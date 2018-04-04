// var split = require('split-require')
var css = require('sheetify')
var choo = require('../')
var html = require('choo/html')

css('todomvc-common/base.css')
css('todomvc-app-css/index.css')

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}
app.use(require('./stores/todos'))

app.route('/', require('./views/main'))
app.route('#active', require('./views/main'))
app.route('#completed', require('./views/main'))
app.route('*', require('./views/main'))

app.experimentalAsyncRoute('/async', () => Promise.resolve(function (state, emit) {
  return html`
    <body>
      Async rendering.
    </body>
  `
}))

module.exports = app.mount('body')
