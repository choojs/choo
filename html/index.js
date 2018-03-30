var bel = require('bel')

function isPromise (elem) {
  return elem && typeof elem.then === 'function'
}

function pWrap (array) {
  var wrap = false
  var result = array.map(function (elem) {
    if (Array.isArray(elem)) { elem = pWrap(elem) }
    if (isPromise(elem)) { wrap = true }
    return elem
  })
  if (wrap) {
    // NOTE: `Promise` will only be used if there is a promise within the tree, up to the dev to shim it
    return Promise.all(result)
  }
  return result
}

function html (strings) {
  var keys = Array.prototype.slice.call(arguments, 1)
  var pKeys = pWrap(keys)
  if (isPromise(pKeys)) {
    return pKeys.then(function (rKeys) { return bel.apply(null, [strings].concat(rKeys)) })
  }
  return bel.apply(null, [strings].concat(pKeys))
}

module.exports = html
