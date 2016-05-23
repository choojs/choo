const choo = require('../../')

const mainView = require('./views/main')

const app = choo()

app.model(require('./models/error'))
app.model(require('./models/api'))

app.router((route) => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
