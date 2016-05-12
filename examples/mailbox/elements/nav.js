const choo = require('../../../')

const mailboxes = [ 'inbox', 'spam', 'sent' ]

module.exports = function (params, state, send) {
  const mailbox = params.mailbox

  return choo.view`
    <aside class="fl mt4 w-20 db">
      <ul>
        <li>
          <h2 class="f4 b lh0">Mailbox</h2>
        </li>
        ${mailboxes.map(function (name) {
          return createLi(name, state[name + ':messages'], mailbox)
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
