class ProductsPage {
  visit() {
    cy.visit("/products");
    this.waitForProducts();
  }

  waitForProducts() {
    cy.get(".custom-table", { timeout: 15000 }).should("exist");
    cy.get(".table-body", { timeout: 15000 }).should("exist");
  }
  // PAGINATION (NEW)
  goToLastPage() {
    cy.get('[data-cy="pagination-last"]').click({ force: true });
    this.waitForProducts();
  }
  // TABLE
  tableRows() {
    return cy.get(".table-body .table-row");
  }
  rowById(id) {
    return cy.get(`[data-cy="table-row-${id}"]`);
  }
  // SEARCH
  searchInput() {
    return cy.get('[data-cy="products-search-input"]');
  }

  search(keyword) {
    this.searchInput().first().clear().type(keyword, { force: true });
    cy.wait(500);
  }
  // BUTTONS
  addButton() {
    return cy.contains("+ Thêm sản phẩm");
  }
  viewDetailButtonById(id) {
    return this.rowById(id).find("button").eq(0);
  }
  editButtonByRowId(id) {
    return this.rowById(id).find("button").eq(1);
  }
  deleteButtonByRowId(id) {
    return this.rowById(id).find("button").eq(2);
  }
  // POPUP
  popup() {
    return cy.get('[data-cy="product-form-popup"]');
  }
  nameInput() {
    return cy.get('[data-cy="product-name-input"]');
  }
  priceInput() {
    return cy.get('[data-cy="product-price-input"]');
  }
  quantityInput() {
    return cy.get('[data-cy="product-quantity-input"]');
  }
  descriptionInput() {
    return cy.get('[data-cy="product-description-input"]');
  }
  // CATEGORY
  categorySelect() {
    return cy.get('[data-cy="popup-category-selected"]');
  }
  categoryOptions() {
    return cy.get('[data-cy="popup-category-option"]');
  }
  selectCategory(categoryName) {
    this.categorySelect().click({ force: true });
    cy.wait(150);
    this.categoryOptions().contains(categoryName).click({ force: true });
  }
  categoryDisplay() {
    return cy.get('[data-cy="popup-category-selected"]');
  }

  // FILL FORM
  fillForm({ name, price, quantity, description, category }) {
    if (name) this.nameInput().clear().type(name, { force: true });
    if (price) this.priceInput().clear().type(price, { force: true });
    if (quantity) this.quantityInput().clear().type(quantity, { force: true });
    if (description)
      this.descriptionInput().clear().type(description, { force: true });
    if (category) this.selectCategory(category);
  }
  verifyDetailForm({ name, price, quantity, description, category }) {
    if (name) {
      this.nameInput().should("have.value", name);
    }
    if (price) {
      this.priceInput().should("have.value", price);
    }
    if (quantity) {
      this.quantityInput().should("have.value", quantity);
    }
    if (description) {
      this.descriptionInput().should("have.value", description);
    }
    // 5. Kiểm tra Danh mục (Category)
    if (category) {
      this.categoryDisplay().should("be.visible").and("contain.text", category);
    }
  }
  submitButton() {
    return cy.get('[data-cy="product-submit-btn"]');
  }
  // ACTIONS
  addProduct(product) {
    this.addButton().click({ force: true });
    this.popup().should("be.visible");
    this.fillForm(product);
    this.submitButton().click({ force: true });
  }
  updateProductById(id, updated) {
    this.editButtonByRowId(id).click({ force: true });
    this.popup().should("be.visible");
    this.fillForm(updated);
    this.submitButton().click({ force: true });
  }
  deleteProductById(id) {
    this.deleteButtonByRowId(id).click({ force: true });
    cy.contains("Xóa").click({ force: true });
  }

  viewDetailById(id, updatedProduct) {
    this.viewDetailButtonById(id).click({ force: true });
    this.popup().should("be.visible");
    this.verifyDetailForm(updatedProduct);
    cy.contains("Đóng").click({ force: true });
    this.popup().should("not.exist");
  }
  clearSearch() {
    cy.get('input[placeholder="Tìm kiếm sản phẩm..."]').clear().type("{enter}");

    this.waitForProducts();
    cy.wait(1000); // Đợi thêm chút cho chắc ăn
  }
}
export default new ProductsPage();
