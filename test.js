var tape = require('tape')

var html = require('./html')
var raw = require('./html/raw')
var choo = require('./')

tape('should render on the server', function (t) {
  var app = choo()
  app.route('/', function (state, emit) {
    var strong = '<strong>Hello filthy planet</strong>'
    return html`
      <p>${raw(strong)}</p>
    `
  })
  var res = app.toString('/')
  var exp = '<p><strong>Hello filthy planet</strong></p>'
  t.equal(res.toString().trim(), exp, 'result was OK')
  t.end()
})

tape('should render async route', function (t) {
  var app = choo()
  app.route('/', function (state, emit) {
    return new Promise(function (resolve) {
      var strong = '<strong>Hello filthy planet</strong>'
      resolve(html`<p>${raw(strong)}</p>`)
    })
  })
  app.toString('/').then(function (res) {
    var exp = '<p><strong>Hello filthy planet</strong></p>'
    t.equal(res.trim(), exp, 'result was OK')
    t.end()
  })
})
