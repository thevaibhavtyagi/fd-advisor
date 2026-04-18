'use client'

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { ChatMessage, JargonTerm } from '@/store/useAppStore'
import { useAppStore } from '@/store/useAppStore'

interface ChatBubbleProps {
  message: ChatMessage
}

const bubbleVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
}

function JargonHighlightedText({
  content,
  jargonTerms,
}: {
  content: string
  jargonTerms?: JargonTerm[]
}) {
  const { setActiveJargonTerm, setJargonSheetOpen } = useAppStore()

  const handleJargonClick = (term: JargonTerm) => {
    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
    setActiveJargonTerm(term)
    setJargonSheetOpen(true)
  }

  // Helper to render markdown-style bold and newlines
  const renderFormattedText = (text: string, keyPrefix: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`${keyPrefix}-bold-${index}`} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      // Handle newlines
      return part.split('\n').map((line, lineIndex) => (
        <span key={`${keyPrefix}-${index}-${lineIndex}`}>
          {lineIndex > 0 && <br />}
          {line}
        </span>
      ))
    })
  }

  if (!jargonTerms || jargonTerms.length === 0) {
    return <span>{renderFormattedText(content, 'text')}</span>
  }

  // Highlight jargon terms
  const processedContent = content
  const elements: React.ReactNode[] = []
  let lastIndex = 0

  jargonTerms.forEach((term, termIdx) => {
    const termIndex = processedContent.indexOf(term.term, lastIndex)
    if (termIndex !== -1) {
      // Add text before the term
      if (termIndex > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>
            {renderFormattedText(processedContent.slice(lastIndex, termIndex), `pre-${termIdx}`)}
          </span>
        )
      }
      // Add the highlighted term with enhanced styling
      elements.push(
        <motion.button
          key={`term-${termIndex}`}
          onClick={() => handleJargonClick(term)}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-0.5 border-b-2 border-dashed border-teal text-teal font-semibold hover:bg-teal/10 active:bg-teal/20 transition-all duration-150 px-0.5 -mx-0.5 rounded"
        >
          {term.term}
          <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-teal text-white rounded-full ml-0.5">
            ?
          </span>
        </motion.button>
      )
      lastIndex = termIndex + term.term.length
    }
  })

  // Add remaining text
  if (lastIndex < processedContent.length) {
    elements.push(
      <span key={`text-${lastIndex}`}>
        {renderFormattedText(processedContent.slice(lastIndex), 'post')}
      </span>
    )
  }

  return <span>{elements}</span>
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const { t } = useTranslation()
  const isUser = message.sender === 'user'

  // Get translated content for bot messages with i18n keys
  const displayContent =
    message.sender === 'bot' && message.content.startsWith('chat.')
      ? t(message.content)
      : message.content

  if (message.type !== 'text') {
    return null // Other message types will be handled by specific components
  }

  return (
    <motion.div
      layout
      initial="hidden"
      animate="visible"
      variants={bubbleVariants}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`chat-bubble ${
          isUser ? 'chat-bubble-user' : 'chat-bubble-bot'
        }`}
      >
        <JargonHighlightedText
          content={displayContent}
          jargonTerms={message.jargonTerms}
        />
      </div>
    </motion.div>
  )
}
