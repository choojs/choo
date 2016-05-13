const choo = require('../../../')

module.exports = function (params, state, send) {
  return choo.view`
    <section>
      <p>Select a mailbox</p>
    </section>
  `
}
