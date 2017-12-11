var assert = require('assert')

module.exports = ChooComponentCache

function ChooComponentCache (state, emit) {
  assert.equal(typeof state, 'object', 'ChooComponentCache: state should be type object')
  assert.equal(typeof emit, 'function', 'ChooComponentCache: state should be type function')

  this.state = state
  this.emit = emit
  this.cache = {}
}

ChooComponentCache.prototype.prune = function () {
  var keys = Object.keys(this.cache)
  for (var id, i = 0, len = keys.length; i < len; i++) {
    id = keys[i]
    if (!this.cache[id].element) delete this.cache[id]
  }
}

ChooComponentCache.prototype.render = function (Component) {
  assert.equal(typeof Component, 'function', 'ChooComponentCache.render: Component should be type function')
  var args = []
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push(arguments[i])
  }

  assert.equal(typeof Component.identity, 'function', 'ChooComponentCache.render: Component.identity should be type function')
  var id = Component.identity(args)
  assert.equal(typeof id, 'string', 'ChooComponentCache.render: Component.identity should return type string')

  var el = this.cache[id]
  if (!el) {
    var ext = args.slice(0)
    ext.unshift(Component, id, this.state, this.emit)
    el = newCall.apply(newCall, ext)
    this.cache[id] = el
  }
  return el.render.apply(el, args)
}

// Because you can't call `new` and `.apply()` at the same time. This is a mad
// hack, but hey it works so we gonna go for it. Whoop.
function newCall (Cls) {
  return new (Cls.bind.apply(Cls, arguments)) // eslint-disable-line
}
