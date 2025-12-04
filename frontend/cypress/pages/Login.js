/* eslint-env cypress */

class LoginPage {
  visit() {
    cy.visit("/");
  }
  username() {
    return cy.get('input[name="username"]');
  }
  password() {
    return cy.get('input[name="password"]');
  }
  submit() {
    return cy.get("button.submit-button");
  }
  fieldError() {
    return cy.get(".message.error");
  }
  errorAlert() {
    return cy.get(".error-alert");
  }
  login(username, password) {
    const typingDelay = 120; // Tăng delay để mô phỏng người gõ thật
    this.username().clear().type(username, { delay: typingDelay });
    cy.wait(500); // Delay giữa các field
    this.password().clear().type(password, { delay: typingDelay });
    cy.wait(500); // Delay trước khi click submit
    this.submit().click();
  }
}
export default new LoginPage();
