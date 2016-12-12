const test = require('tape')
const Event = require('geval/event')
const proxyquire = require('proxyquire')
const append = require('append-child')
const view = require('../../html')

test('routing', function (t) {
  t.test('history', function (t) {
    t.plan(2)

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
        set: (state, data) => ({user: data.id})
      },
      effects: {
        open: function (state, data, send, done) {
          t.deepEqual(data, {id: 1})
          send('set', {id: 1}, function (err) {
            if (err) return done(err)
            history.broadcast('/users/1')
          })
        }
      }
    })

    app.router({ default: '/users' }, [
      ['/users', parentView, [
        ['/:user', childView]
      ]]
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

  // t.test('hash', function (t) {
  //   t.plan(1)

  //   resetLocation()
  //   const hash = Event()
  //   const choo = proxyquire('../..', {
  //     'sheet-router/hash': hash.listen
  //   })

  //   const app = choo({hash: true})

  //   app.model({
  //     state: {
  //       user: null
  //     },
  //     reducers: {
  //       set: (state, data) => ({user: action.id})
  //     },
  //     effects: {
  //       open: function (state, data, send, done) {
  //         send('set', {id: 1}, function (err) {
  //           if (err) return done(err)
  //           hash.broadcast('#users/1')
  //         })
  //       }
  //     }
  //   })

  //   app.router({ default: '/users' }, [
  //     ['/users', parentView, [
  //       ['/:user', childView]
  //     ]]
  //   ])

  //   const tree = app.start()
  //   t.on('end', append(tree))

  //   tree.onclick()

  //   function parentView (state, prev, send) {
  //     return view`
  //       <button onclick=${() => send('open', {id: 1})}>
  //         Open
  //       </button>
  //     `
  //   }

  //   function childView (state, prev, send) {
  //     t.equal(state.user, 1)
  //     return view`<p>${state.user}</p>`
  //   }
  // })

  t.test('disabling history', function (t) {
    t.plan(1)

    resetLocation()
    const choo = proxyquire('../..', {
      'sheet-router/history': () => t.fail('history listener attached')
    })

    const app = choo({ history: false })

    app.router('/', [
      ['/', function () {
        t.pass('rendered')
        return document.createElement('div')
      }]
    ])

    app.start()
  })

  t.test('disabling href', function (t) {
    t.plan(1)

    const choo = proxyquire('../..', {
      'sheet-router/href': () => t.fail('href listener attached')
    })

    const app = choo({ href: false })
    app.router(['/', function () {
      t.pass('rendered')
      return document.createElement('div')
    }])
    app.start()
  })

  t.test('viewless nesting', function (t) {
    t.plan(1)

    const choo = require('../..')
    const app = choo()

    app.router({ default: '/users/123' }, [
      ['/users', [
        ['/:user', function (state) {
          t.deepEqual(state.location.params, {user: '123'})
          return document.createElement('div')
        }]
      ]]
    ])

    app.start()
  })
})

function resetLocation () {
  window.history.pushState({}, null, '/')
}
