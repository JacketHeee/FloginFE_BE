class ProductsPage {

  visit() {
    cy.visit("/products");
    this.waitForProducts();
  }

  waitForProducts() {
    cy.get(".custom-table", { timeout: 15000 }).should("exist");
    cy.get(".table-body", { timeout: 15000 }).should("exist");
  }

  // ==========================
  // PAGINATION (NEW)
  // ==========================
  goToLastPage() {
    cy.get('[data-cy="pagination-last"]').click({ force: true });
    this.waitForProducts();
  }

  // ==========================
  // TABLE
  // ==========================
  tableRows() {
    return cy.get(".table-body .table-row");
  }

  rowById(id) {
    return cy.get(`[data-cy="table-row-${id}"]`);
  }

  // ==========================
  // SEARCH
  // ==========================
  searchInput() {
    return cy.get('[data-cy="products-search-input"]');
  }

  search(keyword) {
    this.searchInput().first().clear().type(keyword, { force: true });
    cy.wait(500);
  }

  // ==========================
  // BUTTONS
  // ==========================
  addButton() {
    return cy.contains("+ Thêm sản phẩm");
  }

  editButtonByRowId(id) {
    return this.rowById(id).find("button").eq(1);
  }

  deleteButtonByRowId(id) {
    return this.rowById(id).find("button").eq(2);
  }

  // ==========================
  // POPUP
  // ==========================
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

  // FILL FORM
  fillForm({ name, price, quantity, description, category }) {
    if (name) this.nameInput().clear().type(name, { force: true });
    if (price) this.priceInput().clear().type(price, { force: true });
    if (quantity) this.quantityInput().clear().type(quantity, { force: true });
    if (description) this.descriptionInput().clear().type(description, { force: true });
    if (category) this.selectCategory(category);
  }

  submitButton() {
    return cy.get('[data-cy="product-submit-btn"]');
  }

  // ==========================
  // ACTIONS
  // ==========================
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
}

export default new ProductsPage();
