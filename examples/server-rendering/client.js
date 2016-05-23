const choo = require('../../')

const mainView = require('./views/main')

const app = choo()

app.router((route) => [
  route('/', mainView)
])

if (module.parent) {
  module.exports = app
} else {
  const tree = app.start()
  document.body.appendChild(tree)
}
