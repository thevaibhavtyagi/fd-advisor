'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { CheckCircle2, X, Loader2, User, CreditCard } from 'lucide-react'
import { createBooking } from '@/services/api'

export function BookingPrompt() {
  const { addMessage, setCurrentScreen, messages, mobileNumber, language } = useAppStore()
  const { t } = useTranslation()
  
  const [step, setStep] = useState<'prompt' | 'form'>('prompt')
  const [isLoading, setIsLoading] = useState(false)
  const [hasDeclined, setHasDeclined] = useState(false)
  const [error, setError] = useState('')

  // Form State
  const [fullName, setFullName] = useState('')
  const [panNumber, setPanNumber] = useState('')

  const calculatorMessage = messages.find(m => m.type === 'calculator' && m.calculatorState)
  const calculatorState = calculatorMessage?.calculatorState

  const handleYes = () => {
    setStep('form')
    addMessage({ sender: 'user', type: 'text', content: t('chat.yes') })
  }

  const handleNo = () => {
    setHasDeclined(true)
    addMessage({ sender: 'user', type: 'text', content: t('chat.no') })
    setTimeout(() => {
      addMessage({ sender: 'bot', type: 'text', content: 'chat.noWorries' })
    }, 500)
  }

  const submitBooking = async () => {
    if (!fullName.trim() || !panNumber.trim()) {
      setError('Name and PAN are required.')
      return
    }

    // Basic PAN validation before hitting backend
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      setError('Invalid PAN format (e.g. ABCDE1234F)')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await createBooking({
        phoneNumber: mobileNumber || '9999999999', // Ensure a fallback valid number
        fullName: fullName,
        panNumber: panNumber.toUpperCase(),
        bankName: calculatorState?.bankName || 'Selected Bank',
        investmentAmount: calculatorState?.principal || 10000,
        interestRate: calculatorState?.interestRate || 0,
        tenureMonths: calculatorState?.tenorMonths || 12,
        maturityAmount: calculatorState?.maturityAmount || 10000,
        language: language
      })

      if (response.success) {
        addMessage({ sender: 'bot', type: 'text', content: 'chat.bookingSuccess' })
        setTimeout(() => {
          setCurrentScreen('booking-success')
        }, 1000)
      } else {
        setError(response.error || response.errors?.[0] || 'Booking failed. Try again.')
        setIsLoading(false)
      }
    } catch (err) {
      setError('Network error. Is the backend running?')
      setIsLoading(false)
    }
  }

  if (hasDeclined) return null

  return (
    <div className="ml-0 mr-auto max-w-[90%] mt-3">
      <AnimatePresence mode="wait">
        {step === 'prompt' ? (
          <motion.div key="prompt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex gap-3">
            <Button onClick={handleYes} className="flex-1 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-teal text-white rounded-xl h-12 font-semibold shadow-lg">
              <CheckCircle2 className="w-4 h-4 mr-2" /> {t('chat.yes')}
            </Button>
            <Button onClick={handleNo} variant="outline" className="flex-1 border-2 border-slate-200 rounded-xl h-12 font-semibold">
              <X className="w-4 h-4 mr-2" /> {t('chat.no')}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-xl shadow-md border border-slate-100 w-[300px]">
            <h4 className="font-semibold text-navy mb-3 text-sm">Please provide details to secure your rate:</h4>
            
            <div className="space-y-3 mb-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Full Name (as per PAN)" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="PAN Number" 
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

            <Button onClick={submitBooking} disabled={isLoading} className="w-full bg-navy hover:bg-navy-light text-white rounded-lg h-10 font-medium">
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</> : 'Confirm Booking'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}