var bel = require('bel')

function html (strings, ...keys) {
  const promises = keys.map(key => Array.isArray(key) ? Promise.all(key) : Promise.resolve(key))
  return Promise.all(promises).then(resolved => bel(strings, ...resolved))
}

module.exports = html
