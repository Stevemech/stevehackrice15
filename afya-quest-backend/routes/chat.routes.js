const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const authMiddleware = require('../middleware/auth.middleware');

// Initialize OpenAI (lazy initialization)
let openai = null;
function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

// Generate response using OpenAI - Steve the Health Assistant
async function generateOpenAIResponse(message, conversationHistory = []) {
  const systemPrompt = `You are Steve, a friendly and knowledgeable AI health assistant for Afya Quest, a gamified learning platform for Community Health Assistants (CHAs). 
  
  Your personality:
  - Name: Steve
  - Friendly, approachable, and encouraging
  - Enthusiastic about health education
  - Patient and understanding
  - Uses casual but professional language
  - Occasionally uses light humor when appropriate
  
  Your expertise includes:
  - Health education and medical knowledge
  - Learning support and study tips
  - Platform navigation and features
  - Motivation and encouragement for learning
  - General health and wellness advice
  
  Always:
  - Introduce yourself as Steve when greeting new users
  - Keep responses helpful, encouraging, and educational
  - Remind users to consult qualified healthcare professionals for serious medical conditions
  - Keep responses concise and engaging (under 500 characters when possible)
  - Be supportive of their learning journey`;

  // Build conversation messages for OpenAI
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-5), // Keep last 5 messages for context
    { role: 'user', content: message }
  ];

  try {
    const openaiClient = getOpenAI();
    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate response from AI');
  }
}

// Chat endpoint
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in environment variables.' 
      });
    }

    // Generate AI response using OpenAI
    const aiResponse = await generateOpenAIResponse(message, conversationHistory);

    res.json({
      success: true,
      response: aiResponse,
      provider: 'openai',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Handle OpenAI-specific errors
    if (error.message?.includes('API key') || error.message?.includes('authentication')) {
      return res.status(500).json({ 
        error: 'Invalid OpenAI API key. Please check your configuration.' 
      });
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return res.status(429).json({ 
        error: 'OpenAI API quota exceeded. Please try again later.' 
      });
    } else if (error.message?.includes('content filter')) {
      return res.status(400).json({ 
        error: 'Message blocked by content filters. Please rephrase your question.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to process chat message. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get chat history (if you want to implement persistent chat history)
router.get('/history', authMiddleware, async (req, res) => {
  try {
    // This would require a Chat model to store conversation history
    // For now, return empty array as history is managed client-side
    res.json({ history: [] });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

module.exports = router;
