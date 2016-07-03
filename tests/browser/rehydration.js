const test = require('tape')
const onReady = require('document-ready')
const choo = require('../../')
const view = require('../../html')

test('rehydration', function (t) {
  t.plan(2)

  const app = choo()

  app.router((route) => [
    route('/', function (state, prev, send) {
      return view`<div id="app-root" onclick=${() => send('test')}>Hello world!</span>`
    })
  ])

  var node = document.createElement('div')
  node.innerHTML = app.toString('/')
  node = node.childNodes[0]
  document.body.appendChild(node)

  app.start('#app-root')

  onReady(function () {
    t.equal(node.innerHTML, 'Hello world!', 'same content')
    t.equal(typeof node.onclick, 'function', 'attaches dom listeners')
  })
})
