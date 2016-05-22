const choo = require('../../../')

module.exports = function (params, state, send) {
  const mailbox = params.mailbox
  const message = params.message

  const email = state[mailbox].messages.filter(function (msg) {
    return String(msg.id) === message
  })[0]

  return choo.view`
    <div>
      ${email ? createEmail(email) : 'error: no email found'}
    </div
  `
}

function createEmail (message) {
  return choo.view`
    <div class="mail">
      <dl>
        <dt>From</dt>
        <dd>${message.from}</dd>
        <dt>To</dt>
        <dd>${message.to}</dd>
        <dt>Date</dt>
        <dd>${message.date}</dd>
      </dl>
      <h4>${message.subject}</h4>
      <p>${message.body}</p>
    </div>
  `
}
