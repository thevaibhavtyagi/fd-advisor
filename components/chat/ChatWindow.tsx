'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMessages, useAppStore } from '@/store/useAppStore'
import { ChatHeader } from './ChatHeader'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { CalculatorWidget } from './CalculatorWidget'
import { BookingPrompt } from './BookingPrompt'
import { JargonDrawer } from './JargonDrawer'

export function ChatWindow() {
  const messages = useMessages()
  const isTyping = useAppStore((state) => state.isTyping)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Improved scroll anchor to ensure the typing indicator remains visible
  // even if exponential backoff delays the response
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping])

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <ChatHeader />
      <JargonDrawer />

      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll px-4 py-4 pb-20">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => {
            switch (message.type) {
              case 'text':
                return <ChatBubble key={message.id} message={message} />
              case 'calculator':
                return (
                  <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
                    <ChatBubble message={{ ...message, type: 'text' }} />
                    {message.calculatorState && <CalculatorWidget messageId={message.id} calculator={message.calculatorState} />}
                  </motion.div>
                )
              case 'booking-prompt':
                return (
                  <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
                    <ChatBubble message={{ ...message, type: 'text' }} />
                    <BookingPrompt />
                  </motion.div>
                )
              default:
                return <ChatBubble key={message.id} message={message} />
            }
          })}

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-start mb-3">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <motion.span className="w-2 h-2 bg-teal-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.span className="w-2 h-2 bg-teal-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} />
                  <motion.span className="w-2 h-2 bg-teal-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ChatInput />
    </div>
  )
}