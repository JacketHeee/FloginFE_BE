import { useState, useEffect } from "react";
import "./AddProductPopup.scss";
import Icon from "../Icon/Icon";

const CustomSelect = ({ options, value, onChange, disabled, placeholder }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div
      className={`custom-select ${open ? "open" : ""} ${disabled ? "disabled" : ""}`}
      onClick={() => !disabled && setOpen(!open)}
    >
      <div className="selected">
        <span>{value || placeholder}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {open && (
        <ul className="dropdown">
          {options.map((opt, index) => (
            <li key={index} onClick={() => handleSelect(opt)}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AddProductPopup = ({ isOpen, onClose, onSubmit, mode = "add", productData = null }) => {
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    quantity: "",
    description: "",
    category: "",
  });

  const [errors, setErrors] = useState({});

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Home Appliances",
    "Books",
    "Office",
    "Furniture",
    "Accessories",
    "Toys",
  ];

  useEffect(() => {
    if (isOpen) {
      if ((mode === "edit" || mode === "view") && productData) {
        setFormData({
          productName: productData[1] || "",
          price: productData[2] || "",
          quantity: productData[3] || "",
          description: productData[4] || "",
          category: productData[5] || "",
        });
      } else {
        setFormData({
          productName: "",
          price: "",
          quantity: "",
          description: "",
          category: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName.trim()) newErrors.productName = "Vui lòng nhập tên sản phẩm";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Giá phải lớn hơn 0";
    if (!formData.quantity || parseInt(formData.quantity) <= 0) newErrors.quantity = "Số lượng phải lớn hơn 0";
    if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả sản phẩm";
    if (!formData.category) newErrors.category = "Vui lòng chọn danh mục";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = {
        productName: formData.productName,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        description: formData.description,
        category: formData.category,
      };
      if (mode === "edit" && productData) onSubmit(productData[0], data);
      else onSubmit(data);
      onClose();
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === "view";
  const getTitle = () =>
    mode === "view" ? "Chi tiết sản phẩm" : mode === "edit" ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới";

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>{getTitle()}</h2>
          <button className="close-button" onClick={onClose}>
            <Icon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Icon>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <label>Tên sản phẩm {!isViewMode && <span className="required">*</span>}</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm..."
              disabled={isViewMode}
              className={errors.productName ? "error" : ""}
            />
            {errors.productName && <span className="error-message">{errors.productName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Giá (VNĐ) {!isViewMode && <span className="required">*</span>}</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1000"
                disabled={isViewMode}
                className={errors.price ? "error" : ""}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label>Số lượng {!isViewMode && <span className="required">*</span>}</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1"
                disabled={isViewMode}
                className={errors.quantity ? "error" : ""}
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Danh mục {!isViewMode && <span className="required">*</span>}</label>
            <CustomSelect
              options={categories}
              value={formData.category}
              onChange={handleSelectChange}
              disabled={isViewMode}
              placeholder="-- Chọn danh mục --"
            />
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label>Mô tả {!isViewMode && <span className="required">*</span>}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sản phẩm..."
              rows="4"
              disabled={isViewMode}
              className={errors.description ? "error" : ""}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              {isViewMode ? "Đóng" : "Hủy"}
            </button>
            {!isViewMode && (
              <button type="submit" className="submit-button">
                {mode === "edit" ? "Cập nhật" : "Thêm sản phẩm"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPopup;
