var serverRouter = require('server-router')
var browserify = require('browserify')
var bankai = require('bankai')
var http = require('http')

var PORT = 8080

var server = http.createServer(createRouter())
server.listen(PORT, () => process.stdout.write(`listening on port ${PORT}\n`))

function createRouter () {
  var router = serverRouter('/404')

  var js = bankai.js(browserify, require.resolve('./client.js'))
  router.on('/bundle.js', (req, res) => js(req, res).pipe(res))
  router.on('/:inbox/bundle.js', (req, res) => js(req, res).pipe(res))

  var html = bankai.html({ css: false })
  router.on('/', (req, res) => html(req, res).pipe(res))
  router.on('/:inbox', (req, res) => html(req, res).pipe(res))
  router.on('/:inbox/:message_id', (req, res) => html(req, res).pipe(res))

  router.on('/hi', (req, res) => res.end('{ "message": "hi back!" }'))
  router.on('/404', (req, res) => {
    res.statusCode = 404
    res.end('{ "message": "the server is confused" }')
  })

  return router
}
