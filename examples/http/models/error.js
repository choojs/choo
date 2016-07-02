// Create a new error. Errors are pushed into an array so they can be
// queued. We're doing a bit of timestamp trickery here so each error
// is shown for exactly one second before being dropped. Probably
// useful for real world scenarios; especially when coupled to
// fancy CSS animation thingies

// Each error is displayed 1 second
const ERROR_TIMEOUT = 1000

module.exports = {
  namespace: 'app',
  state: {
    errors: [],
    errorTimeDone: 0,
    triggerTime: null
  },
  reducers: {
    setError: function (action, state) {
      return {
        errors: state.errors.concat(action.message),
        errorTimeDone: action.errorTimeDone
      }
    },
    'delError': function (action, state) {
      state.errors.shift()
      return { errors: state.errors }
    }
  },
  effects: {
    error: function (err, state, send, done) {
      const timeDone = state.errorTimeDone
      const now = Date.now()

      const timeStamp = (timeDone && timeDone >= now)
        ? timeDone + ERROR_TIMEOUT
        : now + ERROR_TIMEOUT

      const timeout = timeStamp - now

      const errAction = {
        message: err.message,
        errorTimeDone: timeStamp
      }
      send('app:setError', errAction, function (err) {
        if (err) return done(err)
        setTimeout(function () {
          send('app:delError', done)
        }, timeout)
      })
    }
  }
}
