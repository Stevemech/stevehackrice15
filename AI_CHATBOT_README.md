# Meet Steve - Your AI Health Assistant

Steve is a friendly AI health assistant powered by Google Gemini, designed specifically for the Afya Quest learning platform. He's here to help Community Health Assistants with their learning journey!

## Quick Setup

1. **Get a Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to get your free API key

2. **Configure your environment**:
   ```bash
   # In your .env file
   GEMINI_API_KEY=your-actual-gemini-api-key
   GEMINI_MODEL=gemini-pro
   ```

## Available Gemini Models

- **gemini-pro**: Best for text-only prompts (default)
- **gemini-pro-vision**: For text and image prompts
- **gemini-1.5-pro**: Latest model with improved performance

## Why Gemini?

- ✅ **Free tier available**: 60 requests per minute
- ✅ **High quality responses**: Advanced reasoning capabilities  
- ✅ **Fast response times**: Optimized for real-time chat
- ✅ **Safety filters**: Built-in content safety
- ✅ **Conversation context**: Maintains chat history
- ✅ **Health education focused**: Tailored prompts for medical learning

## Setup Instructions

1. **Copy the environment file (if not already done):**
   ```bash
   cd afya-quest-backend
   cp .env.example .env
   ```

2. **Get your Gemini API key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key

3. **Configure your .env file:**
   ```bash
   nano .env
   # Add your key:
   GEMINI_API_KEY=your-actual-api-key-here
   ```

4. **Start the backend:**
   ```bash
   npm run dev
   ```

5. **Start the frontend:**
   ```bash
   cd ../afya-quest-frontend
   npm start
   ```

## Meet Steve's Features

- 😊 **Friendly Personality**: Steve is approachable, patient, and encouraging
- 🧠 **Google Gemini Powered**: Uses Google's latest AI technology
- 👫 **Context-aware**: Steve remembers your conversation history
- 🎯 **Health Education Expert**: Specialized in medical knowledge and learning
- 🔒 **Safety First**: Built-in content moderation and medical disclaimers
- ⚡ **Fast & Reliable**: Quick responses with proper error handling
- 📱 **Works Everywhere**: Responsive design for all devices
- 🎆 **Encouraging**: Steve motivates your learning journey

## How Steve Works

1. **You ask Steve**: Send a message through the chat interface
2. **Steve thinks**: He considers your question, chat history, and health education context
3. **Gemini AI processing**: Google's advanced AI generates Steve's personalized response
4. **Safety check**: Steve ensures all medical advice includes proper disclaimers
5. **Steve responds**: You get a friendly, helpful answer tailored to your learning needs

## Customizing the AI Assistant

To customize the AI's behavior, edit the system prompt in `/routes/chat.routes.js`:

```javascript
const systemPrompt = `You are an AI assistant for Afya Quest...
// Modify this prompt to change the AI's personality and focus
`;
```

## Testing the Integration

Once configured, you can test the chatbot by:

1. Starting both backend and frontend servers
2. Clicking the floating chat button (bottom-left corner)
3. Asking health education questions
4. Observing the AI-powered responses

## Troubleshooting

- **"API key not configured"**: Make sure `GEMINI_API_KEY` is set in your .env file
- **"Invalid API key"**: Check that your key is correct and has not expired
- **"Quota exceeded"**: You've hit the rate limit - wait a moment and try again
- **"Safety filter"**: Your message was blocked - try rephrasing your question
- **No response**: Check your internet connection and backend server status

## Rate Limits

- **Free tier**: 60 requests per minute
- **Paid tier**: Higher limits available
- The chatbot will show appropriate error messages if limits are exceeded
