var serverRouter = require('server-router')
var browserify = require('browserify')
var bankai = require('bankai')
var http = require('http')
var SSE = require('sse')

var clients = []
var PORT = 8080

var server = http.createServer(createRouter())
server.listen(PORT, () => {
  process.stdout.write(`listening on port ${PORT}\n`)
  var sse = new SSE(server)

  // code adapted from: https://github.com/markbrown4/server-sent-events-demo
  sse.on('connection', (stream) => {
    clients.push(stream)
    console.log('Opened connection 🎉')

    var json = JSON.stringify({ message: 'Gotcha' })
    stream.send(json)
    console.log('Sent: ' + json)

    stream.on('close', () => {
      clients.splice(clients.indexOf(stream), 1)
      console.log('Closed connection 😱')
    })
  })
})

// emit data every 1.5 seconds
setInterval(() => {
  var json = JSON.stringify({ message: 'Hello hello!' })
  clients.forEach((stream) => {
    stream.send(json)
    console.log('Sent: ' + json)
  })
}, 1500)

function createRouter () {
  var router = serverRouter('/404')

  var html = bankai.html({ css: false })
  router.on('/', (req, res) => html(req, res).pipe(res))

  var js = bankai.js(browserify, require.resolve('./client.js'))
  router.on('/bundle.js', (req, res) => js(req, res).pipe(res))

  router.on('/404', (req, res) => {
    res.statusCode = 404
    res.end('{ "message": "the server is confused" }')
  })

  return router
}
