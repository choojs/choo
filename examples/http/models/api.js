const http = require('../../../http')

module.exports = {
  namespace: 'api',
  state: {
    title: 'Button pushing machine 3000'
  },
  reducers: {
    set: (action, state) => ({ 'title': action.payload })
  },
  effects: {
    good: (action, state, send) => request('/good', send),
    bad: (action, state, send) => request('/bad', send)
  }
}

function request (uri, send, state) {
  http(uri, { json: true }, function (err, res, body) {
    if (err) return send('app:error', { payload: 'HTTP error' })
    if (res.statusCode !== 200) {
      const message = (body && body.message)
        ? body.message
        : 'unknown server error'
      return send('app:error', { payload: message })
    }
    if (!body) {
      return send('app:error', { payload: 'fatal: no body received' })
    }
    send('api:set', { payload: body.message || body.title })
  })
}
