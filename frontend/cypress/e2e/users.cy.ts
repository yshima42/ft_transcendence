/* eslint-disable jest/no-focused-tests */
import {
  assertUserIsInUsersTab,
  getUsersDataTest,
  RelationChangeButton,
  UsersTab,
  visitProfileFromUsersTab,
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
    cy.exec(
      'yarn --cwd ../backend ts-node prisma/seed-cypress-user-account.ts'
    );
  });

  // dummy1でログイン
  beforeEach(() => {
    cy.visit('/');
    cy.getBySel('dummy1-login').click();
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
    const targetNickname = 'nick-dummy-blocked1';

    visitUsersTab(UsersTab.BLOCKED);
    changeRelation(UsersTab.BLOCKED, 'unblock-button', targetNickname);
  });

  /**
   * シナリオ Users-3
   * サイドバーからFriendタブを表示。
   * FriendRelationによって、表示されるFriend関連のボタンを確認。
   *
   * チェック項目No.59
   */
  it('他のユーザープロフィールのフレンド関係ボタン表示', () => {
    const targetFriendNickname = 'nick-dummy-friends2';
    const targetPendingNickname = 'nick-dummy-pending1';
    const targetRecognitionNickname = 'nick-dummy-recognition1';
    const targetAddFriendNickname = 'nick-dummy-add-friend1';

    // Friendsのプロフィール確認。
    visitProfileFromUsersTab(UsersTab.FRIENDS, targetFriendNickname);
    cy.getBySel('accept-button').should('not.exist');
    cy.getBySel('cancel-button').should('not.exist');
    cy.getBySel('reject-button').should('not.exist');
    cy.getBySel('request-button').should('not.exist');

    // Pendingのプロフィール確認。
    visitProfileFromUsersTab(UsersTab.PENDING, targetPendingNickname);
    cy.getBySel('cancel-button').should('be.visible');
    cy.getBySel('accept-button').should('not.exist');
    cy.getBySel('reject-button').should('not.exist');
    cy.getBySel('request-button').should('not.exist');

    // Recognitionのプロフィール確認。
    visitProfileFromUsersTab(UsersTab.RECOGNITION, targetRecognitionNickname);
    cy.getBySel('accept-button').should('be.visible');
    cy.getBySel('reject-button').should('be.visible');
    cy.getBySel('cancel-button').should('not.exist');
    cy.getBySel('request-button').should('not.exist');

    // Add Friendのプロフィール確認。
    visitProfileFromUsersTab(UsersTab.ADD_FRIEND, targetAddFriendNickname);
    cy.getBySel('request-button').should('be.visible');
    cy.getBySel('accept-button').should('not.exist');
    cy.getBySel('reject-button').should('not.exist');
    cy.getBySel('cancel-button').should('not.exist');
  });

  /**
   * シナリオ Users-4
   * Add Friendタブの中から一人選び、Requestボタンをクリック。
   * Pendingタブに存在することを確認。
   *
   * チェック項目No.21,78
   */
  it('フレンド申請を送ることができる', () => {
    const targetNickname = 'nick-dummy-add-friend1';

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
    const targetNickname = 'nick-dummy-pending1';

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
    const targetNickname = 'nick-dummy-recognition1';

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
    const targetNickname = 'nick-dummy-recognition2';

    visitUsersTab(UsersTab.RECOGNITION);
    changeRelation(UsersTab.RECOGNITION, 'reject-button', targetNickname);
    assertUserIsInUsersTab(UsersTab.ADD_FRIEND, targetNickname);
  });
});
