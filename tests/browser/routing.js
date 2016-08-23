const test = require('tape')
const Event = require('geval/event')
const proxyquire = require('proxyquire')
const append = require('append-child')
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
    t.on('end', append(tree))

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
      return view`<button>${state.user}</button>`
    }
  })

  t.test('hash', function (t) {
    t.plan(1)

    const hash = Event()
    const choo = proxyquire('../..', {
      'sheet-router/hash': hash.listen
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
          send('set', {id: 1}, function (err) {
            if (err) return done(err)
            hash.broadcast('#users/1')
          })
        }
      }
    })

    app.router('/users', (route) => [
      route('/users', parentView, [
        route('/:user', childView)
      ])
    ])

    const tree = app.start({hash: true})
    t.on('end', append(tree))

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
      return view`<button>${state.user}</button>`
    }
  })

  t.test('disabling history', function (t) {
    t.plan(1)

    const choo = proxyquire('../..', {
      'sheet-router/history': () => t.fail('history listener attached')
    })

    const app = choo()

    app.router('/', (route) => [
      route('/', function () {
        t.pass('rendered')
      })
    ])

    app.start({history: false})
  })

  t.test('disabling href', function (t) {
    t.plan(1)

    const choo = proxyquire('../..', {
      'sheet-router/href': () => t.fail('href listener attached')
    })

    const app = choo()

    app.router('/', (route) => [
      route('/', function () {
        t.pass('rendered')
      })
    ])

    app.start({href: false})
  })

  t.test('viewless nesting', function (t) {
    t.plan(1)

    const choo = require('../..')
    const app = choo()

    app.router('/users/123', (route) => [
      route('/users', [
        route('/:user', function (state) {
          t.deepEqual(state.params, {user: '123'})
        })
      ])
    ])

    app.start()
  })

  t.test('prev.params always exists', function (t) {
    t.plan(1)

    const choo = require('../..')
    const app = choo()

    app.router('/users/123', (route) => [
      route('/users', [
        route('/:user', function (state, prev) {
          t.ok(prev.params)
        })
      ])
    ])

    app.start()
  })
})
