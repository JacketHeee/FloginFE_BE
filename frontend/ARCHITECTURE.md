# Product Management - Architecture Documentation

## 📁 Cấu trúc thư mục

```
src/
├── services/
│   └── productService.js       # API service layer (mock data)
├── hooks/
│   └── useProducts.js          # Custom hook for product management
├── utils/
│   └── formatters.js           # Utility functions
├── components/
│   ├── CustomTable/
│   ├── AddProductPopup/
│   └── ...
└── pages/
    └── ProductList/
        ├── ProductList.jsx
        └── ProductList.scss
```

## 🏗️ Kiến trúc

### 1. Service Layer (`productService.js`)
- **Mục đích**: Tách biệt logic API calls
- **Hiện tại**: Mock data với simulate delay
- **Khi có API thật**: Chỉ cần thay đổi implementation trong file này

**Functions:**
- `getProducts(params)` - Lấy danh sách sản phẩm (có filter, search, pagination, sort)
- `getProductById(id)` - Lấy chi tiết 1 sản phẩm
- `createProduct(data)` - Tạo sản phẩm mới
- `updateProduct(id, data)` - Cập nhật sản phẩm
- `deleteProduct(id)` - Xóa sản phẩm
- `getCategories()` - Lấy danh sách categories
- `getStatistics()` - Lấy thống kê

### 2. Custom Hook (`useProducts.js`)
- **Mục đích**: Quản lý state và logic của products
- **Features**:
  - Loading state
  - Error handling
  - Pagination management
  - Filter management
  - CRUD operations

**Returns:**
```javascript
{
  products,          // Mảng sản phẩm
  loading,           // Trạng thái loading
  error,             // Error message
  pagination,        // { page, limit, total, totalPages }
  filters,           // { search, category, minPrice, maxPrice, sortBy, sortOrder }
  addProduct,        // Function
  updateProduct,     // Function
  deleteProduct,     // Function
  fetchProducts,     // Function
  updateFilters,     // Function
  resetFilters,      // Function
  changePage,        // Function
  changePageSize     // Function
}
```

### 3. Utility Functions (`formatters.js`)
- `formatCurrency(value)` - Format VND
- `formatNumber(value)` - Format số
- `formatDate(date)` - Format ngày
- `truncateText(text, max)` - Cắt text
- `productToRow(product)` - Convert object → array
- `rowToProduct(row)` - Convert array → object

## 🔄 Data Flow

```
UI Component (ProductList)
    ↓
useProducts Hook
    ↓
productService
    ↓
Mock Data / API (khi có backend)
```

## 🚀 Cách sử dụng trong ProductList

```javascript
import useProducts from '../../hooks/useProducts';

const ProductList = () => {
  const {
    products,
    loading,
    error,
    pagination,
    filters,
    addProduct,
    updateProduct,
    deleteProduct,
    updateFilters,
    changePage
  } = useProducts();

  // Convert sang table format
  const dataTable = products.map(productToRow);

  // Search
  const handleSearch = (searchValue) => {
    updateFilters({ search: searchValue });
  };

  // Filter by category
  const handleFilter = (category) => {
    updateFilters({ category });
  };

  // CRUD operations tự động refresh data
};
```

## 🔧 Khi có API Backend

### Thay đổi trong `productService.js`:

**Before (Mock):**
```javascript
async getProducts(params) {
  await delay();
  let filtered = [...mockProducts];
  // ... filter logic
  return { data, total, page, totalPages };
}
```

**After (Real API):**
```javascript
async getProducts(params) {
  const response = await fetch('/api/products?' + new URLSearchParams(params));
  const data = await response.json();
  return data;
}
```

**Hoặc với Axios:**
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://your-api.com/api';

async getProducts(params) {
  const response = await axios.get(`${API_BASE_URL}/products`, { params });
  return response.data;
}
```

## ✨ Features đã implement

✅ CRUD operations (Create, Read, Update, Delete)
✅ Search functionality
✅ Category filter
✅ Pagination (dynamic)
✅ Loading states
✅ Error handling
✅ Toast notifications
✅ View/Edit/Add modes

## 📝 Sẵn sàng phát triển

Bây giờ bạn có thể phát triển các tính năng:
- ✅ **Search** - Đã hoạt động (tìm theo tên & mô tả)
- ✅ **Filter by category** - Đã có hàm `handleCategoryFilter`
- 🔧 **Sort** - Có trong service, cần UI
- 🔧 **Price range filter** - Có trong service, cần UI
- 🔧 **Advanced filters** - Có thể mở rộng

## 🎯 Next Steps

1. Tạo UI cho filter panel (category dropdown, price range)
2. Implement sort UI (click column header)
3. Thêm advanced search
4. Export/Import data
5. Bulk operations


