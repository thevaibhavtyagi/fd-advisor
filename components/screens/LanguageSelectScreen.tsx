'use client'

import { motion } from 'framer-motion'
import { useAppStore, type Language } from '@/store/useAppStore'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const languages: { code: Language; label: string; script: string }[] = [
  { code: 'en', label: 'English', script: 'English' },
  { code: 'hi', label: 'Hindi', script: 'हिंदी' },
  { code: 'mr', label: 'Marathi', script: 'मরাठी' },
  { code: 'bn', label: 'Bengali', script: 'বাংলা' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      delay: 0.1,
    },
  },
}

export function LanguageSelectScreen() {
  const { setLanguage, setCurrentScreen } = useAppStore()
  const { i18n, t } = useTranslation()

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
    setCurrentScreen('mobile-auth')
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-full px-6 py-12 bg-gradient-to-b from-background to-secondary/30"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Logo Section */}
      <motion.div variants={logoVariants} className="flex flex-col items-center mb-12">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center mb-6 shadow-lg shadow-teal/20">
          <Globe className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-navy tracking-tight">FD Advisor</h1>
        <p className="text-muted-foreground mt-2 text-center">
          {t('app.tagline')}
        </p>
      </motion.div>

      {/* Language Selection */}
      <motion.div variants={itemVariants} className="w-full max-w-xs">
        <p className="text-sm text-muted-foreground text-center mb-6 font-medium">
          {t('languageSelect.subtitle')}
        </p>

        <div className="space-y-3">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className="w-full py-4 px-6 rounded-xl border-2 border-border bg-card hover:border-teal hover:bg-teal/5 transition-all duration-200 flex items-center justify-between group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              <span className="text-lg font-semibold text-navy group-hover:text-teal transition-colors">
                {lang.script}
              </span>
              <span className="text-sm text-muted-foreground">
                {lang.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        variants={itemVariants}
        className="absolute bottom-6 text-xs text-muted-foreground"
      >
        Powered by <span className="font-semibold text-navy">Blostem</span>
      </motion.p>
    </motion.div>
  )
}