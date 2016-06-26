const history = require('sheet-router/history')
const sheetRouter = require('sheet-router')
const document = require('global/document')
const href = require('sheet-router/href')
const hash = require('sheet-router/hash')
const hashMatch = require('hash-match')
const barracks = require('barracks')
const assert = require('assert')
const xtend = require('xtend')
const yo = require('yo-yo')

module.exports = choo

// framework for creating sturdy web applications
// null -> fn
function choo (opts) {
  opts = opts || {}

  const _store = barracks(xtend(opts, { onState: render }))
  var _rootNode = null
  var _router = null

  start.toString = toString
  start.router = router
  start.model = model
  start.start = start

  return start

  // render the application to a string
  // (str, obj) -> str
  function toString (route, serverState) {
    serverState = serverState || {}
    assert.equal(typeof route, 'string', 'choo.app.toString: route must be a string')
    assert.equal(typeof serverState, 'object', 'choo.app.toString: serverState must be an object')
    _store.start({ noSubscriptions: true, noReducers: true, noEffects: true })
    const state = _store.state({ state: serverState })
    const tree = _router(route, state, function () {
      assert.fail('choo: send() cannot be called from Node')
    })
    return tree.toString()
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
    const send = createSend('view', true)
    const state = _store.state()

    if (!selector) {
      const tree = _router(state.app.location, state, send)
      _rootNode = tree
      return tree
    } else {
      document.addEventListener('DOMContentLoaded', function (event) {
        const oldTree = document.querySelector(selector)
        assert.ok(oldTree, 'could not query selector: ' + selector)
        const newTree = _router(state.app.location, state, send)
        _rootNode = yo.update(oldTree, newTree)
      })
    }
  }

  // update the DOM after every state mutation
  // (obj, obj, obj, str, fn) -> null
  function render (action, state, prev, name, createSend) {
    if (opts.onState) opts.onState(action, state, prev, name, createSend)
    if (state === prev) return

    // note(yw): only here till sheet-router supports custom constructors
    const send = createSend('view', true)
    const newTree = _router(state.app.location, state, send, prev)
    _rootNode = yo.update(_rootNode, newTree)
  }

  // register all routes on the router
  // (str?, [fn|[fn]]) -> obj
  function router (defaultRoute, cb) {
    _router = sheetRouter(defaultRoute, cb)
    return _router
  }

  // create a new model
  // (str?, obj) -> null
  function model (model) {
    _store.model(model)
  }
}

// initial application state model
// obj -> obj
function appInit (opts) {
  const loc = document.location
  const state = { location: (opts.hash) ? hashMatch(loc.hash) : loc.href }
  const reducers = {
    location: function setLocation (action, state) {
      return { location: action.location.replace(/#.*/, '') }
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
    if (opts.history !== false) pushLocationSub(history, 'setLocation', subs)
    if (opts.href !== false) pushLocationSub(href, 'handleHref', subs)
  }

  return {
    namespace: 'app',
    subscriptions: subs,
    reducers: reducers,
    state: state
  }

  // create a new subscription that modifies
  // 'app:location' and push it to be loaded
  // (fn, obj) -> null
  function pushLocationSub (cb, key, model) {
    model[key] = function (send, done) {
      cb(function navigate (href) {
        send('app:location', { location: href }, done)
      })
    }
  }
}
