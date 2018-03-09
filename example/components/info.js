var Component = require('../../component')
var html = require('bel')

module.exports = class Info extends Component {
  update () {
    return false
  }

  createElement () {
    return html`<footer class="info">
      <p>Double-click to edit a todo</p>
      <p>choo by <a href="https://yoshuawuyts.com/">Yoshua Wuyts</a></p>
      <p>Created by <a href="http://shuheikagawa.com">Shuhei Kagawa</a></p>
    </footer>`
  }
}
