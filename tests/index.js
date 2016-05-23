const tape = require('tape')
const choo = require('../')

tape('should render on the server', function (t) {
  t.test('should render a static response', function (t) {
    t.plan(1)

    const app = choo()
    app.router((route) => [
      route('/', () => choo.view`<h1>Hello Tokyo!</h1>`)
    ])

    const html = app.toString('/')
    const expected = '<h1>Hello Tokyo!</h1>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('should accept a state object', function (t) {
    t.plan(1)

    const app = choo()
    app.router((route) => [
      route('/', function (params, state) {
        return choo.view`<h1>meow meow ${state.message}</h1>`
      })
    ])

    const html = app.toString('/', { message: 'nyan!' })
    const expected = '<h1>meow meow nyan!</h1>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('should extend flat existing models', function (t) {
    t.plan(1)

    const app = choo()
    app.model({ state: { bin: 'baz', beep: 'boop' } })
    app.router((route) => [
      route('/', function (params, state) {
        return choo.view`<h1>${state.foo} ${state.bin} ${state.beep}</h1>`
      })
    ])

    const state = { foo: 'bar!', beep: 'beep' }
    const html = app.toString('/', state)
    const expected = '<h1>bar! baz beep</h1>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('should extend namespaced existing models', function (t) {
    t.plan(1)

    const app = choo()
    app.model({
      namespace: 'hello',
      state: { bin: 'baz', beep: 'boop' }
    })
    app.router((route) => [
      route('/', function (params, state) {
        return choo.view`
          <h1>${state.hello.foo} ${state.hello.bin} ${state.hello.beep}</h1>
        `
      })
    ])

    const state = {
      hello: {
        foo: 'bar!',
        beep: 'beep'
      }
    }
    const html = app.toString('/', state)
    const expected = '<h1>bar! baz beep</h1>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('should throw if called without route', function (t) {
    t.plan(1)

    const app = choo()
    app.router((route) => [
      route('/', function (params, state, send) {
        send('hey!')
      })
    ])

    t.throws(app.toString.bind(null), /route must be a string/)
  })

  t.test('should throw if calling send()', function (t) {
    t.plan(1)

    const app = choo()
    app.router((route) => [
      route('/', function (params, state, send) {
        send('hey!')
      })
    ])

    const msg = /send\(\) cannot be called on the server/
    t.throws(app.toString.bind(null, '/', { message: 'nyan!' }), msg)
  })
})
