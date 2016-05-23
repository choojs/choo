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
    error: [],
    errorTimeDone: null,
    triggerTime: null
  },
  reducers: {
    error: function (action, state) {
      const now = Date.now()
      const timeDone = state.errorTimeDone
      const newTimestamp = (timeDone && timeDone >= now)
        ? timeDone + ERROR_TIMEOUT
        : now + ERROR_TIMEOUT

      return {
        error: state.error.concat(action.payload),
        errorTimeDone: newTimestamp
      }
    },
    'error:delete': function (action, state) {
      state.error.shift()
      return { error: state.error }
    }
  },
  effects: {
    error: function (action, state, send) {
      const timeout = state.errorTimeDone - Date.now()
      setTimeout(function () {
        send('app:error:delete')
      }, timeout)
    }
  }
}
