import React, { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { cn } from '../lib/utils'

const VoiceRecognition = ({ onTranscript, onError, isListening, setIsListening, isSpeaking, setIsSpeaking }) => {
  const [recognition, setRecognition] = useState(null)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      // Configure for elderly-friendly speech recognition
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'fa-IR' // Farsi language
      recognitionInstance.maxAlternatives = 3
      
      // Set elderly-friendly settings
      recognitionInstance.grammars = null // Allow any speech
      
      recognitionInstance.onstart = () => {
        console.log('Voice recognition started')
        setIsListening(true)
      }
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        let maxConfidence = 0
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          const confidence = event.results[i][0].confidence
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript
            maxConfidence = Math.max(maxConfidence, confidence)
          } else {
            interimTranscript += transcript
          }
        }
        
        setTranscript(finalTranscript || interimTranscript)
        setConfidence(maxConfidence)
        
        if (finalTranscript) {
          onTranscript(finalTranscript)
          setTranscript('')
        }
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        onError(event.error)
      }
      
      recognitionInstance.onend = () => {
        console.log('Voice recognition ended')
        setIsListening(false)
      }
      
      setRecognition(recognitionInstance)
      setIsSupported(true)
    } else {
      setIsSupported(false)
      onError('تشخیص صدا در مرورگر شما پشتیبانی نمی‌شود')
    }
  }, [onTranscript, onError, setIsListening])

  const startListening = () => {
    if (recognition && isSupported) {
      try {
        recognition.start()
      } catch (error) {
        console.error('Error starting recognition:', error)
        onError('نمی‌توان تشخیص صدا را شروع کرد')
      }
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking)
  }

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <VolumeX className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg text-gray-600 mb-2">
          تشخیص صدا در مرورگر شما پشتیبانی نمی‌شود
        </p>
        <p className="text-base text-gray-500">
          لطفاً از Chrome، Edge یا Safari استفاده کنید
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Voice Recognition Controls */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={toggleListening}
          variant={isListening ? "voiceActive" : "voice"}
          size="voiceIcon"
          className="relative"
          aria-label={isListening ? "توقف گوش دادن" : "شروع گوش دادن"}
        >
          {isListening ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
          
          {/* Voice wave animation when listening */}
          {isListening && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 voice-wave">
              <div className="voice-bar"></div>
              <div className="voice-bar"></div>
              <div className="voice-bar"></div>
              <div className="voice-bar"></div>
              <div className="voice-bar"></div>
            </div>
          )}
        </Button>
        
        <Button
          onClick={toggleSpeaking}
          variant={isSpeaking ? "elderly" : "elderlySecondary"}
          size="lg"
          aria-label={isSpeaking ? "غیرفعال کردن خروجی صوتی" : "فعال کردن خروجی صوتی"}
        >
          {isSpeaking ? (
            <>
              <Volume2 className="h-6 w-6 ml-2" />
              صدا روشن
            </>
          ) : (
            <>
              <VolumeX className="h-6 w-6 ml-2" />
              صدا خاموش
            </>
          )}
        </Button>
      </div>

      {/* Status and Feedback */}
      <div className="text-center">
        {isListening && (
          <div className="space-y-2">
            <p className="text-lg font-semibold text-elder-blue animate-pulse-gentle">
              در حال گوش دادن...
            </p>
            {transcript && (
              <div className="bg-elder-warm rounded-lg p-4 max-w-md mx-auto">
                <p className="text-base text-gray-700">
                  "{transcript}"
                </p>
                {confidence > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-elder-green h-2 rounded-full transition-all duration-300"
                        style={{ width: `${confidence * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      دقت تشخیص: {Math.round(confidence * 100)}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {!isListening && (
          <p className="text-lg text-gray-600">
            روی میکروفون کلیک کنید تا شروع به صحبت کنید
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-elder-cool rounded-lg p-4 max-w-md text-center">
        <h3 className="font-semibold text-lg mb-2">دستورالعمل‌های صوتی</h3>
        <ul className="text-base text-gray-700 space-y-1">
          <li>• واضح و با سرعت معمولی صحبت کنید</li>
          <li>• بین جملات مکث کنید</li>
          <li>• بگویید "متوقف کن" برای پایان دادن</li>
          <li>• دوباره روی میکروفون کلیک کنید</li>
        </ul>
      </div>
    </div>
  )
}

export default VoiceRecognition 