const pathname = require('pathname-match')
const choo = require('../../../')

module.exports = function (params, state, send) {
  const location = state.app.location
  return choo.view`
    <span class="fl mt4 w-100 f4 b">
      URL: ${pathname(location) || '/'}
    </span>
  `
}
