import {
  validatePassword,
  validateUsername,
} from "../validateLogin";

describe("Login Validation Test", () => {
  describe("Username test", () => {
    test("TC1: Username rong - return loi", () => {
      expect(validateUsername("")).toBe("Vui lòng nhập username");
    });

    test("TC2: Username qua ngan - return loi", () => {
      expect(validateUsername("ab")).toBe("Username phải từ 3–50 ký tự");
    });

    test("TC3: Username chua ki tu dac biet - return loi", () => {
      expect(validateUsername("user_name-01.@ma")).toBe(
        "Tên đăng nhập chỉ được chứa [a–zA–Z0–9_-.]"
      );
    });

    test("TC4: Username hop le - khong return loi", () => {
      expect(validateUsername("username")).toBe(null);
    });
  });

  describe("Password test", () => {
    test("TC5: Password rong - return loi", () => {
      expect(validatePassword("")).toBe("Vui lòng nhập mật khẩu");
    });

    test("TC6: Password qua ngan - return loi", () => {
      expect(validatePassword("2394")).toBe("Mật khẩu phải từ 6–100 ký tự");
    });

    test("TC7: Pass khong co chu hoac so - return loi", () => {
      expect(validatePassword("1232435")).toBe(
        "Mật khẩu phải có ít nhất 1 chữ cái và 1 chữ số"
      );
    });

    test("TC8: Password hop le", () => {
      expect(validatePassword("2138kjshf")).toBe(null);
    });
  });
});
