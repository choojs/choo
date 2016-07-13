const raf = require('raf')

module.exports = {
  state: {
    elapsed: 0,
    startTime: 0,
    start: false,
    laps: []
  },
  reducers: {
    start: (data, state) => ({ start: true, startTime: Date.now() - state.elapsed }),
    stop: (data, state) => ({ start: false }),
    update: (data, state) => ({ elapsed: data }),
    reset: (data, state) => ({ startTime: Date.now(), elapsed: 0, laps: [] }),
    add: (data, state) => ({ laps: state.laps.concat(data) })
  },
  effects: {
    now: (data, state, send, done) => {
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
