const pathname = require('pathname-match')
const choo = require('../../../')

module.exports = function (nav) {
  return function (params, state, send) {
    return choo.view`
      <main class="app">
        <span>URL: ${pathname(state.location) || '/'}</span>
        ${nav(params, state, send)}
        <section>
          <table>
            <tr>
              <th>Data</th>
              <th>Subject</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </table>
        </section>
      </main>
    `
  }
}
