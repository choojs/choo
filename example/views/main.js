var html = require('bel') // cannot require choo/html because it's a nested repo

var Header = require('../components/header')
var Footer = require('../components/footer')
var Todos = require('../components/todos')
var Info = require('../components/info')

module.exports = mainView

function mainView (state, emit) {
  return html`
    <body>
      <section class="todoapp">
        ${state.cache(Header, 'header').render()}
        ${state.cache(Todos, 'todos').render()}
        ${state.cache(Footer, 'footer').render()}
      </section>
      ${state.cache(Info, 'info').render()}
    </body>
  `
}
