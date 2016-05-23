const serverRouter = require('server-router')
const browserify = require('browserify')
const bankai = require('bankai')
const http = require('http')

const PORT = 8080

const server = http.createServer(createRouter())
server.listen(PORT, () => process.stdout.write(`listening on port ${PORT}\n`))

function createRouter () {
  const router = serverRouter('/404')

  const html = bankai.html({ css: false })
  router.on('/', (req, res) => html(req, res).pipe(res))
  router.on('/:inbox', (req, res) => html(req, res).pipe(res))
  router.on('/:inbox/:message_id', (req, res) => html(req, res).pipe(res))

  const js = bankai.js(browserify, require.resolve('./client.js'))
  router.on('/bundle.js', (req, res) => js(req, res).pipe(res))

  router.on('/hi', (req, res) => res.end('{ "message": "hi back!" }'))
  router.on('/404', (req, res) => {
    res.statusCode = 404
    res.end('{ "message": "the server is confused" }')
  })

  return router
}
