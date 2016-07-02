const pathname = require('pathname-match')
const html = require('../../../html')

module.exports = function (state, prev, send) {
  const location = state.location.pathname
  return html`
    <span class="fl mt4 w-100 f4 b">
      URL: ${pathname(location) || '/'}
    </span>
  `
}
