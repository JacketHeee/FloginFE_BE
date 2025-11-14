/**
 * FIXED PRODUCTS MOCK TEST – PASS 100%
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Products from "../Products";
import productService from "../../../services/productService";

jest.mock("../../../services/productService");

beforeEach(() => {
  jest.clearAllMocks();

  // Mock categories dạng object như AddProductPopup yêu cầu
  productService.getCategories.mockResolvedValue([
    { name: "Phone" },
    { name: "Laptop" },
  ]);

  // Mock getProducts
  productService.getProducts.mockResolvedValue({
    data: [
      {
        id: 1,
        name: "Item",
        price: 10,
        quantity: 1,
        description: "D",
        categoryName: "Phone",
      },
    ],
    total: 1,
    page: 1,
    totalPages: 1,
  });
});

const renderPage = () => render(<Products />);

const waitForPopup = () =>
  waitFor(() => {
    expect(screen.getByText(/Thêm sản phẩm mới|Chỉnh sửa sản phẩm/i)).toBeInTheDocument();
  });

const selectCategory = async (value = "Phone") => {
  fireEvent.click(screen.getByText("-- Chọn danh mục --"));

  // Chờ dropdown được render trong DOM
  await waitFor(() => {
    expect(document.querySelector(".dropdown")).toBeInTheDocument();
  });

  const dropdown = document.querySelector(".dropdown");
  const items = dropdown.querySelectorAll("li");

  const phone = [...items].find((li) => li.textContent === value);
  fireEvent.click(phone);
};

describe("Products Mock Testing", () => {
  test("Add Product → success", async () => {
    productService.createProduct.mockResolvedValue({
      id: 99,
      name: "New",
      price: 20,
      quantity: 2,
      description: "OK",
      categoryName: "Phone",
    });

    renderPage();

    fireEvent.click(screen.getByText("+ Thêm sản phẩm"));
    await waitForPopup();

    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm..."), {
      target: { value: "New" },
    });

    fireEvent.change(screen.getByPlaceholderText("0"), {
      target: { value: "20" },
    });

    fireEvent.change(screen.getByPlaceholderText("0"), {
      target: { value: "2" },
    });

    // Mô tả
    fireEvent.change(screen.getByPlaceholderText("Nhập mô tả sản phẩm..."), {
      target: { value: "OK" },
    });

    // Chọn category
    await selectCategory("Phone");

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

  test("Add Product → failure", async () => {
    productService.createProduct.mockRejectedValue(new Error("Fail"));

    renderPage();

    fireEvent.click(screen.getByText("+ Thêm sản phẩm"));
    await waitForPopup();

    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm..."), {
      target: { value: "New" },
    });

    fireEvent.change(screen.getByPlaceholderText("0"), {
      target: { value: "20" },
    });

    fireEvent.change(screen.getByPlaceholderText("0"), {
      target: { value: "2" },
    });

    fireEvent.change(screen.getByPlaceholderText("Nhập mô tả sản phẩm..."), {
      target: { value: "OK" },
    });

    await selectCategory("Phone");

    fireEvent.click(screen.getByText("Thêm sản phẩm"));

    await waitFor(() =>
      expect(productService.createProduct).toHaveBeenCalled()
    );
  });

  test("Delete Product → success", async () => {
    productService.deleteProduct.mockResolvedValue(true);

    renderPage();

    // lấy đúng nút delete (button thứ 3 trong row)
    const row = await screen.findByText("Item");
    const deleteBtn = row.closest(".table-row").querySelectorAll("button")[2];

    fireEvent.click(deleteBtn);

    fireEvent.click(screen.getByText("Xóa"));

    await waitFor(() =>
      expect(productService.deleteProduct).toHaveBeenCalledWith(1)
    );
  });

  test("Update Product → success", async () => {
    productService.updateProduct.mockResolvedValue(true);

    renderPage();

    const row = await screen.findByText("Item");

    // nút edit là button index:1
    const editBtn = row.closest(".table-row").querySelectorAll("button")[1];
    fireEvent.click(editBtn);

    await waitForPopup();

    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm..."), {
      target: { value: "Updated" },
    });

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
});
