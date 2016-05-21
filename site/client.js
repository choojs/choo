const choo = require('../')
const sf = require('sheetify')

sf('css-wipe/dest/bundle')
sf('tachyons')

const app = choo()

app.model('inbox', require('./models/inbox'))
app.model('spam', require('./models/spam'))
app.model('sent', require('./models/sent'))

app.router((route) => [
  route('/', require('./views/empty')),
  route('/:mailbox', [
    route('/', require('./views/mailbox')),
    route('/:message', require('./views/email'))
  ])
])

const tree = app.start()
document.body.appendChild(tree)
