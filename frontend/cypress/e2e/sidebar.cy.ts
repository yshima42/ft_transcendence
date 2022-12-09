describe('sidebar spec', () => {
  before(() => {
    cy.exec('yarn --cwd ../backend prisma migrate reset -f');
  });

  beforeEach(() => {
    cy.visit('/');
    cy.contains('Admin Test dummy1').click();
  });

  it('users', () => {
    cy.contains('Users').click();
    cy.url().should('include', '/users');
  });

  it('chat', () => {
    cy.contains('Chat').click();
    cy.url().should('include', '/chat');
  });

  it('watch', () => {
    cy.contains('Watch').click();
    cy.url().should('include', '/games');
  });

  it('profile', () => {
    cy.contains('nicknamedummy1').click();
    cy.url().should('include', '/profile');
  });

  it('avatar', () => {
    cy.get('.chakra-avatar__img').click();
    cy.url().should('include', '/profile');
  });

  it('logout', () => {
    cy.contains('Logout').click();
    cy.url().should('include', '/');
  });
});
