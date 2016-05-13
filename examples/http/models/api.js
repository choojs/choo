const http = require('../../../http')

module.exports = {
  state: {
    title: 'Button pushing machine 3000'
  },
  reducers: {
    set: function (action, state) {
      return { 'api:title': action.payload }
    }
  },
  effects: {
    good: performGoodRequest,
    bad: performBadRequest
  }
}

function performGoodRequest (action, state, send) {
  http('/good', { json: true }, function (err, res, body) {
    if (err) return send('error', { payload: 'HTTP error' })
    if (res.statusCode !== 200) {
      return send('error', { payload: body.payload })
    }
    if (!body) {
      return send('error', { payload: 'fatal: no body received' })
    }
    send('api:set', { payload: body.message })
  })
}

function performBadRequest (action, state, send) {
  http('/bad', { json: true }, function (err, res, body) {
    if (err) return send('error', { payload: 'HTTP error' })
    if (res.statusCode !== 200) {
      const message = (body && body.message)
          ? body.message
          : 'unknown server error'
      return send('error', { payload: message })
    }
    if (!body) {
      return send('error', { payload: 'fatal: no body received' })
    }
    send('api:set', { payload: body.title })
  })
}
