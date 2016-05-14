const choo = require('../../../')

const emailList = require('../elements/email-list')
const pathname = require('../elements/pathname')
const email = require('../elements/email')
const nav = require('../elements/nav')

module.exports = function (params, state, send) {
  return choo.view`
    <main class="mw5 mw7-ns center cf">
      ${pathname(params, state, send)}
      ${nav(params, state, send)}
      <section class="fl mt4 w-80 db">
        ${emailList(params, state, send)}
        ${email(params, state, send)}
      </section>
    </main>
  `
}
