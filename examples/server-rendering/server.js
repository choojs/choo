var serverRouter = require('server-router')
var hyperstream = require('hyperstream')
var browserify = require('browserify')
var bankai = require('bankai')
var http = require('http')

var PORT = 8080
var client = require('./client')

// If an incoming request accepts "text/html", render the
// appropriate HTML. Else use the API server
var apiRouter = createRouter()
var server = http.createServer(function (req, res) {
  if (/text\/html/.test(req.headers.accept)) handleHtml(req, res)
  else apiRouter(req, res)
})
server.listen(PORT, () => process.stdout.write(`listening on port ${PORT}\n`))

// create a new router
// null -> fn
function createRouter () {
  var apiRouter = serverRouter('/404')

  apiRouter.on('/404', (req, res) => res.end('404 not found'))
  apiRouter.on('/', (req, res) => res.end('nothing to be found here'))

  var js = bankai.js(browserify, require.resolve('./client.js'))
  apiRouter.on('/bundle.js', (req, res) => js(req, res).pipe(res))

  return apiRouter
}

// render the client to string
// based on the requested url
// (obj, obj) -> null
var createIndex = bankai.html({ favicon: false, css: false })
function handleHtml (req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  var state = { message: { server: 'hello server!' } }
  var inner = client.toString(req.url, state)
  var hs = hyperstream({ 'body': { _appendHtml: inner } })

  createIndex(req, res).pipe(hs).pipe(res)
}
