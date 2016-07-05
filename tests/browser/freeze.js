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

  app.router((route) => [
    route('/', function (state, prev, send) {
      state.foo = ''
      t.equal(state.foo, 'bar', 'cannot modify property')
      state.bar = 'baz'
      t.equal(state.bar, undefined, 'cannot add property')
    })
  ])

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

  app.router((route) => [
    route('/', function (state, prev, send) {
      state.foo = ''
      t.equal(state.foo, '', 'can modify property')
      state.bar = 'baz'
      t.equal(state.bar, 'baz', 'can add property')
    })
  ])

  app.start()
})
