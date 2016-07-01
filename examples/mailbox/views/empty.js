const html = require('../../../html')

const empty = require('../elements/empty-mailbox')
const pathname = require('../elements/pathname')
const nav = require('../elements/nav')

module.exports = function (state, prev, send) {
  return html`
    <main class="mw5 mw7-ns center cf">
      ${pathname(state, prev, send)}
      ${nav(state, prev, send)}
      ${empty(state, prev, send)}
    </main>
  `
}
