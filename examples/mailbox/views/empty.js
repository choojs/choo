const html = require('../../../html')

const empty = require('../elements/empty-mailbox')
const pathname = require('../elements/pathname')
const nav = require('../elements/nav')

module.exports = function (params, state, send) {
  return html`
    <main class="mw5 mw7-ns center cf">
      ${pathname(params, state, send)}
      ${nav(params, state, send)}
      ${empty(params, state, send)}
    </main>
  `
}
