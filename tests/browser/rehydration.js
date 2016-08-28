const test = require('tape')
const onReady = require('document-ready')
const append = require('append-child')
const mount = require('../../mount')
const choo = require('../../')
const html = require('../../html')

test('rehydration', function (t) {
  t.plan(2)

  const app = choo()

  const node = html`
    <section id="app-root">
      <div id="app-root">Hello squirrel!</span>
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

  const tree = app.start()
  mount('#app-root', tree)

  onReady(function () {
    const newNode = document.querySelector('#app-root')
    t.equal(newNode.innerHTML, 'Hello world!', 'same as it ever was')
    t.equal(typeof newNode.onclick, 'function', 'attaches dom listeners')
  })
})
