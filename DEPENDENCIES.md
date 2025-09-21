# Afya Quest Project Dependencies

## Project Overview
This is a gamified curriculum platform for Community Health Advocates (CHAs) consisting of:
- **Backend**: Node.js/Express API
- **Frontend**: React application with TypeScript
- **Root**: Shared dependencies

---

## Backend Dependencies (`afya-quest-backend/`)

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@google/generative-ai` | ^0.24.1 | Google's Generative AI SDK for AI-powered features |
| `bcryptjs` | ^2.4.3 | Password hashing and security |
| `cloudinary` | ^1.37.0 | Cloud-based image and video management |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| `dotenv` | ^16.0.3 | Environment variable management |
| `express` | ^4.18.2 | Web application framework |
| `express-validator` | ^7.0.1 | Middleware for input validation |
| `jsonwebtoken` | ^9.0.0 | JWT token generation and verification |
| `mongoose` | ^7.2.0 | MongoDB object modeling |
| `multer` | ^1.4.5-lts.1 | File upload handling middleware |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@types/express` | ^4.17.17 | TypeScript definitions for Express |
| `@types/node` | ^20.2.5 | TypeScript definitions for Node.js |
| `jest` | ^29.5.0 | Testing framework |
| `nodemon` | ^2.0.22 | Auto-restart server on file changes |

---

## Frontend Dependencies (`afya-quest-frontend/`)

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@testing-library/jest-dom` | ^5.16.5 | Custom DOM element matchers for Jest |
| `@testing-library/react` | ^13.4.0 | React testing utilities |
| `@testing-library/user-event` | ^13.5.0 | User interaction simulation for testing |
| `axios` | ^1.4.0 | HTTP client for API requests |
| `leaflet` | ^1.9.4 | Interactive maps library |
| `react` | ^18.2.0 | React library |
| `react-dom` | ^18.2.0 | React DOM rendering |
| `react-leaflet` | ^4.2.1 | React components for Leaflet maps |
| `react-router-dom` | ^6.11.0 | Routing for React applications |
| `react-scripts` | 5.0.1 | Create React App build scripts |
| `typescript` | ^4.9.5 | TypeScript language support |
| `web-vitals` | ^2.1.4 | Web performance metrics |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@types/jest` | ^27.5.2 | TypeScript definitions for Jest |
| `@types/node` | ^16.18.0 | TypeScript definitions for Node.js |
| `@types/react` | ^18.2.0 | TypeScript definitions for React |
| `@types/react-dom` | ^18.2.0 | TypeScript definitions for React DOM |
| `@types/leaflet` | ^1.9.3 | TypeScript definitions for Leaflet |

---

## Root Dependencies (`/`)

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `axios` | ^1.12.2 | HTTP client |
| `leaflet` | ^1.9.4 | Interactive maps |
| `react` | ^19.1.1 | React library (newer version) |
| `react-dom` | ^19.1.1 | React DOM (newer version) |
| `react-leaflet` | ^5.0.0 | React Leaflet components (newer version) |
| `react-router-dom` | ^7.9.1 | React routing (newer version) |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@types/leaflet` | ^1.9.20 | TypeScript definitions for Leaflet |
| `@types/node` | ^24.5.2 | TypeScript definitions for Node.js |
| `@types/react-router-dom` | ^5.3.3 | TypeScript definitions for React Router |

---

## Technology Stack Summary

### Languages & Frameworks
- **Frontend**: React 18.2.0 / 19.1.1, TypeScript 4.9.5
- **Backend**: Node.js, Express 4.18.2
- **Database**: MongoDB (via Mongoose 7.2.0)

### Key Features
- **Authentication**: JWT tokens (jsonwebtoken), bcrypt for passwords
- **Maps**: Leaflet for interactive mapping
- **AI Integration**: Google Generative AI
- **File Uploads**: Multer + Cloudinary
- **API Communication**: Axios
- **Routing**: React Router DOM
- **Testing**: Jest, React Testing Library

### Environment Requirements
- **Node.js**: Compatible with versions supporting ES6+
- **MongoDB**: Required for database operations
- **Environment Variables**: Managed with dotenv

---

## Installation Instructions

### Install Backend Dependencies
```bash
cd afya-quest-backend
npm install
```

### Install Frontend Dependencies
```bash
cd afya-quest-frontend
npm install
```

### Install Root Dependencies (if needed)
```bash
npm install
```

---

## Version Conflicts to Note
⚠️ **React Version Mismatch**: The root package.json uses React 19.1.1 while the frontend uses React 18.2.0. This may cause compatibility issues.

⚠️ **React Router Version Difference**: Root uses v7.9.1 while frontend uses v6.11.0.

⚠️ **Node Types Versions**: Different @types/node versions across packages (16.18.0, 20.2.5, 24.5.2).

---

## Security Considerations
- Keep all dependencies updated regularly
- Review security advisories for critical packages
- Use `npm audit` to check for vulnerabilities
- Ensure proper environment variable configuration for sensitive data

---

*Last Updated: September 2025*