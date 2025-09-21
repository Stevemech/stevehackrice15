# 🤖 OpenAI Integration Setup Guide

## ✅ **What I've Done**

1. **Replaced Gemini with OpenAI** in `package.json`
2. **Updated chat routes** to use OpenAI API instead of Gemini
3. **Installed OpenAI SDK** (`npm install openai`)
4. **Updated error handling** for OpenAI-specific errors

## 🔧 **What You Need to Do**

### 1. **Get OpenAI API Key**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-`)

### 2. **Set Environment Variable**
Create or update your `.env` file in the backend directory:

```bash
cd afya-quest-backend
```

Create/edit `.env` file:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/afyaquest

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Server Configuration
PORT=8080
NODE_ENV=development
```

### 3. **Restart Backend**
```bash
cd afya-quest-backend
npm start
```

## 🎯 **Model Options**

The simplest and cheapest model is already set:
- **`gpt-3.5-turbo`** - Fast, cheap, good for chat (default)
- **`gpt-4`** - More advanced but more expensive
- **`gpt-4-turbo`** - Latest GPT-4 model

## 💰 **Cost**

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens (very cheap!)
- **GPT-4**: ~$0.03 per 1K tokens (more expensive)

For a health chatbot, GPT-3.5-turbo is perfect and very affordable.

## 🧪 **Test It**

1. **Start both servers**:
   ```bash
   # Terminal 1 - Backend
   cd afya-quest-backend
   npm start

   # Terminal 2 - Frontend
   cd afya-quest-frontend
   npm start
   ```

2. **Login and test Steve**:
   - Go to http://localhost:3000
   - Login with demo credentials
   - Click Steve's floating button
   - Ask a health question!

## 🚀 **You're All Set!**

Steve will now use OpenAI instead of Gemini and should work perfectly! The error about "Invalid Gemini API key" will be gone, and you'll get proper health assistant responses from OpenAI.

**Just add your OpenAI API key to the `.env` file and restart the backend!** 🎉
