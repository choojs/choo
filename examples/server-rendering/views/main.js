const assert = require('assert')
const html = require('../../../html')

module.exports = function (params, state, send) {
  const serverMessage = state.message.server
  const clientMessage = state.message.client

  assert.equal(typeof serverMessage, 'string', 'server should be a string')
  assert.equal(typeof clientMessage, 'string', 'client should be a string')

  return html`
    <section id="app-root">
      <h1>server message: ${serverMessage}</h1>
      <h1>client message: ${clientMessage}</h1>
      <p>${`
        The first message is passed in by the server on compile time,
        the second message was set by the client.
        The more static the data you pass in, the more cachable your site
        becomes (and thus performant). Try and keep the amount of properties
        you pass in on the server to a minimum for most applications - it'll
        make life a lot easier in the long run, hah.
      `}</p>
    </section>
  `
}
