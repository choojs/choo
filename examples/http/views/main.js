const choo = require('../../../')

module.exports = function (params, state, send) {
  return choo.view`
    <section>
      <h1>${state['api:title']}</h1>
      <h2>Latest error: ${state.error[0]}</h2>
      <button onclick=${(e) => send('api:good')}>OK!</button>
      <button onclick=${(e) => send('api:bad')}>Naughty</button>
    </section>
  `
}
