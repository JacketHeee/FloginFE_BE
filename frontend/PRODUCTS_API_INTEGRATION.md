# Product Management API Integration Guide

## 🎯 Tổng quan

Module quản lý sản phẩm (Products) đã được thiết kế sẵn sàng để tích hợp với REST API backend. Hiện tại đang sử dụng mock data trong `productService.js` để phát triển và testing.

## 📁 Cấu trúc

```
src/
├── services/
│   └── productService.js       # Mock Product API (sẵn sàng thay thế)
├── hooks/
│   └── useProducts.js          # Product state management hook
├── pages/
│   └── Products/
│       ├── Products.jsx        # Product list page
│       └── Products.scss       # Styling
├── components/
│   ├── CustomTable/            # Reusable table component
│   ├── AddProductPopup/        # Add/Edit/View product popup
│   └── SearchPanel/            # Search component
└── utils/
    └── formatters.js           # Data formatting utilities
```

## ✅ Tính năng đã có

### 1. **CRUD Operations**
- ✅ Create: Thêm sản phẩm mới
- ✅ Read: Lấy danh sách sản phẩm với pagination
- ✅ Update: Cập nhật thông tin sản phẩm
- ✅ Delete: Xóa sản phẩm (có confirmation popup)

### 2. **Filters & Search**
- ✅ Search: Tìm kiếm theo tên/mô tả
- ✅ Category filter: Lọc theo danh mục
- ✅ Price range: Lọc theo khoảng giá
- ✅ Sort: Sắp xếp theo field và order

### 3. **Pagination**
- ✅ Page navigation: Next/Previous
- ✅ Page selector: Dropdown chọn trang
- ✅ Items per page: Configurable (default: 10)
- ✅ Total count display

### 4. **UI/UX Features**
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Confirmation popups
- ✅ Keyboard shortcuts (Enter/Escape)
- ✅ Responsive design

## 🔄 Tích hợp API thật

### Bước 1: Tạo API Configuration

Tạo file `src/config/api.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    // Products
    GET_PRODUCTS: '/api/products',           // GET with query params
    GET_PRODUCT_BY_ID: '/api/products/:id',  // GET
    CREATE_PRODUCT: '/api/products',         // POST
    UPDATE_PRODUCT: '/api/products/:id',     // PUT/PATCH
    DELETE_PRODUCT: '/api/products/:id',     // DELETE
    GET_CATEGORIES: '/api/products/categories', // GET
    GET_STATISTICS: '/api/products/statistics'  // GET
  },
  TIMEOUT: 10000 // 10 seconds
};
```

### Bước 2: Tạo API Client Utility

Tạo file `src/utils/apiClient.js`:

```javascript
import { API_CONFIG } from '../config/api';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Make HTTP request with timeout and auth
   */
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

    // Add request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle timeout
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      
      // Handle network errors
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error - please check your connection');
      }
      
      throw error;
    }
  }

  // Convenience methods
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

  patch(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default new ApiClient();
```

### Bước 3: Update productService.js

Thay thế mock logic bằng real API calls:

```javascript
import apiClient from '../utils/apiClient';
import { API_CONFIG } from '../config/api';

const productService = {
  /**
   * Get all products with filters and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} { data, total, page, totalPages }
   */
  async getProducts(params = {}) {
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice);

      const endpoint = `${API_CONFIG.ENDPOINTS.GET_PRODUCTS}?${queryParams.toString()}`;
      const response = await apiClient.get(endpoint);

      return {
        data: response.data || response.products || [],
        total: response.total || 0,
        page: response.page || params.page || 1,
        limit: response.limit || params.limit || 10,
        totalPages: response.totalPages || Math.ceil((response.total || 0) / (params.limit || 10))
      };
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  /**
   * Get single product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getProductById(id) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.GET_PRODUCT_BY_ID.replace(':id', id);
      const response = await apiClient.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  },

  /**
   * Create new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.CREATE_PRODUCT, productData);
      return response.data || response;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  /**
   * Update product
   * @param {number} id - Product ID
   * @param {Object} productData - Updated data
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(id, productData) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.UPDATE_PRODUCT.replace(':id', id);
      const response = await apiClient.put(endpoint, productData);
      return response.data || response;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  /**
   * Delete product
   * @param {number} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteProduct(id) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.DELETE_PRODUCT.replace(':id', id);
      await apiClient.delete(endpoint);
      return true;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },

  /**
   * Get all categories
   * @returns {Promise<Array<string>>} List of categories
   */
  async getCategories() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.GET_CATEGORIES);
      return response.data || response.categories || [];
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  /**
   * Get product statistics
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.GET_STATISTICS);
      return response.data || response;
    } catch (error) {
      console.error('Get statistics error:', error);
      throw error;
    }
  }
};

export default productService;
```

## 📝 API Contract (Expected Backend Format)

### 1. GET /api/products - Get Products List

**Query Parameters:**
```
?search=laptop
&category=Electronics
&page=1
&limit=10
&sortBy=name
&sortOrder=asc
&minPrice=1000
&maxPrice=50000
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop Acer Aspire 7",
      "price": 18990000,
      "quantity": 25,
      "description": "Laptop gaming hiệu năng cao",
      "category": "Electronics",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  }
}
```

