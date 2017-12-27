var scrollToAnchor = require('scroll-to-anchor')
var documentReady = require('document-ready')
var nanolocation = require('nanolocation')
var nanotiming = require('nanotiming')
var nanorouter = require('nanorouter')
var nanomorph = require('nanomorph')
var nanoquery = require('nanoquery')
var nanohref = require('nanohref')
var nanoraf = require('nanoraf')
var nanobus = require('nanobus')
var assert = require('assert')
var xtend = require('xtend')

module.exports = Choo

var HISTORY_OBJECT = {}

function Choo (opts) {
  if (!(this instanceof Choo)) return new Choo(opts)
  opts = opts || {}

  assert.equal(typeof opts, 'object', 'choo: opts should be type object')

  var self = this

  // define events used by choo
  this._events = {
    DOMCONTENTLOADED: 'DOMContentLoaded',
    DOMTITLECHANGE: 'DOMTitleChange',
    REPLACESTATE: 'replaceState',
    PUSHSTATE: 'pushState',
    NAVIGATE: 'navigate',
    POPSTATE: 'popState',
    RENDER: 'render'
  }

  // properties for internal use only
  this._historyEnabled = opts.history === undefined ? true : opts.history
  this._hrefEnabled = opts.href === undefined ? true : opts.href
  this._hasWindow = typeof window !== 'undefined'
  this._createLocation = nanolocation
  this._loaded = false
  this._tree = null

  // properties that are part of the API
  this.router = nanorouter()
  this.emitter = nanobus('choo.emit')
  this.emit = this.emitter.emit.bind(this.emitter)

  var events = { events: this._events }
  if (this._hasWindow) {
    this.state = window.initialState
      ? xtend(window.initialState, events)
      : events
    delete window.initialState
  } else {
    this.state = events
  }

  // listen for title changes; available even when calling .toString()
  if (this._hasWindow) this.state.title = document.title
  this.emitter.prependListener(this._events.DOMTITLECHANGE, function (title) {
    assert.equal(typeof title, 'string', 'events.DOMTitleChange: title should be type string')
    self.state.title = title
    if (self._hasWindow) document.title = title
  })
}

Choo.prototype.route = function (route, handler) {
  assert.equal(typeof route, 'string', 'choo.route: route should be type string')
  assert.equal(typeof handler, 'function', 'choo.handler: route should be type function')
  this.router.on(route, handler)
}

Choo.prototype.use = function (cb) {
  assert.equal(typeof cb, 'function', 'choo.use: cb should be type function')
  var msg = 'choo.use'
  msg = cb.storeName ? msg + '(' + cb.storeName + ')' : msg
  var endTiming = nanotiming(msg)
  cb(this.state, this.emitter, this)
  endTiming()
}

Choo.prototype.start = function () {
  assert.equal(typeof window, 'object', 'choo.start: window was not found. .start() must be called in a browser, use .toString() if running in Node')

  var self = this
  if (this._historyEnabled) {
    this.emitter.prependListener(this._events.NAVIGATE, function () {
      self._matchRoute()
      if (self._loaded) {
        self.emitter.emit(self._events.RENDER)
        setTimeout(scrollToAnchor.bind(null, window.location.hash), 0)
      }
    })

    this.emitter.prependListener(this._events.POPSTATE, function () {
      self.emitter.emit(self._events.NAVIGATE)
    })

    this.emitter.prependListener(this._events.PUSHSTATE, function (href) {
      assert.equal(typeof href, 'string', 'events.pushState: href should be type string')
      window.history.pushState(HISTORY_OBJECT, null, href)
      self.emitter.emit(self._events.NAVIGATE)
    })

    this.emitter.prependListener(this._events.REPLACESTATE, function (href) {
      assert.equal(typeof href, 'string', 'events.replaceState: href should be type string')
      window.history.replaceState(HISTORY_OBJECT, null, href)
      self.emitter.emit(self._events.NAVIGATE)
    })

    window.onpopstate = function () {
      self.emitter.emit(self._events.POPSTATE)
    }

    if (self._hrefEnabled) {
      nanohref(function (location) {
        var href = location.href
        var currHref = window.location.href
        if (href === currHref) return
        self.emitter.emit(self._events.PUSHSTATE, href)
      })
    }
  }

  this._matchRoute()
  this._tree = this._prerender(this.state)
  assert.ok(this._tree, 'choo.start: no valid DOM node returned for location ' + this.state.href)

  this.emitter.prependListener(self._events.RENDER, nanoraf(function () {
    var renderTiming = nanotiming('choo.render')
    var newTree = self._prerender(self.state)
    assert.ok(newTree, 'choo.render: no valid DOM node returned for location ' + self.state.href)

    assert.equal(self._tree.nodeName, newTree.nodeName, 'choo.render: The target node <' +
      self._tree.nodeName.toLowerCase() + '> is not the same type as the new node <' +
      newTree.nodeName.toLowerCase() + '>.')

    var morphTiming = nanotiming('choo.morph')
    nanomorph(self._tree, newTree)
    morphTiming()

    renderTiming()
  }))

  documentReady(function () {
    self.emitter.emit(self._events.DOMCONTENTLOADED)
    self._loaded = true
  })

  return this._tree
}

Choo.prototype.mount = function mount (selector) {
  assert.equal(typeof window, 'object', 'choo.mount: window was not found. .mount() must be called in a browser, use .toString() if running in Node')
  assert.ok(typeof selector === 'string' || typeof selector === 'object', 'choo.mount: selector should be type String or HTMLElement')

  var self = this

  documentReady(function () {
    var renderTiming = nanotiming('choo.render')
    var newTree = self.start()
    if (typeof selector === 'string') {
      self._tree = document.querySelector(selector)
    } else {
      self._tree = selector
    }

    assert.ok(self._tree, 'choo.mount: could not query selector: ' + selector)
    assert.equal(self._tree.nodeName, newTree.nodeName, 'choo.mount: The target node <' +
      self._tree.nodeName.toLowerCase() + '> is not the same type as the new node <' +
      newTree.nodeName.toLowerCase() + '>.')

    var morphTiming = nanotiming('choo.morph')
    nanomorph(self._tree, newTree)
    morphTiming()

    renderTiming()
  })
}

Choo.prototype.toString = function (location, state) {
  this.state = xtend(this.state, state || {})

  assert.notEqual(typeof window, 'object', 'choo.mount: window was found. .toString() must be called in Node, use .start() or .mount() if running in the browser')
  assert.equal(typeof location, 'string', 'choo.toString: location should be type string')
  assert.equal(typeof this.state, 'object', 'choo.toString: state should be type object')

  this._matchRoute(location)
  var html = this._prerender(this.state)
  assert.ok(html, 'choo.toString: no valid value returned for the route ' + location)
  return html.toString()
}

Choo.prototype._matchRoute = function (locationOverride) {
  var location, queryString
  if (locationOverride) {
    location = locationOverride.replace(/\?.+$/, '')
    queryString = locationOverride
  } else {
    location = this._createLocation()
    queryString = window.location.search
  }
  var matched = this.router.match(location)
  this.state.href = location
  this.state.query = nanoquery(queryString)
  this.state.route = matched.route
  this.state.params = matched.params
  this.state._handler = matched.cb
  return this.state
}

Choo.prototype._prerender = function (state) {
  var routeTiming = nanotiming("choo.prerender('" + state.route + "')")
  var res = state._handler(state, this.emit)
  routeTiming()
  return res
}
