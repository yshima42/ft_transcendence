/* eslint-disable jest/no-focused-tests */
import { GameStats } from '../../src/hooks/api/game/useGameStats';

describe('User Settings', function () {
  before(() => {
    cy.exec(
      'yarn --cwd ../backend ts-node prisma/seed-cypress-user-account.ts'
    );
  });

  beforeEach(() => {
    cy.visit('/');
    cy.getBySel('dummy1-login').click();
  });

  it('Top Page', () => {
    cy.location('pathname').should('eq', '/app');
  });

  it('ユーザーは、ウェブサイトに表示される一意の名前を選択できるようにする必要がある（ニックネーム）', () => {
    cy.getBySel('sidenav-user-avatar').click();
    cy.location('pathname').should('eq', '/app/profile');
    cy.getBySel('profile-edit').click();
    cy.getBySelLike('nickname-input').clear().type('New Nickname');
    cy.getBySelLike('submit').click();
    cy.getBySel('profile-nickname').should('contain', 'New Nickname');
  });

  it('ユーザーは、アバターをアップロードすることができる', () => {
    const defaultAvatarPath =
      'https://placehold.jp/2b52ee/ffffff/150x150.png?text=dummy1';
    const uploadFilePath = 'cypress/fixtures/zazen_obousan.png';
    const partOfUploadDirPath = 'avatar/dummy1';

    cy.getBySel('sidenav-user-avatar').click();
    cy.location('pathname').should('eq', '/app/profile');

    cy.getBySel('profile-edit').click();
    cy.getBySelLike('file-select').selectFile(uploadFilePath);
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

  it('統計情報（勝敗、ラダーレベル(勝率)、実績など）がユーザープロフィールに表示される', () => {
    cy.getBySel('sidenav-user-avatar').click();
    cy.location('pathname').should('eq', '/app/profile');

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

  it('フレンドインターフェースでは、フレンドとその状態（オフライン／オンライン／ゲーム中等）を確認することができる', () => {
    cy.getBySel('sidenav-users').click();
    cy.getBySel('users-friends-tab').click();
    cy.location('pathname').should('eq', '/app/users');

    // バッジが表示されているか確認
    cy.getBySel('users-friends').within(() => {
      cy.getBySelLike('users-user-avatar').each(($el) => {
        cy.wrap($el).children('div.chakra-avatar__badge').should('be.visible');
      });
    });
  });

  it.only('他のユーザーをブロックすることができる。', () => {
    cy.getBySel('sidenav-users').click();
    cy.getBySel('users-friends-tab').click();
    cy.location('pathname').should('eq', '/app/users');

    const targetNickname = 'nick-dummy-friends1';
    const targetSelector = 'users-user-avatar-' + targetNickname;

    cy.getBySel('users-friends').within(() => {
      cy.getBySel(targetSelector).click();
    });
    cy.getBySel('block').click();
    cy.getBySel('unblock').should('be.visible');

    cy.getBySel('sidenav-users').click();
    cy.getBySel('users-blocked-tab').click();
    cy.location('pathname').should('eq', '/app/users');
    cy.getBySel(targetSelector).should('be.visible');
  });
});
