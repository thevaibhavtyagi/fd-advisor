'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAppStore, type CalculatorState } from '@/store/useAppStore'
import { TrendingUp, IndianRupee, Sparkles, Calculator } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

interface CalculatorWidgetProps {
  messageId: string
  calculator: CalculatorState
}

export function CalculatorWidget({ messageId, calculator }: CalculatorWidgetProps) {
  const { updateCalculatorState } = useAppStore()
  const { t } = useTranslation()
  const [animatedMaturity, setAnimatedMaturity] = useState(calculator.maturityAmount)
  const [animatedProfit, setAnimatedProfit] = useState(calculator.maturityAmount - calculator.principal)
  const [isInteracting, setIsInteracting] = useState(false)
  const [showGlow, setShowGlow] = useState(false)
  const prevMaturity = useRef(calculator.maturityAmount)

  const handlePrincipalChange = (value: number[]) => {
    setIsInteracting(true)
    updateCalculatorState(messageId, { principal: value[0] })
  }

  const handleSliderEnd = () => {
    setIsInteracting(false)
  }

  const profit = calculator.maturityAmount - calculator.principal

  // Animate numbers with easing
  useEffect(() => {
    const newMaturity = calculator.maturityAmount
    const newProfit = profit
    const startMaturity = prevMaturity.current
    const startProfit = startMaturity - calculator.principal + (calculator.maturityAmount - startMaturity)
    
    const duration = 400
    const steps = 25
    const maturityChange = newMaturity - startMaturity
    let step = 0

    const timer = setInterval(() => {
      step++
      // Ease out cubic
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedMaturity(Math.round(startMaturity + maturityChange * eased))
      setAnimatedProfit(Math.round(newProfit * eased + (startProfit * (1 - eased))))
      
      if (step >= steps) {
        clearInterval(timer)
        setAnimatedMaturity(newMaturity)
        setAnimatedProfit(newProfit)
        prevMaturity.current = newMaturity
        
        // Show glow effect on significant increase
        if (maturityChange > 1000) {
          setShowGlow(true)
          setTimeout(() => setShowGlow(false), 600)
        }
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [calculator.maturityAmount, calculator.principal, profit])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-gradient-to-br from-teal/5 via-white to-gold/5 rounded-2xl border border-teal/20 shadow-lg shadow-teal/10 ml-0 mr-auto max-w-[92%] mt-2 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal to-teal-dark px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-white" />
          <h3 className="font-semibold text-white">{t('calculator.title')}</h3>
        </div>
        <motion.div
          animate={{ rotate: isInteracting ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-4 h-4 text-gold-light" />
        </motion.div>
      </div>

      <div className="p-4">
        {/* Bank and Rate Info */}
        <div className="flex items-center justify-between text-sm mb-4 pb-3 border-b border-border">
          <span className="text-muted-foreground font-medium">{calculator.bankName}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-teal/10 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 text-teal" />
              <span className="text-teal font-bold text-sm">{calculator.interestRate}%</span>
            </div>
            <span className="text-muted-foreground text-sm">{calculator.tenorMonths}M</span>
          </div>
        </div>

        {/* Principal Slider */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">{t('calculator.principal')}</span>
            <motion.span 
              key={calculator.principal}
              initial={{ scale: 1.1, color: '#0D9488' }}
              animate={{ scale: 1, color: '#0F172A' }}
              className="font-bold text-lg text-navy"
            >
              {formatCurrency(calculator.principal)}
            </motion.span>
          </div>
          <Slider
            value={[calculator.principal]}
            onValueChange={handlePrincipalChange}
            onPointerUp={handleSliderEnd}
            min={5000}
            max={500000}
            step={5000}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(5000)}</span>
            <span>{formatCurrency(500000)}</span>
          </div>
        </div>

        {/* Results with Glow */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            className={`relative bg-white rounded-xl p-4 border border-border overflow-hidden ${showGlow ? 'ring-2 ring-teal ring-offset-1' : ''}`}
            animate={showGlow ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background glow */}
            <AnimatePresence>
              {showGlow && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.2, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-teal to-gold blur-xl"
                />
              )}
            </AnimatePresence>
            
            <div className="relative z-10">
              <p className="text-xs text-muted-foreground mb-1">{t('calculator.maturity')}</p>
              <p className="font-bold text-xl text-navy flex items-center">
                <IndianRupee className="w-4 h-4" />
                {animatedMaturity.toLocaleString('en-IN')}
              </p>
            </div>
          </motion.div>
          
          <div className="bg-gradient-to-br from-success-light to-emerald-50 rounded-xl p-4 border border-success/20">
            <p className="text-xs text-success font-medium mb-1">{t('calculator.profit')}</p>
            <motion.p 
              className="font-bold text-xl text-success flex items-center"
              key={animatedProfit}
            >
              +<IndianRupee className="w-4 h-4" />
              {animatedProfit.toLocaleString('en-IN')}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
