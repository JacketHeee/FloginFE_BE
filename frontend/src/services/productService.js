// Mock data - simulating database
let mockProducts = [
  { id: 1, name: "Laptop Acer Aspire 7", price: 18990000, quantity: 25, description: "Laptop gaming hiệu năng cao với chip Intel Gen 12.", category: "Electronics" },
  { id: 2, name: "Bàn phím cơ DareU EK87", price: 890000, quantity: 50, description: "Bàn phím cơ với switch Blue RGB backlight.", category: "Electronics" },
  { id: 3, name: "Chuột Logitech G102", price: 450000, quantity: 75, description: "Chuột chơi game có đèn LED RGB và độ chính xác cao.", category: "Electronics" },
  { id: 4, name: "Tai nghe Sony WH-1000XM5", price: 7490000, quantity: 15, description: "Tai nghe chống ồn cao cấp, pin 30 giờ.", category: "Electronics" },
  { id: 5, name: "Bình giữ nhiệt Lock&Lock 500ml", price: 350000, quantity: 90, description: "Giữ nóng 12 giờ và lạnh 24 giờ, vỏ thép không gỉ.", category: "Home & Kitchen" },
  { id: 6, name: "Áo thun Uniqlo cổ tròn", price: 290000, quantity: 120, description: "Áo cotton thoáng mát, phù hợp mặc hằng ngày.", category: "Fashion" },
  { id: 7, name: "Quạt đứng Panasonic F-409K", price: 1350000, quantity: 40, description: "Quạt đứng 5 cánh, công suất 60W, điều khiển từ xa.", category: "Home Appliances" },
  { id: 8, name: "Bếp điện từ Sunhouse SHD6862", price: 890000, quantity: 60, description: "Bếp điện từ cảm ứng công suất 2000W.", category: "Home Appliances" },
  { id: 9, name: "Sách Clean Code", price: 320000, quantity: 30, description: "Cuốn sách nổi tiếng về cách viết mã sạch của Robert C. Martin.", category: "Books" },
  { id: 10, name: "Giày thể thao Nike Air Max", price: 2750000, quantity: 20, description: "Giày sneaker chính hãng, đệm khí êm ái.", category: "Fashion" },
  { id: 11, name: "Tủ lạnh Samsung Inverter 256L", price: 8290000, quantity: 10, description: "Tủ lạnh tiết kiệm điện với công nghệ làm lạnh đa chiều.", category: "Home Appliances" },
  { id: 12, name: "Ghế công thái học Sihoo M57", price: 4990000, quantity: 35, description: "Ghế văn phòng hỗ trợ lưng, điều chỉnh độ cao linh hoạt.", category: "Office" },
  { id: 13, name: "Điện thoại iPhone 15 Pro", price: 27990000, quantity: 12, description: "Smartphone cao cấp với chip A17 Pro và camera 48MP.", category: "Electronics" },
  { id: 14, name: "Bàn học gỗ thông", price: 1650000, quantity: 22, description: "Bàn học chất liệu gỗ thông tự nhiên, phủ sơn bóng.", category: "Furniture" },
  { id: 15, name: "Balo chống nước Targus 15.6 inch", price: 890000, quantity: 70, description: "Balo laptop chống nước, nhiều ngăn tiện lợi.", category: "Accessories" },
  { id: 16, name: "Đèn bàn học LED Rạng Đông", price: 320000, quantity: 55, description: "Đèn LED tiết kiệm điện, 3 chế độ sáng.", category: "Home & Kitchen" },
  { id: 17, name: "Cốc sứ Minh Long", price: 120000, quantity: 120, description: "Cốc sứ cao cấp, thiết kế sang trọng.", category: "Home & Kitchen" },
  { id: 18, name: "Bộ đồ chơi LEGO City", price: 1450000, quantity: 18, description: "Bộ LEGO phát triển tư duy sáng tạo cho trẻ.", category: "Toys" },
  { id: 19, name: "Máy in Canon LBP2900", price: 3650000, quantity: 15, description: "Máy in laser đơn năng, in nhanh 12 trang/phút.", category: "Office" },
  { id: 20, name: "Máy lọc không khí Sharp FP-J40E-W", price: 4500000, quantity: 10, description: "Máy lọc không khí có ion âm, lọc sạch bụi mịn PM2.5.", category: "Home Appliances" }
];

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Product Service - All API calls will be here
const productService = {
  /**
   * Get all products with optional filters and pagination
   * @param {Object} params - { search, category, page, limit, sortBy, sortOrder }
   * @returns {Promise<Object>} { data: [...], total, page, totalPages }
   */
  async getProducts(params = {}) {
    await delay();
    
    const { 
      search = '', 
      category = '', 
      page = 1, 
      limit = 10,
      sortBy = 'id',
      sortOrder = 'asc',
      minPrice,
      maxPrice
    } = params;

    // Filter products
    let filtered = [...mockProducts];

    // Search by name or description
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filter by price range
    if (minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages
    };
  },

  /**
   * Get single product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getProductById(id) {
    await delay();
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  /**
   * Create new product
   * @param {Object} productData - { name, price, quantity, description, category }
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    await delay();
    
    const newId = mockProducts.length > 0 ? Math.max(...mockProducts.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name: productData.name,
      price: productData.price,
      quantity: productData.quantity,
      description: productData.description,
      category: productData.category,
      createdAt: new Date().toISOString()
    };
    
    mockProducts.push(newProduct);
    return newProduct;
  },

  /**
   * Update product
   * @param {number} id - Product ID
   * @param {Object} productData - Updated fields
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(id, productData) {
    await delay();
    
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...productData,
      updatedAt: new Date().toISOString()
    };
    
    return mockProducts[index];
  },

  /**
   * Delete product
   * @param {number} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteProduct(id) {
    await delay();
    
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    mockProducts.splice(index, 1);
    return true;
  },

  /**
   * Get all unique categories
   * @returns {Promise<Array<string>>} List of categories
   */
  async getCategories() {
    await delay(100);
    
    const categories = [...new Set(mockProducts.map(p => p.category))];
    return categories.sort();
  },

  /**
   * Get product statistics
   * @returns {Promise<Object>} { totalProducts, totalValue, lowStockCount }
   */
  async getStatistics() {
    await delay(100);
    
    const totalProducts = mockProducts.length;
    const totalValue = mockProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStockCount = mockProducts.filter(p => p.quantity < 20).length;
    
    return {
      totalProducts,
      totalValue,
      lowStockCount
    };
  }
};

export default productService;
