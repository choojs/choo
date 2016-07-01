const html = require('../../../html')

const emailList = require('../elements/email-list')
const pathname = require('../elements/pathname')
const email = require('../elements/email')
const nav = require('../elements/nav')

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
