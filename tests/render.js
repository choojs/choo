const tape = require('tape')
const choo = require('../')

tape('happy path', function (t) {
  t.test('should render a static element', function (t) {
    t.plan(1)

    const app = choo()
    const view = (params, action, send) => choo.view`<h1>Hello Tokyo!</h1>`
    app.router((route) => [
      route('/', view)
    ])

    const tree = app.start()
    document.body.appendChild(tree)

    const expected = '<h1 id="choo-root">Hello Tokyo!</h1>'
    t.equal(document.querySelector('h1').outerHTML, expected)

    // unmount
    const child = document.querySelector('h1')
    child.parentNode.removeChild(child)
  })

  t.test('should trigger a reducer', function (t) {
    t.plan(3)

    const app = choo()
    const view = (params, state, send) => choo.view`
      <section>
        <h1>${state.hey}</h1>
        <button onclick=${(e) => send('test')}></button>
      </section>
    `
    app.model({
      state: { hey: 'bar' },
      reducers: {
        test: (state, action) => {
          t.pass('called!')
          return { hey: 'foo' }
        }
      }
    })
    app.router((route) => [
      route('/', view)
    ])

    const tree = app.start()
    document.body.appendChild(tree)

    t.equal(document.querySelector('h1').outerHTML, '<h1>bar</h1>')
    document.querySelector('button').click()
    process.nextTick(function () {
      t.equal(document.querySelector('h1').outerHTML, '<h1>foo</h1>')
    })
  })

  t.test('should support namespaces')
  t.test('should trigger an effect')
  t.test('should respond to subscriptions')
})

tape('done', function (t) {
  t.plan(1)
  window.close()
  t.pass(1, 'closed the window')
})
