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
  console.log('Attempting to speak text:', text)
  
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported in this browser')
    return null
  }
  
  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Set elderly-friendly speech settings
    utterance.rate = 0.8 // Slower for elderly users
    utterance.pitch = 1.0 // Natural pitch
    utterance.volume = 1.0 // Full volume
    
    // Try to use Persian voice if available, otherwise fall back to English
    if (voice) {
      utterance.voice = voice
    } else {
      const voices = window.speechSynthesis.getVoices()
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`))
      
      // Try to find Persian voice first
      let selectedVoice = voices.find(v => 
        v.lang.startsWith('fa') || 
        v.lang.startsWith('fa-IR') ||
        v.name.toLowerCase().includes('persian') ||
        v.name.toLowerCase().includes('farsi')
      )
      
      // If no Persian voice, try English voices
      if (!selectedVoice) {
        selectedVoice = voices.find(v => 
          v.name.includes('Samantha') || 
          v.name.includes('Karen') || 
          v.name.includes('Alex') ||
          v.name.includes('Google') ||
          v.lang.startsWith('en')
        )
      }
      
      // Fall back to default voice
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices.find(v => v.default) || voices[0]
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice
        console.log('Selected voice:', selectedVoice.name, selectedVoice.lang)
      } else {
        console.warn('No suitable voice found')
      }
    }
    
    // Add event listeners for debugging
    utterance.onstart = () => {
      console.log('Speech started:', text)
    }
    
    utterance.onend = () => {
      console.log('Speech ended:', text)
    }
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error, event)
    }
    
    utterance.onpause = () => {
      console.log('Speech paused')
    }
    
    utterance.onresume = () => {
      console.log('Speech resumed')
    }
    
    // Set language to Persian if available
    utterance.lang = 'fa-IR'
    
    window.speechSynthesis.speak(utterance)
    return utterance
    
  } catch (error) {
    console.error('Error in speakText:', error)
    return null
  }
}

export function getFriendlyVoice() {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported')
    return null
  }
  
  try {
    const voices = window.speechSynthesis.getVoices()
    
    // Wait for voices to load if they're not available yet
    if (voices.length === 0) {
      console.log('No voices available, waiting for voices to load...')
      return new Promise((resolve) => {
        window.speechSynthesis.onvoiceschanged = () => {
          const loadedVoices = window.speechSynthesis.getVoices()
          resolve(findBestVoice(loadedVoices))
        }
      })
    }
    
    return findBestVoice(voices)
    
  } catch (error) {
    console.error('Error getting friendly voice:', error)
    return null
  }
}

function findBestVoice(voices) {
  console.log('Finding best voice from', voices.length, 'available voices')
  
  // Try Persian voice first
  let bestVoice = voices.find(v => 
    v.lang.startsWith('fa') || 
    v.lang.startsWith('fa-IR') ||
    v.name.toLowerCase().includes('persian') ||
    v.name.toLowerCase().includes('farsi')
  )
  
  // If no Persian voice, try English voices
  if (!bestVoice) {
    bestVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') || 
      v.name.includes('Alex') ||
      v.name.includes('Google') ||
      v.lang.startsWith('en')
    )
  }
  
  // Fall back to default voice
  if (!bestVoice && voices.length > 0) {
    bestVoice = voices.find(v => v.default) || voices[0]
  }
  
  if (bestVoice) {
    console.log('Best voice found:', bestVoice.name, bestVoice.lang)
  } else {
    console.warn('No suitable voice found')
  }
  
  return bestVoice
} 