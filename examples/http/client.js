var choo = require('../../')

var mainView = require('./views/main')

var app = choo({
  onError: function (err, state, createSend) {
    console.trace()
    console.groupCollapsed(`Error: ${err.message}`)
    console.error(err)
    console.groupEnd()
    var send = createSend('onError: ')
    send('app:error', err)
  },
  onAction: function (state, data, name, caller, createSend) {
    console.groupCollapsed(`Action: ${caller} -> ${name}`)
    console.log(data)
    console.groupEnd()
  },
  onStateChange: function (state, data, prev, createSend) {
    console.groupCollapsed('State')
    console.log(prev)
    console.log(state)
    console.groupEnd()
  }
})

app.model(require('./models/error'))
app.model(require('./models/api'))

app.router(['/', mainView])

var tree = app.start()
document.body.appendChild(tree)
