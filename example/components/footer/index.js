var Component = require('../../../component')
var html = require('bel')

var deleteCompleted = require('./delete-completed')
var filterButton = require('./filter-button')

module.exports = class Footer extends Component {
  static identity () {
    return 'footer'
  }

  constructor (name, state, emit) {
    super(name)
    this.state = state
    this.emit = emit
  }

  update () {
    return false
  }

  createElement () {
    var filter = this.state.href.replace(/^\//, '') || ''
    var activeCount = this.state.todos.active.length
    var hasDone = this.state.todos.done.length

    return html`<footer class="footer">
      <span class="todo-count">
        <strong>${activeCount}</strong>
        item${this.state.todos.all === 1 ? '' : 's'} left
      </span>
      <ul class="filters">
        ${filterButton('All', '', filter, this.emit)}
        ${filterButton('Active', 'active', filter, this.emit)}
        ${filterButton('Completed', 'completed', filter, this.emit)}
      </ul>
      ${hasDone ? deleteCompleted(this.emit) : null}
    </footer>`
  }
}
