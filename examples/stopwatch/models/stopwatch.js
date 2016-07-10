const xtend = require('xtend')
const raf = require('raf')

module.exports = {
  state: {
    elapsed: 0,
    startTime: 0,
    start: false,
    laps: []
  },
  reducers: {
    start: (data, state) => xtend(state, { start: true, startTime: Date.now() - state.elapsed }),
    stop: (data, state) => xtend(state, { start: false }),
    update: (data, state) => xtend(state, { elapsed: data }),
    reset: (data, state) => xtend(state, { startTime: Date.now(), elapsed: 0, laps: [] }),
    add: (data, state) => xtend(state, { laps: state.laps.concat(data) })
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
