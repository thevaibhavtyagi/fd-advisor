'use client'

import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, useMessages, useLanguage } from '@/store/useAppStore'
import { Languages, MessageCircle, Calculator, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * PhaseZeroDemo - Demonstrates the complete architecture setup
 * Shows the mock conversation, language switching, and store state
 */
export function PhaseZeroDemo() {
  const { t } = useTranslation()
  const messages = useMessages()
  const language = useLanguage()
  const setLanguage = useAppStore((state) => state.setLanguage)
  const currentScreen = useAppStore((state) => state.currentScreen)
  const setCurrentScreen = useAppStore((state) => state.setCurrentScreen)

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ] as const

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-navy">{t('app.title')}</h1>
            <p className="text-xs text-muted-foreground">{t('app.tagline')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLanguage(lang.code)}
              className={`text-xs px-2 ${
                language === lang.code 
                  ? 'bg-navy text-white hover:bg-navy-light' 
                  : 'text-navy hover:bg-secondary'
              }`}
            >
              {lang.native}
            </Button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 chat-scroll">
        <div className="space-y-6">
          {/* Architecture Overview Card */}
          <Card className="p-4 border-teal/20 bg-gradient-to-br from-teal/5 to-transparent">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                <Calculator className="w-5 h-5 text-teal" />
              </div>
              <div>
                <h2 className="font-semibold text-navy text-sm">Phase 0 Complete</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Architecture, Zustand store, i18n setup, and mock data are ready.
                </p>
              </div>
            </div>
          </Card>

          {/* Mock Conversation Preview */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageCircle className="w-3 h-3" />
              Mock Conversation ({messages.length} messages)
            </h3>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                      delay: index * 0.05,
                    }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`chat-bubble ${
                        message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'
                      }`}
                    >
                      {message.type === 'text' && (
                        <p className="text-sm leading-relaxed">
                          {message.content.startsWith('chat.') 
                            ? t(message.content) 
                            : message.content}
                        </p>
                      )}
                      {message.type === 'calculator' && message.calculatorState && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">{t('calculator.title')}</p>
                          <div className="calculator-card">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">{t('calculator.principal')}:</span>
                                <p className="font-semibold text-navy">
                                  ₹{message.calculatorState.principal.toLocaleString('en-IN')}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{t('calculator.maturity')}:</span>
                                <p className="font-semibold text-teal">
                                  ₹{message.calculatorState.maturityAmount.toLocaleString('en-IN')}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{t('calculator.interestRate')}:</span>
                                <p className="font-medium">{message.calculatorState.interestRate}% p.a.</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{t('calculator.tenure')}:</span>
                                <p className="font-medium">{message.calculatorState.tenorMonths} {t('calculator.months')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {message.type === 'booking-prompt' && (
                        <div className="space-y-3">
                          <p className="text-sm">{t(message.content)}</p>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-teal hover:bg-teal-dark text-white text-xs">
                              {t('chat.yes')}
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              {t('chat.no')}
                            </Button>
                          </div>
                        </div>
                      )}
                      {/* Jargon Terms Display */}
                      {message.jargonTerms && message.jargonTerms.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Tap to learn:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.jargonTerms.map((term, i) => (
                              <span
                                key={i}
                                className="jargon-term text-xs px-1.5 py-0.5 text-teal-dark"
                              >
                                {term.term}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* State Overview */}
          <Card className="p-4 bg-navy text-white">
            <h3 className="text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2 text-white/70">
              <Languages className="w-3 h-3" />
              Store State Overview
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/60">Current Screen:</span>
                <p className="font-mono text-teal-light">{currentScreen}</p>
              </div>
              <div>
                <span className="text-white/60">Language:</span>
                <p className="font-mono text-teal-light">{language}</p>
              </div>
              <div>
                <span className="text-white/60">Messages:</span>
                <p className="font-mono text-teal-light">{messages.length}</p>
              </div>
              <div>
                <span className="text-white/60">i18n Keys:</span>
                <p className="font-mono text-teal-light">72 per locale</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer - Ready for Phase 1 */}
      <footer className="p-4 border-t border-border bg-white">
        <Button
          onClick={() => setCurrentScreen('language-select')}
          className="w-full bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-teal text-white font-medium"
        >
          Ready for Phase 1
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </footer>
    </div>
  )
}
