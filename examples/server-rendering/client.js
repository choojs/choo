var mount = require('../../mount')
var choo = require('../../')

var mainView = require('./view')

var app = choo()

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
  var tree = app.start()
  mount('#app-root', tree)
}
