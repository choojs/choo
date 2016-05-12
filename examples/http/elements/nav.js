const choo = require('../../../')

module.exports = function (params, state, send) {
  return choo.view`
    <aside>
      <ul>
        <li><h2>Mailboxes</h2></li>
        <li>Inbox <span>${state.inboxCount}</span></li>
        <li>Spam <span>${state.spamCount}</span></li>
        <li>Sent Mail <span>${state.SentMailCount}</span></li>
      </ul>
    </aside>
  `
}
