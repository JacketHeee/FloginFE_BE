import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Products from '../Products';
import * as productService from '../../../services/productService';
import '@testing-library/jest-dom';

// Mock productService
jest.mock('../../../services/productService');

const mockProducts = [
  {
    id: 1,
    name: 'Laptop Dell XPS 13',
    price: 25000000,
    quantity: 15,
    description: 'Laptop cao cấp',
    category: 'Electronics',
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    price: 30000000,
    quantity: 20,
    description: 'Điện thoại thông minh',
    category: 'Electronics',
  },
  {
    id: 3,
    name: 'Samsung Galaxy S24',
    price: 22000000,
    quantity: 10,
    description: 'Smartphone Android',
    category: 'Electronics',
  },
];

const mockCategories = ['Electronics', 'Clothing', 'Books'];

const renderProducts = () => {
  return render(
    <BrowserRouter>
      <Products />
    </BrowserRouter>
  );
};

describe('Products Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    productService.getProducts.mockResolvedValue({
      data: mockProducts,
      total: mockProducts.length,
      page: 1,
      totalPages: 1,
    });
    productService.getCategories.mockResolvedValue(mockCategories);
  });

  describe('Rendering', () => {
    it('should render products page with title', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText(/Quản lý sản phẩm/i)).toBeInTheDocument();
      });
    });

    it('should render add product button', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText(/Thêm sản phẩm/i)).toBeInTheDocument();
      });
    });

    it('should render search input', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Tìm kiếm/i)).toBeInTheDocument();
      });
    });

    it('should render category filter', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText(/Tất cả danh mục/i)).toBeInTheDocument();
      });
    });

    it('should load and display products', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
        expect(screen.getByText('Samsung Galaxy S24')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should filter products by search term', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      productService.getProducts.mockResolvedValue({
        data: [mockProducts[0]],
        total: 1,
        page: 1,
        totalPages: 1,
      });

      const searchInput = screen.getByPlaceholderText(/Tìm kiếm/i);
      fireEvent.change(searchInput, { target: { value: 'Laptop' } });

      await waitFor(() => {
        expect(productService.getProducts).toHaveBeenCalledWith(
          expect.objectContaining({
            search: 'Laptop',
          })
        );
      });
    });

    it('should debounce search input', async () => {
      jest.useFakeTimers();
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Tìm kiếm/i);
      
      // Type multiple times quickly
      fireEvent.change(searchInput, { target: { value: 'L' } });
      fireEvent.change(searchInput, { target: { value: 'La' } });
      fireEvent.change(searchInput, { target: { value: 'Lap' } });

      // Should not call API yet
      expect(productService.getProducts).toHaveBeenCalledTimes(1); // Initial load

      // Fast-forward time
      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(productService.getProducts).toHaveBeenCalledTimes(2); // Initial + debounced call
      });

      jest.useRealTimers();
    });
  });

  describe('Category Filter', () => {
    it('should load categories on mount', async () => {
      renderProducts();

      await waitFor(() => {
        expect(productService.getCategories).toHaveBeenCalled();
      });
    });

    it('should filter products by category', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      productService.getProducts.mockResolvedValue({
        data: mockProducts.filter(p => p.category === 'Electronics'),
        total: 3,
        page: 1,
        totalPages: 1,
      });

      const categorySelect = screen.getByRole('combobox');
      fireEvent.change(categorySelect, { target: { value: 'Electronics' } });

      await waitFor(() => {
        expect(productService.getProducts).toHaveBeenCalledWith(
          expect.objectContaining({
            category: 'Electronics',
          })
        );
      });
    });
  });

  describe('Refresh Functionality', () => {
    it('should have refresh button', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
      });
    });

    it('should reload products when refresh button is clicked', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(productService.getProducts).toHaveBeenCalledTimes(2);
      });
    });

    it('should reset search and filters on refresh', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      // Apply filters
      const searchInput = screen.getByPlaceholderText(/Tìm kiếm/i);
      fireEvent.change(searchInput, { target: { value: 'Laptop' } });

      // Click refresh
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
    });
  });

  describe('Add Product', () => {
    it('should open add product popup when clicking add button', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText(/Thêm sản phẩm/i)).toBeInTheDocument();
      });

      const addButton = screen.getByText(/Thêm sản phẩm/i);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText(/Thêm sản phẩm mới/i)).toBeInTheDocument();
      });
    });

    it('should call createProduct service when submitting new product', async () => {
      productService.createProduct.mockResolvedValue({
        id: 4,
        name: 'New Product',
        price: 10000000,
        quantity: 5,
        description: 'Test',
        category: 'Electronics',
      });

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText(/Thêm sản phẩm/i)).toBeInTheDocument();
      });

      const addButton = screen.getByText(/Thêm sản phẩm/i);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText(/Thêm sản phẩm mới/i)).toBeInTheDocument();
      });

      // Fill form
      const nameInput = screen.getByPlaceholderText(/Tên sản phẩm/i);
      const priceInput = screen.getByPlaceholderText(/Giá/i);
      const quantityInput = screen.getByPlaceholderText(/Số lượng/i);

      fireEvent.change(nameInput, { target: { value: 'New Product' } });
      fireEvent.change(priceInput, { target: { value: '10000000' } });
      fireEvent.change(quantityInput, { target: { value: '5' } });

      // Submit
      const submitButton = screen.getByRole('button', { name: /Thêm/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(productService.createProduct).toHaveBeenCalled();
      });
    });
  });

  describe('Edit Product', () => {
    it('should open edit popup when clicking edit button', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByTitle(/Chỉnh sửa/i);
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Chỉnh sửa sản phẩm/i)).toBeInTheDocument();
      });
    });

    it('should call updateProduct service when editing product', async () => {
      productService.updateProduct.mockResolvedValue({
        ...mockProducts[0],
        name: 'Updated Product',
      });

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByTitle(/Chỉnh sửa/i);
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Chỉnh sửa sản phẩm/i)).toBeInTheDocument();
      });

      const nameInput = screen.getByDisplayValue('Laptop Dell XPS 13');
      fireEvent.change(nameInput, { target: { value: 'Updated Product' } });

      const saveButton = screen.getByRole('button', { name: /Lưu/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(productService.updateProduct).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            name: 'Updated Product',
          })
        );
      });
    });
  });

  describe('Delete Product', () => {
    it('should show delete confirmation popup', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle(/Xóa/i);
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Bạn có chắc chắn muốn xóa/i)).toBeInTheDocument();
      });
    });

    it('should call deleteProduct service when confirming delete', async () => {
      productService.deleteProduct.mockResolvedValue(true);

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle(/Xóa/i);
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Bạn có chắc chắn muốn xóa/i)).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /Xóa/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(productService.deleteProduct).toHaveBeenCalledWith(1);
      });
    });

    it('should not delete when clicking cancel', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle(/Xóa/i);
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Bạn có chắc chắn muốn xóa/i)).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /Hủy/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(productService.deleteProduct).not.toHaveBeenCalled();
      });
    });
  });

  describe('Pagination', () => {
    it('should display pagination controls', async () => {
      productService.getProducts.mockResolvedValue({
        data: mockProducts,
        total: 50,
        page: 1,
        totalPages: 5,
      });

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText(/Trang/i)).toBeInTheDocument();
      });
    });

    it('should load next page when clicking next button', async () => {
      productService.getProducts.mockResolvedValue({
        data: mockProducts,
        total: 50,
        page: 1,
        totalPages: 5,
      });

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(productService.getProducts).toHaveBeenCalledWith(
          expect.objectContaining({
            page: 2,
          })
        );
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when fetching products', async () => {
      productService.getProducts.mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              data: mockProducts,
              total: mockProducts.length,
              page: 1,
              totalPages: 1,
            });
          }, 100);
        });
      });

      renderProducts();

      expect(screen.getByText(/Đang tải/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/Đang tải/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when fetch fails', async () => {
      productService.getProducts.mockRejectedValue(new Error('Network error'));

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText(/lỗi/i)).toBeInTheDocument();
      });
    });

    it('should retry loading products after error', async () => {
      productService.getProducts
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          data: mockProducts,
          total: mockProducts.length,
          page: 1,
          totalPages: 1,
        });

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText(/lỗi/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /thử lại/i });
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no products', async () => {
      productService.getProducts.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText(/Không có sản phẩm nào/i)).toBeInTheDocument();
      });
    });
  });
});
