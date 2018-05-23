var Component = require('../../component')
var html = require('bel')

module.exports = class Header extends Component {
  constructor (name, state, emit) {
    super(name)
    this.state = state
    this.emit = emit
  }

  update () {
    return false
  }

  createElement () {
    return html`<header class="header">
      <h1>todos</h1>
      <input class="new-todo"
        autofocus
        placeholder="What needs to be done?"
        onkeydown=${this.createTodo.bind(this)} />
    </header>`
  }

  createTodo (e) {
    var value = e.target.value
    if (e.keyCode === 13) {
      e.target.value = ''
      this.emit('todos:create', value)
    }
  }
}
