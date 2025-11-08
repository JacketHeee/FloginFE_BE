// Mock users database
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // In production, passwords should be hashed
    email: 'admin@lannm.com',
    role: 'admin',
    fullName: 'Administrator'
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    email: 'user@lannm.com',
    role: 'user',
    fullName: 'Regular User'
  }
];

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock JWT token
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };
  return btoa(JSON.stringify(payload)); // Simple base64 encoding (not secure, just for demo)
};

// Decode token
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

/**
 * Authentication Service
 * This service handles all authentication-related API calls
 * Ready for real API integration - just replace mock logic with actual fetch calls
 */
const authService = {
  /**
   * Login user
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} { success, token, user, message }
   * 
   * PRODUCTION: Replace with actual API call
   * Example:
   * const response = await fetch('/api/auth/login', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify(credentials)
   * });
   * return await response.json();
   */
  async login(credentials) {
    await delay();

    const { username, password } = credentials;

    // Validate input
    if (!username || !password) {
      return {
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin đăng nhập'
      };
    }

    // Find user
    const user = mockUsers.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return {
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      };
    }

    // Generate token
    const token = generateToken(user);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Đăng nhập thành công'
    };
  },

  /**
   * Register new user
   * @param {Object} userData - { username, password, email, fullName }
   * @returns {Promise<Object>} { success, token, user, message }
   * 
   * PRODUCTION: Replace with actual API call
   */
  async register(userData) {
    await delay();

    const { username, password, email, fullName } = userData;

    // Validate input
    if (!username || !password || !email) {
      return {
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin'
      };
    }

    // Check if username exists
    const existingUser = mockUsers.find(u => u.username === username);
    if (existingUser) {
      return {
        success: false,
        message: 'Tên đăng nhập đã tồn tại'
      };
    }

    // Check if email exists
    const existingEmail = mockUsers.find(u => u.email === email);
    if (existingEmail) {
      return {
        success: false,
        message: 'Email đã được sử dụng'
      };
    }

    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      username,
      password, // In production, hash the password
      email,
      fullName: fullName || username,
      role: 'user'
    };

    mockUsers.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Đăng ký thành công'
    };
  },

  /**
   * Logout user
   * @returns {Promise<Object>} { success, message }
   * 
   * PRODUCTION: May need to call API to invalidate token on server
   */
  async logout() {
    await delay(200);

    // In production, you might want to:
    // 1. Call API to invalidate token on server
    // 2. Add token to blacklist
    // Example:
    // await fetch('/api/auth/logout', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });

    return {
      success: true,
      message: 'Đăng xuất thành công'
    };
  },

  /**
   * Verify token validity
   * @param {string} token - JWT token
   * @returns {Promise<Object>} { valid, user, message }
   * 
   * PRODUCTION: Call API to verify token on server
   */
  async verifyToken(token) {
    await delay(200);

    if (!token) {
      return {
        valid: false,
        message: 'Token không tồn tại'
      };
    }

    // Decode token
    const decoded = decodeToken(token);
    
    if (!decoded) {
      return {
        valid: false,
        message: 'Token không hợp lệ'
      };
    }

    // Check expiration
    if (decoded.exp < Date.now()) {
      return {
        valid: false,
        message: 'Token đã hết hạn'
      };
    }

    // Find user (in production, API will return user data)
    const user = mockUsers.find(u => u.id === decoded.userId);
    
    if (!user) {
      return {
        valid: false,
        message: 'Người dùng không tồn tại'
      };
    }

    const { password: _, ...userWithoutPassword } = user;

    return {
      valid: true,
      user: userWithoutPassword,
      message: 'Token hợp lệ'
    };
  },

  /**
   * Refresh token
   * @param {string} token - Current JWT token
   * @returns {Promise<Object>} { success, token, message }
   * 
   * PRODUCTION: Call API to refresh token
   */
  async refreshToken(token) {
    await delay(300);

    const verification = await this.verifyToken(token);
    
    if (!verification.valid) {
      return {
        success: false,
        message: 'Không thể làm mới token'
      };
    }

    // Generate new token
    const newToken = generateToken(verification.user);

    return {
      success: true,
      token: newToken,
      message: 'Làm mới token thành công'
    };
  },

  /**
   * Change password
   * @param {Object} data - { userId, oldPassword, newPassword }
   * @returns {Promise<Object>} { success, message }
   * 
   * PRODUCTION: Call API to change password
   */
  async changePassword(data) {
    await delay();

    const { userId, oldPassword, newPassword } = data;

    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        message: 'Người dùng không tồn tại'
      };
    }

    if (user.password !== oldPassword) {
      return {
        success: false,
        message: 'Mật khẩu cũ không đúng'
      };
    }

    user.password = newPassword;

    return {
      success: true,
      message: 'Đổi mật khẩu thành công'
    };
  },

  /**
   * Get current user info
   * @param {string} token - JWT token
   * @returns {Promise<Object>} { success, user, message }
   * 
   * PRODUCTION: Call API to get user info
   */
  async getCurrentUser(token) {
    await delay(200);

    const verification = await this.verifyToken(token);
    
    if (!verification.valid) {
      return {
        success: false,
        message: 'Không thể lấy thông tin người dùng'
      };
    }

    return {
      success: true,
      user: verification.user,
      message: 'Lấy thông tin thành công'
    };
  }
};

export default authService;
