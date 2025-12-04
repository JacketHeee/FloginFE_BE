import {
  validateCategory,
  validateDescription,
  validatePrice,
  validateProductName,
  validateQuantity,
} from "../validateProduct";

describe("Product Validation Tests", () => {
  // Group: validateProductName
  describe("validateProductName", () => {
    test("TC1: Product name rỗng return lỗi", () => {
      expect(validateProductName("")).toBe("Vui lòng nhập tên sản phẩm");
    });

    test("TC6: Product name quá ngắn return lỗi", () => {
      expect(validateProductName("AB")).toBe(
        "Tên sản phẩm phải từ 3–100 ký tự"
      );
    });

    test("TC7: Product name quá dài return lỗi", () => {
      const longName = "A".repeat(101);
      expect(validateProductName(longName)).toBe(
        "Tên sản phẩm phải từ 3–100 ký tự"
      );
    });

    test("TC8: Product name hợp lệ return null", () => {
      expect(validateProductName("Laptop")).toBe(null);
    });
  });

  // Group: validatePrice
  describe("validatePrice", () => {
    test("TC2: Price âm return lỗi", () => {
      expect(validatePrice(-100)).toBe("Giá sản phẩm phải lớn hơn 0");
    });

    test("TC9: Price không phải số return lỗi", () => {
      expect(validatePrice("abc")).toBe("Giá sản phẩm phải là số");
    });

    test("TC10: Price vượt quá giới hạn return lỗi", () => {
      expect(validatePrice(1_000_000_000)).toBe(
        "Giá sản phẩm không được vượt quá 999,999,999"
      );
    });

    test("TC11: Price hợp lệ return null", () => {
      expect(validatePrice(500000)).toBe(null);
    });
  });

  // Group: validateQuantity
  describe("validateQuantity", () => {
    test("TC3: Quantity âm return lỗi", () => {
      expect(validateQuantity(-99)).toBe("Số lượng không được âm");
    });

    test("TC12: Quantity không phải số return lỗi", () => {
      expect(validateQuantity("abc")).toBe("Số lượng phải là số");
    });

    test("TC13: Quantity vượt quá giới hạn return lỗi", () => {
      expect(validateQuantity(100000)).toBe(
        "Số lượng không được vượt quá 99,999"
      );
    });

    test("TC14: Quantity hợp lệ return null", () => {
      expect(validateQuantity(50)).toBe(null);
    });
  });

  // Group: validateDescription
  describe("validateDescription", () => {
    test("TC4: Description vượt 500 ký tự return lỗi", () => {
      const des = `
        Chiếc laptop này được thiết kế dành cho người dùng cần sự cân bằng hoàn hảo giữa hiệu năng, 
        độ bền và trải nghiệm sử dụng cao cấp. Máy được trang bị bộ vi xử lý thế hệ mới cho khả năng 
        xử lý mượt mà từ các tác vụ văn phòng, học tập đến chỉnh sửa nội dung đa phương tiện. 
        Màn hình độ phân giải cao mang lại hình ảnh sắc nét, màu sắc chân thực, hỗ trợ làm việc nhiều giờ 
        liên tục mà vẫn dễ chịu cho mắt. Thiết kế mỏng nhẹ giúp bạn dễ dàng mang theo mọi nơi, trong khi thời 
        lượng pin dài đảm bảo hoạt động ổn định cả ngày. Bàn phím êm, touchpad chính xác, cùng hệ thống tản nhiệt 
        tối ưu giúp máy vận hành mát mẻ và êm ái. Đây là lựa chọn lý tưởng cho sinh viên, dân văn phòng hoặc người 
        dùng cần một thiết bị đáng tin cậy để đồng hành lâu dài.
        `;
      expect(validateDescription(des)).toBe(
        "Mô tả không được vượt quá 500 ký tự"
      );
    });

    test("TC15: Description hợp lệ return null", () => {
      const desc = "Mô tả sản phẩm hợp lệ.";
      expect(validateDescription(desc)).toBe(null);
    });

    test("TC16: Description rỗng return null", () => {
      expect(validateDescription("")).toBe(null);
    });
  });

  // Group: validateCategory
  describe("validateCategory", () => {
    test("TC5: Category không thuộc danh sách return lỗi", () => {
      const categories = [
        "Laptop Gaming",
        "Laptop Văn Phòng",
        "Laptop Đồ Họa - Kỹ Thuật",
        "Laptop Mỏng Nhẹ - Ultrabook",
        "Laptop Học Sinh - Sinh Viên",
      ];
      expect(validateCategory("Laptop hạng nặng", categories)).toBe(
        "Danh mục không hợp lệ"
      );
    });

    test("TC17: Category rỗng return lỗi", () => {
      expect(validateCategory("", ["Laptop Gaming"])).toBe(
        "Vui lòng chọn danh mục"
      );
    });

    test("TC18: Category hợp lệ return null", () => {
      const categories = ["Laptop Gaming", "Laptop Văn Phòng"];
      expect(validateCategory("Laptop Gaming", categories)).toBe(null);
    });
  });
});
