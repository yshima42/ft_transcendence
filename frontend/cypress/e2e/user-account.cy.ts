/* eslint-disable jest/no-focused-tests */
describe('User Settings', function () {
  beforeEach(() => {
    cy.visit('/');
    cy.getByData('dummy1-login').click();
  });

  it('Top Page', () => {
    cy.location('pathname').should('eq', '/app');
  });

  it('ユーザーは、ウェブサイトに表示される一意の名前を選択できるようにする必要がある（ニックネーム）', () => {
    cy.getByData('sidenav-user-avatar').click();
    cy.location('pathname').should('eq', '/app/profile');
    cy.getByData('profile-edit').click();
    cy.getByData('profile-edit-nickname-input').clear().type('New Nickname');
    cy.getByData('profile-edit-submit').click();
    cy.getByData('profile-nickname').should('contain', 'New Nickname');
  });

  it.only('ユーザーは、アバターをアップロードすることができる', () => {
    const defaultAvatarPath =
      'https://placehold.jp/2b52ee/ffffff/150x150.png?text=dummy1';
    const uploadFilePath = 'cypress/fixtures/zazen_obousan.png';
    const partOfUploadDirPath = 'avatar/dummy1';

    cy.getByData('sidenav-user-avatar').click();
    cy.location('pathname').should('eq', '/app/profile');

    cy.getByData('profile-edit').click();
    cy.getByData('profile-edit-file-select').selectFile(uploadFilePath);
    cy.getByData('profile-edit-submit').click();

    // ファイルがアップロードされているか確認
    // よい方法がわからないので、暫定的なもの
    // srcのパスがデフォルトから変更されているか確認している
    cy.getByData('profile-user-avatar')
      .children('img.chakra-avatar__img')
      .should('have.attr', 'src')
      .and('not.eq', defaultAvatarPath)
      .and('have.string', partOfUploadDirPath);
  });
});
