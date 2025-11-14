import LoginPage from "../pages/Login";

describe("E2E – Đăng nhập hệ thống", () => {

  beforeEach(() => {
    LoginPage.visit();
  });

  // ============================================
  // a) Đăng nhập thành công
  // ============================================
  it("Đăng nhập thành công với thông tin hợp lệ", () => {

    // Mock API trả về token thành công
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: { token: "FAKE_TOKEN" }
    }).as("loginSuccess");

    LoginPage.login("jackethee", "admin123");

    cy.wait("@loginSuccess");

    cy.url().should("include", "/products");
  });

  // ============================================
  // b) Validation FE – thiếu username & password
  // ============================================
  it("Hiển thị lỗi khi bỏ trống username và password", () => {

    LoginPage.username().clear();
    LoginPage.password().clear();

    LoginPage.submit().click();

    // Lỗi từ validateUsername
    LoginPage.fieldError().eq(0).should("contain", "Vui lòng nhập username");

    // Lỗi từ validatePassword
    LoginPage.fieldError().eq(1).should("contain", "Vui lòng nhập mật khẩu");
  });

  // ============================================
  // Sai định dạng username
  // ============================================
  it("Hiển thị lỗi khi username sai định dạng", () => {

    LoginPage.username().clear().type("??");
    LoginPage.password().clear().type("123456");

    LoginPage.submit().click();

    // Vì '??' có độ dài 2 → FE sẽ báo lỗi độ dài, không phải lỗi ký tự
    LoginPage.fieldError()
      .first()
      .should("contain", "Username phải từ 3");
  });



  // ============================================
  // c) Sai username hoặc password
  // ============================================
  it("Hiển thị lỗi khi nhập sai username hoặc password", () => {

    // phải để password hợp lệ format → FE mới allow submit
    const invalidUser = "saiuser";
    const invalidPass = "sai123"; // hợp lệ format (có chữ + số)

    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: { message: "Sai tên đăng nhập hoặc mật khẩu" }
    }).as("loginFail");

    LoginPage.login(invalidUser, invalidPass);

    cy.wait("@loginFail");

    LoginPage.errorAlert().should(
      "contain",
      "Sai tên đăng nhập hoặc mật khẩu"
    );

    cy.url().should("include", "/login");
  });

  // ============================================
  // d) UI toggle password
  // ============================================
  it("Cho phép bật/tắt hiển thị mật khẩu", () => {

    cy.get("button.toggle-password").click();
    cy.get('input[name="password"]').should("have.attr", "type", "text");

    cy.get("button.toggle-password").click();
    cy.get('input[name="password"]').should("have.attr", "type", "password");
  });

  // ============================================
  // Nhấn ENTER để submit
  // ============================================
  it("Nhấn phím Enter để submit form", () => {

    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: { token: "FAKE_TOKEN" }
    }).as("loginSuccess");

    LoginPage.username().type("jackethee");
    LoginPage.password().type("admin123{enter}");

    cy.wait("@loginSuccess");

    cy.url().should("include", "/products");
  });

});
