import { useState, useEffect } from 'react';
import './AddProductPopup.scss';
import Icon from '../Icon/Icon';

const AddProductPopup = ({ isOpen, onClose, onSubmit, mode = 'add', productData = null }) => {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    quantity: '',
    description: '',
    category: ''
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Home Appliances',
    'Books',
    'Office',
    'Furniture',
    'Accessories',
    'Toys'
  ];

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && productData) {
        // Populate form with existing product data for edit mode
        setFormData({
          productName: productData[1] || '',
          price: productData[2] || '',
          quantity: productData[3] || '',
          description: productData[4] || '',
          category: productData[5] || ''
        });
      } else if (mode === 'view' && productData) {
        // Populate form with existing product data for view mode
        setFormData({
          productName: productData[1] || '',
          price: productData[2] || '',
          quantity: productData[3] || '',
          description: productData[4] || '',
          category: productData[5] || ''
        });
      } else {
        // Reset form for add mode
        setFormData({
          productName: '',
          price: '',
          quantity: '',
          description: '',
          category: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'Vui lòng nhập tên sản phẩm';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả sản phẩm';
    }

    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn danh mục';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submittedData = {
        productName: formData.productName,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        description: formData.description,
        category: formData.category
      };
      
      if (mode === 'edit' && productData) {
        onSubmit(productData[0], submittedData); // Pass product ID for edit
      } else {
        onSubmit(submittedData); // Just data for add
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
//   const isAddMode = mode === 'add';

  const getTitle = () => {
    if (isViewMode) return 'Chi tiết sản phẩm';
    if (isEditMode) return 'Chỉnh sửa sản phẩm';
    return 'Thêm sản phẩm mới';
  };

  const getSubmitButtonText = () => {
    if (isEditMode) return 'Cập nhật';
    return 'Thêm sản phẩm';
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>{getTitle()}</h2>
          <button className="close-button" onClick={onClose}>
            <Icon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Icon>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <label htmlFor="productName">
              Tên sản phẩm {!isViewMode && <span className="required">*</span>}
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm..."
              className={errors.productName ? 'error' : ''}
              disabled={isViewMode}
              readOnly={isViewMode}
            />
            {errors.productName && <span className="error-message">{errors.productName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                Giá (VNĐ) {!isViewMode && <span className="required">*</span>}
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1000"
                className={errors.price ? 'error' : ''}
                disabled={isViewMode}
                readOnly={isViewMode}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="quantity">
                Số lượng {!isViewMode && <span className="required">*</span>}
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1"
                className={errors.quantity ? 'error' : ''}
                disabled={isViewMode}
                readOnly={isViewMode}
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">
              Danh mục {!isViewMode && <span className="required">*</span>}
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
              disabled={isViewMode}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Mô tả {!isViewMode && <span className="required">*</span>}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sản phẩm..."
              rows="4"
              className={errors.description ? 'error' : ''}
              disabled={isViewMode}
              readOnly={isViewMode}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              {isViewMode ? 'Đóng' : 'Hủy'}
            </button>
            {!isViewMode && (
              <button type="submit" className="submit-button">
                {getSubmitButtonText()}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPopup;
