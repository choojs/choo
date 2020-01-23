import { expectAssignable, expectType } from 'tsd'
import Choo = require('.')

new Choo({})
new Choo()

new Choo({ cache: 100 })
new Choo({
  cache: new Map()
})
new Choo({
  cache: {
    get: (id) => null,
    set: (id, value) => expectType<any>(value)
  }
})

const app = new Choo({
  history: false,
  href: true,
})

app.use((state, emitter) => {
  state.title = 'choo choo'
  emitter.on(state.events.DOMCONTENTLOADED, () => {
    emitter.emit('example')
  })
})

app.route('/', (state, emit) => {
  expectAssignable<object>(state.params)
  expectType<string>(state.href)
  expectType<string>(state.route)
  expectType<string>(state.title)
  emit('example')
})

expectType<string>(app.toString('/'))

app.mount('body')
