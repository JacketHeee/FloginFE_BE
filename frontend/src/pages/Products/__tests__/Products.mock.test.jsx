/**
 * Products.mock.test.jsx
 * FULL VERSION – FIX ALL ERRORS
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Products from "../Products";
import productService from "../../../services/productService";

// Mock toàn bộ ProductService
jest.mock("../../../services/productService");

// Mock Toast auto-hide timer
jest.useFakeTimers();

const mockProducts = [
  { id: 1, name: "Item", price: 10, quantity: 1, description: "D", categoryName: "Phone" },
];

const mockCategories = [
  { id: 1, name: "Phone" },
  { id: 2, name: "Laptop" }
];

const renderPage = async () => {
  productService.getProducts.mockResolvedValue({
    data: mockProducts,
    total: 1,
    totalPages: 1,
  });

  productService.getCategories.mockResolvedValue(mockCategories);

  render(<Products />);

  await screen.findByText("Danh sách sản phẩm");
};

/* -----------------------------------------------------
   Helper để lấy đúng row chứa product
------------------------------------------------------ */
const getRow = async () => {
  const nameCell = await screen.findByText("Item");
  return nameCell.closest(".table-row");
};

/* -----------------------------------------------------
   TEST 1 — Add Product SUCCESS
------------------------------------------------------ */
test("Add Product → success", async () => {
  await renderPage();

  productService.createProduct.mockResolvedValue({
    id: 2,
    name: "New",
    price: 20,
    quantity: 2,
    description: "OK",
    categoryName: "Phone",
  });

  fireEvent.click(screen.getByText("+ Thêm sản phẩm"));

  fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm..."), {
    target: { value: "New" },
  });

  fireEvent.change(screen.getAllByPlaceholderText("0")[0], {
    target: { value: 20 },
  });

  fireEvent.change(screen.getAllByPlaceholderText("0")[1], {
    target: { value: 2 },
  });

  fireEvent.change(screen.getByPlaceholderText("Nhập mô tả sản phẩm..."), {
    target: { value: "OK" },
  });

  // Click dropdown category to open it
  const categoryDropdown = screen.getByText("-- Chọn danh mục --");
  fireEvent.click(categoryDropdown);

  // Wait for dropdown to open and then select "Phone" from the dropdown list
  await waitFor(() => {
    const dropdownOptions = screen.getAllByText("Phone");
    const dropdownPhone = dropdownOptions.find((el) => el.closest("ul"));
    expect(dropdownPhone).toBeInTheDocument();
    fireEvent.click(dropdownPhone);
  });

  fireEvent.click(screen.getByText("Thêm sản phẩm"));

  await waitFor(() =>
    expect(productService.createProduct).toHaveBeenCalledWith({
      name: "New",
      price: 20,
      quantity: 2,
      description: "OK",
      categoryName: "Phone",
    })
  );
});

/* -----------------------------------------------------
   TEST 2 — Add Product FAILURE
------------------------------------------------------ */
test("Add Product → failure", async () => {
  await renderPage();

  productService.createProduct.mockRejectedValue(new Error("Create failed"));

  fireEvent.click(screen.getByText("+ Thêm sản phẩm"));

  fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm..."), {
    target: { value: "New" },
  });

  fireEvent.change(screen.getAllByPlaceholderText("0")[0], {
    target: { value: 20 },
  });

  fireEvent.change(screen.getAllByPlaceholderText("0")[1], {
    target: { value: 2 },
  });

  fireEvent.change(screen.getByPlaceholderText("Nhập mô tả sản phẩm..."), {
    target: { value: "OK" },
  });

  // Click dropdown category to open it
  const categoryDropdown = screen.getByText("-- Chọn danh mục --");
  fireEvent.click(categoryDropdown);

  // Wait for dropdown to open and then select "Phone" from the dropdown list
  await waitFor(() => {
    const dropdownOptions = screen.getAllByText("Phone");
    const dropdownPhone = dropdownOptions.find((el) => el.closest("ul"));
    expect(dropdownPhone).toBeInTheDocument();
    fireEvent.click(dropdownPhone);
  });

  fireEvent.click(screen.getByText("Thêm sản phẩm"));

  await waitFor(() => expect(productService.createProduct).toHaveBeenCalled());
});

/* -----------------------------------------------------
   TEST 3 — Delete Product SUCCESS
------------------------------------------------------ */
test("Delete Product → success", async () => {
  await renderPage();

  productService.deleteProduct.mockResolvedValue({ success: true });

  const row = await getRow();
  const deleteBtn = row.querySelectorAll("button")[2]; // đúng nút Delete

  fireEvent.click(deleteBtn);

  await waitFor(() =>
    expect(screen.getByText("Xóa")).toBeInTheDocument()
  );

  fireEvent.click(screen.getByText("Xóa"));

  await waitFor(() =>
    expect(productService.deleteProduct).toHaveBeenCalledWith(1)
  );
});

/* -----------------------------------------------------
   TEST 4 — Update Product SUCCESS
------------------------------------------------------ */
test("Update Product → success", async () => {
  await renderPage();

  productService.updateProduct.mockResolvedValue({
    id: 1,
    name: "Updated",
    price: 10,
    quantity: 1,
    description: "D",
    categoryName: "Phone",
  });

  const row = await getRow();
  const editBtn = row.querySelectorAll("button")[1]; // đúng nút Edit

  fireEvent.click(editBtn);

  // Wait for the edit popup to open and categories to load
  await waitFor(() => {
    expect(screen.getByText("Chỉnh sửa sản phẩm")).toBeInTheDocument();
  });

  // Change the product name
  const nameInput = screen.getByPlaceholderText("Nhập tên sản phẩm...");
  fireEvent.change(nameInput, {
    target: { value: "Updated" },
  });

  // Click the update button
  fireEvent.click(screen.getByText("Cập nhật"));

  await waitFor(() =>
    expect(productService.updateProduct).toHaveBeenCalledWith(1, {
      name: "Updated",
      price: 10,
      quantity: 1,
      description: "D",
      categoryName: "Phone",
    })
  );
});
