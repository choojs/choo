var tape = require('tape')

var html = require('./html')
var choo = require('./')

tape('should render on the server', function (t) {
  var app = choo()
  app.route('/', function (state, emit) {
    return html`
      <p>Hello filthy planet</p>
    `
  })
  var res = app.toString('/')
  var exp = '<p>Hello filthy planet</p>'
  t.equal(res.toString(), exp, 'result was OK')
  t.end()
})
