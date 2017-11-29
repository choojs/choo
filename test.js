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

tape('async route should throw on server', function (t) {
  var app = choo()
  app.route('/', async function (state, emit) {
    var strong = '<strong>Hello filthy planet</strong>'
    return html`
      <p>${raw(strong)}</p>
    `
  })
  try {
    var res = app.toString('/')
    t.notOk(res, 'this should not be executed')
  } catch (e) {
    t.ok(e, 'throws expected error')
  }
  t.end()
})
