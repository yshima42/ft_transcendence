describe('dm spec', () => {
  before(() => {
    cy.exec('yarn --cwd ../backend prisma migrate reset -f');
  });

  const loginCheck = (name: string) => {
    cy.visit('/');
    cy.getBySel(`${name}-login`).click();
    cy.location('pathname').should('eq', '/app');
  };

  const clickDmButton = (name: string) => {
    cy.getBySel(`nickname${name}-dm-button`).click();
    cy.getBySel('content-title').should('have.text', 'Direct Message');
  };

  const frinedListToProfile = (name: string) => {
    cy.getBySel('sidenav-users').click();
    cy.getBySel('users-friends-tab').click();
    cy.location('pathname').should('contain', '/app/users');

    const targetNickname = `nickname${name}`;
    const targetSelector = 'users-user-avatar-' + targetNickname;

    cy.getBySel('users-friends').within(() => {
      cy.getBySel(targetSelector).click();
    });

    cy.getBySel('content-title').should('have.text', 'Profile');
    cy.getBySel('profile-nickname').should('have.text', targetNickname);
  };

  const goToDmRooms = () => {
    cy.getBySel('sidenav-dm').click();
    cy.location('pathname').should('contain', '/app/dm/rooms');
  };

  const sendMessage = () => {
    cy.getBySel('message-form').type('direct-message-test');
    cy.getBySel('send-button').click();
    // cy.getBySel('message-direct-message-test').should(
    //   'have.text',
    //   'direct-message-test'
    // );
  };

  const checkMessage = () => {
    cy.getBySel('message-direct-message-test').should(
      'have.text',
      'direct-message-test'
    );
  };

  /**
   * シナリオNo.DM-1
   * dummy1がログイン。
   * Friendページのdummy2のDMボタンからDMルームへ移動。
   * メッセージ送信。
   * DM一覧に移動し、DMルームの表示を確認。
   * dummy2でログイン。DM一覧からDMルームへ移動。
   * メッセージの存在を確認。
   *
   * チェック項目 No.26
   */
  it('他のユーザーにDMを送ることができる。', () => {
    loginCheck('dummy001');

    cy.getBySel('sidenav-users').click();
    cy.getBySel('users-friends-tab').click();
    cy.location('pathname').should('contain', '/app/users');

    clickDmButton('dummy002');
    sendMessage();
    goToDmRooms();
    cy.getBySel('nicknamedummy002').should('be.visible');

    loginCheck('dummy002');

    goToDmRooms();
    cy.getBySel('nicknamedummy001').click();
    cy.getBySel('content-title').should('have.text', 'Direct Message');
    checkMessage();
  });

  /**
   * シナリオNo.DM-2
   * dummy1がログイン。
   * dummy2のProfileページのDMボタンからDMルームへ移動。
   *
   * チェック項目 No.
   */
  it('ProfileページからDMルームに移動できる。', () => {
    loginCheck('dummy001');
    frinedListToProfile('dummy002');
    clickDmButton('dummy002');
  });

  /**
   * シナリオNo.DM-3
   * dummy3でログイン。
   * dummy1へメッセージ送信。
   * dummy1でログイン。dummy3のDMルーム確認。
   * dummy3をブロック。
   * DM一覧からdummy3のDMルームが消えることを確認。
   * また、dummy3のDMボタンをクリックしたときのアラート確認。
   *
   * チェック項目 No.27, 64
   */
  it('ブロックユーザーのDMルームを一覧から除く。', () => {
    loginCheck('dummy003');
    frinedListToProfile('dummy001');
    clickDmButton('dummy001');
    sendMessage();

    loginCheck('dummy001');
    goToDmRooms();
    cy.getBySel('nicknamedummy003').should('be.visible');

    frinedListToProfile('dummy003');
    cy.getBySel('block').click();
    cy.getBySel('unblock').should('be.visible');

    goToDmRooms();
    cy.getBySel('nicknamedummy003').should('not.exist');

    cy.getBySel('sidenav-users').click();
    cy.getBySel('users-friends-tab').click();
    cy.location('pathname').should('contain', '/app/users');

    cy.getBySel(`nicknamedummy003-dm-button`).click();
    cy.on('window:alert', (t) => {
      expect(t).to.equal('you cannot open dm room with block relation'); // eslint-disable-line
    });
  });
});
