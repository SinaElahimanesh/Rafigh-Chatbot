import React, { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Card, CardContent } from './ui/card'
import { formatTime } from '../lib/utils'
import { motion } from 'framer-motion'
import { Users, User } from 'lucide-react'

const ChatMessage = ({ message, isUser, isSpeaking, onSpeak, voiceEnabled }) => {
  const messageRef = useRef(null)
  const utteranceRef = useRef(null)

  useEffect(() => {
    // Auto-scroll to new messages
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      })
    }
  }, [message])

  useEffect(() => {
    // Auto-speak bot messages if voice is enabled
    if (!isUser && voiceEnabled && isSpeaking && message.content) {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()
        
        const utterance = new SpeechSynthesisUtterance(message.content)
        
        // Elderly-friendly speech settings
        utterance.rate = 0.9 // Slightly slower
        utterance.pitch = 1.0 // Natural pitch
        utterance.volume = 1.0 // Full volume
        
        // Try to use a friendly voice
        const voices = speechSynthesis.getVoices()
        const friendlyVoice = voices.find(v => 
          v.name.includes('Samantha') || 
          v.name.includes('Karen') || 
          v.name.includes('Alex') ||
          (v.lang.startsWith('en') && v.default)
        )
        if (friendlyVoice) {
          utterance.voice = friendlyVoice
        }
        
        utterance.onstart = () => {
          console.log('Speaking message:', message.content)
        }
        
        utterance.onend = () => {
          console.log('Finished speaking message')
        }
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error)
        }
        
        window.speechSynthesis.speak(utterance)
        utteranceRef.current = utterance
      }
    }
    
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [message.content, isUser, voiceEnabled, isSpeaking])

  const handleSpeakClick = () => {
    if (onSpeak && message.content) {
      onSpeak(message.content)
    }
  }

  return (
    <motion.div
      ref={messageRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start space-x-3 max-w-2xl ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <Avatar className="flex-shrink-0 h-10 w-10 transition-transform duration-200 hover:scale-110">
          <AvatarFallback className={`text-sm ${message.isUser ? 'bg-elder-blue' : 'bg-elder-green'}`}>
            {message.isUser ? <User className="h-5 w-5" /> : <Users className="h-5 w-5" />}
          </AvatarFallback>
        </Avatar>

        {/* Message Content */}
        <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}>
          <motion.div 
            className={`max-w-xl rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${message.isUser ? 'bg-elder-blue text-white hover:bg-blue-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ duration: 0.2 }}
          >
            <p className={`text-base leading-relaxed ${message.isUser ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
              {message.content}
            </p>
          </motion.div>
          
          {/* Message Metadata */}
          <div className={`flex items-center space-x-2 mt-2 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <span className="text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700">
              {formatTime(new Date(message.timestamp))}
            </span>
            
            {/* Speak button for bot messages */}
            {!message.isUser && isSpeaking && (
              <motion.button
                onClick={handleSpeakClick}
                className="p-1.5 text-gray-400 hover:text-elder-blue transition-all duration-200 rounded-full hover:bg-gray-100 hover:scale-110"
                aria-label="Speak this message"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage 