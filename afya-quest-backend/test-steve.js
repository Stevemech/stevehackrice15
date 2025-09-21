// Test script to verify Steve - AI Health Assistant
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testSteve() {
  console.log('👨‍⚕️ Testing Steve - AI Health Assistant...\n');
  
  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
    console.log('❌ GEMINI_API_KEY not configured');
    console.log('📝 Please set your API key in afya-quest-backend/.env');
    console.log('🔗 Get your key at: https://makersuite.google.com/app/apikey\n');
    return;
  }

  try {
    console.log('✅ API key found');
    console.log('😄 Initializing Steve (Gemini AI)...');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('📤 Sending test message to Steve...');
    
    const prompt = `You are Steve, a friendly and knowledgeable AI health assistant for Afya Quest. 
    Your personality: friendly, approachable, encouraging, enthusiastic about health education.
    Introduce yourself as Steve and respond to: "Hello, can you help me learn about basic first aid?"
    Keep your response friendly and helpful.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Success! Steve is working correctly.\n');
    console.log('💬 Steve\'s Response:');
    console.log('-'.repeat(50));
    console.log(text);
    console.log('-'.repeat(50));
    console.log('\n🎉 Steve is ready to help your users!');
    console.log('🚀 Start your servers and chat with Steve.');
    
  } catch (error) {
    console.log('❌ Error testing Gemini AI:');
    console.log(error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n💡 Your API key might be invalid. Please check:');
      console.log('   • Key is correct');
      console.log('   • Key has not expired'); 
      console.log('   • Gemini API is enabled for your project');
    }
  }
}

testSteve();
