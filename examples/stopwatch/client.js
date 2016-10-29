const choo = require('../../')

const stopwatch = require('./models/stopwatch')
const mainView = require('./views/main')

const app = choo()

app.model(stopwatch)

app.router(['/', mainView])

const tree = app.start()
document.body.appendChild(tree)
