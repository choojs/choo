const test = require('tape')
const choo = require('./')

test('should assert input types', function (t) {
  t.plan(1)
  t.throws(choo)
})
