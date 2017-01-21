var test = require('tape')
var choo = require('../../')

test('freeze (default)', function (t) {
  t.plan(2)
  var called = false

  var app = choo()
  app.model({
    state: {
      foo: 'bar'
    }
  })
  app.router(['/', mainView])
  app.start()

  function mainView (state, prev) {
    if (!called) {
      // Modifying frozen objects can lead to TypeError
      try {
        state.foo = ''
      } catch (e) {
        t.fail('tried to modify state.foo')
      }
      t.equal(state.foo, 'bar', 'cannot modify property')
      // Modifying frozen objects can lead to TypeError
      try {
        state.bar = 'baz'
      } catch (e) {
        t.fail('tried to modify state.bar')
      }
      t.equal(state.bar, undefined, 'cannot add property')

      called = true
      app.stop()
    }
    return document.createElement('div')
  }
})

test('noFreeze', function (t) {
  t.plan(2)
  var app = choo({freeze: false})
  var called = false

  app.model({
    state: {
      foo: 'bar'
    }
  })

  app.router(['/', function (state) {
    if (called) return document.createElement('div')
    else called = true
    state.foo = ''
    t.equal(state.foo, '', 'can modify property')
    state.bar = 'baz'
    t.equal(state.bar, 'baz', 'can add property')
    app.stop()
    return document.createElement('div')
  }])

  app.start()
})
