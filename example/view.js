var html = require('bel') // cannot require choo/html because it's a nested repo

module.exports = mainView

function mainView (state, emit) {
  emit('log:debug', 'Rendering main view')
  return html`
    <body>
      <section class="todoapp">
        ${Header(state, emit)}
        ${TodoList(state, emit)}
        ${Footer(state, emit)}
      </section>
      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>choo by <a href="https://yoshuawuyts.com/">Yoshua Wuyts</a></p>
        <p>Created by <a href="http://shuheikagawa.com">Shuhei Kagawa</a></p>
      </footer>
    </body>
  `
}

function Header (state, emit) {
  return html`
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo"
        value=${state.todos.input}
        autofocus
        placeholder="What needs to be done?"
        onkeydown=${createTodo} />
    </header>
  `

  function createTodo (e) {
    var value = e.target.value
    if (!value) return
    if (e.keyCode === 13) {
      emit('todos:input', '')
      emit('todos:create', value)
    } else {
      emit('todos:input', value)
    }
  }
}

function Footer (state, emit) {
  var filter = state.href.replace(/^\//, '') || ''
  var activeCount = state.todos.active.length
  var hasDone = state.todos.done.length

  return html`
    <footer class="footer">
      <span class="todo-count">
        <strong>${activeCount}</strong>
        item${state.todos.all === 1 ? '' : 's'} left
      </span>
      <ul class="filters">
        ${filterButton('All', '', filter, emit)}
        ${filterButton('Active', 'active', filter, emit)}
        ${filterButton('Completed', 'completed', filter, emit)}
      </ul>
      ${hasDone ? deleteCompleted(emit) : ''}
    </footer>
  `

  function filterButton (name, filter, currentFilter, emit) {
    var filterClass = filter === currentFilter
      ? 'selected'
      : ''

    var uri = '#' + name.toLowerCase()
    if (uri === '#all') uri = '/'
    return html`
      <li>
        <a href=${uri} class=${filterClass}>
          ${name}
        </a>
      </li>
    `
  }

  function deleteCompleted (emit) {
    return html`
      <button class="clear-completed" onclick=${deleteAllCompleted}>
        Clear completed
      </button>
    `

    function deleteAllCompleted () {
      emit('todos:deleteCompleted')
    }
  }
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
