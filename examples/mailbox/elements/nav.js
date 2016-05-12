const choo = require('../../../')

const mailboxes = [ 'inbox', 'spam', 'sent' ]

module.exports = function (params, state, send) {
  const mailbox = params.mailbox

  return choo.view`
    <aside>
      <ul>
        <li><h2>Mailboxes</h2></li>
        ${mailboxes.map(function (name) {
          return createLi(name, state[name + ':messages'], mailbox)
        })}
      </ul>
    </aside>
  `
}

function createLi (mailbox, messages) {
  return choo.view`
    <li>
      <a href="/${mailbox}">
        ${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}
        <span>${messages}</span>
      </a>
    </li>
  `
}
