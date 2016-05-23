const choo = require('../../../')

module.exports = function (params, state, send) {
  const error = state.app.error[0]
  const title = state.api.title
  return choo.view`
    <section>
      <h1>${title}</h1>
      <h2>Latest error: ${error}</h2>
      <button onclick=${(e) => send('api:good')}>OK!</button>
      <button onclick=${(e) => send('api:bad')}>Naughty</button>
    </section>
  `
}
