const choo = require('../../')
const sf = require('sheetify')

sf('css-wipe/dest/bundle')

const app = choo()

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
