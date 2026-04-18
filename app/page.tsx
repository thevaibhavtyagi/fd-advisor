'use client'

import { I18nProvider } from '@/components/providers/I18nProvider'
import { AppContainer } from '@/components/layout/AppContainer'
import { ScreenRouter } from '@/components/screens/ScreenRouter'

export default function Home() {
  return (
    <I18nProvider>
      <AppContainer>
        <ScreenRouter />
      </AppContainer>
    </I18nProvider>
  )
}
