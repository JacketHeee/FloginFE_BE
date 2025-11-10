export const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
  verifyToken: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
  changePassword: jest.fn(),
  getCurrentUser: jest.fn(),
};

export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'user',
  fullName: 'Test User'
};

export const mockAdminUser = {
  id: 2,
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin',
  fullName: 'Administrator'
};

export const mockToken = 'mock-jwt-token-123456';

export const mockLoginResponse = {
  success: true,
  token: mockToken,
  user: mockUser,
  message: 'Đăng nhập thành công'
};

export const mockLoginError = {
  success: false,
  message: 'Tên đăng nhập hoặc mật khẩu không đúng'
};

export const mockRegisterResponse = {
  success: true,
  token: mockToken,
  user: mockUser,
  message: 'Đăng ký thành công'
};
