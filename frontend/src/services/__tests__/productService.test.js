import productService from '../productService';

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should get products with default params', async () => {
      const result = await productService.getProducts();

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBeGreaterThan(0);
    });

    it('should filter products by search term', async () => {
      const result = await productService.getProducts({ 
        search: 'Laptop' 
      });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach(product => {
        const searchTerm = 'laptop';
        expect(
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        ).toBe(true);
      });
    });

    it('should filter products by category', async () => {
      const category = 'Electronics';
      const result = await productService.getProducts({ 
        category 
      });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach(product => {
        expect(product.category).toBe(category);
      });
    });

    it('should filter products by price range', async () => {
      const minPrice = 100000;
      const maxPrice = 1000000;

      const result = await productService.getProducts({ 
        minPrice, 
        maxPrice 
      });

      result.data.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(minPrice);
        expect(product.price).toBeLessThanOrEqual(maxPrice);
      });
    });

    it('should sort products by name ascending', async () => {
      const result = await productService.getProducts({ 
        sortBy: 'name',
        sortOrder: 'asc'
      });

      const names = result.data.map(p => p.name.toLowerCase());
      for (let i = 0; i < names.length - 1; i++) {
        expect(names[i] <= names[i + 1]).toBe(true);
      }
    });

    it('should sort products by price descending', async () => {
      const result = await productService.getProducts({ 
        sortBy: 'price',
        sortOrder: 'desc'
      });

      const prices = result.data.map(p => p.price);
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i] >= prices[i + 1]).toBe(true);
      }
    });

    it('should paginate products correctly', async () => {
      const limit = 5;
      const page = 1;

      const result = await productService.getProducts({ 
        page, 
        limit 
      });

      expect(result.data.length).toBeLessThanOrEqual(limit);
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
    });

    it('should return empty array for page beyond total pages', async () => {
      const result = await productService.getProducts({ 
        page: 999,
        limit: 10
      });

      expect(result.data).toEqual([]);
    });
  });

  describe('getProductById', () => {
    it('should get product by valid ID', async () => {
      const result = await productService.getProductById(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.name).toBeDefined();
    });

    it('should throw error for non-existent product', async () => {
      await expect(
        productService.getProductById(99999)
      ).rejects.toThrow('Product not found');
    });
  });

  describe('createProduct', () => {
    it('should create product successfully', async () => {
      const newProduct = {
        name: 'New Test Product',
        price: 150000,
        quantity: 15,
        description: 'Test product description',
        category: 'Electronics'
      };

      const result = await productService.createProduct(newProduct);

      expect(result.id).toBeDefined();
      expect(result.name).toBe(newProduct.name);
      expect(result.price).toBe(newProduct.price);
      expect(result.quantity).toBe(newProduct.quantity);
      expect(result.category).toBe(newProduct.category);
    });

    it('should generate unique ID for new product', async () => {
      const product1 = await productService.createProduct({
        name: 'Product 1',
        price: 100,
        quantity: 10,
        description: 'Test',
        category: 'Test'
      });

      const product2 = await productService.createProduct({
        name: 'Product 2',
        price: 200,
        quantity: 20,
        description: 'Test',
        category: 'Test'
      });

      expect(product1.id).not.toBe(product2.id);
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const updatedData = {
        name: 'Updated Product Name',
        price: 250000
      };

      const result = await productService.updateProduct(1, updatedData);

      expect(result.name).toBe(updatedData.name);
      expect(result.price).toBe(updatedData.price);
      expect(result.id).toBe(1);
    });

    it('should throw error when updating non-existent product', async () => {
      const updatedData = { name: 'Updated' };

      await expect(
        productService.updateProduct(99999, updatedData)
      ).rejects.toThrow('Product not found');
    });

    it('should partially update product', async () => {
      const original = await productService.getProductById(1);
      const updatedData = { price: 999999 };

      const result = await productService.updateProduct(1, updatedData);

      expect(result.price).toBe(updatedData.price);
      expect(result.name).toBe(original.name); // Unchanged
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      // First create a product
      const newProduct = await productService.createProduct({
        name: 'To Delete',
        price: 100,
        quantity: 10,
        description: 'Test',
        category: 'Test'
      });

      const result = await productService.deleteProduct(newProduct.id);

      expect(result).toBe(true);

      // Verify it's deleted
      await expect(
        productService.getProductById(newProduct.id)
      ).rejects.toThrow('Product not found');
    });

    it('should throw error when deleting non-existent product', async () => {
      await expect(
        productService.deleteProduct(99999)
      ).rejects.toThrow('Product not found');
    });
  });

  describe('getCategories', () => {
    it('should get list of categories', async () => {
      const result = await productService.getCategories();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return sorted categories', async () => {
      const result = await productService.getCategories();

      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i] <= result[i + 1]).toBe(true);
      }
    });
  });

  describe('getStatistics', () => {
    it('should get product statistics', async () => {
      const result = await productService.getStatistics();

      expect(result.totalProducts).toBeDefined();
      expect(result.totalValue).toBeDefined();
      expect(result.lowStockCount).toBeDefined();
      expect(typeof result.totalProducts).toBe('number');
      expect(typeof result.totalValue).toBe('number');
      expect(typeof result.lowStockCount).toBe('number');
    });
  });
});
