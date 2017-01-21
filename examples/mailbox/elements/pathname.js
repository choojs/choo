var pathname = require('pathname-match')
var html = require('../../../html')

module.exports = function (state, prev, send) {
  var location = state.location.pathname
  return html`
    <span class="fl mt4 w-100 f4 b">
      URL: ${pathname(location) || '/'}
    </span>
  `
}
