import { expect } from 'chai';

describe('empty spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io');
    expect(1 + 1).eql(2);
  });
});
