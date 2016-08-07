const sheetRouter = require('sheet-router')
const walk = require('sheet-router/walk')
const barracks = require('barracks')
const nanoraf = require('nanoraf')
const assert = require('assert')
const xtend = require('xtend')
const yo = require('yo-yo')

const createLocationModel = require('./location-model')

module.exports = choo

// framework for creating sturdy web applications
// null -> fn
function choo (opts) {
  opts = opts || {}

  const _store = start._store = barracks()
  var _router = start._router = null
  var _defaultRoute = null
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
    const router = createRouter(_defaultRoute, _routes, createSend)
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
  function start (selector, startOpts) {
    startOpts = startOpts || {}

    _store.model(createLocationModel(startOpts))
    const createSend = _store.start(startOpts)
    _router = start._router = createRouter(_defaultRoute, _routes, createSend)
    const state = _store.state({state: {}})

    const tree = _router(state.location.pathname, state)
    _rootNode = tree
    return tree
  }

  // register all routes on the router
  // (str?, [fn|[fn]]) -> obj
  function router (defaultRoute, routes) {
    _defaultRoute = defaultRoute
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
  //
  // update the DOM after every state mutation
  // (obj, obj, obj, str, fn) -> null
  function render (data, state, prev, name, createSend) {
    if (!_frame) {
      _frame = nanoraf(function (state, prev) {
        const newTree = _router(state.location.pathname, state, prev)
        _rootNode = yo.update(_rootNode, newTree)
      })
    }
    _frame(state, prev)
  }

  // create a new router with a custom `createRoute()` function
  // (str?, obj, fn?) -> null
  function createRouter (defaultRoute, routes, createSend) {
    var prev = {}

    const router = sheetRouter(defaultRoute, routes, { thunk: false })
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

