'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { Send, Loader2 } from 'lucide-react'

export function ChatInput() {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { sendUserMessage, isTyping } = useAppStore()
  const { t } = useTranslation()

  const handleSend = async () => {
    if (!message.trim() || isTyping) return

    const userMessage = message.trim()
    setMessage('')
    inputRef.current?.focus()

    // Send message and get AI response
    await sendUserMessage(userMessage)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 safe-area-inset-bottom">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.inputPlaceholder')}
          className="flex-1 h-12 px-4 rounded-full bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/50 transition-all"
        />
        <motion.button
          onClick={handleSend}
          disabled={!message.trim() || isTyping}
          className="w-12 h-12 rounded-full bg-teal hover:bg-teal-dark disabled:bg-muted disabled:text-muted-foreground text-white flex items-center justify-center transition-all duration-200 shadow-md shadow-teal/20 disabled:shadow-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={t('chat.send')}
        >
          {isTyping ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </motion.button>
      </div>
    </div>
  )
}
