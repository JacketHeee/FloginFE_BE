import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';

/**
 * Custom hook for managing products with API integration
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} Product data and management functions
 */
const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'id',
    sortOrder: 'asc',
    ...initialFilters
  });

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getProducts({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      
      setProducts(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }));
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Initial fetch and refetch when filters/pagination changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add product
  const addProduct = async (productData) => {
    try {
      const newProduct = await productService.createProduct(productData);
      await fetchProducts(); // Refresh list
      return { success: true, data: newProduct };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      await fetchProducts(); // Refresh list
      return { success: true, data: updatedProduct };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      await fetchProducts(); // Refresh list
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'id',
      sortOrder: 'asc'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Change page
  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Change page size
  const changePageSize = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  return {
    // Data
    products,
    loading,
    error,
    pagination,
    filters,
    
    // Actions
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    updateFilters,
    resetFilters,
    changePage,
    changePageSize
  };
};

export default useProducts;
