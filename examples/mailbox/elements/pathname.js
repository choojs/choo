const pathname = require('pathname-match')
const html = require('../../../html')

module.exports = function (params, state, send) {
  const location = state.app.location
  return html`
    <span class="fl mt4 w-100 f4 b">
      URL: ${pathname(location) || '/'}
    </span>
  `
}
