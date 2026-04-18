'use client'

import { motion, Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { ChatMessage, JargonTerm } from '@/store/useAppStore'
import { useAppStore } from '@/store/useAppStore'
import React from 'react'

interface ChatBubbleProps {
  message: ChatMessage
}

// STRICT FIX: Explicitly typing as 'Variants' resolves the TypeScript string error
const bubbleVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: 'spring', stiffness: 400, damping: 25 } 
  },
}

function JargonHighlightedText({ content, jargonTerms }: { content: string, jargonTerms?: JargonTerm[] }) {
  const { setActiveJargonTerm, setJargonSheetOpen } = useAppStore()

  const handleJargonClick = (term: JargonTerm) => {
    if (navigator.vibrate) navigator.vibrate(10)
    setActiveJargonTerm(term)
    setJargonSheetOpen(true)
  }

  // If no terms to highlight, just render text with markdown bolding
  if (!jargonTerms || jargonTerms.length === 0) {
    const parts = content.split(/(\*\*[^*]+\*\*)/)
    return (
      <p className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold text-navy">{part.slice(2, -2)}</strong>
          }
          return <span key={i}>{part}</span>
        })}
      </p>
    )
  }

  // STRICT FIX: Advanced Case-Insensitive Regex Highlighting
  // Sort terms by length (longest first) to prevent partial matching bugs
  const sortedTerms = [...jargonTerms].sort((a, b) => b.term.length - a.term.length)
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`(${sortedTerms.map(t => escapeRegExp(t.term)).join('|')})`, 'gi')

  const parts = content.split(pattern)

  return (
    <p className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, index) => {
        // Check if this chunk of text matches one of our jargon terms
        const matchedTerm = sortedTerms.find(t => t.term.toLowerCase() === part.toLowerCase())
        
        if (matchedTerm) {
          return (
            <motion.button
              key={index}
              onClick={() => handleJargonClick(matchedTerm)}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-0.5 border-b-2 border-dashed border-teal-600 text-teal-700 font-bold hover:bg-teal-50 active:bg-teal-100 transition-all duration-150 px-1 mx-0.5 rounded cursor-pointer"
            >
              {part}
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] bg-teal-600 text-white rounded-full ml-0.5">
                ?
              </span>
            </motion.button>
          )
        }

        // Apply markdown bold formatting to regular text
        const boldParts = part.split(/(\*\*[^*]+\*\*)/)
        return (
          <React.Fragment key={index}>
            {boldParts.map((bp, i) => {
              if (bp.startsWith('**') && bp.endsWith('**')) {
                return <strong key={i} className="font-semibold text-navy">{bp.slice(2, -2)}</strong>
              }
              return <span key={i}>{bp}</span>
            })}
          </React.Fragment>
        )
      })}
    </p>
  )
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const { t } = useTranslation()
  const isUser = message.sender === 'user'

  const displayContent = message.sender === 'bot' && message.content.startsWith('chat.')
    ? t(message.content)
    : message.content

  if (message.type !== 'text') return null

  return (
    <motion.div layout initial="hidden" animate="visible" variants={bubbleVariants} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
        <JargonHighlightedText content={displayContent} jargonTerms={message.jargonTerms} />
      </div>
    </motion.div>
  )
}