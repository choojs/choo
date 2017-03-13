var documentReady = require('document-ready')
var nanorouter = require('nanorouter')
var nanomount = require('nanomount')
var nanomorph = require('nanomorph')
var nanoraf = require('nanoraf')
var nanobus = require('nanobus')
var assert = require('assert')

var onHistoryChange = require('./lib/history')
var onHref = require('./lib/href')

module.exports = Framework

function Framework (opts) {
  opts = opts || {}

  var routerOpts = {
    default: opts.defaultRoute || '/404',
    curry: true
  }

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
    tree = router(createLocation(), state, emit)
    rerender = nanoraf(function () {
      var newTree = router(createLocation(), state, emit)
      tree = nanomorph(tree, newTree)
    })

    bus.on('render', rerender)

    if (opts.history !== false) {
      onHistoryChange(function (href) {
        bus.emit('pushState', window.location.href)
        scrollIntoView()
      })

      if (opts.href !== false) {
        onHref(function (location) {
          var href = location.href
          var currHref = window.location.href
          if (href === currHref) return
          window.history.pushState({}, null, href)
          bus.emit('pushState', window.location.href)
          bus.emit('render')
          scrollIntoView()
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
      assert.ok(root, 'could not query selector: ' + selector)
      nanomount(root, newTree)
      tree = root
    })
  }

  function toString (location, state) {
    state = state || {}
    return router(location, state)
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
