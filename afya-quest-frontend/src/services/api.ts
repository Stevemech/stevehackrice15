import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Dispatch auth change event for chatbot
      window.dispatchEvent(new CustomEvent('authChanged'));
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) => 
    api.post('/auth/register', userData),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

// Lesson endpoints
export const lessonAPI = {
  getAllLessons: () => 
    api.get('/lessons'),
  
  getLessonById: (id: string) => 
    api.get(`/lessons/${id}`),
};

// Video endpoints
export const videoAPI = {
  getAllVideos: () => 
    api.get('/videos'),
};

// Question endpoints
export const questionAPI = {
  getDailyQuestions: () => 
    api.get('/questions/daily'),
};

// Progress endpoints
export const progressAPI = {
  getUserProgress: () => 
    api.get('/progress'),
};

// Daily Report endpoints
export const reportAPI = {
  createReport: (reportData: any) => 
    api.post('/reports', reportData),
  
  getAllReports: () => 
    api.get('/reports'),
  
  getReportById: (id: string) => 
    api.get(`/reports/${id}`),
  
  deleteReport: (id: string) => 
    api.delete(`/reports/${id}`),
  
  updateReport: (id: string, reportData: any) => 
    api.put(`/reports/${id}`, reportData),
};

// Chat endpoints
export const chatAPI = {
  sendMessage: (message: string, conversationHistory?: Array<{role: 'user' | 'assistant', content: string}>) =>
    api.post('/chat/message', { message, conversationHistory }),
  
  getChatHistory: () => 
    api.get('/chat/history'),
};

export default api;
