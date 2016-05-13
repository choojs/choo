const choo = require('../../')
const sf = require('sheetify')

sf('css-wipe/dest/bundle')
sf('tachyons')

const mailboxView = require('./views/mailbox')
const emailView = require('./views/email')
const emptyView = require('./views/empty')

const app = choo()

app.model('inbox', require('./models/inbox'))
app.model('spam', require('./models/spam'))
app.model('sent', require('./models/sent'))

app.router((route) => [
  route('/', emptyView()),
  route('/:mailbox', [
    route('/', mailboxView()),
    route('/:message', emailView())
  ])
])

const tree = app.start()
document.body.appendChild(tree)
