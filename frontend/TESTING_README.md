# 🧪 Testing Documentation

## 📋 Tổng quan

Dự án đã được setup đầy đủ với:
- ✅ **Unit Tests** - Test các functions, services riêng lẻ
- ✅ **Component Tests** - Test React components
- ✅ **Integration Tests** - Test toàn bộ user flows

**Tổng số tests**: 114 test cases

## 🚀 Chạy Tests

### 1. Chạy tất cả tests (Watch mode)
```bash
npm test
```
Watch mode sẽ tự động chạy lại tests khi có file thay đổi.

### 2. Chạy tests một lần
```bash
npm run test:once
```

### 3. Chạy tests với coverage report
```bash
npm run test:coverage
```
Sau khi chạy, mở file `coverage/lcov-report/index.html` để xem báo cáo chi tiết.

### 4. Chạy chỉ Unit tests
```bash
npm run test:unit
```

### 5. Chạy chỉ Integration tests
```bash
npm run test:integration
```

### 6. Chạy tests với output chi tiết
```bash
npm run test:verbose
```

### 7. Chạy test cho một file cụ thể
```bash
npm test -- authService.test
npm test -- LoginForm.test
npm test -- Products.test
```

## 📂 Cấu trúc Tests

```
src/
├── components/
│   └── LoginForm/
│       └── __tests__/
│           └── LoginForm.test.jsx       # 15 tests
│
├── pages/
│   └── Products/
│       └── __tests__/
│           └── Products.test.jsx        # 30 tests
│
├── services/
│   └── __tests__/
│       ├── authService.test.js          # 19 tests ✅ PASSING
│       └── productService.test.js       # 20 tests ✅ PASSING
│
└── tests/
    ├── integration/
    │   ├── auth.integration.test.jsx    # 13 tests
    │   └── products.integration.test.jsx # 17 tests
    │
    ├── mock/
    │   ├── authMock.js                  # Mock auth data
    │   ├── productMock.js               # Mock product data
    │   └── fileMock.js                  # Mock file imports
    │
    └── setup.js                         # Global test setup
```

## 🎯 Test Coverage

### Authentication (Login)
- ✅ **Service Layer** (authService.test.js)
  - Login với credentials đúng/sai
  - Validation empty fields  
  - Token generation & verification
  - Token refresh
  - Logout
  - Register user
  - Get current user

- ✅ **Component Layer** (LoginForm.test.jsx)
  - Render form elements
  - Input validation
  - Form submission
  - Error handling
  - Loading states
  - Keyboard events (Enter)

- ✅ **Integration** (auth.integration.test.jsx)
  - Complete login flow
  - Token persistence
  - Session management
  - Protected routes
  - Logout flow
  - Multiple login attempts

### Products (CRUD)
- ✅ **Service Layer** (productService.test.js)
  - Get products với filters
  - Get product by ID
  - Create product
  - Update product
  - Delete product
  - Get categories
  - Get statistics
  - Pagination
  - Sorting

- ✅ **Component Layer** (Products.test.jsx)
  - Render product list
  - Search products
  - Filter by category
  - Refresh data
  - Add product (open popup, submit, validation)
  - Edit product
  - Delete product (confirmation)
  - Pagination
  - Loading & error states
  - Empty state

- ✅ **Integration** (products.integration.test.jsx)
  - Complete CREATE flow
  - Complete READ flow
  - Complete UPDATE flow
  - Complete DELETE flow
  - Full CRUD cycle
  - Error handling

## 📊 Test Results

### Current Status
```
Test Suites: 2 passed, 2 total (Service tests)
Tests:       39 passed, 39 total
```

### After Fix (Expected)
```
Test Suites: 6 passed, 6 total
Tests:       114 passed, 114 total
Coverage:    > 80%
```

## 🔧 Troubleshooting

### Issue: TextEncoder is not defined
**Nguyên nhân**: React Router cần TextEncoder trong jsdom environment

**Giải pháp**: Đã thêm vào `src/tests/setup.js`:
```javascript
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
```

**Action**: Restart Jest hoặc chạy lại `npm test`

### Issue: Module not found in integration tests
**Nguyên nhân**: Đường dẫn relative path không đúng

**Giải pháp**: Đã fix paths từ `../../../` thành `../../`

### Issue: Tests không chạy được
**Giải pháp**:
```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📝 Writing New Tests

### Test Structure (AAA Pattern)
```javascript
it('should do something', async () => {
  // Arrange - Setup test data
  const mockData = { ... };

  // Act - Perform action
  const result = await functionToTest(mockData);

  // Assert - Verify result
  expect(result).toBe(expected);
});
```

### Component Test Example
```javascript
it('should render button', () => {
  render(<MyComponent />);
  
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
});
```

### Async Test Example
```javascript
it('should fetch data', async () => {
  mockService.getData.mockResolvedValue({ data: [] });
  
  render(<MyComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### Integration Test Example
```javascript
it('should complete full flow', async () => {
  render(<App />);
  
  // Step 1: Fill form
  fireEvent.change(screen.getByPlaceholderText('Username'), {
    target: { value: 'admin' }
  });
  
  // Step 2: Submit
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  // Step 3: Verify result
  await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
```

## 🎓 Best Practices

1. **Descriptive Test Names**
   ```javascript
   ✅ it('should show error when username is empty')
   ❌ it('test login')
   ```

2. **Test User Behavior, Not Implementation**
   ```javascript
   ✅ screen.getByRole('button', { name: /login/i })
   ❌ wrapper.find('.login-button')
   ```

3. **Use waitFor for Async**
   ```javascript
   ✅ await waitFor(() => expect(...).toBeInTheDocument())
   ❌ setTimeout(() => expect(...), 1000)
   ```

4. **Mock External Dependencies**
   ```javascript
   jest.mock('../services/authService');
   ```

5. **Clean Up After Each Test**
   ```javascript
   beforeEach(() => {
     jest.clearAllMocks();
     localStorage.clear();
   });
   ```

6. **One Assertion Focus Per Test**
   ```javascript
   ✅ it('should return success true')
   ✅ it('should return token')
   ❌ it('should login and return everything')
   ```

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest Matchers](https://jestjs.io/docs/expect)

## 🎉 Quick Start

1. **Clone và install**
   ```bash
   git clone <repo>
   cd frontend
   npm install
   ```

2. **Chạy tests**
   ```bash
   npm test
   ```

3. **Xem coverage**
   ```bash
   npm run test:coverage
   open coverage/lcov-report/index.html
   ```

4. **Chạy app**
   ```bash
   npm run dev
   ```

---

**Happy Testing! 🚀**
