const choo = require('../../../')

const mailboxes = [ 'inbox', 'spam', 'sent' ]

module.exports = function (params, state, send) {
  return choo.view`
    <aside class="fl mt4 w-20 db">
      <ul>
        <li>
          <h2 class="f4 b lh0">Mailbox</h2>
        </li>
        ${mailboxes.map(function (mailbox) {
          const messages = mailbox.messages
          return createLi(mailbox, messages)
        })}
      </ul>
    </aside>
  `
}

function createLi (mailbox, messages) {
  return choo.view`
    <li class="mt4 f6">
      <a href="/${mailbox}">
        ${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}
        <span>${messages}</span>
      </a>
    </li>
  `
}
