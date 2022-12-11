import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(`[cy.log] ${message}`);
          return null;
        },
      });
    },
    baseUrl: 'http://localhost:5173',
  },
  video: false,
});
