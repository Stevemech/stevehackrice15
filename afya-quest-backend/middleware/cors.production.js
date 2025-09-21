const cors = require('cors');

// Production CORS configuration
const productionCorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allowed origins for production
    const allowedOrigins = [
      // GitHub Pages
      /^https:\/\/.*\.github\.io$/,
      /^https:\/\/.*\.github\.com$/,
      
      // Custom domains (add yours here)
      'https://afya-quest.com',
      'https://www.afya-quest.com',
      
      // Development origins
      'http://localhost:3000',
      'http://localhost:3001',
      
      // Mobile app origins
      'capacitor://localhost',
      'http://localhost',
      'ionic://localhost',
      
      // Ngrok tunnels
      /^https:\/\/.*\.ngrok\.io$/,
      /^https:\/\/.*\.ngrok\.app$/,
      /^https:\/\/.*\.ngrok-free\.app$/,
    ];
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-HTTP-Method-Override'
  ],
  exposedHeaders: ['Authorization'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Development CORS (more permissive)
const developmentCorsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: '*'
};

// Export appropriate configuration based on environment
const corsMiddleware = cors(
  process.env.NODE_ENV === 'production' 
    ? productionCorsOptions 
    : developmentCorsOptions
);

module.exports = corsMiddleware;
