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
        cy.wait(1500); // Delay để xem thông báo tạo thành công

        ProductsPage.goToLastPage();

        ProductsPage.rowById(productId)
          .should("exist")
          .and("contain.text", created.name)
          .and("contain.text", created.quantity);
        cy.wait(1500); // Delay để xem sản phẩm vừa tạo
      });
    });

    // b) READ + e) SEARCH (0.5 điểm)
    // it("b) READ + e) SEARCH - Search and find the updated product", () => {
    //   cy.intercept("GET", "**/products*").as("searchProduct");
    //   // Search theo tên đã update
    //   ProductsPage.search(created.name);

    //   cy.wait("@searchProduct");

    //   cy.log(` Searching for: ${created.name}`);

    //   // Verify product được tìm thấy
    //   ProductsPage.rowById(productId)
    //     .should("exist")
    //     .and("be.visible")
    //     .and("contain.text", created.name);
    // });
    it("b) READ + e) SEARCH - Search and find the created product", () => {
      //Reset search
      ProductsPage.clearSearch();

      // Đợi danh sách load lại (để input search sẵn sàng)
      cy.wait(1000);

      // cy.intercept("GET", "**/products*search=*Cypress*").as("searchProduct");
      cy.intercept("GET", "**/products*search=*Cypress*").as("searchProduct");

      // Thực hiện Search
      ProductsPage.search(created.name);

      // Đợi request search
      cy.wait("@searchProduct");
      cy.wait(1500); // Delay để xem kết quả search

      cy.log(` Searching for: ${created.name}`);

      // Verify
      ProductsPage.rowById(productId)
        .should("exist")
        .and("be.visible")
        .and("contain.text", created.name);
      cy.wait(1500); // Delay để xem sản phẩm tìm được
    });
    // c) UPDATE
    it("c) UPDATE - Update the same product successfully", () => {
      cy.intercept("GET", "**/products*").as("getProductsList");
      cy.intercept("PUT", `**/products/${productId}`).as("updateProduct");

      ProductsPage.clearSearch();
      cy.wait("@getProductsList");
      ProductsPage.goToLastPage();

      ProductsPage.updateProductById(productId, updated);
      cy.wait(1000); // Delay sau khi điền form update

      cy.wait("@updateProduct");
      cy.wait(1500); // Delay để xem thông báo update thành công

      cy.wait("@getProductsList");
      cy.wait("@getProductsList");

      ProductsPage.goToLastPage();

      cy.log(` Product ${productId} updated and list reloaded`);

      // 6. Verify (Lúc này đang ở đúng trang, chắc chắn sẽ thấy)
      ProductsPage.rowById(productId)
        .should("exist")
        .and("contain.text", updated.name)
        .and("contain.text", updated.quantity);
      cy.wait(1500); // Delay để xem sản phẩm đã update
    });
    //View detail
    it("BONUS: VIEW DETAIL - Verify updated product info in detail view", () => {
      cy.intercept("GET", "**/api/categories*").as("getCategories");
      ProductsPage.goToLastPage();
      ProductsPage.viewDetailById(productId, updated);
      cy.wait(2000); // Delay để xem chi tiết sản phẩm
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
      cy.wait(1000); // Delay để xem sản phẩm trước khi xóa

      cy.intercept("DELETE", `**/products/${productId}`).as("deleteProduct");

      // 4. Thực hiện hành động Xóa
      cy.wait(1500); // Delay để xem confirm dialog và thực hiện xóa
      ProductsPage.deleteProductById(productId);

      cy.log(`Product ${productId} deleted`);

      // Lưu ý: Sau khi xóa, UI thường reload, cần wait hoặc check logic
      ProductsPage.rowById(productId).should("not.exist");
      cy.wait(1500); // Delay để xem sản phẩm đã bị xóa
    });
  }
);
