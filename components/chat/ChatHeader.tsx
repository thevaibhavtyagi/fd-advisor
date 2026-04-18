'use client'

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAppStore, type Language } from '@/store/useAppStore'
import { Bot, Globe, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languages: { code: Language; label: string; script: string }[] = [
  { code: 'en', label: 'English', script: 'EN' },
  { code: 'hi', label: 'Hindi', script: 'हि' },
  { code: 'mr', label: 'Marathi', script: 'म' },
]

export function ChatHeader() {
  const { language, setLanguage } = useAppStore()
  const { t, i18n } = useTranslation()

  const currentLang = languages.find((l) => l.code === language) || languages[0]

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 left-0 right-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3"
    >
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center shadow-md shadow-teal/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-navy text-lg leading-tight">
              {t('app.title')}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm text-navy">
                {currentLang.script}
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center justify-between ${
                  language === lang.code ? 'bg-teal/10 text-teal' : ''
                }`}
              >
                <span>{lang.label}</span>
                <span className="text-sm font-medium">{lang.script}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
