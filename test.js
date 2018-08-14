var tape = require('tape')
var h = require('hyperscript')

var html = require('./html')
var raw = require('./html/raw')
var choo = require('./')

tape('should render on the server with nanohtml', function (t) {
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

tape('should enable history and hash by defaut', function (t) {
  var app = choo()
  t.true(app._historyEnabled, 'history enabled')
  t.true(app._hrefEnabled, 'href enabled')
  t.end()
})

tape('router should pass state and emit to view', function (t) {
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

tape('router should support a default route', function (t) {
  t.plan(1)
  var app = choo()
  app.route('*', function (state, emit) {
    t.pass()
    return html`<div></div>`
  })
  app.toString('/random')
  t.end()
})

tape('router should treat hashes as slashes by default', function (t) {
  t.plan(1)
  var app = choo()
  app.route('/account/security', function (state, emit) {
    t.pass()
    return html`<div></div>`
  })
  app.toString('/account#security')
  t.end()
})

tape('router should ignore hashes if hash is disabled', function (t) {
  t.plan(1)
  var app = choo({ hash: false })
  app.route('/account', function (state, emit) {
    t.pass()
    return html`<div></div>`
  })
  app.toString('/account#security')
  t.end()
})

tape('cache should default to 100 instances', function (t) {
  t.plan(1)
  var app = choo()
  app.route('/', function (state, emit) {
    for (var i = 0; i <= 100; i++) state.cache(Component, i)
    state.cache(Component, 0)
    return html`<div></div>`

    function Component (id) {
      if (id < i) t.pass('oldest instance was pruned when exceeding 100')
    }
  })
  app.toString('/')
  t.end()
})

tape('cache option should override number of max instances', function (t) {
  t.plan(1)
  var app = choo({ cache: 1 })
  app.route('/', function (state, emit) {
    var instances = 0
    state.cache(Component, instances)
    state.cache(Component, instances)
    state.cache(Component, 0)
    return html`<div></div>`

    function Component (id) {
      if (id < instances) t.pass('oldest instance was pruned when exceeding 1')
      instances++
    }
  })
  app.toString('/')
  t.end()
})

tape('cache option should override default LRU cache', function (t) {
  t.plan(2)
  var cache = {
    get (Component, id) {
      t.pass('called get')
    },
    set (Component, id) {
      t.pass('called set')
    }
  }
  var app = choo({ cache: cache })
  app.route('/', function (state, emit) {
    state.cache(Component, 'foo')
    return html`<div></div>`
  })
  app.toString('/')
  t.end()

  function Component () {}
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

tape('state should include cache', function (t) {
  t.plan(6)
  var app = choo()
  app.route('/', function (state, emit) {
    t.equal(typeof state.cache, 'function', 'state has cache method')
    var cached = state.cache(Component, 'foo', 'arg')
    t.equal(cached, state.cache(Component, 'foo'), 'consecutive calls return same instance')
    return html`<div></div>`
  })
  app.toString('/')
  t.end()

  function Component (id, state, emit, arg) {
    t.equal(id, 'foo', 'id was prefixed to constructor args')
    t.equal(typeof state, 'object', 'state was prefixed to constructor args')
    t.equal(typeof emit, 'function', 'emit was prefixed to constructor args')
    t.equal(arg, 'arg', 'constructor args were forwarded')
  }
})
