import 'cypress-mochawesome-reporter/register';

// Custom command for handling password modal
Cypress.Commands.add('unlockStore', (password = 'yeuffa') => {
  cy.get('.modal__toggle-open').click();
  cy.get('[id="Password"]').type(password);
  cy.get('.password-button').click();
  cy.wait(4000);
});

describe('PDP Automation Demo', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.intercept('/some-3rd-party-script.js*').as('externalScript');
   cy.visit('/', { failOnStatusCode: false });
    cy.unlockStore();
  });

  it('Featured Product: Add to Cart and Checkout Flow', () => {
    // Scroll to product section
    cy.contains('Red Mariner Stripe Beverage Bucket Bag').scrollIntoView();
    cy.log('Clicking product: Red Mariner Stripe Beverage Bucket Bag');
    cy.contains('Red Mariner Stripe Beverage Bucket Bag').click();

    // Verify PDP loaded
    cy.url().should('include', '/products/');
    cy.get('h1').should('contain.text', 'Red Mariner Stripe Beverage Bucket Bag');

    cy.wait(3000);

    // Add to cart (resilient to dynamic IDs)
    cy.get('button[id^="ProductSubmitButton-"]', { timeout: 10000 })
      .filter(':visible')
      .first()
      .scrollIntoView()
      .should('be.visible')
      .and('be.enabled')
      .click({ force: true });

    // Wait for cart drawer or page to appear
    cy.wait(2000); // Adjust if needed for your UI

    // Click checkout button (robust selector)
    cy.contains('button', 'Checkout', { matchCase: false, timeout: 10000 })
      .filter(':visible')
      .first()
      .should('be.visible')
      .click({ force: true });

    // Verify product in cart
    cy.contains('Red Mariner Stripe Beverage Bucket Bag').should('exist');

    // Verify checkout page
    cy.url().should('include', '/checkout');

    // Go back to homepage
    cy.visit('/');
  });








})