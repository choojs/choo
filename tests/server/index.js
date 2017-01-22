var test = require('tape')
var minDocument = require('min-document')
var html = require('../../html')
var choo = require('../../')

test('server', function (t) {
  t.test('renders a static html response', function (t) {
    t.plan(1)

    var app = choo()
    app.router(['/', () => html`<h1>Hello Tokyo!</h1>`])

    var el = app.toString('/')
    var expected = '<h1>Hello Tokyo!</h1>'
    t.equal(el, expected, 'strings are equal')
  })
})
