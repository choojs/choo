const choo = require('../..')
const html = require('../../html')

const app = choo()

app.model({
  state: {twelveHour: false},
  reducers: {
    'toggle': (data, state) => ({ twelveHour: data })
  }
})

const elements = [
  {name: 'live-clock', proto: require('./clock')}
]

const view = (state, prev, send) => {
  return html`
    <main>
      <h1>
        <live-clock data-twelve=${state.twelveHour}></live-clock>
      </h1>
      <button onclick=${() => send('toggle', !state.twelveHour)}>
        Toggle ${state.twelveHour ? '24h' : '12h'}
      </button>
    </main>
  `
}

app.router('/', route => [
  route('/', view)
])

elements.forEach(element => document.registerElement(element.name, element.proto))
document.body.appendChild(app.start())
