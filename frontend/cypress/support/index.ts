/// <reference types="cypress" />

/* eslint-disable */
declare namespace Cypress {
  interface Chainable {
    getByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>;
  }
}
/* eslint-enable */
