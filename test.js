var tape = require('tape')
require('jsdom-global')()
window.localStorage = window.localStorage || {} // See: yoshuawuyts/nanotiming#7

var html = require('./html')
var choo = require('./')

tape.skip('should render on the server', function (t) {
  var app = choo()
  app.route('/', function (state, emit) {
    return html`
      <p>Hello filthy planet</p>
    `
  })
  var res = app.toString('/')
  var exp = '<p>Hello filthy planet</p>'
  t.equal(res, exp, 'result was OK')
  t.end()
})

tape('enables history and href by defaut', function (t) {
  var app = choo()
  t.true(app._historyEnabled, 'history enabled')
  t.true(app._hrefEnabled, 'href enabled')
  t.end()
})

// TODO: I expect nanohref is cancelling because it's node
tape.skip('clicking <a> triggers pushstate', function (t) {
  t.plan(1)
  var app = choo()
  app.route('/', function (state, emit) {
    return html`
      <a href="/elsewhere" onclick=${() => console.log('called yo')}>Elsewhere</a>
    `
  })
  app.use(function (state, emitter) {
    emitter.on('pushState', function () {
      t.pass('pushstate emitted')
    })
  })
  var tree = app.start()
  document.body.appendChild(tree)
  tree.click()
  t.end()
})
