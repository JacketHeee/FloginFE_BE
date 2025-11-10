export const mockProducts = [
  {
    id: 1,
    name: 'Test Product 1',
    price: 100000,
    quantity: 10,
    description: 'Test description 1',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Test Product 2',
    price: 200000,
    quantity: 20,
    description: 'Test description 2',
    category: 'Fashion'
  },
  {
    id: 3,
    name: 'Laptop Dell XPS',
    price: 25000000,
    quantity: 5,
    description: 'High-end laptop',
    category: 'Electronics'
  }
];

export const mockProductResponse = {
  data: mockProducts,
  total: 3,
  page: 1,
  limit: 10,
  totalPages: 1
};

export const mockProductService = {
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getCategories: jest.fn(),
  getStatistics: jest.fn(),
};

export const mockNewProduct = {
  name: 'New Product',
  price: 150000,
  quantity: 15,
  description: 'New product description',
  category: 'Office'
};

export const mockCategories = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Office',
  'Furniture'
];
