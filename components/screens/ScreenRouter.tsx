'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCurrentScreen, useAppStore } from '@/store/useAppStore'
import { LanguageSelectScreen } from './LanguageSelectScreen'
import { MobileAuthScreen } from './MobileAuthScreen'
import { SuccessScreen } from './SuccessScreen'
import { ChatWindow } from '@/components/chat/ChatWindow'

const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: 0.2,
    }
  },
}

export function ScreenRouter() {
  const currentScreen = useCurrentScreen()
  const { setCurrentScreen } = useAppStore()

  // Auto-advance from splash after initial load
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('language-select')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [currentScreen, setCurrentScreen])

  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'splash' && (
        <motion.div
          key="splash"
          {...pageTransition}
          className="flex flex-col items-center justify-center min-h-full bg-gradient-to-b from-navy to-navy-light"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-gold flex items-center justify-center">
              <span className="text-white text-2xl font-bold">FD</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white text-2xl font-bold"
          >
            FD Advisor
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </motion.div>
        </motion.div>
      )}

      {currentScreen === 'language-select' && (
        <motion.div key="language-select" {...pageTransition} className="h-full">
          <LanguageSelectScreen />
        </motion.div>
      )}

      {currentScreen === 'mobile-auth' && (
        <motion.div key="mobile-auth" {...pageTransition} className="h-full">
          <MobileAuthScreen />
        </motion.div>
      )}

      {currentScreen === 'chat' && (
        <motion.div key="chat" {...pageTransition} className="h-full">
          <ChatWindow />
        </motion.div>
      )}

      {currentScreen === 'booking-success' && (
        <motion.div key="booking-success" {...pageTransition} className="h-full">
          <SuccessScreen />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
