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

tape('should expose a public API', function (t) {
  var app = choo()

  t.equal(typeof app.route, 'function', 'app.route prototype method exists')
  t.equal(typeof app.toString, 'function', 'app.toString prototype method exists')
  t.equal(typeof app.start, 'function', 'app.start prototype method exists')
  t.equal(typeof app.mount, 'function', 'app.mount prototype method exists')
  t.equal(typeof app.emitter, 'object', 'app.emitter prototype method exists')

  t.equal(typeof app.emit, 'function', 'app.emit instance method exists')
  t.equal(typeof app.router, 'object', 'app.router instance object exists')
  t.equal(typeof app.state, 'object', 'app.state instance object exists')

  t.end()
})

tape('should enable history, href, and hash by defaut', function (t) {
  var app = choo()
  t.true(app._historyEnabled, 'history enabled')
  t.true(app._hrefEnabled, 'href enabled')
  t.true(app._hashEnabled, 'hash enabled')
  t.end()
})

tape('should pass state and emit to route handler', function (t) {
  t.plan(2)
  var app = choo()
  app.route('/', function (state, emit) {
    t.equal(typeof state, 'object', 'state is an object')
    t.equal(typeof emit, 'function', 'emit is a function')
    return html`<div></div>`
  })
  app.toString('/')
  t.end()
})

// built-in state

tape('state should include events', function (t) {
  t.plan(2)
  var app = choo()
  app.route('/', function (state, emit) {
    t.ok(state.hasOwnProperty('events'), 'state has event property')
    t.ok(Object.keys(state.events).length > 0, 'events object has keys')
    return html`<div></div>`
  })
  app.toString('/')
  t.end()
})

tape('state should include params', function (t) {
  t.plan(4)
  var app = choo()
  app.route('/:resource/:id/*', function (state, emit) {
    t.ok(state.hasOwnProperty('params'), 'state has params property')
    t.equal(state.params.resource, 'users', 'resources param is users')
    t.equal(state.params.id, '1', 'id param is 1')
    t.equal(state.params.wildcard, 'docs/foo.txt', 'wildcard captures what remains')
    return html`<div></div>`
  })
  app.toString('/users/1/docs/foo.txt')
  t.end()
})

tape('state should include query', function (t) {
  t.plan(2)
  var app = choo()
  app.route('/', function (state, emit) {
    t.ok(state.hasOwnProperty('query'), 'state has query property')
    t.equal(state.query.page, '2', 'page querystring is 2')
    return html`<div></div>`
  })
  app.toString('/?page=2')
  t.end()
})

tape('state should include href', function (t) {
  t.plan(2)
  var app = choo()
  app.route('/:resource/:id', function (state, emit) {
    t.ok(state.hasOwnProperty('href'), 'state has href property')
    t.equal(state.href, '/users/1', 'href is users/1')
    return html`<div></div>`
  })
  app.toString('/users/1?page=2') // should ignore query
  t.end()
})

// TODO: Implement this using jsdom, as this only works when window is present
tape.skip('state should include title', function (t) {})
