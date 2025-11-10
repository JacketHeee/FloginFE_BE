# Testing Guide - Login & Products

## 📋 Mục lục
- [Setup Testing Environment](#setup-testing-environment)
- [Chạy Tests](#chạy-tests)
- [Test Coverage](#test-coverage)
- [Login Tests](#login-tests)
- [Products Tests](#products-tests)
- [Troubleshooting](#troubleshooting)

## 🚀 Setup Testing Environment

### 1. Dependencies đã có
```json
{
  "@testing-library/react": "^latest",
  "@testing-library/jest-dom": "^latest",
  "jest": "^latest",
  "babel-jest": "^latest"
}
```

### 2. Cấu trúc Test Files
```
src/
├── services/
│   ├── __tests__/
│   │   ├── authService.test.js      ✅ Đã tạo
│   │   └── productService.test.js   ✅ Đã tạo
│   ├── authService.js
│   └── productService.js
├── tests/
│   ├── setup.js                      ✅ Đã tạo
│   └── mock/
│       ├── authMock.js               ✅ Đã tạo
│       ├── productMock.js            ✅ Đã tạo
│       └── fileMock.js               ✅ Đã tạo
```

### 3. Configuration Files
- ✅ `jest.config.js` - Đã cấu hình
- ✅ `babel.config.js` - Đã có
- ✅ `src/tests/setup.js` - Đã tạo

## 🏃 Chạy Tests

### Chạy tất cả tests
```bash
npm test
```

### Chạy tests với coverage
```bash
npm run test:coverage
```

### Chạy test cho một file cụ thể
```bash
# Test authService
npm test -- authService.test.js

# Test productService
npm test -- productService.test.js
```

### Watch mode (tự động re-run khi file thay đổi)
```bash
npm test -- --watch
```

### Chạy tests với verbose output
```bash
npm test -- --verbose
```

## 📊 Test Coverage

### Coverage Report Locations
```
coverage/
├── lcov-report/
│   └── index.html          # View in browser
├── clover.xml
└── coverage-final.json
```

### View Coverage Report
```bash
# Generate coverage
npm run test:coverage

# Open HTML report (Windows)
start coverage/lcov-report/index.html

# Open HTML report (Mac/Linux)
open coverage/lcov-report/index.html
```

### Coverage Thresholds (Target)
```javascript
{
  "statements": 80,
  "branches": 75,
  "functions": 80,
  "lines": 80
}
```

## 🔐 Login Tests

### Test Cases cho AuthService

#### 1. **Login Tests** (6 test cases)
```javascript
✅ should login successfully with valid credentials
✅ should fail with invalid username
✅ should fail with invalid password
✅ should fail with empty username
✅ should fail with empty password
✅ should login with user account
```

#### 2. **Register Tests** (4 test cases)
```javascript
✅ should register new user successfully
✅ should fail with existing username
✅ should fail with existing email
✅ should fail with missing fields
```

#### 3. **Token Verification Tests** (4 test cases)
```javascript
✅ should verify valid token
✅ should reject invalid token
✅ should reject empty token
✅ should reject null token
```

#### 4. **Logout Tests** (1 test case)
```javascript
✅ should logout successfully
```

#### 5. **Token Refresh Tests** (2 test cases)
```javascript
✅ should refresh valid token
✅ should fail to refresh invalid token
```

#### 6. **Get Current User Tests** (2 test cases)
```javascript
✅ should get current user info with valid token
✅ should fail with invalid token
```

### Test Data cho Login
```javascript
// Valid credentials
{
  username: 'admin',
  password: 'admin123'
}

{
  username: 'user',
  password: 'user123'
}

// Invalid scenarios
{
  username: '',        // Empty username
  password: ''         // Empty password
}

{
  username: 'invalid', // Wrong username
  password: 'wrong'    // Wrong password
}
```

## 📦 Products Tests

### Test Cases cho ProductService

#### 1. **Get Products Tests** (8 test cases)
```javascript
✅ should get products with default params
✅ should filter products by search term
✅ should filter products by category
✅ should filter products by price range
✅ should sort products by name ascending
✅ should sort products by price descending
✅ should paginate products correctly
✅ should return empty array for page beyond total pages
```

#### 2. **Get Product By ID Tests** (2 test cases)
```javascript
✅ should get product by valid ID
✅ should throw error for non-existent product
```

#### 3. **Create Product Tests** (2 test cases)
```javascript
✅ should create product successfully
✅ should generate unique ID for new product
```

#### 4. **Update Product Tests** (3 test cases)
```javascript
✅ should update product successfully
✅ should throw error when updating non-existent product
✅ should partially update product
```

#### 5. **Delete Product Tests** (2 test cases)
```javascript
✅ should delete product successfully
✅ should throw error when deleting non-existent product
```

#### 6. **Get Categories Tests** (2 test cases)
```javascript
✅ should get list of categories
✅ should return sorted categories
```

#### 7. **Get Statistics Tests** (1 test case)
```javascript
✅ should get product statistics
```

### Test Data cho Products
```javascript
// Valid product
{
  name: 'Test Product',
  price: 150000,
  quantity: 15,
  description: 'Test description',
  category: 'Electronics'
}

// Filter params
{
  search: 'Laptop',
  category: 'Electronics',
  minPrice: 100000,
  maxPrice: 1000000,
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  limit: 10
}
```

## 📝 Test Structure Example

### Basic Test Structure
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup trước mỗi test
    jest.clearAllMocks();
  });

  describe('Function Name', () => {
    it('should do something', async () => {
      // Arrange
      const input = { ... };

      // Act
      const result = await functionToTest(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });
});
```

### Async Test Example
```javascript
it('should handle async operation', async () => {
  const result = await asyncFunction();
  
  expect(result).toBeDefined();
});
```

### Error Handling Test
```javascript
it('should throw error', async () => {
  await expect(
    functionThatThrows()
  ).rejects.toThrow('Error message');
});
```

## 🔧 Troubleshooting

### Issue 1: Tests không chạy
**Solution:**
```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Module not found
**Solution:**
```bash
# Check babel configuration
cat babel.config.js

# Ensure jest.config.js has correct moduleNameMapper
```

### Issue 3: Timeout errors
**Solution:**
```javascript
// Increase timeout in test
it('should complete', async () => {
  // ... test code
}, 10000); // 10 seconds timeout
```

### Issue 4: Mock not working
**Solution:**
```javascript
// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Reset module registry
beforeEach(() => {
  jest.resetModules();
});
```

## 📈 Best Practices

### 1. Test Naming
```javascript
// ✅ Good
it('should return user when credentials are valid')

// ❌ Bad
it('test login')
```

### 2. AAA Pattern
```javascript
it('should create product', async () => {
  // Arrange
  const productData = { ... };

  // Act
  const result = await createProduct(productData);

  // Assert
  expect(result.success).toBe(true);
});
```

### 3. One Assertion Focus
```javascript
// ✅ Good - Focused test
it('should return success true', async () => {
  const result = await login(credentials);
  expect(result.success).toBe(true);
});

it('should return token', async () => {
  const result = await login(credentials);
  expect(result.token).toBeDefined();
});

// ❌ Bad - Multiple focuses
it('should login', async () => {
  const result = await login(credentials);
  expect(result.success).toBe(true);
  expect(result.token).toBeDefined();
  expect(result.user).toBeDefined();
  expect(result.user.username).toBe('admin');
});
```

### 4. Clean Up
```javascript
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
```

## 🎯 Test Checklist

### Login Feature
- [x] Valid login
- [x] Invalid username
- [x] Invalid password
- [x] Empty fields
- [x] Token generation
- [x] Token verification
- [x] Logout
- [x] Register
- [x] Refresh token

### Products Feature
- [x] List products
- [x] Search products
- [x] Filter by category
- [x] Filter by price
- [x] Sort products
- [x] Pagination
- [x] Create product
- [x] Update product
- [x] Delete product
- [x] Get categories
- [x] Get statistics

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Jest Matchers](https://jestjs.io/docs/expect)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🎓 Next Steps

1. **Chạy tests hiện tại:**
   ```bash
   npm test
   ```

2. **Xem coverage report:**
   ```bash
   npm run test:coverage
   ```

3. **Thêm tests cho components:**
   - LoginForm component tests
   - Products component tests
   - AddProductPopup component tests

4. **Viết integration tests:**
   - Login flow end-to-end
   - CRUD products flow
   - Protected routes

5. **Viết E2E tests:**
   - User journey tests
   - Cross-browser testing

---

**Happy Testing! 🎉**
