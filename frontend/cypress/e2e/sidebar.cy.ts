describe('sidebar spec', () => {
  beforeEach(() => {
    // cy.exec('yarn --cwd ../backend migrate:reset -f');
    cy.visit('/');
    cy.contains('Admin Test dummy1').click();
  });

  it('Users', () => {
    cy.contains('Users').click();
    cy.url().should('include', '/users');
  });
});
