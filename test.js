var tape = require('tape')
var Nanobus = require('nanobus')
require('jsdom-global')(null, { url: 'http://localhost/' })
window.localStorage = window.localStorage || {} // See: yoshuawuyts/nanotiming#7
window.requestAnimationFrame = window.requestAnimationFrame || function (cb) { process.nextTick(cb) }

var html = require('./html')
var choo = require('./')

// TODO: .toString() fails when window is present, which jsdom-global provides
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

tape('route handler is passed state and emit', function (t) {
  t.plan(2)
  var app = choo()
  app.route('/', function (state, emit) {
    t.equal(typeof state, 'object', 'state is an object')
    t.equal(typeof emit, 'function', 'emit is a function')
    return html`<div></div>`
  })
  app.start()
  t.end()
})

// TODO: Need to pause between emits to give handlers a chance to assert
tape.skip('state includes current route', function (t) {
  t.plan(3)
  var app = choo()

  app.route('/', function (state, emit) {
    t.equal(state.route, '/', 'matches empty route')
    return html`<div>empty</div>`
  })
  app.route('/elsewhere', function (state, emit) {
    t.equal(state.route, '/elsewhere', 'matches named route')
    return html`<div>elsewhere</div>`
  })
  app.route('/with/:param', function (state, emit) {
    t.equal(state.route, '/with/:param', 'matches route with param')
    return html`<div>with param</div>`
  })
  app.start()

  var PUSHSTATE = app.state.events.PUSHSTATE
  tickSeries([
    function () { app.emitter.emit(PUSHSTATE, '/elsewhere') },
    function () { app.emitter.emit(PUSHSTATE, '/with/test') },
    function () { t.end() }
  ])
})

// Execute an array of functions in sequential ticks
function tickSeries (fns) {
  const fn = fns.shift()
  process.nextTick(function () {
    fn()
    if (fns.length) {
      tickSeries(fns)
    }
  })
}

tape('use is passed state and emitter', function (t) {
  t.plan(2)
  var app = choo()
  app.use(function (state, emitter) {
    t.equal(typeof state, 'object', 'state is an object')
    t.true(emitter instanceof Nanobus, 'emitter is Nanobus instance')
  })
  t.end()
})

// TODO: jsdom doesn't support changing the search
tape.skip('state includes query', function (t) {
  t.plan(1)
  var app = choo()
  app.route('/', function (state, emit) {
    const expected = { foo: 'bar' }
    t.deepEqual(state.query, expected, 'state includes query')
    return html`<div></div>`
  })
  window.location.search = '?foo=bar'
  app.start()
  t.end()
})
