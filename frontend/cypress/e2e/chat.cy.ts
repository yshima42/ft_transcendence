describe('dm spec', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('チャットルームの作成・削除ができる', () => {
    // ログインしてトップページヘ移動。
    cy.getByData('dummy1-auth-button').click();
    cy.location('pathname').should('eq', '/app');

    // Chatページへ移動。
    cy.contains(/^Chat$/).click();
    cy.location('pathname').should('eq', '/app/chat/rooms');

    // Create Chat Room ボタンクリック。
    cy.getByData('create-chat-room').click();
    cy.location('pathname').should('eq', '/app/chat/rooms/create');

    // チャットルーム名入力して Createボタンクリック。チャットページに移動。
    // チャットルーム名が確認できれば、作成成功。
    cy.getByData('input-chat-room-name').type('cypress-test-room');
    cy.getByData('chat-room-create-button').click();
    cy.getByData('content-title').should('have.text', 'cypress-test-room');

    // My Chatに移動。
    cy.visit('/app/chat/rooms/me');
    cy.getByData('content-title').should('have.text', 'My Chat');

    // 作成したルームをクリックし、移動。
    cy.getByData('cypress-test-room').click();
    cy.getByData('content-title').should('have.text', 'cypress-test-room');

    // Settingボタンをクリックし、設定ページへ移動。Deleteボタンクリック。
    // 正しくMy Chatへ移動できれば、削除成功。
    cy.getByData('chat-room-settings-button').click();
    cy.getByData('content-title').should('have.text', 'Chat Room Settings');
    cy.getByData('chat-room-delete-button').click();
    cy.location('pathname').should('eq', '/app/chat/rooms/me');
  });
});
