'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Lightbulb, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppStore, type JargonTerm } from '@/store/useAppStore'

// Helper component to render definition with bold text
function JargonDefinitionText({ definition }: { definition: string }) {
  // Parse markdown-style bold (**text**)
  const parts = definition.split(/(\*\*[^*]+\*\*)/)
  return (
    <p className="text-slate-700 leading-relaxed text-base">
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-semibold text-navy">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </p>
  )
}

export function JargonDrawer() {
  const { t } = useTranslation()
  const { activeJargonTerm, isJargonSheetOpen, setJargonSheetOpen, setActiveJargonTerm } = useAppStore()

  const handleClose = () => {
    setJargonSheetOpen(false)
    setActiveJargonTerm(null)
  }

  // Get the translated definition from the definitionKey
  const definition = activeJargonTerm ? t(activeJargonTerm.definitionKey) : ''

  return (
    <AnimatePresence>
      {isJargonSheetOpen && activeJargonTerm && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy text-lg">
                    {activeJargonTerm.term}
                  </h3>
                  <p className="text-xs text-slate-500">{t('jargon.financialTerm')}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-5 overflow-y-auto max-h-[50vh]">
              {/* Simple Definition */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-medium text-teal-700">
                    {t('jargon.simpleExplanation')}
                  </span>
                </div>
                <JargonDefinitionText definition={definition} />
              </motion.div>

              

              {/* Got it button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={handleClose}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 active:scale-[0.98] transition-transform"
              >
                {t('jargon.gotIt')}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
