import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { analyzeOffer } from '@/services/api'

export type MessageType = 'text' | 'calculator' | 'jargon-explanation' | 'booking-prompt' | 'booking-success'

export interface JargonTerm {
  term: string
  definitionKey: string 
  definition?: string
}

export interface CalculatorState {
  bankName: string
  interestRate: number 
  tenorMonths: number 
  principal: number 
  maturityAmount: number 
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'bot'
  type: MessageType
  content: string 
  timestamp: Date
  jargonTerms?: JargonTerm[] 
  calculatorState?: CalculatorState 
  isTyping?: boolean
}

export interface BookingLead {
  mobileNumber: string
  name: string
  pan: string
  nominee: string
  bankName: string
  principal: number
  interestRate: number
  tenorMonths: number
  status: 'pending' | 'collecting-name' | 'collecting-pan' | 'collecting-nominee' | 'confirmed'
}

export type AppScreen = 'splash' | 'language-select' | 'mobile-auth' | 'chat' | 'booking-success'
export type Language = 'en' | 'hi' | 'mr'

interface AppState {
  currentScreen: AppScreen
  setCurrentScreen: (screen: AppScreen) => void
  language: Language
  setLanguage: (lang: Language) => void
  mobileNumber: string
  setMobileNumber: (number: string) => void
  isAuthenticated: boolean
  setIsAuthenticated: (auth: boolean) => void
  messages: ChatMessage[]
  isTyping: boolean
  setIsTyping: (typing: boolean) => void
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  updateCalculatorState: (messageId: string, calculator: Partial<CalculatorState>) => void
  sendUserMessage: (content: string) => Promise<void>
  bookingLead: BookingLead | null
  setBookingLead: (lead: BookingLead | null) => void
  updateBookingLead: (updates: Partial<BookingLead>) => void
  isJargonSheetOpen: boolean
  setJargonSheetOpen: (open: boolean) => void
  activeJargonTerm: JargonTerm | null
  setActiveJargonTerm: (term: JargonTerm | null) => void
  resetApp: () => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

const calculateMaturity = (principal: number, rate: number, months: number): number => {
  const years = months / 12
  return Math.round(principal * Math.pow(1 + rate / 100, years))
}

const initialWelcomeMessage: ChatMessage = {
  id: generateId(),
  sender: 'bot',
  type: 'text',
  content: 'chat.welcome',
  timestamp: new Date(),
}

const initialState = {
  currentScreen: 'splash' as AppScreen,
  language: 'hi' as Language,
  mobileNumber: '',
  isAuthenticated: false,
  messages: [initialWelcomeMessage], // STRICTLY fresh start
  isTyping: false,
  bookingLead: null,
  isJargonSheetOpen: false,
  activeJargonTerm: null,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setCurrentScreen: (screen) => set({ currentScreen: screen }),
      setLanguage: (lang) => set({ language: lang }),
      setMobileNumber: (number) => set({ mobileNumber: number }),
      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
      setIsTyping: (typing) => set({ isTyping: typing }),

      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        }
        set((state) => ({ messages: [...state.messages, newMessage] }))
      },

      clearMessages: () => set({ messages: [initialWelcomeMessage] }),

      updateCalculatorState: (messageId, calculator) => {
        set((state) => ({
          messages: state.messages.map((msg) => {
            if (msg.id === messageId && msg.calculatorState) {
              const updatedCalc = { ...msg.calculatorState, ...calculator }
              if (calculator.principal !== undefined) {
                updatedCalc.maturityAmount = calculateMaturity(calculator.principal, updatedCalc.interestRate, updatedCalc.tenorMonths)
              }
              return { ...msg, calculatorState: updatedCalc }
            }
            return msg
          }),
        }))
      },

      sendUserMessage: async (content: string) => {
        const { language, addMessage } = get()
        addMessage({ sender: 'user', type: 'text', content })
        set({ isTyping: true })

        try {
          const response = await analyzeOffer({ userMessage: content, language })
          set({ isTyping: false })

          if (response.success && response.data) {
            const { bankName, interestRate, tenureMonths, botMessage, jargonTerms } = response.data

            const formattedJargonTerms = jargonTerms?.map((term, index) => ({
              term: term.term,
              definitionKey: `dynamic.jargon.${index}`,
              definition: term.definition,
            })) || []

            addMessage({
              sender: 'bot',
              type: 'text',
              content: botMessage,
              jargonTerms: formattedJargonTerms,
            })

            if (bankName && interestRate && tenureMonths) {
              const defaultPrincipal = 10000
              const maturityAmount = calculateMaturity(defaultPrincipal, interestRate, tenureMonths)

              addMessage({
                sender: 'bot',
                type: 'calculator',
                content: 'chat.calculatorIntro',
                calculatorState: { bankName, interestRate, tenorMonths: tenureMonths, principal: defaultPrincipal, maturityAmount },
              })

              setTimeout(() => {
                addMessage({ sender: 'bot', type: 'booking-prompt', content: 'chat.bookingPrompt' })
              }, 500)
            }
          } else {
            addMessage({ sender: 'bot', type: 'text', content: response.error || 'Server connection error.' })
          }
        } catch (error) {
          set({ isTyping: false })
          console.error('[Store] sendUserMessage error:', error)
          addMessage({ sender: 'bot', type: 'text', content: 'System error. Please ensure the backend is running.' })
        }
      },

      setBookingLead: (lead) => set({ bookingLead: lead }),
      updateBookingLead: (updates) => {
        const current = get().bookingLead
        if (current) set({ bookingLead: { ...current, ...updates } })
      },
      setJargonSheetOpen: (open) => set({ isJargonSheetOpen: open }),
      setActiveJargonTerm: (term) => set({ activeJargonTerm: term }),
      resetApp: () => set(initialState),
    }),
    {
      name: 'fd-advisor-storage',
      partialize: (state) => ({
        language: state.language,
        mobileNumber: state.mobileNumber,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export const useMessages = () => useAppStore((state) => state.messages)
export const useLanguage = () => useAppStore((state) => state.language)
export const useCurrentScreen = () => useAppStore((state) => state.currentScreen)
export const useBookingLead = () => useAppStore((state) => state.bookingLead)