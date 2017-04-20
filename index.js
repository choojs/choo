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
  if (!(this instanceof Choo)) return new Choo(opts)
  opts = opts || {}

  var routerOpts = {
    default: opts.defaultRoute || '/404',
    curry: true
  }

  // properties for internal use only
  this._historyEnabled = opts.history === undefined ? true : opts.history
  this._timingEnabled = opts.timing === undefined ? true : opts.timing
  this._hrefEnabled = opts.href === undefined ? true : opts.href
  this._hasWindow = typeof window !== 'undefined'
  this._hasPerformance = this._hasWindow && window.performance && window.performance.mark
  this._rerender = null
  this._tree = null

  // properties that are part of the API
  this.router = nanorouter(routerOpts)
  this.emitter = nanobus()
  this.state = {}
}

Choo.prototype.route = function (route, handler) {
  var self = this
  this.router.on(route, function (params) {
    return function () {
      self.state.params = params
      return handler(self.state, function (eventName, data) {
        self.emitter.emit(eventName, data)
      })
    }
  })
}

Choo.prototype.use = function (cb) {
  cb(this.state, this.emitter)
}

Choo.prototype.start = function () {
  var self = this

  this._tree = this.router(this._createLocation())
  this._rerender = nanoraf(function () {
    if (self._hasPerformance && self._timingEnabled) {
      window.performance.mark('choo:renderStart')
    }
    var newTree = self.router(self._createLocation())
    self._tree = nanomorph(self._tree, newTree)
    if (self._hasPerformance && self._timingEnabled) {
      window.performance.mark('choo:renderEnd')
      window.performance.measure('choo:render', 'choo:renderStart', 'choo:renderEnd')
    }
  })

  this.emitter.prependListener('render', this._rerender)

  if (this._historyEnabled) {
    nanohistory(function (href) {
      self.emitter.emit('pushState')
    })

    this.emitter.prependListener('pushState', function (href) {
      if (href) window.history.pushState({}, null, href)
      self.emitter.emit('render')
      setTimeout(function () {
        self._scrollIntoView()
      }, 0)
    })

    if (self._hrefEnabled) {
      nanohref(function (location) {
        var href = location.href
        var currHref = window.location.href
        if (href === currHref) return
        self.emitter.emit('pushState', href)
      })
    }
  }

  documentReady(function () {
    self.emitter.emit('DOMContentLoaded')
  })

  return this._tree
}

Choo.prototype.mount = function mount (selector) {
  var self = this
  var newTree = this.start()
  documentReady(function () {
    var root = document.querySelector(selector)
    assert.ok(root, 'choo.mount: could not query selector: ' + selector)
    nanomount(root, newTree)
    self._tree = root
  })
}

Choo.prototype.toString = function (location, state) {
  this.state = state || {}
  var html = this.router(location)
  return html.toString()
}

Choo.prototype._scrollIntoView = function () {
  var hash = window.location.hash
  if (hash) {
    try {
      var el = document.querySelector(hash)
      if (el) el.scrollIntoView(true)
    } catch (e) {}
  }
}

Choo.prototype._createLocation = function () {
  var pathname = window.location.pathname.replace(/\/$/, '')
  var hash = window.location.hash.replace(/^#/, '/')
  return pathname + hash
}
