const log = require('choo-log')
const sf = require('sheetify')

const choo = require('../../')

sf('css-wipe/dest/bundle')

const app = choo()
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

const tree = app.start()
document.body.appendChild(tree)
