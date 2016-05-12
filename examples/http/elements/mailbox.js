const choo = require('../../../')

module.exports = function (params, state, send) {
  const mailbox = params.mailbox

  return choo.view`
    <section>
      <table>
        ${createHeader()}
        ${state[mailbox + ':messages'].map(function (msg) {
          return createMessage(msg, mailbox)
        })}
      </table>
    </section>
  `
}

function createHeader () {
  return choo.view`
    <tr>
      <th>Data</th>
      <th>Subject</th>
      <th>From</th>
      <th>To</th>
    </tr>
  `
}

function createMessage (message, mailbox) {
  return choo.view`
    <tr>
      <a href="${'/' + mailbox + '/' + message.id}">
        <td>${message.date}</td>
        <td>${message.subject}</td>
        <td>${message.from}</td>
        <td>${message.to}</td>
      </a>
    </tr>
  `
}
