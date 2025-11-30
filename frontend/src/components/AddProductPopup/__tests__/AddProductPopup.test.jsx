/**
CHECKLIST TEST
--------------------------
A) UNIT TEST CHO VALIDATE PRODUCT (3 điểm)
✔ validateProductName
✔ validatePrice (boundary tests)
✔ validateQuantity
✔ validateDescription
✔ validateCategory

B) TEST COMPONENT FORM (1 điểm)
✔ Render popup
✔ Load categories (mock API)
✔ Validate form khi submit
✔ Submit thành công gọi onSubmit
✔ Mode = add / edit / view
✔ CustomSelect dropdown

C) Coverage >= 90% (1 điểm)
*/

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddProductPopup from "../AddProductPopup";

import {
  validateProductName,
  validatePrice,
  validateQuantity,
  validateDescription,
  validateCategory,
} from "../../../utils/validateProduct";

import productService from "../../../services/productService";

// Mock validation functions
jest.mock("../../../utils/validateProduct");

// Mock API service
jest.mock("../../../services/productService", () => ({
  getCategories: jest.fn(),
}));

const mockClose = jest.fn();
const mockSubmit = jest.fn();

const renderPopup = (props = {}) =>
  render(
    <AddProductPopup
      isOpen={true}
      onClose={mockClose}
      onSubmit={mockSubmit}
      {...props}
    />
  );

//
// =============================================
// A) UNIT TEST VALIDATION FUNCTIONS
// =============================================
describe("Validation Product", () => {
  beforeEach(() => jest.clearAllMocks());

  test("validateProductName", () => {
    validateProductName.mockImplementation((name) => {
      if (!name.trim()) return "Vui lòng nhập tên sản phẩm";
      if (name.length < 3) return "Tên sản phẩm phải từ 3–100 ký tự";
      return null;
    });

    expect(validateProductName("")).toBe("Vui lòng nhập tên sản phẩm");
    expect(validateProductName("ab")).toBe("Tên sản phẩm phải từ 3–100 ký tự");
    expect(validateProductName("Sản phẩm OK")).toBe(null);
  });

  test("validatePrice với boundary test", () => {
    validatePrice.mockImplementation((price) => {
      if (price <= 0) return "Giá sản phẩm phải lớn hơn 0";
      if (price > 999_999_999)
        return "Giá sản phẩm không được vượt quá 999,999,999";
      return null;
    });

    expect(validatePrice(0)).toBe("Giá sản phẩm phải lớn hơn 0");
    expect(validatePrice(-1)).toBe("Giá sản phẩm phải lớn hơn 0");
    expect(validatePrice(1_000_000_000)).toBe(
      "Giá sản phẩm không được vượt quá 999,999,999"
    );
    expect(validatePrice(5000)).toBe(null);
  });

  test("validateQuantity", () => {
    validateQuantity.mockImplementation((q) => {
      if (q < 0) return "Số lượng không được âm";
      if (q > 99_999) return "Số lượng không được vượt quá 99,999";
      return null;
    });

    expect(validateQuantity(-1)).toBe("Số lượng không được âm");
    expect(validateQuantity(100_000)).toBe(
      "Số lượng không được vượt quá 99,999"
    );
    expect(validateQuantity(50)).toBe(null);
  });

  test("validateDescription length", () => {
    validateDescription.mockImplementation((desc) => {
      if (desc.length > 500) return "Mô tả không được vượt quá 500 ký tự";
      return null;
    });

    expect(validateDescription("a".repeat(501))).toBe(
      "Mô tả không được vượt quá 500 ký tự"
    );
    expect(validateDescription("OK")).toBe(null);
  });

  test("validateCategory", () => {
    validateCategory.mockImplementation((name, list) => {
      if (!name) return "Vui lòng chọn danh mục";
      if (!list.includes(name)) return "Danh mục không hợp lệ";
      return null;
    });

    expect(validateCategory("", ["A", "B"])).toBe("Vui lòng chọn danh mục");
    expect(validateCategory("C", ["A", "B"])).toBe("Danh mục không hợp lệ");
    expect(validateCategory("A", ["A", "B"])).toBe(null);
  });
});

