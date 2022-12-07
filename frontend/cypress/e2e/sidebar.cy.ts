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
    cy.get('h2').should('have.text', 'Users');
  });

  it('chat', () => {
    cy.contains('Chat').click();
    cy.url().should('include', '/chats');
    cy.get('h2').should('have.text', 'Chat Room');
  });

  it('watch', () => {
    cy.contains('Watch').click();
    cy.url().should('include', '/games');
    cy.get('h2').should('have.text', 'Games');
  });

  it('profile', () => {
    cy.contains('nicknamedummy1').click();
    cy.url().should('include', '/profile');
    cy.get('h2').first().should('have.text', 'Profile');
  });

  it('avatar', () => {
    cy.get('.chakra-avatar__img').click();
    cy.url().should('include', '/profile');
    cy.get('h2').first().should('have.text', 'Profile');
  });

  it('logout', () => {
    cy.contains('Logout').click();
    cy.url().should('include', '/');
    cy.contains('TransPong');
  });
});
