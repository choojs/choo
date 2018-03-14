var bel = require('bel')

async function html (strings, ...keys) {
  const promises = keys.map(key => Array.isArray(key)
    ? Promise.all(key)
    : Promise.resolve(key)
  )
  const resolved = await Promise.all(promises)
  return bel(strings, ...resolved)
}

module.exports = html
