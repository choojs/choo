const serverRouter = require('server-router')
const hyperstream = require('hyperstream')
const browserify = require('browserify')
const bankai = require('bankai')
const http = require('http')

const PORT = 8080
const client = require('./client')

// If an incoming request accepts "text/html", render the
// appropriate HTML. Else use the API server
const apiRouter = createRouter()
const server = http.createServer(function (req, res) {
  if (/text\/html/.test(req.headers.accept)) handleHtml(req, res)
  else apiRouter(req, res)
})
server.listen(PORT, () => process.stdout.write(`listening on port ${PORT}\n`))

// create a new router
// null -> fn
function createRouter () {
  const apiRouter = serverRouter('/404')

  apiRouter.on('/404', (req, res) => res.end('404 not found'))
  apiRouter.on('/', (req, res) => res.end('nothing to be found here'))

  const js = bankai.js(browserify, require.resolve('./client.js'))
  apiRouter.on('/bundle.js', (req, res) => js(req, res).pipe(res))

  return apiRouter
}

// render the client to string
// based on the requested url
// (obj, obj) -> null
const createIndex = bankai.html({ favicon: false, css: false })
function handleHtml (req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  const state = { message: { server: 'hello server!' } }
  const inner = client.toString(req.url, state)
  const hs = hyperstream({ 'body': { _appendHtml: inner } })

  createIndex(req, res).pipe(hs).pipe(res)
}
