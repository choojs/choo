const test = require('tape')
const choo = require('../../')

test('freeze (default)', function (t) {
  t.plan(2)
  const app = choo()

  app.model({
    state: {
      foo: 'bar'
    }
  })

  app.router(['/', function (state) {
    // Modifying frozen objects can lead to TypeError
    try {
      state.foo = ''
    } catch (e) {
    }
    t.equal(state.foo, 'bar', 'cannot modify property')
    // Modifying frozen objects can lead to TypeError
    try {
      state.bar = 'baz'
    } catch (e) {
    }
    t.equal(state.bar, undefined, 'cannot add property')
    return document.createElement('div')
  }])

  app.start()
})

test('noFreeze', function (t) {
  t.plan(2)
  const app = choo({freeze: false})

  app.model({
    state: {
      foo: 'bar'
    }
  })

  app.router(['/', function (state) {
    state.foo = ''
    t.equal(state.foo, '', 'can modify property')
    state.bar = 'baz'
    t.equal(state.bar, 'baz', 'can add property')
    return document.createElement('div')
  }])

  app.start()
})
