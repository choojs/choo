var html = require('../../../html')

module.exports = function (state, prev, send) {
  var params = state.params
  var mailbox = params.mailbox
  var message = params.message

  var email = state[mailbox].messages.filter(function (msg) {
    return String(msg.id) === message
  })[0]

  return html`
    <div>
      ${email ? createEmail(email) : 'error: no email found'}
    </div
  `
}

function createEmail (message) {
  return html`
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
