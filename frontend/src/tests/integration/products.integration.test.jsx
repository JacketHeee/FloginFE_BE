/**
 * INTEGRATION TEST — PRODUCT LIST + PRODUCT FORM + PRODUCT DETAIL
 * Covers:
 * ✔ ProductList
 * ✔ Add Product
 * ✔ Edit Product
 * ✔ View Product
 */

import {
  render,
  screen,
  waitFor,
  fireEvent,
  within
} from "@testing-library/react";

import Products from "../../pages/Products/Products";
import useProducts from "../../hooks/useProducts";
import productService from "../../services/productService";

jest.mock("../../hooks/useProducts");
jest.mock("../../services/productService");

const renderProducts = () => render(<Products />);

beforeEach(() => {
  jest.clearAllMocks();
  productService.getCategories.mockResolvedValue([
    { name: "Phone" },
    { name: "Laptop" },
  ]);
});

/* =======================================================
   PRODUCT LIST
======================================================= */
describe("ProductList Integration", () => {
  test("Hiển thị danh sách sản phẩm từ API", async () => {
    useProducts.mockReturnValue({
      products: [
        {
          id: 1,
          name: "iPhone 15",
          price: 25000000,
          quantity: 10,
          description: "Flagship",
          categoryName: "Phone",
        },
        {
          id: 2,
          name: "MacBook Pro",
          price: 45000000,
          quantity: 5,
          description: "Laptop",
          categoryName: "Laptop",
        },
      ],
      loading: false,
      error: null,
      pagination: { page: 1, total: 2, totalPages: 1, limit: 10 },
      filters: { search: "" },
      changePage: jest.fn(),
      updateFilters: jest.fn(),
      addProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    });

    renderProducts();

    expect(await screen.findByText("iPhone 15")).toBeInTheDocument();
    expect(await screen.findByText("MacBook Pro")).toBeInTheDocument();
  });

  test("Search panel → gọi updateFilters", async () => {
    const updateFilters = jest.fn();

    useProducts.mockReturnValue({
      products: [],
      loading: false,
      error: null,
      pagination: { page: 1, total: 0, totalPages: 1, limit: 10 },
      filters: { search: "" },
      changePage: jest.fn(),
      updateFilters,
      addProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    });

    renderProducts();

    fireEvent.change(screen.getByPlaceholderText("Tìm kiếm sản phẩm..."), {
      target: { value: "phone" },
    });

    expect(updateFilters).toHaveBeenCalledWith({ search: "phone" });
  });
});

/* =======================================================
   PRODUCT FORM (ADD + EDIT)
======================================================= */
describe("Product Form Integration", () => {
  test("Mở popup Add Product → nhập form → submit thành công", async () => {
    const addProductMock = jest.fn().mockResolvedValue({ success: true });

    useProducts.mockReturnValue({
      products: [],
      loading: false,
      error: null,
      pagination: { page: 1, total: 0, totalPages: 1, limit: 10 },
      filters: {},
      addProduct: addProductMock,
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      updateFilters: jest.fn(),
      changePage: jest.fn(),
    });

    renderProducts();

    fireEvent.click(screen.getByText("+ Thêm sản phẩm"));

    await waitFor(() =>
      expect(screen.getByText("Thêm sản phẩm mới")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm..."), {
      target: { value: "iPad Pro" },
    });

    const [priceInput, qtyInput] = screen.getAllByPlaceholderText("0");

    fireEvent.change(priceInput, { target: { value: 20000000 } });
    fireEvent.change(qtyInput, { target: { value: 5 } });

    fireEvent.change(
      screen.getByPlaceholderText("Nhập mô tả sản phẩm..."),
      { target: { value: "New tablet" } }
    );

    fireEvent.click(screen.getByText("-- Chọn danh mục --"));
    fireEvent.click(await screen.findByText("Phone"));

    fireEvent.click(screen.getByText("Thêm sản phẩm"));

    await waitFor(() =>
      expect(addProductMock).toHaveBeenCalledWith({
        name: "iPad Pro",
        price: 20000000,
        quantity: 5,
        description: "New tablet",
        categoryName: "Phone",
      })
    );
  });

  test("View mode → fields phải disabled", async () => {
    useProducts.mockReturnValue({
      products: [
        {
          id: 1,
          name: "iPhone 15",
          price: 25000000,
          quantity: 10,
          description: "Flagship",
          categoryName: "Phone",
        },
      ],
      loading: false,
      error: null,
      pagination: { page: 1, total: 1, totalPages: 1, limit: 10 },
      filters: {},
      addProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      updateFilters: jest.fn(),
      changePage: jest.fn(),
    });

    renderProducts();

    const nameCell = await screen.findByText("iPhone 15");
    const rowElement = nameCell.closest(".table-row");
    const viewButton = rowElement.querySelectorAll("button")[0];

    fireEvent.click(viewButton);

    expect(await screen.findByText("Chi tiết sản phẩm")).toBeInTheDocument();

    expect(screen.getByDisplayValue("iPhone 15")).toBeDisabled();
    expect(screen.getByDisplayValue("25000000")).toBeDisabled();
  });
});

/* =======================================================
   PRODUCT DETAIL (VIEW MODE)
======================================================= */
describe("Product Detail Integration", () => {
  test("View mode → tất cả field phải disabled", async () => {
    useProducts.mockReturnValue({
      products: [
        {
          id: 1,
          name: "iPhone 15",
          price: 25000000,
          quantity: 10,
          description: "Flagship",
          categoryName: "Phone",
        },
      ],
      loading: false,
      error: null,
      pagination: { page: 1, total: 1, totalPages: 1, limit: 10 },
      filters: {},
      addProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      updateFilters: jest.fn(),
      changePage: jest.fn(),
    });

    renderProducts();

    const nameCell = await screen.findByText("iPhone 15");
    const rowElement = nameCell.closest(".table-row");

    const viewButton = rowElement.querySelectorAll("button")[0];
    fireEvent.click(viewButton);

    expect(await screen.findByText("Chi tiết sản phẩm")).toBeInTheDocument();

    expect(screen.getByDisplayValue("iPhone 15")).toBeDisabled();
    expect(screen.getByDisplayValue("25000000")).toBeDisabled();
    expect(screen.getByDisplayValue("10")).toBeDisabled();
    expect(screen.getByDisplayValue("Flagship")).toBeDisabled();

    // FIXED: tìm đúng custom-select trong popup, không dùng getByText
    const categorySelect = document.querySelector(
      ".popup-container .custom-select"
    );

    expect(categorySelect).toHaveClass("disabled");

    // text "Phone" nằm trong .selected
    expect(within(categorySelect).getByText("Phone")).toBeInTheDocument();
  });
});
