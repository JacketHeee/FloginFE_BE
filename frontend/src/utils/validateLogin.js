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
    return "Tên đăng nhập chỉ được chứa [a–zA–Z0–9_-.]";
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

