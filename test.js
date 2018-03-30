var tape = require('tape')
var h = require('hyperscript')

var html = require('./html')
var raw = require('./html/raw')
var choo = require('./')

tape('should render on the server with bel', function (t) {
  var app = choo()
  app.route('/', function (state, emit) {
    var strong = '<strong>Hello filthy planet</strong>'
    return html`
      <p>${raw(strong)}</p>
    `
  })
  var res = app.toString('/')
  var exp = '<p><strong>Hello filthy planet</strong></p>'
  t.equal(res.toString().trim(), exp, 'result was OK')
  t.end()
})

tape('should render async on the server with bel', function (t) {
  var app = choo()
  app.route('/', function (state, emit) {
    var strong = '<strong>Hello filthy planet</strong>'
    return html`
      <p>${Promise.resolve(raw(strong))}</p>
    `
  })
  app.toString('/').then(function (res) {
    var exp = '<p><strong>Hello filthy planet</strong></p>'
    t.equal(res.toString().trim(), exp, 'result was OK')
    t.end()
  })
})

tape('should render composition of sync and async on the server', function (t) {
  var app = choo()
  var async = function (state, emit) {
    return new Promise(function (resolve) {
      resolve(html`<p>Hello!</p>`)
    })
  }
  var hoc = function (child) {
    return function (state, emit) {
      return html`<div>${child(state, emit)}</div>`
    }
  }
  var component = hoc(async)
  app.route('/', function (state, emit) {
    return html`<div>${component(state, emit)}</div>`
  })
  app.toString('/').then(function (res) {
    var exp = '<div><div><p>Hello!</p></div></div>'
    t.equal(res.toString().trim(), exp, 'result was OK')
    t.end()
  })
})

tape('should render async with custom promise resolution strategy', function (t) {
  t.plan(5)
  var order = 3
  var app = choo()
  var component1 = function (state, emit) {
    return new Promise(function (resolve) { resolve(html`<p>hEllo!</p>`) })
  }
  var component2 = function (state, emit) {
    return new Promise(function (resolve) { resolve(html`<p>heLlo!</p>`) })
  }
  var component3 = function (state, emit) {
    return new Promise(function (resolve) { resolve(html`<p>helLo!</p>`) })
  }
  app.route('/', function (state, emit) {
    // resolve component3 first then component2 and then component1
    var pC3 = component3(state, emit).then(function (result) { t.equal(order, 3); order--; return result })
    var pC2 = pC3.then(function () { return component2(state, emit).then(function (result) { t.equal(order, 2); order--; return result }) })
    var pC1 = pC2.then(function () { return component1(state, emit).then(function (result) { t.equal(order, 1); order--; return result }) })
    return html`
      <div>
        ${pC1}
        ${pC2}
        ${pC3}
        ${'HELLO'}
      </div>
    `
  })
  app.toString('/').then(function (res) {
    var exp = '<div>\n        <p>hEllo!</p>\n        <p>heLlo!</p>\n        <p>helLo!</p>\n        HELLO\n      </div>'
    t.equal(order, 0, 'order was OK')
    t.equal(res.toString().trim(), exp, 'result was OK')
    t.end()
  })
})

tape('should render on the server with hyperscript', function (t) {
  var app = choo()
  app.route('/', function (state, emit) {
    return h('p', h('strong', 'Hello filthy planet'))
  })
  var res = app.toString('/')
  var exp = '<p><strong>Hello filthy planet</strong></p>'
  t.equal(res.toString().trim(), exp, 'result was OK')
  t.end()
})

tape('should expose a public API', function (t) {
  var app = choo()

  t.equal(typeof app.route, 'function', 'app.route prototype method exists')
  t.equal(typeof app.toString, 'function', 'app.toString prototype method exists')
  t.equal(typeof app.start, 'function', 'app.start prototype method exists')
  t.equal(typeof app.mount, 'function', 'app.mount prototype method exists')
  t.equal(typeof app.emitter, 'object', 'app.emitter prototype method exists')

  t.equal(typeof app.emit, 'function', 'app.emit instance method exists')
  t.equal(typeof app.router, 'object', 'app.router instance object exists')
  t.equal(typeof app.state, 'object', 'app.state instance object exists')

  t.end()
})
