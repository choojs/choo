var test = require('tape')
var onReady = require('document-ready')
var append = require('append-child')
var mount = require('../../mount')
var choo = require('../../')
var html = require('../../html')

test('rehydration', function (t) {
  t.plan(2)

  var app = choo()

  var node = html`
    <section id="app-root">
      <div>Hello squirrel!</span>
    </section>
  `

  app.router(['/', function (state, prev, send) {
    return html`
      <section id="app-root">
        <div onclick=${() => send('test')}>Hello world!</span>
      </section>
    `
  }])

  append(node)

  var tree = app.start()
  mount('#app-root', tree)

  onReady(function () {
    var newNode = document.querySelector('#app-root')
    var el = newNode.children[0]
    t.equal(el.innerHTML, 'Hello world!', 'same as it ever was')
    t.equal(typeof el.onclick, 'function', 'attaches dom listeners')
  })
})
