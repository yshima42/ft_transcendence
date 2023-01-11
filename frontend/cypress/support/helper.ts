export enum UsersTab {
  FRIENDS,
  PENDING,
  RECOGNITION,
  BLOCKED,
  ADD_FRIEND,
}

export const getUsersDataTest = (tab: UsersTab): string => {
  const usersTabDataTest: string[] = [
    'users-friends',
    'users-pending',
    'users-recognition',
    'users-blocked',
    'users-add-friend',
  ];

  return usersTabDataTest[tab];
};

export const visitMyProfile = (): void => {
  cy.getBySel('sidenav-user-avatar').click();
  cy.location('pathname').should('contain', '/app/users');
};

export const visitUsersTab = (tab: UsersTab): void => {
  const dataTest = getUsersDataTest(tab) + '-tab';
  cy.getBySel('sidenav-users').click();
  cy.getBySel(dataTest).click();
  cy.location('pathname').should('eq', '/app/users');
};

export const visitProfileFromUsersTab = (
  tab: UsersTab,
  nickname: string
): void => {
  visitUsersTab(tab);
  const targetSelector = 'users-user-avatar-' + nickname;
  const dataTest = getUsersDataTest(tab) + '-grid';
  cy.getBySel(dataTest).within(() => {
    cy.getBySel(targetSelector).should('be.visible').click();
  });
  cy.location('pathname').should('contain', '/app/users');
};

export const assertUserIsInUsersTab = (
  tab: UsersTab,
  nickname: string
): void => {
  visitUsersTab(tab);
  const targetSelector = 'users-user-avatar-' + nickname;
  const dataTest = getUsersDataTest(tab) + '-grid';
  cy.getBySel(dataTest).within(() => {
    cy.getBySel(targetSelector).should('be.visible');
  });
};
