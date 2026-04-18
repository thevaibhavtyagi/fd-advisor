'use client'

import { motion } from 'framer-motion'

interface AppContainerProps {
  children: React.ReactNode
}

/**
 * AppContainer - The responsive "app-frame" wrapper
 * 
 * On mobile: Full viewport, no borders
 * On desktop: Constrained to mobile width with elegant shadow for preview
 */
export function AppContainer({ children }: AppContainerProps) {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-slate-100 md:py-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="app-frame relative flex flex-col"
      >
        {children}
      </motion.div>
    </div>
  )
}
