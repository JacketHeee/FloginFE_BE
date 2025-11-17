import api from "./api";

// Product Service - All API calls will be here
const productService = {
  /**
   * Get all products with optional filters and pagination
   * @param {Object} params - { search, category, page, limit, sortBy, sortOrder }
   * @returns {Promise<Object>} { data: [...], total, page, totalPages }
   */
  async getProducts(params = {}) {
    try {
      const res = await api.get("/products", { params });
      return res.data;
    } catch (err) {
      console.error("Lấy danh sách sản phẩm lỗi!", err);
      throw err;
    }
  },

  /**
   * Get single product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getProductById(id) {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      console.error("Lấy sản phẩm theo id lỗi", err);
      throw err;
    }
  },

  /**
   * Get all unique categories
   * @returns {Promise<Array<string>>} List of categories
   */
  async getCategories() {
    try {
      const res = await api.get("/categories");
      return res.data;
    } catch (err) {
      console.error("Lấy danh sách danh mục lỗi", err);
      return [];
    }
  },

  /**
   * Create new product
   * @param {Object} productData - { name, price, quantity, description, category }
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    try {
      const res = await api.post("/products", productData);
      return res.data;
    } catch (err) {
      console.error("thêm sản phẩm lỗi", err);
      throw err;
    }
  },

  /**
   * Update product
   * @param {number} id - Product ID
   * @param {Object} productData - Updated fields
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(id, productData) {
    try {
      const res = await api.put(`/products/${id}`, productData);
      return res.data;
    } catch (err) {
      console.error("cập nhật sản phẩm lỗi ", err);
      throw err;
    }
  },

  /**
   * Delete product
   * @param {number} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteProduct(id) {
    try {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    } catch (err) {
      console.error("xóa sản phẩm lỗi ", err);
      throw err;
    }
  },

  /**
   * Get product statistics
   * @returns {Promise<Object>} { totalProducts, totalValue, lowStockCount }
   */
  async getStatistics() {},
};

export default productService;