**Alternative Response Format:**
```json
{
  "products": [...],
  "total": 20,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

### 2. GET /api/products/:id - Get Product Detail

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop Acer Aspire 7",
    "price": 18990000,
    "quantity": 25,
    "description": "Laptop gaming hiệu năng cao",
    "category": "Electronics",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 3. POST /api/products - Create Product

**Request Body:**
```json
{
  "name": "New Product",
  "price": 1000000,
  "quantity": 50,
  "description": "Product description",
  "category": "Electronics"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 21,
    "name": "New Product",
    "price": 1000000,
    "quantity": 50,
    "description": "Product description",
    "category": "Electronics",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "name": "Name is required",
    "price": "Price must be greater than 0"
  }
}
```

### 4. PUT /api/products/:id - Update Product

**Request Body:**
```json
{
  "name": "Updated Product",
  "price": 1200000,
  "quantity": 40,
  "description": "Updated description",
  "category": "Electronics"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Product",
    "price": 1200000,
    "quantity": 40,
    "description": "Updated description",
    "category": "Electronics",
    "updatedAt": "2024-01-15T11:30:00Z"
  }
}
```

### 5. DELETE /api/products/:id - Delete Product

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 6. GET /api/products/categories - Get Categories

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Home Appliances",
    "Books",
    "Office",
    "Furniture",
    "Accessories",
    "Toys"
  ]
}
```

### 7. GET /api/products/statistics - Get Statistics

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "totalProducts": 20,
    "totalValue": 150000000,
    "lowStockCount": 5,
    "categories": 9
  }
}
```

## 🔒 Authentication

Tất cả API requests phải include JWT token trong header:

```javascript
headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

Token được lấy từ `localStorage.getItem('authToken')` và tự động thêm bởi `apiClient.js`.

## ⚠️ Error Handling

Frontend đã xử lý các trường hợp lỗi:

1. **Network Errors**: Hiển thị "Network error - please check your connection"
2. **Timeout**: Hiển thị "Request timeout - please try again"
3. **HTTP Errors**: Hiển thị message từ backend
4. **Validation Errors**: Hiển thị trong form fields

Backend nên return consistent error format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": "Field-specific error"
  }
}
```

## 🧪 Testing trước khi deploy

### 1. Test với Mock Data
```bash
# Current state - works with mock data
npm start
```

### 2. Test với Real API
```bash
# Set environment variable
REACT_APP_API_URL=http://localhost:3000 npm start
```

### 3. Test Cases

- [ ] **GET Products**: Load danh sách sản phẩm
- [ ] **Search**: Tìm kiếm theo tên
- [ ] **Filter**: Lọc theo category
- [ ] **Sort**: Sắp xếp theo name, price
- [ ] **Pagination**: Chuyển trang, hiển thị đúng
- [ ] **Create**: Thêm sản phẩm mới
- [ ] **Update**: Cập nhật sản phẩm
- [ ] **Delete**: Xóa sản phẩm
- [ ] **Error Handling**: Hiển thị lỗi đúng
- [ ] **Loading States**: Hiển thị spinner
- [ ] **Empty State**: Hiển thị khi không có data

## 🚀 Deployment Checklist

### Frontend
- [ ] Replace mock productService with real API calls
- [ ] Configure API_BASE_URL via environment variables
- [ ] Test all CRUD operations
- [ ] Test pagination and filters
- [ ] Test error scenarios
- [ ] Verify loading states
- [ ] Check responsive design
- [ ] Test with slow network (throttling)

### Backend Requirements
- [ ] Implement REST API endpoints
- [ ] Add authentication middleware
- [ ] Add input validation
- [ ] Add error handling
- [ ] Add CORS configuration
- [ ] Add rate limiting
- [ ] Add logging
- [ ] Write API documentation
- [ ] Add database indexes for performance
- [ ] Implement pagination efficiently

## 📊 Database Schema Recommendation

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2) NOT NULL CHECK (price > 0),
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  description TEXT,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_category (category),
  INDEX idx_name (name),
  INDEX idx_price (price),
  FULLTEXT INDEX idx_search (name, description)
);
```

## 🔗 Environment Variables

Tạo file `.env`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=10000

# Feature Flags
REACT_APP_ENABLE_LOGGING=true
REACT_APP_ENABLE_MOCK_API=false
```

Tạo file `.env.production`:

```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_API_TIMEOUT=15000
REACT_APP_ENABLE_LOGGING=false
REACT_APP_ENABLE_MOCK_API=false
```

## 📖 Additional Resources

- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [CORS Configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Rate Limiting](https://blog.logrocket.com/rate-limiting-node-js/)

## 🆘 Troubleshooting

### Issue: CORS Error
**Solution**: Backend cần enable CORS
```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: 401 Unauthorized
**Solution**: Check token validity
```javascript
// Verify token in localStorage
const token = localStorage.getItem('authToken');
console.log('Token:', token);
```

### Issue: Slow Performance
**Solution**: Add pagination, indexes, caching
- Frontend: Implement virtual scrolling
- Backend: Add database indexes
- Backend: Implement Redis caching

### Issue: Data không update
**Solution**: Check if fetchProducts được gọi sau CRUD
```javascript
// After create/update/delete
await fetchProducts(); // Refresh list
```

---

**Note**: Document này sẽ được cập nhật khi có thay đổi về API contract hoặc implementation details.
