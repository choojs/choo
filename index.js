const history = require('sheet-router/history')
const sheetRouter = require('sheet-router')
const document = require('global/document')
const onReady = require('document-ready')
const href = require('sheet-router/href')
const hash = require('sheet-router/hash')
const hashMatch = require('hash-match')
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
    if (!startOpts && typeof selector !== 'string') {
      startOpts = selector
      selector = null
    }
    startOpts = startOpts || {}

    _store.model(appInit(startOpts))
    const createSend = _store.start(startOpts)
    _router = start._router = createRouter(_defaultRoute, _routes, createSend)
    const state = _store.state({state: {}})

    if (!selector) {
      const tree = _router(state.location.pathname, state)
      _rootNode = tree
      return tree
    } else {
      onReady(function onReady () {
        const oldTree = document.querySelector(selector)
        assert.ok(oldTree, 'could not query selector: ' + selector)
        const newTree = _router(state.location.pathname, state)
        _rootNode = yo.update(oldTree, newTree)
      })
    }
  }

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

  // create a new router with a custom `createRoute()` function
  // (str?, obj, fn?) -> null
  function createRouter (defaultRoute, routes, createSend) {
    var prev = {}
    return sheetRouter(defaultRoute, routes, createRoute)

    function createRoute (routeFn) {
      return function (route, inline, child) {
        if (typeof inline === 'function') {
          inline = wrap(inline, route)
        }
        return routeFn(route, inline, child)
      }

      function wrap (child, route) {
        const send = createSend('view: ' + route, true)
        return function chooWrap (params, state) {
          const nwPrev = prev
          const nwState = prev = xtend(state, { params: params })
          if (opts.freeze !== false) Object.freeze(nwState)
          return child(nwState, nwPrev, send)
        }
      }
    }
  }
}

// initial application state model
// obj -> obj
function appInit (opts) {
  const loc = document.location
  const state = { pathname: (opts.hash) ? hashMatch(loc.hash) : loc.href }
  const reducers = {
    setLocation: function setLocation (data, state) {
      return { pathname: data.location.replace(/#.*/, '') }
    }
  }
  // if hash routing explicitly enabled, subscribe to it
  const subs = {}
  if (opts.hash === true) {
    pushLocationSub(function (navigate) {
      hash(function (fragment) {
        navigate(hashMatch(fragment))
      })
    }, 'handleHash', subs)
  } else {
    if (opts.history !== false) pushLocationSub(history, 'handleHistory', subs)
    if (opts.href !== false) pushLocationSub(href, 'handleHref', subs)
  }

  return {
    namespace: 'location',
    subscriptions: subs,
    reducers: reducers,
    state: state
  }

  // create a new subscription that modifies
  // 'app:location' and push it to be loaded
  // (fn, obj) -> null
  function pushLocationSub (cb, key, model) {
    model[key] = function (send, done) {
      cb(function navigate (pathname) {
        send('location:setLocation', { location: pathname }, done)
      })
    }
  }
}
