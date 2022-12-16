describe('chatroom spec', () => {
  beforeEach(() => {
    cy.visit('/'); // テスト開始前にルートにアクセス
    cy.contains('Admin Test dummy1').click(); // Admin Test dummy1が含まれる要素をクリック
  });

  it('chat', () => {
    cy.contains('Chat').click(); // Chatが含まれる要素をクリック
    // data-testid="create-chat-room"が存在する
    cy.get('[data-testid="create-chat-room"]').should('exist');
  });
});
