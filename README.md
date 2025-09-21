# Afya Quest - Gamified Curriculum for Community Health Assistants

## Overview

Afya Quest is a mobile-first web application designed to empower Community Health Assistants (CHAs) through gamified learning. The platform provides interactive lessons, video modules, daily questions, and location-based features to enhance the learning experience for healthcare workers in the field.

## Features

### Interactive Learning
- Bilingual support (English & Swahili)
- Gamified curriculum with points and achievements
- Progressive difficulty levels
- Category-based lessons (Hygiene, Nutrition, Emergency Care, etc.)

### Video Modules and Lessons
- Content-based informational videos
- Quiz integration with video lessons
- Progress tracking for each module
- Offline capability for downloaded content

### Daily Questions
- Reinforcement learning through daily quizzes
- Multiple difficulty levels (Easy, Medium, Hard)
- Points-based reward system
- Streak tracking to encourage daily engagement

### Map-Based UI
- Location-based navigation
- Nearby health facilities finder
- CHA network visualization
- Easy navigation for Kabale region

## Tech Stack

### Frontend
- **React** (v18.2.0) - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Leaflet** - Map integration
- **Axios** - API communication

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Project Structure

```
hackriceproject/
├── afya-quest-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── styles/             # CSS files
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Utility functions
│   └── public/                 # Static assets
│
├── afya-quest-backend/          # Express backend API
│   ├── routes/                 # API routes
│   ├── models/                 # Database models
│   ├── middleware/             # Custom middleware
│   ├── controllers/            # Route controllers
│   └── config/                 # Configuration files
│
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd afya-quest-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
- MongoDB connection string
- JWT secret key
- Other environment variables

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd afya-quest-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get lesson by ID
- `POST /api/lessons` - Create new lesson
- `PUT /api/lessons/:id` - Update lesson

### Videos
- `GET /api/videos` - Get all videos

### Questions
- `GET /api/questions/daily` - Get daily questions

### Progress
- `GET /api/progress` - Get user progress

## Features in Detail

### Gamification System
- **Points System**: Earn points for completing lessons, watching videos, and answering questions
- **Levels**: Progress through levels based on total points earned
- **Ranks**: Bronze, Silver, Gold, and Platinum CHA ranks
- **Achievements**: Unlock badges for various accomplishments
- **Streaks**: Maintain daily streaks for consistent learning

### Language Support
- Full bilingual support (English and Swahili)
- Toggle between languages at any time
- Content available in both languages

### Offline Functionality
- Download lessons for offline access
- Cache progress locally
- Sync when connection is restored

## Development

### Running Tests
```bash
# Frontend tests
cd afya-quest-frontend
npm test

# Backend tests
cd afya-quest-backend
npm test
```

### Building for Production
```bash
# Frontend build
cd afya-quest-frontend
npm run build

# Backend (ensure environment is set to production)
NODE_ENV=production npm start
```

## Demo Credentials
- Email: `demo@afyaquest.com`
- Password: `demo123`

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.

## Acknowledgments
- Designed for Community Health Assistants (CHAs)
- Built to address healthcare education challenges in remote areas
- Optimized for mobile devices and low-bandwidth environments

## Contact
For questions or support, please contact the development team.
