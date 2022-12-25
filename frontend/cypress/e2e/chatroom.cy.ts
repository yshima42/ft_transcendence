describe('chatroom spec', () => {
  beforeEach(() => {
    cy.visit('/'); // テスト開始前にルートにアクセス
    cy.contains('Admin Test dummy1').click(); // Admin Test dummy1が含まれる要素をクリック
  });

  it('chat', () => {
    // Chatと一致する要素をクリック
    cy.contains(/^Chat$/).click();
    cy.get('[data-testid="create-chat-room"]').should('exist');
    cy.get('[data-testid="chat-room-list"]').should('exist');
    cy.get('[data-testid="chat-room-id"]').should('exist');
    cy.get('[data-testid="chat-room-created-at"]').should('exist');
    cy.get('[data-testid="chat-room-room-status"]').should('not.exist');
  });
});
