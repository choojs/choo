var test = require('tape')
var choo = require('../../')

test('freeze (default)', function (t) {
  t.plan(2)
  var app = choo()

  app.model({
    state: {
      foo: 'bar'
    }
  })

  app.router(['/', function (state, prev, send) {
    state.foo = ''
    t.equal(state.foo, 'bar', 'cannot modify property')
    state.bar = 'baz'
    t.equal(state.bar, undefined, 'cannot add property')
    return document.createElement('div')
  }])

  app.start()
})

test('noFreeze', function (t) {
  t.plan(2)
  var app = choo({freeze: false})

  app.model({
    state: {
      foo: 'bar'
    }
  })

  app.router(['/', function (state, prev, send) {
    state.foo = ''
    t.equal(state.foo, '', 'can modify property')
    state.bar = 'baz'
    t.equal(state.bar, 'baz', 'can add property')
    return document.createElement('div')
  }])

  app.start()
})
