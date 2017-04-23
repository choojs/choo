var documentReady = require('document-ready')
var nanohistory = require('nanohistory')
var nanorouter = require('nanorouter')
var nanomount = require('nanomount')
var nanomorph = require('nanomorph')
var nanohref = require('nanohref')
var nanoraf = require('nanoraf')
var nanobus = require('nanobus')
var assert = require('assert')

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
  var router = nanorouter(routerOpts)
  var bus = nanobus()
  var rerender = null
  var tree = null
  var state = {}

  return {
    toString: toString,
    use: register,
    mount: mount,
    router: router,
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
    tree = router(createLocation())
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

    bus.prependListener('render', rerender)

    if (opts.history !== false) {
      nanohistory(function (href) {
        bus.emit('pushState')
      })

      bus.prependListener('pushState', function (href) {
        if (href) window.history.pushState({}, null, href)
        bus.emit('render')
        setTimeout(function () {
          scrollIntoView()
        }, 0)
      })

      if (opts.href !== false) {
        nanohref(function (location) {
          var href = location.href
          var currHref = window.location.href
          if (href === currHref) return
          bus.emit('pushState', href)
        })
      }
    }

    documentReady(function () {
      bus.emit('DOMContentLoaded')
    })

    return tree
  }

  function emit (eventName, data) {
    bus.emit(eventName, data)
  }

  function mount (selector) {
    var newTree = start()
    documentReady(function () {
      var root = document.querySelector(selector)
      assert.ok(root, 'choo.mount: could not query selector: ' + selector)
      nanomount(root, newTree)
      tree = root
    })
  }

  function toString (location, _state) {
    state = _state || {}
    var html = router(location)
    assert.equal()
    return html.toString()
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
