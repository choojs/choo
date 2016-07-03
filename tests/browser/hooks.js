const test = require('tape')
const choo = require('../../')
const view = require('../../html')

test('hooks', function (t) {
  t.plan(11)

  const app = choo({
    onError: function (err, state, createSend) {
      t.equal(err.message, 'effect error', 'receives err')
      t.equal(state.clicks, 1, 'current state: 1 clicks')
      t.equal(typeof createSend, 'function', 'createSend fn')
    },
    onAction: function (action, state, name, caller, createSend) {
      if (name === 'explodes') return
      t.deepEqual(action, {foo: 'bar'}, 'action data')
      t.equal(state.clicks, 0, 'current state: 0 clicks')
      t.equal(name, 'click', 'action name')
      t.equal(caller, '/', 'caller name')
      t.equal(typeof createSend, 'function', 'createSend fn')
    },
    onState: function (action, state, prev, createSend) {
      t.deepEqual(action, {foo: 'bar'}, 'action data')
      t.deepEqual(state.clicks, 1, 'new state: 1 clicks')
      t.deepEqual(prev.clicks, 0, 'prev state: 0 clicks')
    }
  })

  app.model({
    state: {
      clicks: 0
    },
    reducers: {
      click: (action, state) => ({clicks: state.clicks + 1})
    },
    effects: {
      explodes: (action, state, send, done) => {
        setTimeout(() => done(new Error('effect error')), 5)
      }
    }
  })

  var sent = false
  app.router((route) => [
    route('/', function (state, prev, send) {
      if (!sent) {
        send('click', {foo: 'bar'})
        send('explodes')
      }
      sent = true
      return view`<span></span>`
    })
  ])

  const tree = app.start()
  document.body.appendChild(tree)
})
