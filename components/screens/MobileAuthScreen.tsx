'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Smartphone, ArrowRight } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
}

export function MobileAuthScreen() {
  const [mobileNumber, setMobileNumber] = useState('')
  const [error, setError] = useState('')
  const { setMobileNumber: storeMobile, setIsAuthenticated, setCurrentScreen } = useAppStore()
  const { t } = useTranslation()

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setMobileNumber(value)
    if (error) setError('')
  }

  const handleContinue = () => {
    if (mobileNumber.length !== 10) {
      setError(t('mobileAuth.error'))
      return
    }
    storeMobile(mobileNumber)
    setIsAuthenticated(true)
    setCurrentScreen('chat')
  }

  const handleBack = () => {
    setCurrentScreen('language-select')
  }

  const isValidNumber = mobileNumber.length === 10

  return (
    <motion.div
      className="flex flex-col min-h-full bg-gradient-to-b from-background to-secondary/30"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="px-4 pt-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="w-5 h-5 text-navy" />
        </button>
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Icon */}
        <motion.div
          variants={itemVariants}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center mb-8 shadow-lg shadow-teal/20"
        >
          <Smartphone className="w-8 h-8 text-white" />
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy mb-2">
            {t('mobileAuth.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('mobileAuth.subtitle')}
          </p>
        </motion.div>

        {/* Input */}
        <motion.div variants={itemVariants} className="w-full max-w-xs space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              +91
            </div>
            <Input
              type="tel"
              inputMode="numeric"
              value={mobileNumber}
              onChange={handleMobileChange}
              placeholder={t('mobileAuth.placeholder')}
              className="pl-14 h-14 text-lg font-medium border-2 border-border focus:border-teal rounded-xl"
              autoFocus
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <Button
            onClick={handleContinue}
            disabled={!isValidNumber}
            className="w-full h-14 text-lg font-semibold rounded-xl bg-teal hover:bg-teal-dark disabled:bg-muted disabled:text-muted-foreground transition-all duration-200"
          >
            {t('mobileAuth.continue')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Trust Indicator */}
        <motion.p
          variants={itemVariants}
          className="mt-8 text-xs text-muted-foreground text-center max-w-xs"
        >
          Your number is secure and will only be used for booking confirmations
        </motion.p>
      </div>
    </motion.div>
  )
}
