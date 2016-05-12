const pathname = require('pathname-match')
const choo = require('../../../')

module.exports = function (nav, mailbox) {
  return function (params, state, send) {
    return choo.view`
      <main class="mw5 mw7-ns center cf">
        <span class="fl mt4 w-100 f4 b">
          URL: ${pathname(state.location) || '/'}
        </span>
        ${nav(params, state, send)}
        ${mailbox(params, state, send)}
      </main>
    `
  }
}
