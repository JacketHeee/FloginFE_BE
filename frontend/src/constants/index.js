// App constants
export const APP_NAME = 'Grocify'
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Route constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PRODUCTS: '/products',
  CATEGORIES: '/categories'
}

// Local storage keys
export const STORAGE_KEYS = {
  IS_LOGGED_IN: 'isLoggedIn',
  USER_DATA: 'userData',
  TOKEN: 'token'
}

// API endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout'
  }
}