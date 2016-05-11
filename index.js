// const history = require('sheet-router/history')
const sheetRouter = require('sheet-router')
const document = require('global/document')
// const href = require('sheet-router/href')
const sendAction = require('send-action')
const mutate = require('xtend/mutable')
const xtend = require('xtend')
const yo = require('yo-yo')

choo.view = yo
module.exports = choo

// A framework for creating sturdy web applications
// null -> fn
function choo () {
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
      onaction: events.middleware,
      onchange: onchange,
      state: events.state
    })

    const tree = _router(send.state().location, send.state(), send)
    tree.setAttribute('id', 'choo-root')
    return tree

    // update on every change
    function onchange (action, state) {
      const oldTree = document.querySelector('#choo-root')
      const newTree = _router(state.location, state, send)
      newTree.setAttribute('id', 'choo-root')
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
  const initialState = { }
  const reducers = {}
  const effects = {}

  events.forEach(function (event) {
    const name = event.name
    if (event.state) mutate(initialState, event.state)
    if (event.reducers) {
      Object.keys(event.reducers).forEach(function (key) {
        if (name) {
          reducers[name + ':' + key] = event.reducers[key]
        } else {
          reducers[key] = event.reducers[key]
        }
      })
    }
    if (event.effects) {
      Object.keys(event.effects).forEach(function (key) {
        if (name) {
          effects[name + ':' + key] = event.effects[key]
        } else {
          effects[key] = event.effects[key]
        }
      })
    }
  })

  return {
    middleware: modifyState,
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
