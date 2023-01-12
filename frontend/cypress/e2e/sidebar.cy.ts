describe('sidebar spec', () => {
  before(() => {
    cy.exec('yarn --cwd ../backend prisma migrate reset -f');
  });

  beforeEach(() => {
    cy.visit('/');
    cy.getBySel('dummy001-login').click();
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
    cy.url().should('include', '/game/rooms');
  });

  it('profile', () => {
    cy.contains('dummy001').click();
    cy.url().should('include', '/users');
  });

  it('avatar', () => {
    cy.get('.chakra-avatar__img').click();
    cy.url().should('include', '/users');
  });

  it('logout', () => {
    cy.contains('Logout').click();
    cy.url().should('include', '/');
  });
});
