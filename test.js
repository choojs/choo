var tape = require('tape')
var h = require('hyperscript')

var html = require('./html')
var raw = require('./html/raw')
var choo = require('./')

tape('should render on the server with bel', function (t) {
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

tape('should render async on the server with bel', function (t) {
  var app = choo()
  app.route('/', function (state, emit) {
    var strong = '<strong>Hello filthy planet</strong>'
    return html`
      <p>${Promise.resolve(raw(strong))}</p>
    `
  })
  app.toString('/').then(function (res) {
    var exp = '<p><strong>Hello filthy planet</strong></p>'
    t.equal(res.toString().trim(), exp, 'result was OK')
    t.end()
  })
})

tape('should render on the server with hyperscript', function (t) {
  var app = choo()
  app.route('/', function (state, emit) {
    return h('p', h('strong', 'Hello filthy planet'))
  })
  var res = app.toString('/')
  var exp = '<p><strong>Hello filthy planet</strong></p>'
  t.equal(res.toString().trim(), exp, 'result was OK')
  t.end()
})
