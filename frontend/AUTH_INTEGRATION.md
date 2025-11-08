# Authentication System - API Integration Guide

## 🎯 Tổng quan

Hệ thống xác thực đã được thiết kế sẵn sàng để tích hợp với API backend thật. Hiện tại đang sử dụng mock API để phát triển và testing.

## 📁 Cấu trúc

```
src/
├── services/
│   └── authService.js          # Mock Auth API (thay thế bằng real API)
├── contexts/
│   └── AuthContext.jsx         # Auth state management
├── components/
│   ├── ProtectedRoute/         # Route protection
│   └── LoginForm/              # Login UI
└── router/
    └── AppRouter.jsx           # Route configuration
```

## 🔐 Tính năng hiện tại

### 1. **Login**
- Username/Password authentication
- Token-based authentication (mock JWT)
- Error handling
- Loading states
- Remember user session

### 2. **Logout**
- Clear auth token
- Clear user data
- Redirect to login
- Confirmation popup

### 3. **Route Protection**
- Protect routes from unauthorized access
- Auto redirect to login
- Token verification on app start
- Loading state during verification

### 4. **Session Management**
- Store token in localStorage
- Auto-verify token on app start
- Token expiration handling (24h)
- Refresh token capability

## 🔄 Tích hợp API thật

### Bước 1: Cập nhật `authService.js`

Thay thế mock logic bằng real API calls:

```javascript
// Before (Mock)
async login(credentials) {
  await delay();
  const user = mockUsers.find(u => u.username === username);
  // ...
}

// After (Real API)
async login(credentials) {
  const response = await fetch('https://your-api.com/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const error = await response.json();
    return {
      success: false,
      message: error.message || 'Đăng nhập thất bại'
    };
  }

  const data = await response.json();
  return {
    success: true,
    token: data.token,
    user: data.user,
    message: 'Đăng nhập thành công'
  };
}
```

### Bước 2: Cấu hình API Base URL

Tạo file `src/config/api.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    VERIFY_TOKEN: '/api/auth/verify',
    REFRESH_TOKEN: '/api/auth/refresh',
    CURRENT_USER: '/api/auth/me'
  },
  TIMEOUT: 10000 // 10s
};
```

### Bước 3: Tạo API Client

Tạo file `src/utils/apiClient.js`:

```javascript
import { API_CONFIG } from '../config/api';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add auth token if exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default new ApiClient();
```

### Bước 4: Update AuthService với Real API

```javascript
import apiClient from '../utils/apiClient';
import { API_CONFIG } from '../config/api';

const authService = {
  async login(credentials) {
    try {
      const data = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
      return {
        success: true,
        token: data.token,
        user: data.user,
        message: data.message || 'Đăng nhập thành công'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Đăng nhập thất bại'
      };
    }
  },

  async verifyToken(token) {
    try {
      const data = await apiClient.get(API_CONFIG.ENDPOINTS.VERIFY_TOKEN);
      return {
        valid: true,
        user: data.user,
        message: 'Token hợp lệ'
      };
    } catch (error) {
      return {
        valid: false,
        message: error.message || 'Token không hợp lệ'
      };
    }
  },

  // ... other methods
};

export default authService;
```

## 📝 API Contract (Expected Backend Format)

### POST /api/auth/login
**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "fullName": "Administrator"
  },
  "message": "Login successful"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### GET /api/auth/verify
**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### POST /api/auth/logout
**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## 🔒 Security Best Practices

### 1. **Token Storage**
```javascript
// Hiện tại: localStorage (dễ dàng nhưng kém bảo mật)
localStorage.setItem('authToken', token);

// Tốt hơn: httpOnly cookie (backend set cookie)
// Frontend không cần lưu token
```

### 2. **Token Expiration**
```javascript
// Check token expiration trước mỗi request
const isTokenExpired = (token) => {
  const decoded = JSON.parse(atob(token.split('.')[1]));
  return decoded.exp * 1000 < Date.now();
};
```

### 3. **Auto Refresh Token**
```javascript
// Tự động refresh token trước khi hết hạn
useEffect(() => {
  const interval = setInterval(async () => {
    const token = localStorage.getItem('authToken');
    if (token && isTokenExpired(token)) {
      await refreshAuth();
    }
  }, 5 * 60 * 1000); // Check mỗi 5 phút

  return () => clearInterval(interval);
}, []);
```

### 4. **HTTPS Only**
```javascript
// Chỉ sử dụng HTTPS trong production
if (process.env.NODE_ENV === 'production' && !window.location.protocol.includes('https')) {
  window.location.protocol = 'https:';
}
```

## 🧪 Testing với Mock Data

### Tài khoản demo:
- **Admin:** username: `admin`, password: `admin123`
- **User:** username: `user`, password: `user123`

### Test scenarios:
1. ✅ Login thành công → Redirect to /products
2. ✅ Login thất bại → Show error message
3. ✅ Logout → Clear session, redirect to /login
4. ✅ Access protected route without login → Redirect to /login
5. ✅ Refresh page → Auto verify token, maintain session
6. ✅ Token expired → Clear session, redirect to /login

## 🚀 Deployment Checklist

- [ ] Replace mock authService with real API
- [ ] Configure API base URL via environment variables
- [ ] Implement proper error handling
- [ ] Add request/response interceptors
- [ ] Setup token refresh mechanism
- [ ] Implement CSRF protection
- [ ] Add rate limiting
- [ ] Setup CORS properly
- [ ] Use HTTPS in production
- [ ] Add security headers
- [ ] Implement logging and monitoring

## 📞 Backend Requirements

Backend API cần implement:

1. **Authentication endpoints:**
   - POST /api/auth/login
   - POST /api/auth/register
   - POST /api/auth/logout
   - GET /api/auth/verify
   - POST /api/auth/refresh

2. **Security features:**
   - Password hashing (bcrypt)
   - JWT token generation
   - Token expiration (24h)
   - Refresh token (7 days)
   - Rate limiting
   - CORS configuration

3. **Response format:**
   - Consistent JSON structure
   - Proper HTTP status codes
   - Clear error messages

## 🔗 Liên kết hữu ích

- [JWT.io](https://jwt.io/) - JWT debugger
- [OWASP Auth Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [MDN - Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
