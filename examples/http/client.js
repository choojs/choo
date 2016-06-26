const choo = require('../../')

const mainView = require('./views/main')

const app = choo({
  onError: function (err, state, createSend) {
    console.groupCollapsed(`Error: ${err.message}`)
    console.error(err)
    console.groupEnd()
    const send = createSend('onError: ')
    send('app:error', err)
  },
  onAction: function (action, state, name, caller, createSend) {
    console.groupCollapsed(`Action: ${caller} -> ${name}`)
    console.log(action)
    console.groupEnd()
  },
  onState: function (action, state, prev, createSend) {
    console.groupCollapsed('State')
    console.log(prev)
    console.log(state)
    console.groupEnd()
  }
})

app.model(require('./models/error'))
app.model(require('./models/api'))

app.router((route) => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
