const choo = require('../../')
const html = require('../../html')

const app = choo()
app.model({
  namespace: 'input',
  state: {
    title: 'my demo app'
  },
  reducers: {
    update: (data, state) => ({ title: data.payload })
  },
  effects: {
    update: (data, state, send, done) => {
      document.title = data.payload
      done()
    }
  }
})

app.router(route => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)

function mainView (state, prev, send) {
  return html`
    <main class="app">
      <h1>${state.input.title}</h1>
      <label>Set the title</label>
      <input
        type="text"
        placeholder=${state.input.title}
        oninput=${(e) => send('input:update', { payload: e.target.value })}>
    </main>
  `
}
