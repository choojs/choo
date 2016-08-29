const test = require('tape')
const append = require('append-child')
const choo = require('../../')
const view = require('../../html')

test('hooks', function (t) {
  t.plan(9)

  const app = choo({
    onError: function (err) {
      t.equal(err.message, 'effect error', 'onError: receives err')
    },
    onAction: function (data, state, name, caller, createSend) {
      if (name === 'explodes') return
      t.deepEqual(data, {foo: 'bar'}, 'onAction: action data')
      t.equal(state.clicks, 0, 'onAction: current state: 0 clicks')
      t.equal(name, 'click', 'onAction: action name')
      t.equal(caller, 'view: /', 'onAction: caller name')
      t.equal(typeof createSend, 'function', 'onAction: createSend fn')
    },
    onStateChange: function (data, state, prev, createSend) {
      t.deepEqual(data, {foo: 'bar'}, 'onState: action data')
      t.deepEqual(state.clicks, 1, 'onState: new state: 1 clicks')
      t.deepEqual(prev.clicks, 0, 'onState: prev state: 0 clicks')
    }
  })

  app.model({
    state: {
      clicks: 0
    },
    reducers: {
      click: (data, state) => ({clicks: state.clicks + 1})
    },
    effects: {
      explodes: (data, state, send, done) => {
        setTimeout(() => done(new Error('effect error')), 5)
      }
    }
  })

  var sent = false
  app.router(['/', function (state, prev, send) {
    if (!sent) {
      send('click', {foo: 'bar'})
      send('explodes')
    }
    sent = true
    return view`<span></span>`
  }])

  const tree = app.start()
  t.on('end', append(tree))
})
