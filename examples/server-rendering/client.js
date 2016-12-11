const mount = require('../../mount')
const choo = require('../../')

const mainView = require('./view')

const app = choo()

app.model({
  namespace: 'message',
  state: {
    server: 'rehydration has kicked in, server data was tossed',
    client: 'hello client!'
  }
})

app.router(['/', mainView])

if (module.parent) {
  module.exports = app
} else {
  const tree = app.start()
  mount('#app-root', tree)
}
