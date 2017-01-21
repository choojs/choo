var choo = require('../../')

var stopwatch = require('./models/stopwatch')
var mainView = require('./views/main')

var app = choo()

app.model(stopwatch)

app.router(['/', mainView])

var tree = app.start()
document.body.appendChild(tree)
