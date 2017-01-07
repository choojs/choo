var serverRouter = require('server-router')
var browserify = require('browserify')
var bankai = require('bankai')
var http = require('http')

var PORT = 8080

var server = http.createServer(createRouter())
server.listen(PORT, () => process.stdout.write(`listening on port ${PORT}\n`))

var index = 0
var errors = [
  'a giant robot invaded robot town!',
  'something weird crawled out of the swamp',
  'oh no, the bear people invaded the server!',
  'the NSA',
  '12 goats started a band',
  'we kinda just gave up'
]

function createRouter () {
  var router = serverRouter('/404')

  var html = bankai.html({ css: false })
  router.on('/', (req, res) => html(req, res).pipe(res))

  var js = bankai.js(browserify, require.resolve('./client.js'))
  router.on('/bundle.js', (req, res) => js(req, res).pipe(res))

  router.on('/good', (req, res) => {
    res.end('{ "message": "all is well in robo town!" }')
  })

  router.on('/bad', (req, res) => {
    res.statusCode = 500
    res.end(`{ "message": "${errors[index++ % (errors.length)]}" }`)
  })

  router.on('/404', (req, res) => {
    res.statusCode = 404
    res.end('{ "message": "the server is confused" }')
  })

  return router
}
