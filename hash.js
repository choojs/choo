const hash = require('sheet-router/hash')

module.exports = {
  namespace: 'location',
  subscriptions: {
    hash: function (send, done) {
      hash(function (fragment) {
        send('location:setLocation', { hash: fragment })
      })
    }
  }
}
