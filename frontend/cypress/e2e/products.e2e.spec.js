import ProductsPage from "../pages/Products";

describe("E2E – Products CRUD + Search (1 product flow)", () => {
  const created = {
    name: "Cypress Auto Product " + Date.now(),
    price: "990000",
    quantity: "12",
    description: "Product created by Cypress",
    category: "Electronics",
  };

  const updated = {
    name: "Cypress Auto Updated " + Date.now(),
    price: "1500000",
    quantity: "9",
    description: "Updated by Cypress",
    category: "Fashion",
  };

  let productId = null;

  before(() => {
    // Login một lần cho toàn bộ test suite
    cy.loginUIReal();
    ProductsPage.waitForProducts();
  });

  // ===========================================
  // a) CREATE (0.5 điểm)
  // ===========================================
  it("a) CREATE - Create product successfully", () => {
    cy.intercept("POST", "**/products").as("createProduct");

    ProductsPage.addProduct(created);

    cy.wait("@createProduct").then((res) => {
      productId = res.response.body.id;
      expect(productId).to.exist;

      cy.log(`✅ Product created with ID: ${productId}`);

      // Đi đến trang cuối để tìm product vừa tạo
      ProductsPage.goToLastPage();

      // Verify product xuất hiện trong table
      ProductsPage.rowById(productId)
        .should("exist")
        .and("contain.text", created.name)
        .and("contain.text", created.quantity);
    });
  });

  // ===========================================
  // c) UPDATE (0.5 điểm)
  // ===========================================
  it("c) UPDATE - Update the same product successfully", () => {
    cy.intercept("PUT", `**/products/${productId}`).as("updateProduct");

    // Visit lại trang products
    // ProductsPage.visit();

    // Đi đến trang cuối nơi product vừa tạo nằm
    ProductsPage.goToLastPage();

    // Update product
    ProductsPage.updateProductById(productId, updated);

    cy.wait("@updateProduct");

    cy.log(`✅ Product ${productId} updated`);

    // Verify thông tin đã được update
    ProductsPage.rowById(productId)
      .should("exist")
      .and("contain.text", updated.name)
      .and("contain.text", updated.quantity);
  });

  // ===========================================
  // b) READ + e) SEARCH (0.5 điểm)
  // ===========================================
  it("b) READ + e) SEARCH - Search and find the updated product", () => {
    // Visit lại trang products
    ProductsPage.visit();

    // Search theo tên đã update
    ProductsPage.search(updated.name);

    cy.wait(1000); // Đợi search filter apply

    cy.log(`✅ Searching for: ${updated.name}`);

    // Verify product được tìm thấy
    ProductsPage.rowById(productId)
      .should("exist")
      .and("be.visible")
      .and("contain.text", updated.name);
  });

  // ===========================================
  // d) DELETE (0.5 điểm)
  // ===========================================
  it("d) DELETE - Delete the same product successfully", () => {
    cy.intercept("DELETE", `**/products/${productId}`).as("deleteProduct");

    // Visit lại trang products
    ProductsPage.visit();

    // Search lại để tìm product
    ProductsPage.search(updated.name);
    cy.wait(1000);

    // Delete product
    ProductsPage.deleteProductById(productId);

    cy.wait("@deleteProduct");

    cy.log(`✅ Product ${productId} deleted`);

    // Verify product không còn tồn tại
    ProductsPage.rowById(productId).should("not.exist");
  });
});
