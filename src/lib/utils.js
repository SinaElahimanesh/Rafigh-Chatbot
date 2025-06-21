import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function generateElderlyFriendlyResponse(message) {
  const responses = [
    "That's a wonderful question! Let me think about that for a moment...",
    "I'm here to help you with that. What would you like to know more about?",
    "That's very interesting! I'd be happy to chat about that with you.",
    "Thank you for sharing that with me. How can I assist you today?",
    "I understand what you're saying. Let me help you with that.",
    "That sounds lovely! Tell me more about it.",
    "I'm listening carefully. Please go on.",
    "What a thoughtful question! Let me explain that in a simple way.",
    "I appreciate you asking that. Here's what I think...",
    "That's a great point! I'd love to discuss that with you."
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

export function speakText(text, voice = null) {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Set elderly-friendly speech settings
    utterance.rate = 0.9 // Slightly slower
    utterance.pitch = 1.0 // Natural pitch
    utterance.volume = 1.0 // Full volume
    
    // Try to use a friendly voice if available
    if (voice) {
      utterance.voice = voice
    } else {
      const voices = speechSynthesis.getVoices()
      const friendlyVoice = voices.find(v => 
        v.name.includes('Samantha') || 
        v.name.includes('Karen') || 
        v.name.includes('Alex') ||
        v.lang.startsWith('en')
      )
      if (friendlyVoice) {
        utterance.voice = friendlyVoice
      }
    }
    
    window.speechSynthesis.speak(utterance)
    return utterance
  }
  return null
}

export function getFriendlyVoice() {
  if ('speechSynthesis' in window) {
    const voices = speechSynthesis.getVoices()
    return voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') || 
      v.name.includes('Alex') ||
      (v.lang.startsWith('en') && v.default)
    ) || voices[0]
  }
  return null
} 