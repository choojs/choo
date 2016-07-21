const html = require('../../../html')
const format = require('../utilities/format')

function toggle (state, send) {
  if (state.start) {
    send('stop')
  } else {
    send('start')
  }
}

module.exports = (state, prev, send) => {
  const start = state.start
  const elapsed = state.elapsed

  return html`
    <main class="app">
      <h1>stopwatch</h1>
      <p>${format(elapsed)}</p>
      <button 
        onclick=${e => toggle(state, send)}
        >${start ? 'stop' : 'start'}</button>
      <button 
        style="display:${start ? 'none' : 'inline'};" 
        onclick=${e => send('reset')}
        >reset</button>
      <button 
        style="display:${start ? 'inline' : 'none'};" 
        onclick=${e => send('add', format(elapsed))}
        >lap</button>
      <ol>
        ${state.laps.map(lap => html`<li>${lap}</li>`)}
      </ol>
    </main>
  `
}
