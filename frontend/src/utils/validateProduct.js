// ======================================
// PRODUCT VALIDATIONS
// ======================================

// Product Name: 3–100 ký tự, không rỗng
export const validateProductName = (name) => {
  if (!name || name.trim() === "") {
    return "Vui lòng nhập tên sản phẩm";
  }

  const trimmed = name.trim();

  if (trimmed.length < 3 || trimmed.length > 100) {
    return "Tên sản phẩm phải từ 3–100 ký tự";
  }

  return null;
};

// Price: > 0, <= 999,999,999
export const validatePrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Vui lòng nhập giá sản phẩm";
  }

  const num = Number(price);

  if (isNaN(num)) {
    return "Giá sản phẩm phải là số";
  }

  if (num <= 0) {
    return "Giá sản phẩm phải lớn hơn 0";
  }

  if (num > 999_999_999) {
    return "Giá sản phẩm không được vượt quá 999,999,999";
  }

  return null;
};

// Quantity: >= 0, <= 99,999
export const validateQuantity = (quantity) => {
  if (quantity === null || quantity === undefined || quantity === "") {
    return "Vui lòng nhập số lượng";
  }

  const num = Number(quantity);

  if (isNaN(num)) {
    return "Số lượng phải là số";
  }

  if (num < 0) {
    return "Số lượng không được âm";
  }

  if (num > 99999) {
    return "Số lượng không được vượt quá 99,999";
  }

  return null;
};

// Description: <= 500 ký tự
export const validateDescription = (desc) => {
  if (!desc) return null; // mô tả là optional

  const trimmed = desc.trim();

  if (trimmed.length > 500) {
    return "Mô tả không được vượt quá 500 ký tự";
  }

  return null;
};

// Category: phải thuộc danh sách categories
export const validateCategory = (category, categoryList = []) => {
  if (!category || category.trim() === "") {
    return "Vui lòng chọn danh mục";
  }

  const trimmed = category.trim();

  if (!categoryList.includes(trimmed)) {
    return "Danh mục không hợp lệ";
  }

  return null;
};
