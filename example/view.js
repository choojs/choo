var html = require('bel') // cannot require choo/html because it's a nested repo

var Header = require('./components/header')
var Footer = require('./components/footer')

module.exports = mainView

function mainView (state, emit, render) {
  return html`
    <body>
      <section class="todoapp">
        ${render(Header)}
        ${TodoList(state, emit)}
        ${render(Footer)}
      </section>
      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>choo by <a href="https://yoshuawuyts.com/">Yoshua Wuyts</a></p>
        <p>Created by <a href="http://shuheikagawa.com">Shuhei Kagawa</a></p>
      </footer>
    </body>
  `
}

function TodoItem (todo, emit) {
  var clx = classList({ completed: todo.done, editing: todo.editing })
  return html`
    <li id=${todo.id} class=${clx}>
      <div class="view">
        <input
          type="checkbox"
          class="toggle"
          checked="${todo.done}"
          onchange=${toggle} />
        <label ondblclick=${edit}>${todo.name}</label>
        <button
          class="destroy"
          onclick=${destroy}
        ></button>
      </div>
      <input
        class="edit"
        value=${todo.name}
        onkeydown=${handleEditKeydown}
        onblur=${update} />
    </li>
  `

  function toggle (e) {
    emit('todos:toggle', todo.id)
  }

  function edit (e) {
    emit('todos:edit', todo.id)
  }

  function destroy (e) {
    emit('todos:delete', todo.id)
  }

  function update (e) {
    emit('todos:update', {
      id: todo.id,
      editing: false,
      name: e.target.value
    })
  }

  function handleEditKeydown (e) {
    if (e.keyCode === 13) update(e)              // Enter
    else if (e.code === 27) emit('todos:unedit') // Escape
  }

  function classList (classes) {
    var str = ''
    var keys = Object.keys(classes)
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i]
      var val = classes[key]
      if (val) str += (key + ' ')
    }
    return str
  }
}

function TodoList (state, emit) {
  var filter = state.href.replace(/^\//, '') || ''
  var items = filter === 'completed'
    ? state.todos.done
    : filter === 'active'
      ? state.todos.active
      : state.todos.all

  var allDone = state.todos.done.length === state.todos.all.length

  var nodes = items.map(function (todo) {
    return TodoItem(todo, emit)
  })

  return html`
    <section class="main">
      <input
        class="toggle-all"
        type="checkbox"
        checked=${allDone}
        onchange=${toggleAll}/>
      <label for="toggle-all" style="display: none;">
        Mark all as done
      </label>
      <ul class="todo-list">
        ${nodes}
      </ul>
    </section>
  `

  function toggleAll () {
    emit('todos:toggleAll')
  }
}
