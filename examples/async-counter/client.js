var choo = require('../../')
var html = require('../../html')
var plur = require('plur')

var app = choo()
app.model({
  state: {
    counter: 0
  },
  reducers: {
    increment: (state, data) => ({ counter: state.counter + 1 }),
    decrement: (state, data) => ({ counter: state.counter - 1 })
  },
  effects: {
    incrementAsync: function (state, data, send, done) {
      setTimeout(() => send('increment', done), 1000)
    },
    decrementAsync: function (state, data, send, done) {
      setTimeout(() => send('decrement', done), 1000)
    }
  }
})

function mainView (state, prev, send) {
  var count = state.counter

  return html`
    <main class="app">
      <h1>Async counter</h1>
      <p>Clicked ${count} ${plur('time', count)}!</p>
      <button onclick=${() => send('increment')}>Increment</button>
      <button onclick=${() => send('decrement')}>Decrement</button>
      <button onclick=${() => send('incrementAsync')}>Increment async</button>
      <button onclick=${() => send('decrementAsync')}>Decrement async</button>
    </main>
  `
}

app.router([ '/', mainView ])

var tree = app.start()
document.body.appendChild(tree)
