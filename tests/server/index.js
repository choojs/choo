var test = require('tape')
var minDocument = require('min-document')
var choo = require('../../')
var view = require('../../html')

test('server', function (t) {
  t.test('renders a static html response', function (t) {
    t.plan(1)

    var app = choo()
    app.router(['/', () => view`<h1>Hello Tokyo!</h1>`])

    var html = app.toString('/')
    var expected = '<h1>Hello Tokyo!</h1>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('renders without a real DOM', function (t) {
    t.plan(1)

    var app = choo()
    app.router(['/', () => minDocument.createElement('div')])

    var html = app.toString('/')
    var expected = '<div></div>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('receives a state object', function (t) {
    t.plan(1)

    var app = choo()
    app.router(['/', (state, prev, send) => {
      return view`<h1>meow meow ${state.message}</h1>`
    }])

    var html = app.toString('/', { message: 'nyan!' })
    var expected = '<h1>meow meow nyan!</h1>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('extends flat existing models', function (t) {
    t.plan(1)

    var app = choo()
    app.model({ state: { bin: 'baz', beep: 'boop' } })
    app.router(['/', (state, prev, send) => {
      return view`<h1>${state.foo} ${state.bin} ${state.beep}</h1>`
    }])

    var state = { foo: 'bar!', beep: 'beep' }
    var html = app.toString('/', state)
    var expected = '<h1>bar! baz beep</h1>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('extends namespaced existing models', function (t) {
    t.plan(1)

    var app = choo()
    app.model({
      namespace: 'hello',
      state: { bin: 'baz', beep: 'boop' }
    })
    app.router(['/', (state, prev, send) => {
      return view`
        <h1>${state.hello.foo} ${state.hello.bin} ${state.hello.beep}</h1>
      `
    }])

    var state = {
      hello: {
        foo: 'bar!',
        beep: 'beep'
      }
    }
    var html = app.toString('/', state)
    var expected = '<h1>bar! baz beep</h1>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('throws if called without route', function (t) {
    t.plan(1)

    var app = choo()
    app.router(['/', (state, prev, send) => send('hey!')])
    t.throws(app.toString.bind(null), /route must be a string/)
  })

  t.test('throws when calling send()', function (t) {
    t.plan(1)

    var app = choo()
    app.router(['/', (state, prev, send) => send('hey!')])
    var msg = /send\(\) cannot be called/
    t.throws(app.toString.bind(null, '/', { message: 'nyan!' }), msg)
  })
})