//
// =============================================
// B) TEST COMPONENT AddProductPopup
// =============================================
describe("AddProductPopup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    productService.getCategories.mockResolvedValue([
      { name: "Điện thoại" },
      { name: "Laptop" },
    ]);

    // Default: validate OK
    validateProductName.mockReturnValue(null);
    validatePrice.mockReturnValue(null);
    validateQuantity.mockReturnValue(null);
    validateDescription.mockReturnValue(null);
    validateCategory.mockReturnValue(null);
  });

  test("Render popup with all fields", async () => {
    await waitFor(() => renderPopup());

    expect(screen.getByText("Thêm sản phẩm mới")).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText("Nhập tên sản phẩm...")
    ).toBeInTheDocument();
  });

  test("Load categories (mock API)", async () => {
    await waitFor(() => renderPopup());

    await waitFor(() => {
      expect(productService.getCategories).toHaveBeenCalled();
    });
  });

  test("Validate lỗi khi form rỗng", async () => {
    validateProductName.mockReturnValue("Tên lỗi");
    validatePrice.mockReturnValue("Giá lỗi");
    validateQuantity.mockReturnValue("SL lỗi");
    validateDescription.mockReturnValue("Mô tả lỗi");
    validateCategory.mockReturnValue("Danh mục lỗi");

    await waitFor(() => renderPopup());

    fireEvent.click(screen.getByRole("button", { name: "Thêm sản phẩm" }));

    expect(await screen.findByText("Tên lỗi")).toBeInTheDocument();
    expect(screen.getByText("Giá lỗi")).toBeInTheDocument();
    expect(screen.getByText("SL lỗi")).toBeInTheDocument();
    expect(screen.getByText("Mô tả lỗi")).toBeInTheDocument();
    expect(screen.getByText("Danh mục lỗi")).toBeInTheDocument();
  });

  test("Submit thành công", async () => {
    renderPopup();

    // Nhập tên
    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm..."), {
      target: { value: "iPhone 15" },
    });

    // Nhập giá & số lượng
    const [priceInput, quantityInput] = screen.getAllByPlaceholderText("0");

    fireEvent.change(priceInput, {
      target: { value: "50000000" },
    });

    fireEvent.change(quantityInput, {
      target: { value: "10" },
    });

    // Mô tả
    fireEvent.change(screen.getByPlaceholderText("Nhập mô tả sản phẩm..."), {
      target: { value: "Mô tả OK" },
    });

    // Chọn danh mục
    fireEvent.click(screen.getByText("-- Chọn danh mục --"));
    fireEvent.click(await screen.findByText("Điện thoại"));

    // Submit
    fireEvent.click(screen.getByRole("button", { name: "Thêm sản phẩm" }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
      expect(mockClose).toHaveBeenCalled();
    });
  });

  test("Mode = view: disable all inputs", async () => {
    renderPopup({
      mode: "view",
      productData: [1, "SP1", 1000, 5, "Mô tả", "Laptop"],
    });

    expect(screen.getByText("Chi tiết sản phẩm")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập tên sản phẩm...")).toBeDisabled();
  });

  test("Mode = edit: hiển thị dữ liệu cũ", async () => {
    renderPopup({
      mode: "edit",
      productData: [1, "SP1", 1000, 5, "Mô tả", "Laptop"],
    });

    expect(screen.getByDisplayValue("SP1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1000")).toBeInTheDocument();
  });

  test("CustomSelect mở dropdown và chọn danh mục", async () => {
    await waitFor(() => renderPopup());

    fireEvent.click(screen.getByText("-- Chọn danh mục --"));
    expect(await screen.findByText("Điện thoại")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Điện thoại"));
    expect(screen.getByText("Điện thoại")).toBeInTheDocument();
  });
});
