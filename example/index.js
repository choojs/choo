var css = require('sheetify')
var choo = require('../')

css('todomvc-common/base.css')
css('todomvc-app-css/index.css')

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}
app.use(require('./store'))

app.route('/', require('./view'))
app.route('#active', require('./view'))
app.route('#completed', require('./view'))
app.route('*', require('./view'))

if (module.parent) module.exports = app
else app.mount('body')
