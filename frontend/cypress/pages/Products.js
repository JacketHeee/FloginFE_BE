/* eslint-env cypress */

class ProductsPage {
  visit() {
    cy.visit("/products");
  }

  // ========== LIST TABLE SELECTORS ==========
  tableRows() {
    return cy.get(".table-body .table-row");
  }

  searchInput() {
    return cy.get(".search-input");
  }

  addButton() {
    return cy.get(".add-button");
  }

  // ========== POPUP ==========
  popup() {
    return cy.get(".popup-overlay");
  }

  popupTitle() {
    return cy.get(".popup-header h2");
  }

  // ========== FORM INPUTS (ADD/EDIT) ==========
  nameInput() {
    return cy.get('input[name="name"], input#name');
  }

  priceInput() {
    return cy.get('input[name="price"]');
  }

  quantityInput() {
    return cy.get('input[name="quantity"]');
  }

  descriptionInput() {
    return cy.get('textarea[name="description"]');
  }

  // ========== CATEGORY DROPDOWN ==========
  categorySelect() {
    return cy.get(".custom-select .selected");
  }

  categoryOptions() {
    return cy.get(".custom-select ul.dropdown li");
  }

  // ========== SUBMIT / CANCEL ==========
  submitButton() {
    return cy.get(".submit-button");
  }

  cancelButton() {
    return cy.get(".cancel-button");
  }

  // ========== ACTION ICONS ==========
  editButton(rowIndex = 0) {
    return this.tableRows().eq(rowIndex).find("button").eq(1); // ICON EDIT
  }

  deleteButton(rowIndex = 0) {
    return this.tableRows().eq(rowIndex).find("button").eq(2); // ICON DELETE
  }

  // ========== METHODS ==========

  fillForm({ name, price, quantity, description, category }) {
    if (name) this.nameInput().clear().type(name);
    if (price) this.priceInput().clear().type(price);
    if (quantity) this.quantityInput().clear().type(quantity);
    if (description) this.descriptionInput().clear().type(description);

    if (category) {
      this.categorySelect().click();
      this.categoryOptions().contains(category).click();
    }
  }

  addProduct(product) {
    this.addButton().click();
    this.popup().should("be.visible");
    this.fillForm(product);
    this.submitButton().click();
  }

  updateProduct(rowIndex, product) {
    this.editButton(rowIndex).click();
    this.popup().should("be.visible");
    this.fillForm(product);
    this.submitButton().click();
  }

  deleteProduct(rowIndex) {
    this.deleteButton(rowIndex).click();
    cy.contains("Xóa").click();
  }
}

export default new ProductsPage();
