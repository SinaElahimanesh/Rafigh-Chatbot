# رفیق - دوست هوشمند شما

یک چت‌بات دوستانه و قابل دسترس برای کاربران سالمند با قابلیت تشخیص صدا و رابط کاربری فارسی.

## ویژگی‌ها

- 🎤 تشخیص صدا به زبان فارسی
- 🔊 خروجی صوتی
- 🌙 حالت تاریک/روشن
- 📱 طراحی واکنش‌گرا و قابل دسترس
- 🎨 رابط کاربری دوستانه برای سالمندان
- 🔄 پشتیبانی از RTL (راست به چپ)

## نصب و راه‌اندازی

```bash
npm install
npm start
```

## عیب‌یابی تشخیص صدا

### مشکلات رایج و راه‌حل‌ها:

#### 1. خطای "لطفاً مجوز میکروفون را بدهید"
- روی آیکون قفل در نوار آدرس کلیک کنید
- مجوز میکروفون را فعال کنید
- صفحه را رفرش کنید

#### 2. خطای "تشخیص صدا در مرورگر شما پشتیبانی نمی‌شود"
- از مرورگر Chrome یا Edge استفاده کنید
- مرورگر خود را به‌روزرسانی کنید
- از HTTPS استفاده کنید

#### 3. خطای "صدایی تشخیص داده نشد"
- با صدای واضح و بلند صحبت کنید
- از محیط آرام استفاده کنید
- میکروفون را بررسی کنید

#### 4. خطای "مشکل در دسترسی به میکروفون"
- میکروفون را بررسی کنید
- تنظیمات میکروفون مرورگر را چک کنید
- از میکروفون دیگری استفاده کنید

### مرورگرهای پشتیبانی شده:
- ✅ Google Chrome (توصیه شده)
- ✅ Microsoft Edge
- ✅ Safari (محدود)
- ❌ Firefox (پشتیبانی محدود)

### نکات مهم:
- حتماً از HTTPS استفاده کنید
- میکروفون باید به درستی کار کند
- محیط باید نسبتاً آرام باشد
- با صدای واضح و طبیعی صحبت کنید

## تکنولوژی‌های استفاده شده

- React
- Tailwind CSS
- Radix UI
- Framer Motion
- Web Speech API

# Elderly-Friendly Chatbot

A beautiful, accessible, and user-friendly chatbot interface designed specifically for elderly users with voice capabilities. This application provides a warm, supportive AI companion that can communicate through both text and voice modalities.

## 🌟 Features

### Elderly-Friendly Design
- **Large, readable text** - Optimized font sizes for better readability
- **High contrast colors** - Easy-to-see color combinations
- **Simple navigation** - Intuitive interface with clear visual hierarchy
- **Large touch targets** - Buttons and interactive elements sized for easy interaction
- **Smooth animations** - Gentle, non-distracting animations
- **Dark mode support** - Toggle between light and dark themes

### Voice Capabilities
- **Speech-to-Text** - Speak naturally to the chatbot
- **Text-to-Speech** - Hear responses read aloud
- **Voice feedback** - Visual indicators for voice recognition status
- **Confidence scoring** - See how well your speech was understood
- **Elderly-optimized speech** - Slower, clearer speech synthesis

### Accessibility Features
- **Keyboard navigation** - Full keyboard accessibility
- **Screen reader support** - ARIA labels and semantic HTML
- **Focus indicators** - Clear focus states for all interactive elements
- **Reduced motion support** - Respects user's motion preferences
- **High contrast mode** - Enhanced contrast for better visibility

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Edge, or Safari for voice features)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000` to see the application

## 🎯 Usage

### Text Chat
1. Type your message in the input field
2. Press Enter or click the Send button
3. Wait for the AI to respond

### Voice Chat
1. Click the microphone button to start voice recognition
2. Speak clearly and at a normal pace
3. The chatbot will transcribe your speech and respond
4. Click the microphone again to stop listening

### Voice Output
1. Toggle the "Speech On/Off" button to enable/disable text-to-speech
2. When enabled, all AI responses will be read aloud
3. Click the speaker icon on any message to hear it again

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and functional components
- **Radix UI** - Accessible, unstyled UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Web Speech API** - Browser-based speech recognition and synthesis
- **Lucide React** - Beautiful, customizable icons

## 🌐 Browser Support

### Voice Features
- **Chrome** - Full support
- **Edge** - Full support  
- **Safari** - Full support
- **Firefox** - Limited support (no speech recognition)

---

**Made with ❤️ for elderly users everywhere** 