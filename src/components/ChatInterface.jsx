import React, { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback } from './ui/avatar'
import VoiceRecognition from './VoiceRecognition'
import ChatMessage from './ChatMessage'
import { generateElderlyFriendlyResponse, speakText, getFriendlyVoice } from '../lib/utils'
import { Send, Users, Settings, Volume2, VolumeX, Sun, Moon, User, Mic, MicOff, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ChatInterface = () => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [showVoicePanel, setShowVoicePanel] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [isVoiceSupported, setIsVoiceSupported] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      content: "سلام! من رفیق شما هستم. یک دوست هوشمند که آماده صحبت و کمک به شماست. می‌توانید با تایپ یا صحبت کردن با من ارتباط برقرار کنید. امروز حالتان چطور است؟",
      timestamp: new Date(),
      isUser: false
    }
    setMessages([welcomeMessage])
  }, [])

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      // Better configuration for voice recognition
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'fa-IR' // Farsi language
      recognitionInstance.maxAlternatives = 1
      
      recognitionInstance.onstart = () => {
        console.log('Voice recognition started successfully')
        setIsListening(true)
        setError(null) // Clear any previous errors
      }
      
      recognitionInstance.onresult = (event) => {
        console.log('Voice recognition result received')
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          console.log('Transcript:', transcript, 'isFinal:', event.results[i].isFinal)
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        if (finalTranscript) {
          console.log('Final transcript:', finalTranscript)
          handleSendMessage(finalTranscript)
          setIsListening(false)
        }
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error, event)
        setIsListening(false)
        
        // More specific error messages
        let errorMessage = 'خطا در تشخیص صدا'
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'لطفاً مجوز میکروفون را بدهید'
            break
          case 'no-speech':
            errorMessage = 'صدایی تشخیص داده نشد'
            break
          case 'audio-capture':
            errorMessage = 'مشکل در دسترسی به میکروفون'
            break
          case 'network':
            errorMessage = 'مشکل شبکه در تشخیص صدا'
            break
          case 'service-not-allowed':
            errorMessage = 'سرویس تشخیص صدا در دسترس نیست'
            break
          default:
            errorMessage = `خطا در تشخیص صدا: ${event.error}`
        }
        setError(errorMessage)
      }
      
      recognitionInstance.onend = () => {
        console.log('Voice recognition ended')
        setIsListening(false)
      }
      
      setRecognition(recognitionInstance)
      setIsVoiceSupported(true)
      console.log('Voice recognition initialized successfully')
    } else {
      console.log('Speech recognition not supported in this browser')
      setIsVoiceSupported(false)
      setError('تشخیص صدا در مرورگر شما پشتیبانی نمی‌شود')
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle voice transcript
  const handleVoiceTranscript = (transcript) => {
    if (transcript.trim()) {
      handleSendMessage(transcript)
    }
  }

  // Handle voice errors
  const handleVoiceError = (error) => {
    setError(error)
    setTimeout(() => setError(null), 5000)
  }

  // Send message function
  const handleSendMessage = async (content) => {
    if (!content.trim()) return

    const userMessage = {
      id: Date.now(),
      content: content.trim(),
      timestamp: new Date(),
      isUser: true
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: generateElderlyFriendlyResponse(content),
        timestamp: new Date(),
        isUser: false
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000) // Random delay for natural feel
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  // Handle speak function
  const handleSpeak = (text) => {
    console.log('handleSpeak called with text:', text)
    
    if (!text || text.trim() === '') {
      console.warn('Empty text provided to handleSpeak')
      return
    }
    
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported in this browser')
      setError('پخش صدا در مرورگر شما پشتیبانی نمی‌شود')
      return
    }
    
    try {
      // Check if speech synthesis is paused or speaking
      if (window.speechSynthesis.speaking) {
        console.log('Speech synthesis is already speaking, canceling...')
        window.speechSynthesis.cancel()
      }
      
      if (window.speechSynthesis.paused) {
        console.log('Speech synthesis is paused, resuming...')
        window.speechSynthesis.resume()
        return
      }
      
      setIsSpeaking(true)
      console.log('Starting speech synthesis...')
      
      const utterance = speakText(text, getFriendlyVoice())
      
      if (utterance) {
        utterance.onend = () => {
          console.log('Speech ended, setting isSpeaking to false')
          setIsSpeaking(false)
        }
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error in handleSpeak:', event.error)
          setIsSpeaking(false)
          setError(`خطا در پخش صدا: ${event.error}`)
        }
      } else {
        console.error('Failed to create utterance')
        setIsSpeaking(false)
        setError('خطا در ایجاد صدا')
      }
      
    } catch (error) {
      console.error('Error in handleSpeak:', error)
      setIsSpeaking(false)
      setError('خطا در پخش صدا')
    }
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  // Toggle voice panel
  const toggleVoicePanel = () => {
    setShowVoicePanel(!showVoicePanel)
  }

  // Handle voice input button
  const handleVoiceInput = () => {
    console.log('Voice input button clicked')
    console.log('Recognition:', recognition)
    console.log('Is voice supported:', isVoiceSupported)
    
    if (recognition && isVoiceSupported) {
      try {
        if (isListening) {
          console.log('Stopping voice recognition')
          recognition.stop()
        } else {
          console.log('Starting voice recognition')
          setError(null) // Clear any previous errors
          recognition.start()
        }
      } catch (error) {
        console.error('Error with voice recognition:', error)
        setError('خطا در شروع تشخیص صدا: ' + error.message)
      }
    } else {
      console.log('Voice recognition not available')
      setError('تشخیص صدا در مرورگر شما پشتیبانی نمی‌شود')
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="container mx-auto px-6 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-6">
            <Avatar className="h-14 w-14 transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-pointer">
              <AvatarFallback className="bg-elder-green text-white">
                <Users className="h-7 w-7" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                رفیق
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300">
                دوست و هم‌صحبت هوشمند شما
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleVoicePanel}
              variant="elderlySecondary"
              size="default"
              className="px-6 py-3"
              aria-label="Toggle voice controls"
            >
              {showVoicePanel ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            
            <Button
              onClick={toggleDarkMode}
              variant="elderlySecondary"
              size="default"
              className="px-6 py-3"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </motion.div>

        {/* Voice Panel */}
        <AnimatePresence>
          {showVoicePanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  تنظیمات صدا
                </h3>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Button
                    onClick={() => handleSpeak('سلام! من رفیق شما هستم. تشخیص صدا فعال است.')}
                    variant="elderlySecondary"
                    size="sm"
                    className="px-4 py-2 text-sm"
                    aria-label="Test voice output"
                  >
                    <Volume2 className="h-4 w-4 ml-1" />
                    تست خروجی صدا
                  </Button>
                  <Button
                    onClick={() => {
                      console.log('Testing voice synthesis...')
                      const voices = window.speechSynthesis.getVoices()
                      console.log('Available voices:', voices)
                      handleSpeak('Hello! This is a test of voice synthesis.')
                    }}
                    variant="elderlySecondary"
                    size="sm"
                    className="px-4 py-2 text-sm"
                    aria-label="Test English voice"
                  >
                    <Volume2 className="h-4 w-4 ml-1" />
                    تست انگلیسی
                  </Button>
                  <Button
                    onClick={handleVoiceInput}
                    variant={isListening ? "destructive" : "elderlyPrimary"}
                    size="sm"
                    className="px-4 py-2 text-sm"
                    aria-label="Test voice input"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-4 w-4 ml-1" />
                        توقف تشخیص
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 ml-1" />
                        تست تشخیص صدا
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
                    وضعیت تشخیص صدا
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 ${isVoiceSupported ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isVoiceSupported ? 'تشخیص صدا پشتیبانی می‌شود' : 'تشخیص صدا پشتیبانی نمی‌شود'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 ${isListening ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isListening ? 'در حال گوش دادن...' : 'آماده برای تشخیص صدا'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
                    راهنمای استفاده
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li className="p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">• روی دکمه میکروفون کلیک کنید</li>
                    <li className="p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">• با صدای واضح صحبت کنید</li>
                    <li className="p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">• منتظر تشخیص خودکار باشید</li>
                    <li className="p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">• پیام به صورت خودکار ارسال می‌شود</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-start space-x-3 space-x-reverse">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium text-base">{error}</p>
                  {error.includes('مجوز') && (
                    <div className="mt-2 text-sm text-red-700">
                      <p className="font-medium">راه‌حل:</p>
                      <ul className="list-disc list-inside mt-1 space-y-0.5">
                        <li>روی آیکون قفل در نوار آدرس کلیک کنید</li>
                        <li>مجوز میکروفون را فعال کنید</li>
                        <li>صفحه را رفرش کنید</li>
                      </ul>
                    </div>
                  )}
                  {error.includes('پشتیبانی نمی‌شود') && (
                    <div className="mt-2 text-sm text-red-700">
                      <p className="font-medium">پیشنهاد:</p>
                      <ul className="list-disc list-inside mt-1 space-y-0.5">
                        <li>از مرورگر Chrome یا Edge استفاده کنید</li>
                        <li>مرورگر خود را به‌روزرسانی کنید</li>
                        <li>از HTTPS استفاده کنید</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Listening Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-elder-warm border border-elder-orange rounded-xl text-center"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="voice-wave">
                  <div className="voice-bar"></div>
                  <div className="voice-bar"></div>
                  <div className="voice-bar"></div>
                  <div className="voice-bar"></div>
                  <div className="voice-bar"></div>
                </div>
                <p className="text-lg font-semibold text-elder-orange">
                  در حال گوش دادن... صحبت کنید
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Container */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Messages */}
          <div className="h-[28rem] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onSpeak={handleSpeak}
                isSpeaking={isSpeaking}
              />
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3 space-x-reverse"
              >
                <Avatar className="h-10 w-10 transition-all duration-200 hover:scale-110 hover:shadow-lg">
                  <AvatarFallback className="bg-elder-green text-white text-sm">
                    <Users className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <motion.div 
                  className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 transition-all duration-200 hover:shadow-md hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex space-x-1 space-x-reverse">
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 text-base"
                disabled={isTyping}
              />
              
              <Button
                type="submit"
                variant="elderlyPrimary"
                size="default"
                className="px-4 py-2"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
              
              <Button
                type="button"
                onClick={handleVoiceInput}
                variant={isListening ? "destructive" : "elderlySecondary"}
                size="default"
                className="px-4 py-2"
                disabled={!isVoiceSupported || isTyping}
                aria-label="Voice input"
              >
                {isListening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 text-base">
            ساخته شده با ❤️ برای سالمندان
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-3">
            دسترس‌پذیر • صوتی • کاربرپسند
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ChatInterface 