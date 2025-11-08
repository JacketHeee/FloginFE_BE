import { useState } from 'react';
import './Products.scss';
import CustomTable from '../../components/CustomTable/CustomTable';
import SearchPanel from '../../components/SearchPanel/SearchPanel';
import Devider from '../../components/Devider/Devider';
import AddProductPopup from '../../components/AddProductPopup/AddProductPopup';
import Toast from '../../components/Toast/Toast';
import useProducts from '../../hooks/useProducts';
import { productToRow } from '../../utils/formatters';
import CustomSelect from '../../components/CustomSelect/CustomSelect';

const Products = () => {
  const [popupState, setPopupState] = useState({
    isOpen: false,
    mode: 'add',
    productData: null
  });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  // Use custom hook for product management
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

  // Convert products to table format
  const dataTable = products.map(productToRow);

  // Handle popup submit (Add or Edit)
  const handlePopupSubmit = async (productIdOrData, productData) => {
    if (popupState.mode === 'add') {
      // productIdOrData is actually productData for add mode
      const result = await addProduct({
        name: productIdOrData.productName,
        price: productIdOrData.price,
        quantity: productIdOrData.quantity,
        description: productIdOrData.description,
        category: productIdOrData.category
      });
      
      if (result.success) {
        setToast({ 
          isVisible: true, 
          message: `Đã thêm sản phẩm "${productIdOrData.productName}" thành công!`, 
          type: 'success' 
        });
      } else {
        setToast({ 
          isVisible: true, 
          message: `Lỗi: ${result.error}`, 
          type: 'error' 
        });
      }
    } else if (popupState.mode === 'edit') {
      // productIdOrData is productId, productData is the updated data
      const productId = productIdOrData;
      const result = await updateProduct(productId, {
        name: productData.productName,
        price: productData.price,
        quantity: productData.quantity,
        description: productData.description,
        category: productData.category
      });
      
      if (result.success) {
        setToast({ 
          isVisible: true, 
          message: `Đã cập nhật sản phẩm "${productData.productName}" thành công!`, 
          type: 'success' 
        });
      } else {
        setToast({ 
          isVisible: true, 
          message: `Lỗi: ${result.error}`, 
          type: 'error' 
        });
      }
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (row) => {
  const productId = row[0];
  const productName = row[1];

  const result = await deleteProduct(productId);
  
  if (result.success) {
    setToast({ 
      isVisible: true, 
      message: `Đã xóa sản phẩm "${productName}" thành công!`, 
      type: 'success' 
    });
  } else {
    setToast({ 
      isVisible: true, 
      message: `Lỗi: ${result.error}`, 
      type: 'error' 
    });
  }
};


  // Handle search
  const handleSearch = (searchValue) => {
    updateFilters({ search: searchValue });
  };

  // Handle apply filters from FilterPanel
  // const handleApplyFilters = (newFilters) => {
  //   updateFilters(newFilters);
  //   setToast({
  //     isVisible: true,
  //     message: 'Đã áp dụng bộ lọc thành công!',
  //     type: 'success'
  //   });
  // };

  // Handle refresh - reset all filters and reload
  // const handleRefresh = () => {
  //   updateFilters({
  //     search: '',
  //     category: '',
  //     minPrice: undefined,
  //     maxPrice: undefined,
  //     sortBy: 'id',
  //     sortOrder: 'asc'
  //   });
  //   setToast({
  //     isVisible: true,
  //     message: 'Đã làm mới dữ liệu!',
  //     type: 'success'
  //   });
  // };

  const openAddPopup = () => {
    setPopupState({
      isOpen: true,
      mode: 'add',
      productData: null
    });
  };

  const openEditPopup = (row) => {
    setPopupState({
      isOpen: true,
      mode: 'edit',
      productData: row
    });
  };

  const openViewPopup = (row) => {
    setPopupState({
      isOpen: true,
      mode: 'view',
      productData: row
    });
  };

  const closePopup = () => {
    setPopupState({
      isOpen: false,
      mode: 'add',
      productData: null
    });
  };


  const columns = [
    "Id",
    "Product Name",
    "Price",
    "Quantity",
    "Description",
    "Category"
  ];

  return (
    <>
      <div className="products-container">
        <div className="list-header">
          <h2>Danh sách sản phẩm</h2>
          <div className="header-actions">
            <SearchPanel 
              isButtonSearch={false}
              placeholder='Tìm kiếm sản phẩm...'
              backWhite={true}
              onChange={(e) => handleSearch(e.target.value)}
              value={filters.search}
            />

            {/* <button className="filter-button" onClick={() => setIsFilterOpen(true)}>
              <Icon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                </svg>
              </Icon>
              <span>Filter</span>
            </button> */}

            <Devider isVer={true}/>

            <button className="add-button" onClick={openAddPopup}>
              + Thêm sản phẩm
            </button>
          </div>
        </div> 

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <p>❌ Lỗi: {error}</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && (
          <div className='custom'>
            <CustomTable 
              columns={columns} 
              data={dataTable}
              onEdit={openEditPopup}
              onDelete={handleDeleteProduct}
              onView={openViewPopup}
            />
    
            <div className="table-footer">
              <div className="page-info">
                Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} sản phẩm
              </div>
              <div className="pagination">
                <CustomSelect
                  options={Array.from({ length: pagination.totalPages }, (_, i) => `Page ${i + 1}`)}
                  value={`Page ${pagination.page}`}
                  onChange={(option) => changePage(Number(option.replace("Page ", "")))}
                />

                <button 
                  className="pagination-button" 
                  disabled={pagination.page === 1}
                  onClick={() => changePage(pagination.page - 1)}
                >
                  &lt;
                </button>
                <button 
                  className="pagination-button pagination-next"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => changePage(pagination.page + 1)}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddProductPopup 
        isOpen={popupState.isOpen}
        onClose={closePopup}
        onSubmit={handlePopupSubmit}
        mode={popupState.mode}
        productData={popupState.productData}
      />

      <Toast 
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
        duration={3000}
      />
    </>
  );
};

export default Products;
