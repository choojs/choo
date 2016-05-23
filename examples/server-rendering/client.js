const choo = require('../../')

const mainView = require('./views/main')

const app = choo()

app.model({
  namespace: 'message',
  state: {
    server: 'rehydration has kicked in, server data was tossed',
    client: 'hello client!'
  }
})

app.router((route) => [
  route('/', mainView)
])

if (module.parent) {
  module.exports = app
} else {
  app.start('#app-root')
}
