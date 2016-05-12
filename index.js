const history = require('sheet-router/history')
const sheetRouter = require('sheet-router')
const document = require('global/document')
const href = require('sheet-router/href')
const sendAction = require('send-action')
const xtend = require('xtend')
const yo = require('yo-yo')

choo.view = yo
module.exports = choo

// A framework for creating sturdy web applications
// null -> fn
function choo (opts) {
  opts = opts || {}
  const name = opts.name || 'choo'
  var _router = null
  var _models = [ appInit() ]

  start.router = router
  start.model = model
  start.start = start

  return start

  // start the application
  // null -> DOMNode
  function start () {
    const events = bootstrap(_models)
    const send = sendAction({
      onaction: events.modifyState,
      onchange: onchange,
      state: events.state
    })

    if (opts.href !== false) {
      href(function (href) {
        send('location', { location: href })
      })
    }

    if (opts.history !== false) {
      history(function (href) {
        send('location', { location: href })
      })
    }

    const rootId = name + '-root'
    const tree = _router(send.state().location, send.state(), send)
    tree.setAttribute('id', rootId)
    return tree

    // update on every change
    function onchange (action, state) {
      const oldTree = document.querySelector('#' + rootId)
      const newTree = _router(state.location, state, send)
      newTree.setAttribute('id', rootId)
      yo.update(oldTree, newTree)
    }
  }

  // register all routes
  // [obj|fn] -> null
  function router (cb) {
    _router = sheetRouter(cb)
  }

  // create a new model
  // (str?, obj) -> null
  function model (name, model) {
    if (!model) model = name
    if (typeof name === 'string') model.name = name
    _models.push(model)
  }
}

// initial application state model
// null -> obj
function appInit () {
  return {
    state: {
      location: document.location.href
    },
    reducers: {
      location: setLocation
    }
  }

  // handle href links
  function setLocation (action, state) {
    const location = action.location.replace(/#.*/, '')
    return xtend(state, { location: location })
  }
}

function bootstrap (events) {
  const initialState = {}
  const reducers = {}
  const effects = {}

  events.forEach(function (model) {
    if (model.state) apply(model.name, model.state, initialState)
    if (model.reducers) apply(model.name, model.reducers, reducers)
    if (model.effects) apply(model.name, model.effects, effects)
  })

  return {
    modifyState: modifyState,
    state: initialState
  }

  function modifyState (action, state, send) {
    var _reducers = false
    var _effects = false
    var newState = null

    if (reducers[action.type]) {
      newState = xtend(state, reducers[action.type](action, state))
      _reducers = true
    }

    if (effects[action.type]) {
      effects[action.type](action, state, send)
      newState = newState || state
      _effects = true
    }

    if (!_reducers && !_effects) {
      throw new Error('Could not find action ' + action.type)
    }

    return newState
  }
}

// compose an object conditionally
// (str, obj, obj) -> null
function apply (name, source, target) {
  Object.keys(source).forEach(function (key) {
    if (name) target[name + ':' + key] = source[key]
    else target[key] = source[key]
  })
}
