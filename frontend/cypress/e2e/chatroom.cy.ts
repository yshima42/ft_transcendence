describe('chatroom spec', () => {
  before(() => {
    cy.exec('yarn --cwd ../backend prisma migrate reset -f');
  });

  beforeEach(() => {
    cy.visit('/'); // テスト開始前にルートにアクセス
    cy.getBySel('dummy001-login').click();
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
