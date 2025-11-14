import { validatePassword, validateUsername } from "../../../utils/validate";


//
// ===============================
//  A) TEST validateUsername()
// ===============================


//
describe("validateUsername()", () => {
  test("Trả lỗi khi username rỗng", () => {
    expect(validateUsername("")).toBe("Vui lòng nhập username");
    expect(validateUsername("   ")).toBe("Vui lòng nhập username");
  });

  test("Trả lỗi khi username quá ngắn hoặc quá dài", () => {
    expect(validateUsername("ab")).toBe("Username phải từ 3–50 ký tự");

    const longName = "a".repeat(51);
    expect(validateUsername(longName)).toBe("Username phải từ 3–50 ký tự");
  });

  test("Trả lỗi khi username chứa ký tự đặc biệt không hợp lệ", () => {
    expect(validateUsername("abc!")).toBe(
      "Username chỉ được chứa a–z, A–Z, 0–9, dấu gạch dưới (_), gạch ngang (-), hoặc dấu chấm (.)"
    );

    expect(validateUsername("tênCóDấu")).toBe(
      "Username chỉ được chứa a–z, A–Z, 0–9, dấu gạch dưới (_), gạch ngang (-), hoặc dấu chấm (.)"
    );
  });

  test("Username hợp lệ", () => {
    expect(validateUsername("jackethee")).toBe(null);
    expect(validateUsername("user.name")).toBe(null);
    expect(validateUsername("user_name-123")).toBe(null);
  });
});

//
// ===============================
//  B) TEST validatePassword()
// ===============================
//
describe("validatePassword()", () => {
  test("Trả lỗi khi password rỗng", () => {
    expect(validatePassword("")).toBe("Vui lòng nhập mật khẩu");
    expect(validatePassword("   ")).toBe("Vui lòng nhập mật khẩu");
  });

  test("Trả lỗi khi password quá ngắn hoặc quá dài", () => {
    expect(validatePassword("123a")).toBe("Mật khẩu phải từ 6–100 ký tự");

    const longPass = "a1".repeat(60); // > 100 ký tự
    expect(validatePassword(longPass)).toBe("Mật khẩu phải từ 6–100 ký tự");
  });

  test("Trả lỗi khi password không có chữ hoặc số", () => {
    expect(validatePassword("123456")).toBe("Mật khẩu phải có ít nhất 1 chữ cái và 1 chữ số");
    expect(validatePassword("abcdef")).toBe("Mật khẩu phải có ít nhất 1 chữ cái và 1 chữ số");
  });

  test("Trả lỗi khi password chứa khoảng trắng", () => {
    expect(validatePassword("abc 123")).toBe("Mật khẩu không được chứa khoảng trắng");
  });

  test("Trả lỗi khi password chứa ký tự Unicode", () => {
    expect(validatePassword("abc123á")).toBe("Mật khẩu chỉ được chứa ký tự ASCII (không dấu)");
  });

  test("Password hợp lệ", () => {
    expect(validatePassword("admin123")).toBe(null);
    expect(validatePassword("A1b2C3")).toBe(null);
  });
});
