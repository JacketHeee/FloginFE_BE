import authService from '../authService';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials = {
        username: 'admin',
        password: 'admin123'
      };

      const result = await authService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('admin');
      expect(result.user.password).toBeUndefined(); // Password không được trả về
    });

    it('should fail with invalid username', async () => {
      const credentials = {
        username: 'invaliduser',
        password: 'admin123'
      };

      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should fail with invalid password', async () => {
      const credentials = {
        username: 'admin',
        password: 'wrongpassword'
      };

      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should fail with empty username', async () => {
      const credentials = {
        username: '',
        password: 'admin123'
      };

      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Vui lòng nhập');
    });

    it('should fail with empty password', async () => {
      const credentials = {
        username: 'admin',
        password: ''
      };

      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Vui lòng nhập');
    });

    it('should login with user account', async () => {
      const credentials = {
        username: 'user',
        password: 'user123'
      };

      const result = await authService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.user.username).toBe('user');
      expect(result.user.role).toBe('user');
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      const userData = {
        username: 'newuser',
        password: 'newpass123',
        email: 'new@example.com',
        fullName: 'New User'
      };

      const result = await authService.register(userData);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.user.username).toBe('newuser');
    });

    it('should fail with existing username', async () => {
      const userData = {
        username: 'admin',
        password: 'newpass123',
        email: 'test@example.com'
      };

      const result = await authService.register(userData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('đã tồn tại');
    });

    it('should fail with existing email', async () => {
      const userData = {
        username: 'newuser2',
        password: 'newpass123',
        email: 'admin@lannm.com'
      };

      const result = await authService.register(userData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Email');
    });

    it('should fail with missing fields', async () => {
      const userData = {
        username: 'newuser',
        password: ''
      };

      const result = await authService.register(userData);

      expect(result.success).toBe(false);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const credentials = {
        username: 'admin',
        password: 'admin123'
      };
      const loginResult = await authService.login(credentials);
      const token = loginResult.token;

      const result = await authService.verifyToken(token);

      expect(result.valid).toBe(true);
      expect(result.user).toBeDefined();
    });

    it('should reject invalid token', async () => {
      const result = await authService.verifyToken('invalid-token');

      expect(result.valid).toBe(false);
    });

    it('should reject empty token', async () => {
      const result = await authService.verifyToken('');

      expect(result.valid).toBe(false);
    });

    it('should reject null token', async () => {
      const result = await authService.verifyToken(null);

      expect(result.valid).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const result = await authService.logout();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Đăng xuất thành công');
    });
  });

  describe('refreshToken', () => {
    it('should refresh valid token', async () => {
      const credentials = {
        username: 'admin',
        password: 'admin123'
      };
      const loginResult = await authService.login(credentials);
      const oldToken = loginResult.token;

      const result = await authService.refreshToken(oldToken);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.token).not.toBe(oldToken);
    });

    it('should fail to refresh invalid token', async () => {
      const result = await authService.refreshToken('invalid-token');

      expect(result.success).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user info with valid token', async () => {
      const credentials = {
        username: 'admin',
        password: 'admin123'
      };
      const loginResult = await authService.login(credentials);
      const token = loginResult.token;

      const result = await authService.getCurrentUser(token);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('admin');
    });

    it('should fail with invalid token', async () => {
      const result = await authService.getCurrentUser('invalid-token');

      expect(result.success).toBe(false);
    });
  });
});
