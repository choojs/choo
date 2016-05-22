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
function choo () {
  const _models = []
  var _router = null

  start.toString = toString
  start.router = router
  start.model = model
  start.start = start

  return start

  // render the application to a string
  function toString (route, state) {
    const initialState = {}

    _models.forEach(function (model) {
      if (model.state) apply(model.name, model.state, initialState)
    })

    const tree = _router(route, xtend(initialState, state), function () {
      throw new Error('send() cannot be called on the server')
    })

    return tree.toString()
  }

  // start the application
  // obj -> DOMNode
  function start (opts) {
    opts = opts || {}
    const name = opts.name || 'choo'
    const initialState = {}
    const reducers = {}
    const effects = {}

    _models.push(appInit(opts))
    _models.forEach(function (model) {
      if (model.state) apply(model.namespace, model.state, initialState)
      if (model.reducers) apply(model.namespace, model.reducers, reducers)
      if (model.effects) apply(model.namespace, model.effects, effects)
    })

    const send = sendAction({
      onaction: handleAction,
      onchange: onchange,
      state: initialState
    })

    _models.forEach(function (model) {
      if (model.subscriptions) {
        model.subscriptions.forEach(function (sub) {
          sub(send)
        })
      }
    })

    const rootId = name + '-root'
    const tree = _router(send.state().app.location, send.state(), send)
    tree.setAttribute('id', rootId)
    return tree

    function handleAction (action, state, send) {
      var _reducers = false
      var _effects = false
      var newState = null

      if (/:/.test(action.type)) {
        const arr = action.type.split(':')
        var ns = arr[0]
        action.type = arr[1]
      }

      const nsReducers = ns ? reducers[ns] : reducers
      if (nsReducers && nsReducers[action.type]) {
        if (ns) {
          state[ns] = reducers[ns][action.type](action, state[ns])
          newState = state
        } else {
          newState = xtend(state, reducers[action.type](action, state))
        }
        _reducers = true
      }

      const nsEffects = ns ? effects[ns] : effects
      if (nsEffects && nsEffects[action.type]) {
        nsEffects[action.type](action, newState || state)
        _effects = true
      }

      if (!_reducers && !_effects) {
        throw new Error('Could not find action ' + action.type)
      }

      return newState || state
    }

    // update on every change
    function onchange (action, state) {
      const oldTree = document.querySelector('#' + rootId)
      const newTree = _router(state.app.location, state, send)
      newTree.setAttribute('id', rootId)
      yo.update(oldTree, newTree)
    }
  }

  // register all routes
  // [obj|fn] -> null
  function router (cb) {
    _router = sheetRouter(cb)
    return _router
  }

  // create a new model
  // (str?, obj) -> null
  function model (model) {
    _models.push(model)
  }
}

// initial application state model
// obj -> obj
function appInit (opts) {
  const model = {
    namespace: 'app',
    state: { location: document.location.href },
    reducers: { location: setLocation },
    subscriptions: []
  }

  if (opts.href !== false) {
    model.subscriptions.push(function (send) {
      href(function (href) {
        send('app:location', { location: href })
      })
    })
  }

  if (opts.history !== false) {
    model.subscriptions.push(function (send) {
      history(function (href) {
        send('app:location', { location: href })
      })
    })
  }

  return model

  // handle href links
  function setLocation (action, state) {
    return { location: action.location.replace(/#.*/, '') }
  }
}

// compose an object conditionally
// (str, obj, obj) -> null
function apply (name, source, target) {
  Object.keys(source).forEach(function (key) {
    if (name) {
      if (!target[name]) target[name] = {}
      target[name][key] = source[key]
      target[name][key].namespace = name
    } else target[key] = source[key]
  })
}
