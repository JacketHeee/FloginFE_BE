/**
 * Format number to Vietnamese currency
 * @param {number} value - Price value
 * @returns {string} Formatted price
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

/**
 * Format number with thousand separators
 * @param {number} value - Number value
 * @returns {string} Formatted number
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

/**
 * Format date to Vietnamese format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Convert product object to table row format
 * @param {Object} product - Product object
 * @returns {Array} Row array [id, name, price, quantity, description, category]
 */
export const productToRow = (product) => {
  return [
    product.id,
    product.name,
    product.price,
    product.quantity,
    product.description,
    product.categoryName
  ];
};

/**
 * Convert table row to product object
 * @param {Array} row - Row array
 * @returns {Object} Product object
 */
export const rowToProduct = (row) => {
  return {
    id: row[0],
    name: row[1],
    price: row[2],
    quantity: row[3],
    description: row[4],
    category: row[5]
  };
};
