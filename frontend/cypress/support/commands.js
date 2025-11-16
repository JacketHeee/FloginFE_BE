// ===========================================================
// 1) LOGIN UI MOCK (dùng cho testcase kiểm thử login)
// ===========================================================
Cypress.Commands.add("loginUITest", () => {
  cy.visit("/");

  cy.intercept("POST", "**/auth/login").as("loginAPI");

  cy.get('input[name="username"]').clear().type("jackethee");
  cy.get('input[name="password"]').clear().type("admin123");
  cy.get("button.submit-button").click();

  cy.wait("@loginAPI");
});

// ===========================================================
// 2) LOGIN UI REAL (KHÔNG MOCK) – dùng cho CRUD
// ===========================================================
Cypress.Commands.add("loginUIReal", () => {
  cy.visit("/");

  cy.get('input[name="username"]').clear().type("jackethee");
  cy.get('input[name="password"]').clear().type("admin123");

  // request thật
  cy.intercept("POST", "**/auth/login").as("realLogin");

  cy.get("button.submit-button").click();

  cy.wait("@realLogin").then((interception) => {
    const token = interception.response.body.token;
    expect(token).to.exist;

    // Ensure token is stored BEFORE FE redirects
    cy.window().then((win) => {
      win.localStorage.setItem("token", token);
    });
  });

  // FE tự redirect đúng theo logic thật
  cy.url({ timeout: 15000 }).should("include", "/products");
});
