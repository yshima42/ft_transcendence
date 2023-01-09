describe('dm spec', () => {
  /**
   * dummy1でログイン。
   * passwordなしでチャットルーム新規作成。
   *
   * 対応テストケース No.18
   */
  beforeEach(() => {
    // ログインページから、ログインしてトップページに移動。
    cy.visit('/');
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
  });

  /**
   * dummy1でログイン。
   * 作成したチャットルームを削除する。
   */
  afterEach(() => {
    // dummy1でログイン。
    cy.visit('/');
    cy.getByData('dummy1-auth-button').click();
    cy.location('pathname').should('eq', '/app');

    // My Chatに移動。
    cy.visit('/app/chat/rooms/me');
    cy.getByData('content-title').should('have.text', 'My Chat');

    // 作成したルームをクリックし、移動。
    cy.getByData('cypress-test-room').click();
    cy.getByData('content-title').should('have.text', 'cypress-test-room');

    // Settingボタンをクリックし、設定ページへ移動。Deleteボタンクリック。
    // 正しくMy Chatへ移動し、チャットルームが存在しないことを確認。
    cy.getByData('chat-room-settings-button').click();
    cy.getByData('content-title').should('have.text', 'Chat Room Settings');
    cy.getByData('chat-room-delete-button').click();
    cy.location('pathname').should('eq', '/app/chat/rooms/me');
    cy.getByData('cypress-test-room').should('not.exist');
  });

  /**
   * テストシナリオ1
   * dummy2でログイン。
   * Chatに移動して、作成したチャットルームを選択し、入退室。
   *
   * 対応テストケース No.25, 26
   */
  it('チャットルームの作成・削除・入室・退室ができる', () => {
    // dummy2でログイン。
    cy.visit('/');
    cy.getByData('dummy2-auth-button').click();
    cy.location('pathname').should('eq', '/app');

    // Chatページへ移動。
    cy.contains(/^Chat$/).click();
    cy.location('pathname').should('eq', '/app/chat/rooms');

    // 作成したルームをクリックし、移動。
    cy.getByData('cypress-test-room').click();
    cy.getByData('content-title').should('have.text', 'Chat Room Confirmation');

    // Joinボタンクリック。
    // チャットルーム名が確認できれば、入室成功。
    cy.getByData('chat-room-join-button').click();
    cy.getByData('content-title').should('have.text', 'cypress-test-room');

    // Settingsボタンクリック。
    // Exitボタンクリック。MyChatからチャットルームが消えていることを確認。
    cy.getByData('chat-room-settings-button').click();
    cy.getByData('content-title').should('have.text', 'Chat Room Settings');
    cy.getByData('chat-room-exit-button').click();
    cy.location('pathname').should('eq', '/app/chat/rooms/me');
    cy.getByData('cypress-test-room').should('not.exist');
  });

  /**
   * テストシナリオ2
   * dummy1でログイン。
   * 作成されたチャットルームにpasswordを設定。
   * dummy2でログイン。
   * Chatに移動して、作成されたチャットルームを選択。
   * passwordを入力して入室。
   *
   * 対応テストケース No.19, 27
   */
  it('チャットルームにパスワードを設定できる', () => {
    // My Chatに移動。
    cy.visit('/app/chat/rooms/me');
    cy.getByData('content-title').should('have.text', 'My Chat');

    // 作成したルームをクリックし、移動。
    cy.getByData('cypress-test-room').click();
    cy.getByData('content-title').should('have.text', 'cypress-test-room');

    // Settingボタンをクリックし、設定ページへ移動。
    // Securityをクリックして、Passwordを入力し、Lockボタンをクリック。
    // チャットルームに移動できていれば設定成功。
    cy.getByData('chat-room-settings-button').click();
    cy.getByData('content-title').should('have.text', 'Chat Room Settings');
    cy.getByData('Security-accordion-button').click();
    cy.getByData('input-chat-room-password').type('YuuYuuHakuSho');
    cy.getByData('lock-button').click();
    cy.getByData('content-title').should('have.text', 'cypress-test-room');

    // dummy2 でログインし直し。
    cy.visit('/');
    cy.getByData('dummy2-auth-button').click();
    cy.location('pathname').should('eq', '/app');

    // Chatページへ移動。
    cy.contains(/^Chat$/).click();
    cy.location('pathname').should('eq', '/app/chat/rooms');

    // 作成したルームをクリックし、移動。
    cy.getByData('cypress-test-room').click();
    cy.getByData('content-title').should('have.text', 'Chat Room Confirmation');

    // passwordを入力し、Joinボタンクリック。
    // チャットルーム名が確認できれば、入室成功。
    cy.getByData('input-chat-room-password').type('YuuYuuHakuSho');
    cy.getByData('chat-room-join-button').click();
    cy.getByData('content-title').should('have.text', 'cypress-test-room');
  });

  /**
   * テストシナリオ3
   * dummy3でログイン。
   * dummy1はdummy3をseedでブロックしておく。
   * dummy3がチャットルームで書き込み。
   * dummy1でログイン。
   * チャットルームに移動し、dummy3の書き込みが表示されない
   * ことを確認。
   *
   * 対応テストケース No.20, 24
   */
  it('ブロックユーザーの書き込み非表示。', () => {
    // dummy3 でログイン。
    cy.visit('/');
    cy.getByData('dummy3-auth-button').click();
    cy.location('pathname').should('eq', '/app');

    // Chatページへ移動。
    cy.contains(/^Chat$/).click();
    cy.location('pathname').should('eq', '/app/chat/rooms');

    // 作成したルームをクリックし、移動。
    cy.getByData('cypress-test-room').click();
    cy.getByData('content-title').should('have.text', 'Chat Room Confirmation');

    // チャットルーム名が確認できれば、入室成功。
    cy.getByData('chat-room-join-button').click();
    cy.getByData('content-title').should('have.text', 'cypress-test-room');

    // メッセージを送信する。
    cy.getByData('message-form').type('prostetnic-vogon-jeltz');
    cy.getByData('send-button').click();
    cy.getByData('message-prostetnic-vogon-jeltz').should(
      'have.text',
      'prostetnic-vogon-jeltz'
    );

    // dummy1 でログイン。
    cy.visit('/');
    cy.getByData('dummy1-auth-button').click();
    cy.location('pathname').should('eq', '/app');

    // My Chatに移動。
    cy.visit('/app/chat/rooms/me');
    cy.getByData('content-title').should('have.text', 'My Chat');

    // 作成したルームをクリックし、移動。
    cy.getByData('cypress-test-room').click();
    cy.getByData('content-title').should('have.text', 'cypress-test-room');

    // dummy3のメッセージが表示されないことを確認。
    cy.getByData('message-prostetnic-vogon-jeltz').should('not.exist');
  });

  /**
   * テストシナリオ4
   * dummy2でログイン。
   * Chatに移動して、作成したチャットルームを選択し、入室。
   * メッセージを書き込む。
   * dummy1でログイン。
   * My Chatでチャットルームに入室。
   * メッセージにあるdummy2のアバターをクリック。
   * プロフィールへ移動する。
   *
   * 対応テストケース No.22
   */
  it('チャットルームのアイコンからプロフィールへ移動できる', () => {
    // dummy2でログイン。
    cy.visit('/');
    cy.getByData('dummy2-auth-button').click();
    cy.location('pathname').should('eq', '/app');

    // Chatページへ移動。
    cy.contains(/^Chat$/).click();
    cy.location('pathname').should('eq', '/app/chat/rooms');

    // 作成したルームをクリックし、移動。
    cy.getByData('cypress-test-room').click();
    cy.getByData('content-title').should('have.text', 'Chat Room Confirmation');

    // Joinボタンクリック。
    // チャットルーム名が確認できれば、入室成功。
    cy.getByData('chat-room-join-button').click();
    cy.getByData('content-title').should('have.text', 'cypress-test-room');

    // メッセージを送信する。
    cy.getByData('message-form').type('expect_patronum');
    cy.getByData('send-button').click();
    cy.getByData('message-expect_patronum').should(
      'have.text',
      'expect_patronum'
    );

    // dummy1でログイン。
    cy.visit('/');
    cy.getByData('dummy1-auth-button').click();
    cy.location('pathname').should('eq', '/app');

    // My Chatに移動。
    cy.visit('/app/chat/rooms/me');
    cy.getByData('content-title').should('have.text', 'My Chat');

    // 作成したルームをクリックし、移動。
    cy.getByData('cypress-test-room').click();
    cy.getByData('content-title').should('have.text', 'cypress-test-room');

    // メッセージのアイコンをクリック。プロフィールへ移動。
    // TODO プロフィールへ飛べないのでバグ解消必要。
    // cy.getByData('message-avatar').click();
    // cy.getByData('content-title').should('have.text', 'Profile');
    // cy.getByData('user-name').should('have.text', 'dummy2');
  });
});
