const choo = require('../../../')

module.exports = function (params, state, send) {
  const message = state.message
  return choo.view`
    <section>
      <h1>${message}</h1>
    </section>
  `
}
