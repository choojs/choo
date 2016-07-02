const http = require('../../../http')

module.exports = {
  namespace: 'api',
  state: {
    title: 'Button pushing machine 3000'
  },
  reducers: {
    set: (action, state) => ({ 'title': action.data })
  },
  effects: {
    good: function (action, state, send, done) {
      request('/good', send, done)
    },
    bad: (action, state, send, done) => request('/bad', send, done)
  }
}

function request (uri, send, done) {
  http(uri, { json: true }, function (err, res, body) {
    if (err) return done(new Error('HTTP error'))
    if (res.statusCode !== 200) {
      const message = (body && body.message)
        ? body.message
        : 'unknown server error'
      return done(new Error(message))
    }
    if (!body) return done(new Error('fatal: no body received'))
    send('api:set', { data: body.message || body.title }, done)
  })
}
