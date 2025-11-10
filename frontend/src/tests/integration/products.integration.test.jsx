import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Products from '../../pages/Products/Products';
import * as productService from '../../services/productService';
import '@testing-library/jest-dom';

// Mock productService
jest.mock('../../services/productService');

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
];

const mockCategories = ['Electronics', 'Clothing', 'Books'];

const renderProducts = () => {
  return render(
    <BrowserRouter>
      <Products />
    </BrowserRouter>
  );
};

describe('Products CRUD Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    productService.getProducts.mockResolvedValue({
      data: [...mockProducts],
      total: mockProducts.length,
      page: 1,
      totalPages: 1,
    });
    productService.getCategories.mockResolvedValue([...mockCategories]);
  });

  describe('Create Product Flow', () => {
    it('should complete full create product flow', async () => {
      const newProduct = {
        id: 3,
        name: 'Samsung Galaxy S24',
        price: 22000000,
        quantity: 10,
        description: 'Smartphone Android',
        category: 'Electronics',
      };

      productService.createProduct.mockResolvedValue(newProduct);
      productService.getProducts.mockResolvedValueOnce({
        data: [...mockProducts],
        total: mockProducts.length,
        page: 1,
        totalPages: 1,
      }).mockResolvedValueOnce({
        data: [...mockProducts, newProduct],
        total: mockProducts.length + 1,
        page: 1,
        totalPages: 1,
      });

      renderProducts();

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      // Open add product popup
      const addButton = screen.getByRole('button', { name: /Thêm sản phẩm/i });
      fireEvent.click(addButton);

      // Wait for popup to open
      await waitFor(() => {
        expect(screen.getByText(/Thêm sản phẩm mới/i)).toBeInTheDocument();
      });

      // Fill form
      const nameInput = screen.getByPlaceholderText(/Tên sản phẩm/i);
      const priceInput = screen.getByPlaceholderText(/Giá/i);
      const quantityInput = screen.getByPlaceholderText(/Số lượng/i);
      const descriptionInput = screen.getByPlaceholderText(/Mô tả/i);

      fireEvent.change(nameInput, { target: { value: 'Samsung Galaxy S24' } });
      fireEvent.change(priceInput, { target: { value: '22000000' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.change(descriptionInput, { target: { value: 'Smartphone Android' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /^Thêm$/i });
      fireEvent.click(submitButton);

      // Should call createProduct service
      await waitFor(() => {
        expect(productService.createProduct).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Samsung Galaxy S24',
            price: 22000000,
            quantity: 10,
            description: 'Smartphone Android',
          })
        );
      });

      // Should reload products list
      await waitFor(() => {
        expect(productService.getProducts).toHaveBeenCalledTimes(2);
      });

      // Should close popup
      await waitFor(() => {
        expect(screen.queryByText(/Thêm sản phẩm mới/i)).not.toBeInTheDocument();
      });

      // New product should appear in list
      await waitFor(() => {
        expect(screen.getByText('Samsung Galaxy S24')).toBeInTheDocument();
      });
    });

    it('should validate required fields when creating product', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      // Open add popup
      const addButton = screen.getByRole('button', { name: /Thêm sản phẩm/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText(/Thêm sản phẩm mới/i)).toBeInTheDocument();
      });

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /^Thêm$/i });
      fireEvent.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/Vui lòng nhập/i)).toBeInTheDocument();
      });

      // Should NOT call createProduct
      expect(productService.createProduct).not.toHaveBeenCalled();
    });

    it('should handle create product error', async () => {
      productService.createProduct.mockRejectedValue(new Error('Failed to create product'));

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /Thêm sản phẩm/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText(/Thêm sản phẩm mới/i)).toBeInTheDocument();
      });

      // Fill and submit form
      const nameInput = screen.getByPlaceholderText(/Tên sản phẩm/i);
      fireEvent.change(nameInput, { target: { value: 'Test Product' } });

      const submitButton = screen.getByRole('button', { name: /^Thêm$/i });
      fireEvent.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/lỗi/i)).toBeInTheDocument();
      });
    });
  });

  describe('Read/Search Product Flow', () => {
    it('should search and filter products', async () => {
      productService.getProducts
        .mockResolvedValueOnce({
          data: mockProducts,
          total: 2,
          page: 1,
          totalPages: 1,
        })
        .mockResolvedValueOnce({
          data: [mockProducts[0]],
          total: 1,
          page: 1,
          totalPages: 1,
        });

      renderProducts();

      // Initial load
      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      // Search for "Laptop"
      const searchInput = screen.getByPlaceholderText(/Tìm kiếm/i);
      fireEvent.change(searchInput, { target: { value: 'Laptop' } });

      // Should call getProducts with search param
      await waitFor(() => {
        expect(productService.getProducts).toHaveBeenCalledWith(
          expect.objectContaining({
            search: 'Laptop',
          })
        );
      });

      // Should show only laptop
      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
        expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument();
      });
    });

    it('should filter by category', async () => {
      productService.getProducts
        .mockResolvedValueOnce({
          data: mockProducts,
          total: 2,
          page: 1,
          totalPages: 1,
        })
        .mockResolvedValueOnce({
          data: mockProducts.filter(p => p.category === 'Electronics'),
          total: 2,
          page: 1,
          totalPages: 1,
        });

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      // Select category
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

    it('should handle pagination', async () => {
      productService.getProducts
        .mockResolvedValueOnce({
          data: mockProducts,
          total: 50,
          page: 1,
          totalPages: 5,
        })
        .mockResolvedValueOnce({
          data: mockProducts,
          total: 50,
          page: 2,
          totalPages: 5,
        });

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      // Click next page
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

  describe('Update Product Flow', () => {
    it('should complete full update product flow', async () => {
      const updatedProduct = {
        ...mockProducts[0],
        name: 'Laptop Dell XPS 13 Updated',
        price: 26000000,
      };

      productService.updateProduct.mockResolvedValue(updatedProduct);
      productService.getProducts
        .mockResolvedValueOnce({
          data: mockProducts,
          total: 2,
          page: 1,
          totalPages: 1,
        })
        .mockResolvedValueOnce({
          data: [updatedProduct, mockProducts[1]],
          total: 2,
          page: 1,
          totalPages: 1,
        });

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      // Click edit button
      const editButtons = screen.getAllByTitle(/Chỉnh sửa/i);
      fireEvent.click(editButtons[0]);

      // Wait for edit popup
      await waitFor(() => {
        expect(screen.getByText(/Chỉnh sửa sản phẩm/i)).toBeInTheDocument();
      });

      // Update fields
      const nameInput = screen.getByDisplayValue('Laptop Dell XPS 13');
      const priceInput = screen.getByDisplayValue('25000000');

      fireEvent.change(nameInput, { target: { value: 'Laptop Dell XPS 13 Updated' } });
      fireEvent.change(priceInput, { target: { value: '26000000' } });

      // Submit
      const saveButton = screen.getByRole('button', { name: /Lưu/i });
      fireEvent.click(saveButton);

      // Should call updateProduct
      await waitFor(() => {
        expect(productService.updateProduct).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            name: 'Laptop Dell XPS 13 Updated',
            price: 26000000,
          })
        );
      });

      // Should reload products
      await waitFor(() => {
        expect(productService.getProducts).toHaveBeenCalledTimes(2);
      });

      // Updated product should appear
      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13 Updated')).toBeInTheDocument();
      });
    });

    it('should handle update product error', async () => {
      productService.updateProduct.mockRejectedValue(new Error('Failed to update'));

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
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

      const saveButton = screen.getByRole('button', { name: /Lưu/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/lỗi/i)).toBeInTheDocument();
      });
    });
  });

  describe('Delete Product Flow', () => {
    it('should complete full delete product flow', async () => {
      productService.deleteProduct.mockResolvedValue(true);
      productService.getProducts
        .mockResolvedValueOnce({
          data: mockProducts,
          total: 2,
          page: 1,
          totalPages: 1,
        })
        .mockResolvedValueOnce({
          data: [mockProducts[1]],
          total: 1,
          page: 1,
          totalPages: 1,
        });

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButtons = screen.getAllByTitle(/Xóa/i);
      fireEvent.click(deleteButtons[0]);

      // Should show confirmation
      await waitFor(() => {
        expect(screen.getByText(/Bạn có chắc chắn muốn xóa/i)).toBeInTheDocument();
      });

      // Confirm delete
      const confirmButton = screen.getByRole('button', { name: /^Xóa$/i });
      fireEvent.click(confirmButton);

      // Should call deleteProduct
      await waitFor(() => {
        expect(productService.deleteProduct).toHaveBeenCalledWith(1);
      });

      // Should reload products
      await waitFor(() => {
        expect(productService.getProducts).toHaveBeenCalledTimes(2);
      });

      // Product should be removed
      await waitFor(() => {
        expect(screen.queryByText('Laptop Dell XPS 13')).not.toBeInTheDocument();
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });
    });

    it('should cancel delete operation', async () => {
      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle(/Xóa/i);
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Bạn có chắc chắn muốn xóa/i)).toBeInTheDocument();
      });

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /Hủy/i });
      fireEvent.click(cancelButton);

      // Should NOT call deleteProduct
      expect(productService.deleteProduct).not.toHaveBeenCalled();

      // Product should still be there
      expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
    });

    it('should handle delete product error', async () => {
      productService.deleteProduct.mockRejectedValue(new Error('Failed to delete'));

      renderProducts();

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle(/Xóa/i);
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Bạn có chắc chắn muốn xóa/i)).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /^Xóa$/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/lỗi/i)).toBeInTheDocument();
      });
    });
  });

  describe('Complete CRUD Cycle', () => {
    it('should perform create -> read -> update -> delete cycle', async () => {
      // Initial state
      let productsData = [...mockProducts];

      productService.getProducts.mockImplementation(() =>
        Promise.resolve({
          data: [...productsData],
          total: productsData.length,
          page: 1,
          totalPages: 1,
        })
      );

      renderProducts();

      // READ: Initial load
      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      // CREATE: Add new product
      const newProduct = {
        id: 3,
        name: 'New Product',
        price: 10000000,
        quantity: 5,
        description: 'Test',
        category: 'Electronics',
      };

      productService.createProduct.mockImplementation((data) => {
        const product = { ...newProduct, ...data };
        productsData.push(product);
        return Promise.resolve(product);
      });

      const addButton = screen.getByRole('button', { name: /Thêm sản phẩm/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText(/Thêm sản phẩm mới/i)).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/Tên sản phẩm/i);
      fireEvent.change(nameInput, { target: { value: 'New Product' } });
      
      const submitButton = screen.getByRole('button', { name: /^Thêm$/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('New Product')).toBeInTheDocument();
      });

      // UPDATE: Edit the new product
      productService.updateProduct.mockImplementation((id, data) => {
        const index = productsData.findIndex(p => p.id === id);
        productsData[index] = { ...productsData[index], ...data };
        return Promise.resolve(productsData[index]);
      });

      const editButtons = screen.getAllByTitle(/Chỉnh sửa/i);
      fireEvent.click(editButtons[2]); // Click edit on new product

      await waitFor(() => {
        expect(screen.getByText(/Chỉnh sửa sản phẩm/i)).toBeInTheDocument();
      });

      const editNameInput = screen.getByDisplayValue('New Product');
      fireEvent.change(editNameInput, { target: { value: 'Updated Product' } });

      const saveButton = screen.getByRole('button', { name: /Lưu/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Updated Product')).toBeInTheDocument();
      });

      // DELETE: Remove the updated product
      productService.deleteProduct.mockImplementation((id) => {
        productsData = productsData.filter(p => p.id !== id);
        return Promise.resolve(true);
      });

      const deleteButtons = screen.getAllByTitle(/Xóa/i);
      fireEvent.click(deleteButtons[2]);

      await waitFor(() => {
        expect(screen.getByText(/Bạn có chắc chắn muốn xóa/i)).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /^Xóa$/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByText('Updated Product')).not.toBeInTheDocument();
      });

      // Should be back to original 2 products
      expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    });
  });
});
