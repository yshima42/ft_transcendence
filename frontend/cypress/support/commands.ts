/// <reference types="cypress" />

Cypress.Commands.add('getBySel', (selector: string) => {
  return cy.get(`[data-test=${selector}]`);
});

Cypress.Commands.add('getBySelLike', (selector: string) => {
  return cy.get(`[data-test*=${selector}]`);
});
