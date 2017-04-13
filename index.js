var nanorouter = require('nanorouter')
var nanomount = require('nanomount')
var nanomorph = require('nanomorph')
var nanotask = require('nanotask')
var nanoraf = require('nanoraf')
var nanobus = require('nanobus')
var assert = require('assert')

var onHistoryChange = require('./lib/history')
var onHref = require('./lib/href')

module.exports = Choo

function Choo (opts) {
  opts = opts || {}

  var routerOpts = {
    default: opts.defaultRoute || '/404',
    curry: true
  }

  var timingEnabled = opts.timing === undefined ? true : opts.timing
  var hasWindow = typeof window !== 'undefined'
  var hasPerformance = hasWindow && window.performance && window.performance.mark
  var taskQueue = hasWindow ? nanotask() : null
  var router = nanorouter(routerOpts)
  var bus = nanobus()
  var rerender = null
  var tree = null
  var state = {}

  return {
    toString: toString,
    use: register,
    mount: mount,
    route: route,
    start: start
  }

  function route (route, handler) {
    router.on(route, function (params) {
      return function () {
        state.params = params
        return handler(state, emit)
      }
    })
  }

  function register (cb) {
    cb(state, bus)
  }

  function start () {
    if (hasPerformance && timingEnabled) {
      window.performance.mark('choo:renderStart')
    }
    tree = router(createLocation())
    if (hasPerformance && timingEnabled) {
      window.performance.mark('choo:renderEnd')
      window.performance.measure('choo:render', 'choo:renderStart', 'choo:renderEnd')
    }

    rerender = nanoraf(function () {
      if (hasPerformance && timingEnabled) {
        window.performance.mark('choo:renderStart')
      }
      var newTree = router(createLocation())
      tree = nanomorph(tree, newTree)
      if (hasPerformance && timingEnabled) {
        window.performance.mark('choo:renderEnd')
        window.performance.measure('choo:render', 'choo:renderStart', 'choo:renderEnd')
      }
    })

    bus.on('render', rerender)

    if (opts.history !== false) {
      onHistoryChange(function (href) {
        bus.emit('pushState')
      })

      bus.on('pushState', function (href) {
        if (href) window.history.pushState({}, null, href)
        bus.emit('render')
        taskQueue(scrollIntoView)
      })

      if (opts.href !== false) {
        onHref(function (location) {
          var href = location.href
          var currHref = window.location.href
          if (href === currHref) return
          bus.emit('pushState', href)
        })
      }
    }

    onReady(function () {
      bus.emit('DOMContentLoaded')
    })

    return tree
  }

  function emit (eventName, data) {
    bus.emit(eventName, data)
  }

  function mount (root) {
    var newTree = start()
    if (typeof root === 'string') {
      var selector = root
      root = document.querySelector(selector)
      assert.ok(root, 'could not query selector: ' + selector)
    }

    onReady(function () {
      setTimeout(function () {
        if (hasPerformance && timingEnabled) {
          window.performance.mark('choo:mountStart')
        }
        nanomount(root, newTree)
        tree = root
        if (hasPerformance && timingEnabled) {
          window.performance.mark('choo:mountEnd')
          window.performance.measure('choo:mount', 'choo:mountStart', 'choo:mountEnd')
        }
      }, 0)
    })
  }

  function toString (location, _state) {
    state = _state || {}
    var html = router(location)
    assert.equal()
    return html.toString()
  }

  function onReady (cb) {
    var docState = document.readyState
    var onReady = taskQueue(cb)

    if (docState === 'complete' || docState === 'interactive') onReady()
    else document.addEventListener('DOMContentLoaded', onReady)
  }
}

function scrollIntoView () {
  var hash = window.location.hash
  if (hash) {
    try {
      var el = document.querySelector(hash)
      if (el) el.scrollIntoView(true)
    } catch (e) {}
  }
}

function createLocation () {
  var pathname = window.location.pathname.replace(/\/$/, '')
  var hash = window.location.hash.replace(/^#/, '/')
  return pathname + hash
}
