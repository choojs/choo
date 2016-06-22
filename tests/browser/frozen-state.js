const tape = require('tape')
const choo = require('../../')

tape('should render on the client', function (t) {
  t.test('state should not be mutable', function (t) {
    t.plan(3)

    const app = choo()
    const state = {
      foo: 'baz',
      beep: 'boop'
    }
    app.model({
      state: state,
      reducers: {
        mutate: (action, state) => {
          state.foo = 'zap'
          return {}
        },
        noMutate: (action, state) => {
          return {beep: 'poob'}
        }
      },
      effects: {
        effectMutate: (action, state) => {
          state.foo = 'zap'
        }
      }
    })

    app.router((route) => [
      route('/', function (params, state, send) {
        const okd = (evt) => {
          if (evt.key === 'a') {
            send('mutate')
          } else {
            send('noMutate')
          }
        }
        return choo.view`<span class="test" onkeydown=${okd}>${state.foo}:${state.beep}</span>`
      })
    ])
    document.body.appendChild(app.start())
    const $el = document.querySelector('.test')
    const mutate = new window.KeyboardEvent('keydown', {key: 'a'})
    const noMutate = new window.KeyboardEvent('keydown', {key: 'b'})
    const effectMutate = new window.KeyboardEvent('keydown', {key: 'c'})
    $el.dispatchEvent(mutate)
    t.equal($el.innerText, 'baz:boop', 'state did not mutate')
    $el.dispatchEvent(noMutate)
    t.equal($el.innerText, 'baz:poob', 'state was updated from a return')
    $el.dispatchEvent(effectMutate)
    t.equal($el.innerText, 'baz:poob', 'state was not updated from an effect')
  })
})
