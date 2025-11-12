import { useState, useEffect } from "react";
import "./AddProductPopup.scss";
import Icon from "../Icon/Icon";
import productService from "../../services/productService";

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
    name: "",
    price: "",
    quantity: "",
    description: "",
    categoryName: "",
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if ((mode === "edit" || mode === "view") && productData) {
        setFormData({
          name: productData[1] || "",
          price: productData[2] || "",
          quantity: productData[3] || "",
          description: productData[4] || "",
          categoryName: productData[5] || "",
        });
      } else {
        setFormData({
          name: "",
          price: "",
          quantity: "",
          description: "",
          categoryName: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, productData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên sản phẩm";
    if (formData.price === "" || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Giá phải lớn hơn 0";
    if (formData.quantity === "" || isNaN(formData.quantity) || formData.quantity <= 0)
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả sản phẩm";
    if (!formData.categoryName) newErrors.categoryName = "Vui lòng chọn danh mục";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submittedData = {
        name: formData.name,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        description: formData.description,
        categoryName: formData.categoryName,
      };
      console.log("Submitting product:", submittedData);
      if (mode === "edit" && productData) {
        onSubmit(productData[0], submittedData);
      } else {
        onSubmit(submittedData);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const getTitle = () => {
    if (isViewMode) return "Chi tiết sản phẩm";
    if (isEditMode) return "Chỉnh sửa sản phẩm";
    return "Thêm sản phẩm mới";
  };

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
            <label htmlFor="name">
              Tên sản phẩm {!isViewMode && <span className="required">*</span>}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm..."
              className={errors.name ? "error" : ""}
              disabled={isViewMode}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
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
                step="any"
                className={errors.price ? "error" : ""}
                disabled={isViewMode}
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
                className={errors.quantity ? "error" : ""}
                disabled={isViewMode}
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="categoryName">
              Danh mục {!isViewMode && <span className="required">*</span>}
            </label>
            <CustomSelect
              options={categories.map((cat) => cat.name)}
              value={formData.categoryName}
              onChange={(value) => setFormData((prev) => ({ ...prev, categoryName: value }))}
              disabled={isViewMode}
              placeholder="-- Chọn danh mục --"
            />
            {errors.categoryName && <span className="error-message">{errors.categoryName}</span>}
          </div>

          <div className="form-group">
            <label>Mô tả {!isViewMode && <span className="required">*</span>}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sản phẩm..."
              rows="4"
              className={errors.description ? "error" : ""}
              disabled={isViewMode}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              {isViewMode ? "Đóng" : "Hủy"}
            </button>
            {!isViewMode && (
              <button type="submit" className="submit-button">
                {isEditMode ? "Cập nhật" : "Thêm sản phẩm"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPopup;
