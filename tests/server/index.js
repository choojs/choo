const test = require('tape')
const minDocument = require('min-document')
const choo = require('../../')
const view = require('../../html')

test('server', function (t) {
  t.test('renders a static html response', function (t) {
    t.plan(1)

    const app = choo()
    app.router((route) => [
      route('/', () => view`<h1>Hello Tokyo!</h1>`)
    ])

    const html = app.toString('/')
    const expected = '<h1>Hello Tokyo!</h1>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('renders without a real DOM', function (t) {
    t.plan(1)

    const app = choo()
    app.router((route) => [
      route('/', () => minDocument.createElement('div'))
    ])

    const html = app.toString('/')
    const expected = '<div></div>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('receives a state object', function (t) {
    t.plan(1)

    const app = choo()
    app.router((route) => [
      route('/', function (state, prev, send) {
        return view`<h1>meow meow ${state.message}</h1>`
      })
    ])

    const html = app.toString('/', { message: 'nyan!' })
    const expected = '<h1>meow meow nyan!</h1>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('extends flat existing models', function (t) {
    t.plan(1)

    const app = choo()
    app.model({ state: { bin: 'baz', beep: 'boop' } })
    app.router((route) => [
      route('/', function (state, prev, send) {
        return view`<h1>${state.foo} ${state.bin} ${state.beep}</h1>`
      })
    ])

    const state = { foo: 'bar!', beep: 'beep' }
    const html = app.toString('/', state)
    const expected = '<h1>bar! baz beep</h1>'
    t.equal(html, expected, 'strings are equal')
  })

  t.test('extends namespaced existing models', function (t) {
    t.plan(1)

    const app = choo()
    app.model({
      namespace: 'hello',
      state: { bin: 'baz', beep: 'boop' }
    })
    app.router((route) => [
      route('/', function (state, prev, send) {
        return view`
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

  t.test('throws if called without route', function (t) {
    t.plan(1)

    const app = choo()
    app.router((route) => [
      route('/', function (state, prev, send) {
        send('hey!')
      })
    ])

    t.throws(app.toString.bind(null), /route must be a string/)
  })

  t.test('throws when calling send()', function (t) {
    t.plan(1)

    const app = choo()
    app.router((route) => [
      route('/', function (state, prev, send) {
        send('hey!')
      })
    ])

    const msg = /send\(\) cannot be called/
    t.throws(app.toString.bind(null, '/', { message: 'nyan!' }), msg)
  })
})
