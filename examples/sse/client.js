const choo = require('../../')
const html = require('../../html')

const app = choo()
app.model(createModel())
app.router((route) => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)

function mainView (params, state, send) {
  return html`
    <div>${state.logger.msg}</div>
  `
}

function createModel () {
  const stream = new window.EventSource('/sse')
  return {
    namespace: 'logger',
    state: {
      msg: ''
    },
    subscriptions: [
      function (send) {
        stream.onerror = (e) => {
          send('logger:error', { payload: JSON.stringify(e) })
        }
        stream.onmessage = (e) => {
          const msg = JSON.parse(e.data).message
          send('logger:print', { payload: msg })
        }
      }
    ],
    reducers: {
      'print': (action, state) => {
        return ({ msg: state.msg + ' ' + action.payload })
      }
    },
    effects: {
      close: () => stream.close(),
      error: (action, state) => console.error(`error: ${action.payload}`)
    }
  }
}
