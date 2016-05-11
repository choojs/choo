const choo = require('../')

const app = choo()
app.model('title', {
  state: { title: 'my-demo-app' },
  reducers: {
    'update': (action, state) => ({ title: action.payload })
  },
  effects: {
    'update': (action, state, send) => (document.title = action.title)
  }
})

const mainView = (params, state, send) => choo.view`
  <main class="app">
    <h1>${state.title}</h1>
    <label>Set the title</label>
    <input
      type="text"
      placeholder=${state.title}
      oninput=${(e) => send('title:update', { payload: e.target.value })}>
  </main>
`

app.router((route) => [
  route('/', mainView)
])

const node = app.start()
document.body.appendChild(node)
