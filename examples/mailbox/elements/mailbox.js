const dateformat = require('dateformat')
const choo = require('../../../')

module.exports = function () {
  return function (params, state, send) {
    const mailbox = params.mailbox
    const message = params.message
    const messages = state[mailbox].messages

    if (message) {
      const email = state[mailbox].messages.filter(function (msg) {
        return String(msg.id) === message
      })[0]

      return choo.view`
        <section class="fl mt4 w-80 db">
          <div>
            ${createHeader()}
            ${messages.map(function (msg) {
              return createMessage(msg, mailbox)
            })}
          </div>
          <div>
            ${email ? createEmail(email) : 'error: no email found'}
          </div
        </section>
      `
    } else {
      return choo.view`
        <section class="fl mt4 w-80 db">
          ${createHeader()}
          ${messages.map(function (msg) {
            return createMessage(msg, mailbox)
          })}
        </section>
      `
    }
  }
}

function createHeader () {
  return choo.view`
    <div class="db cf w-100">
      <div class="fl mb3 w-25 mt0 b">Date</th>
      <div class="fl mb3 w-25 mt0 b">Subject</th>
      <div class="fl mb3 w-25 mt0 b">From</th>
      <div class="fl mb3 w-25 mt0 b">To</th>
    </div>
  `
}

function createMessage (message, mailbox) {
  return choo.view`
    <div class="db cf w-100">
      <a href="${'/' + mailbox + '/' + message.id}">
        <div class="fl mb3 w-25 f6 link">
          ${dateformat(message.date, 'mmmm dS')}
        </div>
        <div class="fl mb3 w-25 f6 link">${message.subject}</div>
        <div class="fl mb3 w-25 f6 link">${message.from}</div>
        <div class="fl mb3 w-25 f6 link">${message.to}</div>
      </a>
    </div>
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
