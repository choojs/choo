var Component = require('../../../component')
var html = require('nanohtml')

var Todo = require('./todo')

module.exports = class Header extends Component {
  constructor (name, state, emit) {
    super(name)
    this.state = state
    this.emit = emit
    this.local = this.state.components[name] = {}
    this.setState()
  }

  setState () {
    this.local.rawTodos = this.state.todos.clock
    this.local.rawHref = this.state.href

    this.local.allDone = this.state.todos.done.length === this.state.todos.all.length
    this.local.filter = this.state.href.replace(/^\//, '') || ''
    this.local.todos = this.local.filter === 'completed'
      ? this.state.todos.done
      : this.local.filter === 'active'
        ? this.state.todos.active
        : this.state.todos.all
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
    return html`<section class="main">
      <input
        class="toggle-all"
        type="checkbox"
        checked=${this.local.allDone}
        onchange=${() => this.toggleAll()}/>
      <label for="toggle-all" style="display: none;">
        Mark all as done
      </label>
      <ul class="todo-list">
        ${this.local.todos.map(todo => Todo(todo, this.emit))}
      </ul>
    </section>`
  }

  createTodo (e) {
    var value = e.target.value
    if (e.keyCode === 13) {
      e.target.value = ''
      this.emit('todos:create', value)
    }
  }

  toggleAll () {
    this.emit('todos:toggleAll')
  }
}
