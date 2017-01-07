var html = require('../../../html')

var empty = require('../elements/empty-mailbox')
var pathname = require('../elements/pathname')
var nav = require('../elements/nav')

module.exports = function (state, prev, send) {
  return html`
    <main class="mw5 mw7-ns center cf">
      ${pathname(state, prev, send)}
      ${nav(state, prev, send)}
      ${empty(state, prev, send)}
    </main>
  `
}
