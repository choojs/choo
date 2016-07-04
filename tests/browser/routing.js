const test = require('tape')
const Event = require('geval/event')
const proxyquire = require('proxyquire')
const view = require('../../html')

test('routing', function (t) {
  t.test('history', function (t) {
    t.plan(3)

    const history = Event()
    const choo = proxyquire('../..', {
      'sheet-router/history': history.listen
    })

    const app = choo()

    app.model({
      state: {
        user: null
      },
      reducers: {
        set: (action, state) => ({user: action.id})
      },
      effects: {
        open: function (action, state, send, done) {
          t.deepEqual(action, {id: 1})
          send('set', {id: 1}, function (err) {
            if (err) return done(err)
            history.broadcast('https://foo.com/users/1')
          })
        }
      }
    })

    app.router('/users', (route) => [
      route('/users', parentView, [
        route('/:user', childView)
      ])
    ])

    const tree = app.start()
    document.body.appendChild(tree)

    t.equal(tree.innerHTML.trim(), 'Open')
    tree.onclick()

    function parentView (state, prev, send) {
      return view`
        <button onclick=${() => send('open', {id: 1})}>
          Open
        </button>
      `
    }

    function childView (state, prev, send) {
      t.equal(state.user, 1)
      return view`<div>${state.user}</div>`
    }
  })
})
