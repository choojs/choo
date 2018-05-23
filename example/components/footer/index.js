var Component = require('../../../component')
var html = require('bel')

var clearButton = require('./clear-button')
var filterButton = require('./filter-button')

module.exports = class Footer extends Component {
  constructor (name, state, emit) {
    super(name)
    this.state = state
    this.emit = emit

    this.local = this.state.components.footer = {}
    this.setState()
  }

  setState () {
    this.local.rawTodos = this.state.todos.clock
    this.local.rawHref = this.state.href

    this.local.filter = this.state.href.replace(/^\//, '') || ''
    this.local.activeCount = this.state.todos.active.length
    this.local.hasDone = this.state.todos.done.length || null
  }

  update () {
    if (this.local.rawTodos !== this.state.todos.clock ||
      this.local.rawHref !== this.state.href) {
      this.setState()
      return true
    } else {
      return false
    }
  }

  createElement () {
    return html`<footer class="footer">
      <span class="todo-count">
        <strong>${this.local.activeCount}</strong>
        item${this.state.todos.all === 1 ? '' : 's'} left
      </span>
      <ul class="filters">
        ${filterButton('All', '', this.local.filter, this.emit)}
        ${filterButton('Active', 'active', this.local.filter, this.emit)}
        ${filterButton('Completed', 'completed', this.local.filter, this.emit)}
      </ul>
      ${this.local.hasDone && clearButton(this.emit)}
    </footer>`
  }
}
