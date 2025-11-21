import ProductsPage from "../pages/Products";

// 1. THÊM { testIsolation: false } VÀO ĐÂY
describe(
  "E2E – Products CRUD + Search (1 product flow)",
  { testIsolation: false },
  () => {
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
      // Login một lần, state sẽ được giữ nguyên cho toàn bộ các it bên dưới
      cy.loginUIReal();
      ProductsPage.waitForProducts();
    });

    // a) CREATE

    it("a) CREATE - Create product successfully", () => {
      cy.intercept("POST", "**/products").as("createProduct");

      ProductsPage.addProduct(created);

      cy.wait("@createProduct").then((res) => {
        productId = res.response.body.id;
        expect(productId).to.exist;
        cy.log(` Product created with ID: ${productId}`);

        ProductsPage.goToLastPage();

        ProductsPage.rowById(productId)
          .should("exist")
          .and("contain.text", created.name)
          .and("contain.text", created.quantity);
      });
    });

    // b) READ + e) SEARCH (0.5 điểm)

    it("b) READ + e) SEARCH - Search and find the updated product", () => {
      // Search theo tên đã update
      ProductsPage.search(created.name);

      cy.wait(1000); // Đợi search filter apply

      cy.log(` Searching for: ${updated.name}`);

      // Verify product được tìm thấy
      ProductsPage.rowById(productId)
        .should("exist")
        .and("be.visible")
        .and("contain.text", created.name);
    });

    // c) UPDATE

    it("c) UPDATE - Update the same product successfully", () => {
      cy.intercept("PUT", `**/products/${productId}`).as("updateProduct");

      // Visit lại trang products
      ProductsPage.clearSearch();

      // Đi đến trang cuối nơi product vừa tạo nằm
      ProductsPage.goToLastPage();

      // Update product
      ProductsPage.updateProductById(productId, updated);

      cy.wait("@updateProduct");

      cy.log(` Product ${productId} updated`);

      // Verify thông tin đã được update
      ProductsPage.rowById(productId)
        .should("exist")
        .and("contain.text", updated.name)
        .and("contain.text", updated.quantity);
    });

    // d) DELETE (0.5 điểm)

    it("d) DELETE - Delete the product successfully", () => {
      ProductsPage.clearSearch();
      ProductsPage.goToLastPage();

      // Phải chắc chắn sản phẩm có id này đang hiển thị trước khi xóa
      cy.log(`Checking existence of ID: ${productId}`);
      ProductsPage.rowById(productId)
        .scrollIntoView()
        .should("exist")
        .and("be.visible");

      cy.intercept("DELETE", `**/products/${productId}`).as("deleteProduct");

      // 4. Thực hiện hành động Xóa
      ProductsPage.deleteProductById(productId);

      cy.log(`Product ${productId} deleted`);

      // Lưu ý: Sau khi xóa, UI thường reload, cần wait hoặc check logic
      ProductsPage.rowById(productId).should("not.exist");
    });
  }
);
