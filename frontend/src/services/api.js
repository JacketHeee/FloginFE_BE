import axios from 'axios';

/**
 * API Client Configuration
 * Centralized HTTP client with interceptors for request/response handling
 */

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

/**
 * Request Interceptor
 * Automatically adds JWT token to all requests
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    // Handle request error
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles global error responses and token refresh
 */
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
      });
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Call refresh token endpoint
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (response.data.token) {
            // Save new token
            localStorage.setItem('authToken', response.data.token);
            
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            
            // Retry original request
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh token failed, logout user
        console.error('Token refresh failed:', refreshError);
        
        // Clear auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redirect to login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
      // Could show a toast notification here
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Server error, please try again later');
      // Could show a toast notification here
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - please check your connection');
      // Could show a toast notification here
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to create cancel token
 * Useful for cancelling requests on component unmount
 */
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

/**
 * Helper function to check if error is from cancelled request
 */
export const isCancel = (error) => {
  return axios.isCancel(error);
};

export default api;
