'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Calendar, Phone, ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import confetti from 'canvas-confetti'
import { useAppStore } from '@/store/useAppStore'

export function SuccessScreen() {
  const { t } = useTranslation()
  const { messages, setCurrentScreen, mobileNumber } = useAppStore()
  const confettiTriggered = useRef(false)

  // Get calculator state from the last calculator message
  const calculatorMessage = messages.find(m => m.type === 'calculator' && m.calculatorState)
  const calculatorState = calculatorMessage?.calculatorState || {
    principal: 10000,
    interestRate: 8.5,
    tenorMonths: 12,
    maturityAmount: 10850,
    bankName: 'Suryoday Small Finance Bank'
  }

  useEffect(() => {
    if (!confettiTriggered.current) {
      confettiTriggered.current = true
      
      // Initial burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0D9488', '#D97706', '#0F172A', '#14B8A6', '#F59E0B']
      })

      // Secondary burst
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#0D9488', '#D97706']
        })
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#0D9488', '#D97706']
        })
      }, 250)
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleStartNew = () => {
    setCurrentScreen('chat')
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-teal-50 via-white to-amber-50/30">
      {/* Success Animation */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Animated Check */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-xl shadow-teal-500/30">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          {/* Sparkle decorations */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-amber-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute -bottom-1 -left-3"
          >
            <Sparkles className="w-5 h-5 text-teal-400" />
          </motion.div>
        </motion.div>

        {/* Success Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-navy text-center mb-2"
        >
          {t('success.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 text-center mb-8"
        >
          {t('success.subtitle')}
        </motion.p>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-navy to-navy-light px-5 py-4">
            <h2 className="text-white font-semibold">{t('success.bookingDetails')}</h2>
          </div>

          {/* Card Content */}
          <div className="p-5 space-y-4">
            {/* Principal */}
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">{t('calculator.principal')}</span>
              <span className="font-semibold text-navy">
                {formatCurrency(calculatorState.principal)}
              </span>
            </div>

            {/* Interest Rate */}
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">{t('calculator.interestRate')}</span>
              <span className="font-semibold text-teal-600">
                {calculatorState.interestRate}% p.a.
              </span>
            </div>

            {/* Tenure */}
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">{t('calculator.tenure')}</span>
              <span className="font-semibold text-navy">
                {calculatorState.tenorMonths} {t('calculator.months')}
              </span>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Maturity Amount - Highlighted */}
            <div className="flex justify-between items-center bg-gradient-to-r from-teal-50 to-amber-50 -mx-5 px-5 py-3">
              <span className="text-slate-700 font-medium">{t('calculator.maturityAmount')}</span>
              <span className="text-xl font-bold text-teal-600">
                {formatCurrency(calculatorState.maturityAmount)}
              </span>
            </div>

            {/* Interest Earned */}
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">{t('calculator.interestEarned')}</span>
              <span className="font-semibold text-amber-600">
                + {formatCurrency(calculatorState.maturityAmount - calculatorState.principal)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Callback Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full mt-5 bg-amber-50 rounded-xl p-4 border border-amber-100"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-amber-900 font-medium text-sm">
                {t('success.callbackInfo')}
              </p>
              <p className="text-amber-700 text-sm mt-1">
                {mobileNumber || '+91 98765 43210'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full mt-4 flex items-center gap-3 text-slate-500 text-sm"
        >
          <Calendar className="w-4 h-4" />
          <span>{t('success.timeline')}</span>
        </motion.div>
      </div>

      {/* Bottom Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="px-6 pb-8"
      >
        <button
          onClick={handleStartNew}
          className="w-full py-4 bg-gradient-to-r from-navy to-navy-light text-white font-semibold rounded-xl shadow-lg shadow-navy/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          {t('success.startNew')}
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  )
}
