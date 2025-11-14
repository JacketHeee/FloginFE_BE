// ======================================
// USER VALIDATIONS
// ======================================
export const validateUsername = (username) => {
  if (!username || username.trim() === "") {
    return "Vui lòng nhập username";
  }

  const trimmed = username.trim();
  const regex = /^[a-zA-Z0-9._-]{3,50}$/;

  if (trimmed.length < 3 || trimmed.length > 50) {
    return "Username phải từ 3–50 ký tự";
  }

  if (!regex.test(trimmed)) {
    return "Username chỉ được chứa a–z, A–Z, 0–9, dấu gạch dưới (_), gạch ngang (-), hoặc dấu chấm (.)";
  }

  return null;
};

export const validatePassword = (password) => {
  if (!password || password.trim() === "") {
    return "Vui lòng nhập mật khẩu";
  }

  const trimmed = password.trim();
  const hasLetter = /[A-Za-z]/.test(trimmed);
  const hasNumber = /\d/.test(trimmed);
  const hasWhitespace = /\s/.test(trimmed);
  const hasUnicode = [...trimmed].some((ch) => ch.charCodeAt(0) > 127);

  if (trimmed.length < 6 || trimmed.length > 100) {
    return "Mật khẩu phải từ 6–100 ký tự";
  }

  if (!hasLetter || !hasNumber) {
    return "Mật khẩu phải có ít nhất 1 chữ cái và 1 chữ số";
  }

  if (hasWhitespace) {
    return "Mật khẩu không được chứa khoảng trắng";
  }

  if (hasUnicode) {
    return "Mật khẩu chỉ được chứa ký tự ASCII (không dấu)";
  }

  return null;
};

export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return "Vui lòng nhập email";
  }

  const trimmed = email.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(trimmed)) {
    return "Địa chỉ email không hợp lệ";
  }

  return null;
};

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
