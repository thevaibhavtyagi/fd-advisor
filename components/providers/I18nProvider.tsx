'use client'

import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { useAppStore } from '@/store/useAppStore'

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const language = useAppStore((state) => state.language)

  useEffect(() => {
    // Sync Zustand language state with i18n
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
    }
    setIsInitialized(true)
  }, [language])

  // Subscribe to language changes from Zustand
  useEffect(() => {
    const unsubscribe = useAppStore.subscribe(
      (state) => {
        if (i18n.language !== state.language) {
          i18n.changeLanguage(state.language)
        }
      }
    )
    return unsubscribe
  }, [])

  if (!isInitialized) {
    return null
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
}
