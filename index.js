module.exports = typeof window !== 'undefined'
  ? require('./lib/browser.js')
  : require('./lib/server.js')
