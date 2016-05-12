const pathname = require('pathname-match')
const choo = require('../../../')

module.exports = function (nav, mailbox) {
  return function (params, state, send) {
    return choo.view`
      <main class="app">
        <span>URL: ${pathname(state.location) || '/'}</span>
        ${nav(params, state, send)}
        ${mailbox(params, state, send)}
      </main>
    `
  }
}
