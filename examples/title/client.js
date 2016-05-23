const choo = require('../../')

const app = choo()
app.model({
  namespace: 'input',
  state: {
    title: 'my demo app'
  },
  reducers: {
    update: (action, state) => ({ title: action.payload })
  },
  effects: {
    update: (action, state, send) => (document.title = action.payload)
  }
})

const mainView = (params, state, send) => {
  return choo.view`
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

app.router((route) => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
