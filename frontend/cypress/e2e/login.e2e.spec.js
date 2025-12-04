/* eslint-env cypress */
import LoginPage from "../pages/Login";

describe("E2E – Login Flow", () => {
  beforeEach(() => {
    LoginPage.visit();
  });

  // ============================================
  // 1) Đăng nhập thành công
  // ============================================
  it("Đăng nhập thành công với thông tin hợp lệ", () => {
    cy.loginUIReal();
    cy.wait(1500); // Delay để xem kết quả
    cy.url().should("include", "/products");
  });

  // ============================================
  // 2) Validation trống username + password
  // ============================================
  it("Hiển thị lỗi khi bỏ trống username và password", () => {
    LoginPage.username().clear();
    LoginPage.password().clear();
    LoginPage.submit().click();
    cy.wait(1500); // Delay để xem lỗi hiển thị

    LoginPage.fieldError().eq(0).should("contain", "Vui lòng nhập username");
    LoginPage.fieldError().eq(1).should("contain", "Vui lòng nhập mật khẩu");
  });

  // ============================================
  // 3) Validation sai định dạng username
  // ============================================
  it("Hiển thị lỗi khi username sai định dạng", () => {
    LoginPage.username().clear().type("??", { delay: 150 });
    cy.wait(800);
    LoginPage.password().clear().type("123456", { delay: 100 });
    cy.wait(800);

    LoginPage.submit().click();
    cy.wait(1500); // Delay để xem lỗi

    LoginPage.fieldError().first().should("contain", "Username phải từ 3");
    cy.wait(1000);
  });

  // ============================================
  // 4) Sai username hoặc password (Backend trả về lỗi)
  // ============================================
  it("Hiển thị lỗi khi nhập sai username hoặc password", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: { message: "Sai tên đăng nhập hoặc mật khẩu" },
    }).as("loginFail");

    LoginPage.login("saiuser", "sai123");

    cy.wait("@loginFail");
    cy.wait(1500); // Delay để xem lỗi từ backend

    LoginPage.errorAlert().should("contain", "Sai tên đăng nhập hoặc mật khẩu");
    cy.url().should("include", "/login");
    cy.wait(800);
  });

  // ============================================
  // 5) Toggle show/hide password
  // ============================================
  it("Cho phép bật/tắt hiển thị mật khẩu", () => {
    cy.get("button.toggle-password").click();
    cy.wait(1000); // Delay để xem password hiển thị
    cy.get('input[name="password"]').should("have.attr", "type", "text");

    cy.get("button.toggle-password").click();
    cy.wait(1000); // Delay để xem password ẩn
    cy.get('input[name="password"]').should("have.attr", "type", "password");
  });

  // ============================================
  // 6) Nhấn Enter để submit
  // ============================================
  it("Submit form bằng phím Enter", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: { token: "FAKE_TOKEN" },
    }).as("loginSuccess");

    LoginPage.username().type("jackethee", { delay: 100 });
    LoginPage.password().type("admin123{enter}", { delay: 100 });

    cy.wait("@loginSuccess");
    cy.wait(1500); // Delay để xem chuyển trang

    cy.url().should("include", "/products");
    cy.wait(1000);
  });
});
