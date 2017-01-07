var html = require('../../../html')

module.exports = function (params, state, send) {
  var error = state.app.error[0]
  var title = state.api.title
  return html`
    <section>
      <h1>${title}</h1>
      <h2>Latest error: ${error}</h2>
      <button onclick=${(e) => send('api:good')}>OK!</button>
      <button onclick=${(e) => send('api:bad')}>Naughty</button>
    </section>
  `
}
