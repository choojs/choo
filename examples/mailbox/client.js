var log = require('choo-log')
var sf = require('sheetify')

var choo = require('../../')

sf('css-wipe/dest/bundle')

var app = choo()
app.use(log())

app.model(require('./models/inbox'))
app.model(require('./models/spam'))
app.model(require('./models/sent'))

app.router([
  ['/', require('./views/empty')],
  ['/:mailbox', require('./views/mailbox'), [
    ['/:message', require('./views/email')]
  ]]
])

var tree = app.start()
document.body.appendChild(tree)
