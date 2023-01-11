/* eslint-disable jest/no-focused-tests */
import {
  assertUserIsInUsersTab,
  UsersTab,
  visitProfileFromUsersTab,
  visitUsersTab,
} from '../support/helper';

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
   * シナリオ UA-4
   * サイドバーからFriendタブを表示。
   * Friendの一覧を取得し、バッチの表示を確認する。
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
   * シナリオ UA-
   * サイドバーからBlockedタブを表示。
   * Blockedの中から一人選び、アンブロックボタンをクリック。
   * ブロック一覧に存在しないことを確認。
   *
   * チェック項目No.
   */
  it('他のユーザーのブロックを解除することができる。', () => {
    const targetNickname = 'nick-dummy-blocked1';

    visitUsersTab(UsersTab.BLOCKED);

    cy.getBySelLike('blocked-grid').within(() => {
      cy.getBySel('users-user-card-' + targetNickname).within(() => {
        cy.getBySel('unblock-button').should('be.visible').click();
      });
      cy.getBySel('users-user-card-' + targetNickname).should('not.exist');
    });
  });

  /**
   * シナリオ UA-6
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

    // Friendのプロフィール確認。
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
   * シナリオ UA-
   * サイドバーからAdd Friendタブを表示。
   * Add Friendの中から一人選び、リクエストボタンをクリック。
   * Pendingタブに存在することを確認。
   *
   * チェック項目No.
   */
  it('フレンド申請を送ることができる', () => {
    const targetNickname = 'nick-dummy-add-friend1';

    visitUsersTab(UsersTab.ADD_FRIEND);

    cy.getBySelLike('add-friend-grid').within(() => {
      cy.getBySel('users-user-card-' + targetNickname).within(() => {
        cy.getBySel('request-button').should('be.visible').click();
      });
      cy.getBySel('users-user-card-' + targetNickname).should('not.exist');
    });

    assertUserIsInUsersTab(UsersTab.PENDING, targetNickname);
  });

  it('フレンド申請を取り消すことができる', () => {
    const targetNickname = 'nick-dummy-pending1';

    visitUsersTab(UsersTab.PENDING);

    cy.getBySelLike('pending-grid').within(() => {
      cy.getBySel('users-user-card-' + targetNickname).within(() => {
        cy.getBySel('cancel-button').should('be.visible').click();
      });
      cy.getBySel('users-user-card-' + targetNickname).should('not.exist');
    });

    assertUserIsInUsersTab(UsersTab.ADD_FRIEND, targetNickname);
  });

  it('フレンド申請を承認することができる', () => {
    const targetNickname = 'nick-dummy-recognition1';
    visitUsersTab(UsersTab.RECOGNITION);

    cy.getBySelLike('recognition-grid').within(() => {
      cy.getBySel('users-user-card-' + targetNickname).within(() => {
        cy.getBySel('accept-button').should('be.visible').click();
      });
      cy.getBySel('users-user-card-' + targetNickname).should('not.exist');
    });

    assertUserIsInUsersTab(UsersTab.FRIENDS, targetNickname);
  });

  it('フレンド申請を拒否することができる', () => {
    const targetNickname = 'nick-dummy-recognition2';

    visitUsersTab(UsersTab.RECOGNITION);

    cy.getBySelLike('recognition-grid').within(() => {
      cy.getBySel('users-user-card-' + targetNickname).within(() => {
        cy.getBySel('reject-button').should('be.visible').click();
      });
      cy.getBySel('users-user-card-' + targetNickname).should('not.exist');
    });

    assertUserIsInUsersTab(UsersTab.ADD_FRIEND, targetNickname);
  });
});
