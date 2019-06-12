var tape = require('tape')
var h = require('hyperscript')

var html = require('../html')
var raw = require('../html/raw')
var choo = require('..')

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

tape('enabling hash routing should treat hashes as slashes', function (t) {
  t.plan(1)
  var app = choo({ hash: true })
  app.route('/account/security', function (state, emit) {
    t.pass()
    return html`<div></div>`
  })
  app.toString('/account#security')
  t.end()
})

tape('router should ignore hashes by default', function (t) {
  t.plan(1)
  var app = choo()
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

tape('state should include location on render', function (t) {
  t.plan(6)
  var app = choo()
  app.route('/:first/:second/*', function (state, emit) {
    var params = { first: 'foo', second: 'bar', wildcard: 'file.txt' }
    t.equal(state.href, '/foo/bar/file.txt', 'state has href')
    t.equal(state.route, ':first/:second/*', 'state has route')
    t.ok(state.hasOwnProperty('params'), 'state has params')
    t.deepEqual(state.params, params, 'params match')
    t.ok(state.hasOwnProperty('query'), 'state has query')
    t.deepEqual(state.query, { bin: 'baz' }, 'query match')
    return html`<div></div>`
  })
  app.toString('/foo/bar/file.txt?bin=baz')
  t.end()
})

tape('state should include location on store init', function (t) {
  t.plan(6)
  var app = choo()
  app.use(store)
  app.route('/:first/:second/*', function (state, emit) {
    return html`<div></div>`
  })
  app.toString('/foo/bar/file.txt?bin=baz')

  function store (state, emit) {
    var params = { first: 'foo', second: 'bar', wildcard: 'file.txt' }
    t.equal(state.href, '/foo/bar/file.txt', 'state has href')
    t.equal(state.route, ':first/:second/*', 'state has route')
    t.ok(state.hasOwnProperty('params'), 'state has params')
    t.deepEqual(state.params, params, 'params match')
    t.ok(state.hasOwnProperty('query'), 'state has query')
    t.deepEqual(state.query, { bin: 'baz' }, 'query match')
  }
})

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

tape('state should not mutate on toString', function (t) {
  t.plan(6)

  var app = choo()
  app.use(store)

  var routes = ['foo', 'bar']
  var states = routes.map(function (route) {
    var state = {}
    app.route(`/${route}`, view)
    app.toString(`/${route}`, state)
    return state
  })

  for (var i = 0, len = routes.length; i < len; i++) {
    t.equal(states[i].test, routes[i], 'store was used')
    t.equal(states[i].title, routes[i], 'title was added to state')
  }

  function store (state, emitter) {
    state.test = null
    emitter.on('test', function (str) {
      t.equal(state.test, null, 'state has been reset')
      state.test = str
    })
  }

  function view (state, emit) {
    emit('test', state.route)
    emit(state.events.DOMTITLECHANGE, state.route)
    return html`<body>Hello ${state.route}</body>`
  }
})
