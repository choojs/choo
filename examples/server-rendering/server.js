const serverRouter = require('server-router')
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
  apiRouter.on('/404', (req, res) => res.end('not found'))
  apiRouter.on('/', (req, res) => {
    res.end(JSON.stringify({ routes: [ '/', '/404' ] }))
  })
  return apiRouter
}

// render the client to string
// based on the requested url
// (obj, obj) -> null
function handleHtml (req, res) {
  const html = client.toString(req.url, { message: 'hello server!' })
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(html)
}
