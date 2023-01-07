/* eslint-disable jest/no-focused-tests */
describe('User Settings', function () {
  beforeEach(() => {
    cy.visit('/');
    cy.getByData('dummy1-login').click();
  });

  it('Top Page', () => {
    cy.location('pathname').should('eq', '/app');
  });

  it.only('ユーザーは、ウェブサイトに表示される一意の名前を選択できるようにする必要がある（ニックネーム）', () => {
    cy.getByData('sidenav-user-avatar').click();
    cy.location('pathname').should('eq', '/app/profile');
    cy.getByData('profile-edit').click();
    cy.getByData('profile-edit-nickname-input').clear().type('New Nickname');
    cy.getByData('profile-edit-submit').click();
    cy.getByData('profile-nickname').should('contain', 'New Nickname');
  });
});
