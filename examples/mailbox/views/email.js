var html = require('../../../html')

var emailList = require('../elements/email-list')
var pathname = require('../elements/pathname')
var email = require('../elements/email')
var nav = require('../elements/nav')

module.exports = function (state, prev, send) {
  return html`
    <main class="mw5 mw7-ns center cf">
      ${pathname(state, prev, send)}
      ${nav(state, prev, send)}
      <section class="fl mt4 w-80 db">
        ${emailList(state, prev, send)}
        ${email(state, prev, send)}
      </section>
    </main>
  `
}
