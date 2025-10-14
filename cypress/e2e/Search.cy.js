import 'cypress-mochawesome-reporter/register';

// Custom command for handling password modal
Cypress.Commands.add('unlockStore', (password = 'DEVsea-bags') => {
  cy.get('.modal__toggle-open').click();
  cy.get('[id="Password"]').type(password);
  cy.get('.password-button').click();
  cy.wait(4000);
});

describe('Search Functionality', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.intercept('/some-3rd-party-script.js*').as('externalScript');
    cy.visit('https://seabags-dev1.myshopify.com/', { failOnStatusCode: false });
    cy.unlockStore();
  });

  it('opens search drawer when clicking on search input', () => {
    cy.get('#Search-In-Modal').click({force: true});
    cy.get('#predictive-search-results').should('be.visible');
  });

  it('closes search drawer when clicking outside', () => {
    cy.get('#Search-In-Modal').click({force: true});
    cy.get('#predictive-search-results').should('be.visible');
    cy.get('body').click(0, 0); // Click outside
    cy.get('#predictive-search-results').should('not.be.visible');
  });

  it('displays best matches when typing in search input', () => {
    cy.get('#Search-In-Modal').click({force: true}).type('tote');
    cy.contains('Best matches for tote').should('be.visible');
    cy.get('#predictive-search-products').should('have.length.gte', 1);
  });

  it('navigates to search results page when pressing enter', () => {
    cy.get('#Search-In-Modal').click({force: true}).type('tote bag{enter}');
    cy.url().should('include', '/search?q=tote+bag');
    cy.get('h1, [data-testid="search-title"]').should('be.visible');
  });

  it('handles empty search input on enter', () => {
    cy.get('#Search-In-Modal').click({force: true}).type('{enter}');
    cy.url().should('include', '/search?q=');
    cy.contains('Find what\'s on your mind?').should('be.visible');
  });

  it('handles search for non-existent term', () => {
    cy.get('#Search-In-Modal').click({force: true}).type('rtrtreyery{enter}');
  cy.url().should('include', '/search?q=rtrtreyery');
 cy.get('#product-grid', { timeout: 15000 })
    .should('be.visible')
    .and(($grid) => {
      const text = $grid.text().trim();
      expect(text).to.match(/Oops! We Couldn'?t Find Any Matching Products/i);
    })
  });

  it('updates suggestions dynamically on input change', () => {
    cy.get('#Search-In-Modal').click({force: true}).type('tote');
    cy.get('#predictive-search-results').should('be.visible');
    cy.get('#Search-In-Modal').clear().type('backpack');
    cy.get('#predictive-search-results').should('be.visible');
  });

})