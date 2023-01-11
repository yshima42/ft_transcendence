/* eslint-disable jest/no-focused-tests */
import { GameStats } from '../../src/hooks/api/game/useGameStats';
import {
  assertUserIsInUsersTab,
  assertUserIsNotInUsersTab,
  UsersTab,
  visitMyProfile,
  visitProfileFromUsersTab,
} from '../support/helper';

describe('Profile', function () {
  // DBセットアップ
  before(() => {
    // cy.exec('yarn --cwd ../backend db:seed:test:ua');
  });

  // dummy1でログイン
  beforeEach(() => {
    cy.exec('yarn --cwd ../backend db:seed:test:ua');
    cy.visit('/');
    cy.getBySel('dummy1-login').click();
  });

  /**
   * シナリオ Profile-1
   * ProfileページでEditボタンをクリックして、ProfileEdit表示する。
   * ニックネームを変更し、表示の変更を確認。
   *
   * チェック項目No.17, 58
   */
  it('ユーザーは、ウェブサイトに表示される一意の名前を選択できるようにする必要がある（ニックネーム）', () => {
    visitMyProfile();
    cy.getBySel('profile-edit').click();
    cy.getBySelLike('nickname-input').type('New Nickname');
    cy.getBySelLike('submit').click();
    cy.getBySel('profile-nickname').should('contain', 'New Nickname');
  });

  /**
   * シナリオ Profile-2
   * Profileページでデフォルトアバターが設定されているか確認。
   * Editボタンクリックして、ProfileEdit表示。
   * アバターをアップロードし、パスの変更を確認。
   *
   * チェック項目No.18, 19, 58
   */
  it('ユーザーは、アバターをアップロードすることができる', () => {
    const defaultAvatarPath =
      'https://placehold.jp/0C163D/fffffe/150x150.png?text=dummy1';
    const uploadFilePath = 'cypress/fixtures/zazen_obousan.png';
    const partOfUploadDirPath = 'avatar/dummy1';

    visitMyProfile();

    // デフォルトアバターが設定されているか確認。
    cy.getBySel('profile-user-avatar')
      .children('img.chakra-avatar__img')
      .should('have.attr', 'src')
      .and('have.string', defaultAvatarPath);

    // アバターアップロード
    cy.getBySel('profile-edit').click();
    cy.getBySelLike('file-select').selectFile(uploadFilePath, { force: true });
    cy.getBySelLike('submit').click();

    // ファイルがアップロードされているか確認
    // よい方法がわからないので、暫定的なもの
    // srcのパスがデフォルトから変更されているか確認している
    cy.getBySel('profile-user-avatar')
      .children('img.chakra-avatar__img')
      .should('have.attr', 'src')
      .and('not.eq', defaultAvatarPath)
      .and('have.string', partOfUploadDirPath);
  });

  /**
   * シナリオ Profile-3
   * ProfileページでStats, MatchHistoryの確認をする。
   *
   * チェック項目No.22, 23
   */
  it('統計情報（勝敗、ラダーレベル(勝率)、実績など）がユーザープロフィールに表示される', () => {
    visitMyProfile();

    // ゲームの結果（最新5件）が表示されているか確認
    // バックエンドのデータと一致しているか確認するのは大変なので、
    // とりあえず、勝敗の文字列が表示されているかだけ確認する
    cy.getBySelLike('match-result').each(($el) => {
      cy.wrap($el).contains(/Win!!|Lose.../);
    });

    // 勝率が表示されているか確認
    const gameStatsUrl = `${Cypress.env().backendUrl as string}/game/stats`;

    cy.request('GET', gameStatsUrl).then((response) => {
      const gameStats = response.body as GameStats;
      cy.getBySelLike('win-rate').should('contain', `${gameStats.winRate}%`);
      cy.getBySelLike('total-matches').should(
        'contain',
        `${gameStats.totalWins}/${gameStats.totalMatches}`
      );
    });
  });

  /**
   * シナリオ Profile-4
   * Friendタブの中から一人選び、プロフィールへ移動。
   * プロフィールページでBlockボタンをクリック。
   * Blockedタブに表示されることを確認。
   *
   * チェック項目No.27, 60
   */
  it.only('他のユーザーをブロックすることができ、そのブロックを解除することができる。', () => {
    const targetNickname = 'n-friends1';

    visitProfileFromUsersTab(UsersTab.FRIENDS, targetNickname);
    cy.getBySel('block-button').click();
    cy.getBySel('unblock-button').should('be.visible');
    assertUserIsInUsersTab(UsersTab.BLOCKED, targetNickname);

    visitProfileFromUsersTab(UsersTab.FRIENDS, targetNickname);
    cy.getBySel('unblock-button').click();
    cy.getBySel('block-button').should('be.visible');
    assertUserIsNotInUsersTab(UsersTab.BLOCKED, targetNickname);
  });

  /**
   * シナリオ Profile-5
   * Add Friendタブの中から一人選び、プロフィールへ移動。
   * プロフィールページでRequestボタンをクリック。
   * Pendingタブに存在することを確認。
   *
   * チェック項目No.21,78
   */
  it('フレンド申請を送ることができる', () => {
    const targetNickname = 'n-add-friend1';

    visitProfileFromUsersTab(UsersTab.ADD_FRIEND, targetNickname);
    cy.getBySel('request-button').should('be.visible').click();
    cy.getBySel('cancel-button').should('be.visible');
    assertUserIsInUsersTab(UsersTab.PENDING, targetNickname);
  });

  /**
   * シナリオ Profile-6
   * Pendingタブの中から一人選び、プロフィールへ移動。
   * プロフィールページでCancelボタンをクリック。
   * Add Friendタブに存在することを確認。
   *
   * チェック項目No.21,78
   */
  it('フレンド申請を取り消すことができる', () => {
    const targetNickname = 'n-pending1';

    visitProfileFromUsersTab(UsersTab.PENDING, targetNickname);
    cy.getBySel('cancel-button').should('be.visible').click();
    cy.getBySel('request-button').should('be.visible');
    assertUserIsInUsersTab(UsersTab.ADD_FRIEND, targetNickname);
  });

  /**
   * シナリオ Profile-7
   * Recognitionタブの中から一人選び、プロフィールへ移動。
   * プロフィールページでAcceptボタンをクリック。
   * Friendsタブに存在することを確認。
   *
   * チェック項目No.21,78
   */
  it('フレンド申請を承認することができる', () => {
    const targetNickname = 'n-recognition1';

    visitProfileFromUsersTab(UsersTab.RECOGNITION, targetNickname);
    cy.getBySel('accept-button').should('be.visible').click();
    cy.getBySel('profile-user-avatar')
      .children('div.chakra-avatar__badge')
      .should('be.visible');
    assertUserIsInUsersTab(UsersTab.FRIENDS, targetNickname);
  });

  /**
   * シナリオ Profile-8
   * Recognitionタブの中から一人選び、プロフィールへ移動。
   * プロフィールページでRejectボタンをクリック。
   * Add Friendタブに存在することを確認。
   *
   * チェック項目No.21,78
   */
  it('フレンド申請を拒否することができる', () => {
    const targetNickname = 'n-recognition2';

    visitProfileFromUsersTab(UsersTab.RECOGNITION, targetNickname);
    cy.getBySel('reject-button').should('be.visible').click();
    cy.getBySel('request-button').should('be.visible');
    assertUserIsInUsersTab(UsersTab.ADD_FRIEND, targetNickname);
  });
});
