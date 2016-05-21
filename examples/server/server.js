const serverRouter = require('server-router')
const http = require('http')

const PORT = 8080

const client = require('./client')

const server = http.createServer(createRouter())
server.listen(PORT, () => console.log(`listening on port ${PORT}`))

function createRouter () {
  const router = serverRouter('/404')

  router.on('/404', (req, res) => res.end('not found'))
  router.on('/', function (req, res, params) {
    const html = client.toString('/', { message: 'hello server!' })
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(html)
  })

  return router
}
