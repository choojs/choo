const choo = require('../../')
const sf = require('sheetify')

sf('css-wipe/dest/bundle')
sf('tachyons')

const mainView = require('./views/main')
const mailbox = require('./elements/mailbox')
const nav = require('./elements/nav')

const app = choo()

app.model('inbox', require('./models/inbox'))
app.model('spam', require('./models/spam'))
app.model('sent', require('./models/sent'))

app.router((route) => [
  route('/', mainView(nav, mailbox)),
  route('/:mailbox', [
    route('/', mainView(nav, mailbox)),
    route('/:message', mainView(nav, mailbox))
  ])
])

const tree = app.start()
document.body.appendChild(tree)
