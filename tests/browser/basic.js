const tape = require('tape')
const choo = require('../../')
const view = require('../../html')

tape('should render on the client', function (t) {
  t.test('state should not be mutable', function (t) {
    t.plan(4)

    const app = choo()
    const state = {
      foo: 'baz',
      beep: 'boop'
    }

    app.model({
      state: state,
      namespace: 'test',
      reducers: {
        'no-reducer-mutate': (action, state) => {
          return {}
        },
        'mutate-on-return': (action, state) => {
          delete action.type
          return action
        }
      },
      effects: {
        'triggers-reducers': (action, state, send) => {
          send('test:mutate-on-return', {beep: 'barp'})
        }
      }
    })

    let loop = -1

    const asserts = [
      (state) => t.deepEqual(state, {foo: 'baz', beep: 'boop'}, 'intial state'),
      (state) => t.deepEqual(state, {foo: 'baz', beep: 'boop'}, 'no change in state'),
      (state) => t.deepEqual(state, {foo: 'oof', beep: 'boop'}, 'change in state from reducer'),
      (state) => t.deepEqual(state, {foo: 'oof', beep: 'barp'}, 'change in state from effect')
    ]

    const triggers = [
      (send) => send('test:no-reducer-mutate'),
      (send) => send('test:mutate-on-return', {foo: 'oof'}),
      (send) => send('test:triggers-reducers')
    ]

    app.router((route) => [
      route('/', function (params, state, send) {
        ++loop
        asserts[loop] && asserts[loop](state.test)
        setTimeout(() => triggers[loop] && triggers[loop](send), 5)
        return view`<div><span class="test">${state.foo}:${state.beep}</span></div>`
      })
    ])

    const tree = app.start()
    document.body.appendChild(tree)
  })
})
