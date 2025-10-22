import 'cypress-mochawesome-reporter/register';

Cypress.Commands.add('unlockStore', (password = 'DEVsea-bags') => {
  cy.get('.modal__toggle-open').click();
  cy.get('[id="Password"]').type(password);
  cy.get('.password-button').click();
  cy.wait(4000);
});

describe('PLP Automation Demo', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.intercept('/some-3rd-party-script.js*').as('externalScript');
    cy.visit('https://seabags-dev1.myshopify.com/', { failOnStatusCode: false });
    cy.unlockStore();
  });

it('PLP Automation: Iterate All Sort Dropdown Options', () => {
  cy.contains(/^shop all$/i).filter(':visible').first().click();
  cy.url().should('include', '/all');
  cy.contains('All Products').should('be.visible');

  const sortDropdown = '.text-seabags-black.font-body.font-medium';
  const sortOptions = [
    'Alphabetically, A-Z',
    'Alphabetically, Z-A',
    'Price, low to high',
    'Price, high to low',
    'Date, old to new',
    'Date, new to old'
  ];

  sortOptions.forEach(optionText => {
    // Open dropdown (ignore overlay by forcing the click)
    cy.get(sortDropdown).filter(':visible').first().click({ force: true });

    // Click the option (again force to bypass overlay)
    cy.contains(optionText, { timeout: 15000 }).click({ force: true });

    // Give the page a small pause so sorting can finish
    cy.wait(5000);

    // Confirm products exist
    cy.get('[class*=grid] [class*=product], .product-item, [data-testid*="product"]')
      .should('have.length.greaterThan', 0)
      .then($p => cy.log(`"${optionText}" applied → ${$p.length} products`));
  });
});
})

