var html = require('bel') // cannot require choo/html because it's a nested repo

var Header = require('../components/header')
var Footer = require('../components/footer')
var Todos = require('../components/todos')
var Info = require('../components/info')

module.exports = mainView

function mainView (state, emit, render) {
  return html`
    <body>
      <section class="todoapp">
        ${render(Header)}
        ${render(Todos)}
        ${render(Footer)}
      </section>
      ${render(Info)}
    </body>
  `
}
