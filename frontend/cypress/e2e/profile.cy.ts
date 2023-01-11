/* eslint-disable jest/no-focused-tests */
import { GameStats } from '../../src/hooks/api/game/useGameStats';
import {
  assertUserIsInUsersTab,
  UsersTab,
  visitMyProfile,
  visitProfileFromUsersTab,
} from '../support/helper';

describe('Profile', function () {
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
   * シナリオ UA-1
   * サイドバーのアバターからプロフィールページへ移動。
   * Editボタンクリックして、ProfileEdit表示。
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
   * シナリオ UA-2
   * サイドバーのアバターからプロフィールページへ移動。
   * デフォルトアバターが設定されているか確認。
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
   * シナリオ UA-3
   * サイドバーのアバターからプロフィールページへ移動。
   * Stats, MatchHistoryの確認をする。
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
   * シナリオ UA-5
   * サイドバーからFriendタブを表示。
   * Friendの中から一人選び、アバターからプロフィールへ移動。
   * プロフィールページでブロックボタンをクリック。
   * Friendタブの、ブロック一覧に存在することを確認。
   *
   * チェック項目No.27, 60
   */
  it('他のユーザーをブロックすることができる。', () => {
    const targetNickname = 'nick-dummy-friends1';

    visitProfileFromUsersTab(UsersTab.FRIENDS, targetNickname);

    cy.getBySel('block-button').click();
    cy.getBySel('unblock-button').should('be.visible');

    assertUserIsInUsersTab(UsersTab.BLOCKED, targetNickname);
  });

  it('フレンド申請を送ることができる', () => {
    const targetNickname = 'nick-dummy-add-friend1';

    visitProfileFromUsersTab(UsersTab.ADD_FRIEND, targetNickname);

    cy.getBySel('request-button').should('be.visible').click();
    cy.getBySel('cancel-button').should('be.visible');

    assertUserIsInUsersTab(UsersTab.PENDING, targetNickname);
  });

  it('フレンド申請を取り消すことができる', () => {
    const targetNickname = 'nick-dummy-pending1';

    visitProfileFromUsersTab(UsersTab.PENDING, targetNickname);

    cy.getBySel('cancel-button').should('be.visible').click();
    cy.getBySel('request-button').should('be.visible');

    assertUserIsInUsersTab(UsersTab.ADD_FRIEND, targetNickname);
  });

  it('フレンド申請を承認することができる', () => {
    const targetNickname = 'nick-dummy-recognition1';

    visitProfileFromUsersTab(UsersTab.RECOGNITION, targetNickname);

    cy.getBySel('accept-button').should('be.visible').click();
    cy.getBySel('profile-user-avatar')
      .children('div.chakra-avatar__badge')
      .should('be.visible');

    assertUserIsInUsersTab(UsersTab.FRIENDS, targetNickname);
  });

  it('フレンド申請を拒否することができる', () => {
    const targetNickname = 'nick-dummy-recognition2';

    visitProfileFromUsersTab(UsersTab.RECOGNITION, targetNickname);

    cy.getBySel('reject-button').should('be.visible').click();
    cy.getBySel('request-button').should('be.visible');

    assertUserIsInUsersTab(UsersTab.ADD_FRIEND, targetNickname);
  });
});
