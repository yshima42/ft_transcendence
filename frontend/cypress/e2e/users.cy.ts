/* eslint-disable jest/no-focused-tests */
import {
  assertUserIsInUsersTab,
  getUsersDataTest,
  RelationChangeButton,
  UsersTab,
  visitUsersTab,
} from '../support/helper';

const changeRelation = (
  tab: UsersTab,
  button: RelationChangeButton,
  nickname: string
) => {
  const dataTest = getUsersDataTest(tab) + '-grid';

  cy.getBySelLike(dataTest).within(() => {
    cy.getBySel('user-card-' + nickname).within(() => {
      cy.getBySel(button).should('be.visible').click();
    });
    cy.getBySel('user-card-' + nickname).should('not.exist');
  });
};

describe('Users', function () {
  // DBセットアップ
  before(() => {
    // cy.exec('yarn --cwd ../backend db:seed:test:ua');
  });

  // dummy001でログイン
  beforeEach(() => {
    cy.exec('yarn --cwd ../backend db:seed:test:ua');
    cy.visit('/');
    cy.getBySel('dummy001-login').click();
  });

  /**
   * シナリオ Users-1
   * Friendsタブでバッジの表示されているか確認する。
   *
   * チェック項目No.21, 61
   */
  it('フレンドインターフェースでは、フレンドとその状態（オフライン／オンライン／ゲーム中等）を確認することができる', () => {
    visitUsersTab(UsersTab.FRIENDS);

    // バッジが表示されているか確認
    cy.getBySelLike('friends-grid').within(() => {
      cy.getBySelLike('user-avatar').each(($el) => {
        cy.wrap($el).children('div.chakra-avatar__badge').should('be.visible');
      });
    });
  });

  /**
   * シナリオ Users-2
   * Blockedタブに表示されるユーザー一人選び、UnBlockボタンをクリック。
   * プロフィールページでRejectボタンをクリック。
   * ブロック一覧に表示されないことを確認。
   *
   * チェック項目No.21,78
   */
  it('他のユーザーのブロックを解除することができる。', () => {
    const targetNickname = 'n-blocked1';

    visitUsersTab(UsersTab.BLOCKED);
    changeRelation(UsersTab.BLOCKED, 'unblock-button', targetNickname);
  });

  /**
   * シナリオ Users-4
   * Add Friendタブの中から一人選び、Requestボタンをクリック。
   * Pendingタブに存在することを確認。
   *
   * チェック項目No.21,78
   */
  it('フレンド申請を送ることができる', () => {
    const targetNickname = 'n-add-friend1';

    visitUsersTab(UsersTab.ADD_FRIEND);
    changeRelation(UsersTab.ADD_FRIEND, 'request-button', targetNickname);
    assertUserIsInUsersTab(UsersTab.PENDING, targetNickname);
  });

  /**
   * シナリオ Users-5
   * Pendingタブの中から一人選び、Cancelボタンをクリック。
   * Add Friendタブに存在することを確認。
   *
   * チェック項目No.21,78
   */
  it('フレンド申請を取り消すことができる', () => {
    const targetNickname = 'n-pending1';

    visitUsersTab(UsersTab.PENDING);
    changeRelation(UsersTab.PENDING, 'cancel-button', targetNickname);
    assertUserIsInUsersTab(UsersTab.ADD_FRIEND, targetNickname);
  });

  /**
   * シナリオ Users-6
   * Recognitionタブの中から一人選び、Acceptボタンをクリック。
   * Friendsタブに存在することを確認。
   *
   * チェック項目No.21,78
   */
  it('フレンド申請を承認することができる', () => {
    const targetNickname = 'n-recognition1';

    visitUsersTab(UsersTab.RECOGNITION);
    changeRelation(UsersTab.RECOGNITION, 'accept-button', targetNickname);
    assertUserIsInUsersTab(UsersTab.FRIENDS, targetNickname);
  });

  /**
   * シナリオ Users-7
   * Recognitionタブの中から一人選び、Rejectボタンをクリック。
   * Add Friendタブに存在することを確認。
   *
   * チェック項目No.21,78
   */
  it('フレンド申請を拒否することができる', () => {
    const targetNickname = 'n-recognition2';

    visitUsersTab(UsersTab.RECOGNITION);
    changeRelation(UsersTab.RECOGNITION, 'reject-button', targetNickname);
    assertUserIsInUsersTab(UsersTab.ADD_FRIEND, targetNickname);
  });
});
