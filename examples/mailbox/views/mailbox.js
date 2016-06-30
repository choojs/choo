const html = require('../../../html')

const emailList = require('../elements/email-list')
const pathname = require('../elements/pathname')
const nav = require('../elements/nav')

module.exports = function (params, state, send) {
  return html`
    <main class="mw5 mw7-ns center cf">
      ${pathname(params, state, send)}
      ${nav(params, state, send)}
      <section class="fl mt4 w-80 db">
        ${emailList(params, state, send)}
      </section>
    </main>
  `
}
