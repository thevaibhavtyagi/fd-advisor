'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { CheckCircle2, X, Loader2 } from 'lucide-react'

export function BookingPrompt() {
  const { addMessage, setCurrentScreen, messages } = useAppStore()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [hasResponded, setHasResponded] = useState(false)

  // Get calculator state from messages
  const calculatorMessage = messages.find(m => m.type === 'calculator' && m.calculatorState)
  const calculatorState = calculatorMessage?.calculatorState

  const handleYes = async () => {
    if (hasResponded) return
    setHasResponded(true)
    setIsLoading(true)

    // Add user response
    addMessage({
      sender: 'user',
      type: 'text',
      content: t('chat.yes'),
    })

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Add confirmation message
    addMessage({
      sender: 'bot',
      type: 'text',
      content: 'chat.bookingSuccess',
    })

    // Wait a moment then navigate to success screen
    setTimeout(() => {
      setCurrentScreen('booking-success')
    }, 800)
  }

  const handleNo = () => {
    if (hasResponded) return
    setHasResponded(true)
    
    addMessage({
      sender: 'user',
      type: 'text',
      content: t('chat.no'),
    })

    // Bot acknowledges
    setTimeout(() => {
      addMessage({
        sender: 'bot',
        type: 'text',
        content: 'chat.noWorries',
      })
    }, 500)
  }

  if (hasResponded && !isLoading) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 ml-0 mr-auto max-w-[90%] mt-3"
    >
      <Button
        onClick={handleYes}
        disabled={isLoading || hasResponded}
        className="flex-1 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-teal text-white rounded-xl h-12 font-semibold shadow-lg shadow-teal/25 transition-all duration-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t('common.processing') || 'Processing...'}
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {t('chat.yes')}
          </>
        )}
      </Button>
      <Button
        onClick={handleNo}
        disabled={isLoading || hasResponded}
        variant="outline"
        className="flex-1 border-2 border-slate-200 hover:bg-slate-50 rounded-xl h-12 font-semibold transition-all duration-300"
      >
        <X className="w-4 h-4 mr-2" />
        {t('chat.no')}
      </Button>
    </motion.div>
  )
}
