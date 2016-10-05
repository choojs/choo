const createLocation = require('sheet-router/create-location')
const onHistoryChange = require('sheet-router/history')
const sheetRouter = require('sheet-router')
const onHref = require('sheet-router/href')
const walk = require('sheet-router/walk')
const mutate = require('xtend/mutable')
const barracks = require('barracks')
const nanoraf = require('nanoraf')
const assert = require('assert')
const xtend = require('xtend')
const yo = require('yo-yo')

module.exports = choo

// framework for creating sturdy web applications
// null -> fn
function choo (opts) {
  opts = opts || {}

  const _store = start._store = barracks()
  var _router = start._router = null
  var _routerOpts = null
  var _rootNode = null
  var _routes = null
  var _frame = null

  _store.use({ onStateChange: render })
  _store.use(opts)

  start.toString = toString
  start.router = router
  start.model = model
  start.start = start
  start.use = use

  return start

  // render the application to a string
  // (str, obj) -> str
  function toString (route, serverState) {
    serverState = serverState || {}
    assert.equal(typeof route, 'string', 'choo.app.toString: route must be a string')
    assert.equal(typeof serverState, 'object', 'choo.app.toString: serverState must be an object')
    _store.start({ subscriptions: false, reducers: false, effects: false })

    const state = _store.state({ state: serverState })
    const router = createRouter(_routerOpts, _routes, createSend)
    const tree = router(route, state)
    return tree.outerHTML || tree.toString()

    function createSend () {
      return function send () {
        assert.ok(false, 'choo: send() cannot be called from Node')
      }
    }
  }

  // start the application
  // (str?, obj?) -> DOMNode
  function start () {
    _store.model(createLocationModel(opts))
    const createSend = _store.start(opts)
    _router = start._router = createRouter(_routerOpts, _routes, createSend)
    const state = _store.state({state: {}})

    const tree = _router(state.location.pathname, state)
    _rootNode = tree
    return tree
  }

  // update the DOM after every state mutation
  // (obj, obj, obj, str, fn) -> null
  function render (state, data, prev, name, createSend) {
    if (!_frame) {
      _frame = nanoraf(function (state, prev) {
        const newTree = _router(state.location.pathname, state, prev)
        _rootNode = yo.update(_rootNode, newTree)
      })
    }
    _frame(state, prev)
  }

  // register all routes on the router
  // (str?, [fn|[fn]]) -> obj
  function router (defaultRoute, routes) {
    _routerOpts = defaultRoute
    _routes = routes
  }

  // create a new model
  // (str?, obj) -> null
  function model (model) {
    _store.model(model)
  }

  // register a plugin
  // (obj) -> null
  function use (hooks) {
    assert.equal(typeof hooks, 'object', 'choo.use: hooks should be an object')
    _store.use(hooks)
  }

  // create a new router with a custom `createRoute()` function
  // (str?, obj) -> null
  function createRouter (routerOpts, routes, createSend) {
    var prev = {}
    if (!routes) {
      routes = routerOpts
      routerOpts = {}
    }
    routerOpts = mutate({ thunk: 'match' }, routerOpts)
    const router = sheetRouter(routerOpts, routes)
    walk(router, wrap)

    return router

    function wrap (route, handler) {
      const send = createSend('view: ' + route, true)
      return function chooWrap (params) {
        return function (state) {
          const nwPrev = prev
          const nwState = prev = xtend(state, { params: params })
          if (opts.freeze !== false) Object.freeze(nwState)
          return handler(nwState, nwPrev, send)
        }
      }
    }
  }
}

// application location model
// obj -> obj
function createLocationModel (opts) {
  return {
    namespace: 'location',
    state: createLocation(),
    subscriptions: createSubscriptions(opts),
    effects: { set: setLocation },
    reducers: { update: updateLocation }
  }

  function updateLocation (location, state) {
    return location
  }

  // set a new location e.g. "/foo/bar#baz?beep=boop"
  // (str, obj, fn, fn) -> null
  function setLocation (patch, state, send, done) {
    const newLocation = createLocation(state, patch)
    if (opts.history !== false && newLocation.href !== state.href) {
      window.history.pushState({}, null, newLocation.href)
    }
    send('location:update', newLocation, done)
  }

  function createSubscriptions (opts) {
    const subs = {}

    if (opts.history !== false) {
      subs.handleHistory = function (send, done) {
        onHistoryChange(function navigate (pathname) {
          send('location:set', { pathname: pathname }, done)
        })
      }
    }

    if (opts.href !== false) {
      subs.handleHref = function (send, done) {
        onHref(function navigate (pathname) {
          send('location:set', { pathname: pathname }, done)
        })
      }
    }

    return subs
  }
}
