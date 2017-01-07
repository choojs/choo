var raf = require('raf')

module.exports = {
  state: {
    elapsed: 0,
    startTime: 0,
    start: false,
    laps: []
  },
  reducers: {
    start: (state, data) => ({ start: true, startTime: Date.now() - state.elapsed }),
    stop: (state, data) => ({ start: false }),
    update: (state, data) => ({ elapsed: data }),
    reset: (state, data) => ({ startTime: Date.now(), elapsed: 0, laps: [] }),
    add: (state, data) => ({ laps: state.laps.concat(data) })
  },
  effects: {
    now: (state, data, send, done) => {
      if (state.start) {
        let elapsed = data - state.startTime
        send('update', elapsed, done)
      }
    }
  },
  subscriptions: [
    (send, done) => {
      raf(function loop () {
        send('now', Date.now(), done)
        raf(loop)
      })
    }
  ]
}
