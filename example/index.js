var Microbounce = require('microbounce')
var Microframe = require('microframe')
var mutate = require('xtend/mutable')
var expose = require('choo-expose')
var css = require('sheetify')
var html = require('bel')
var choo = require('../')

css('todomvc-common/base.css')
css('todomvc-app-css/index.css')

// we export this so tests can run
if (module.parent) {
  exports.todoStore = todoStore
} else {
  var app = choo()

  if (process.env.NODE_ENV !== 'production') {
    var persist = require('choo-persist')
    var logger = require('choo-log')
    app.use(persist())
    app.use(logger())
  }
  app.use(expose())
  app.use(todoStore)

  app.route('/', mainView)
  app.route('#active', mainView)
  app.route('#completed', mainView)
  app.mount('body')
}

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

function todoStore (state, emitter) {
  // Default values
  if (!state.todos) {
    state.todos = {}

    state.todos.active = []
    state.todos.done = []
    state.todos.all = []

    state.todos.idCounter = 0
  }

  // Always reset when application boots
  state.todos.input = ''

  // Register emitters after DOM is loaded to speed up DOM loading
  emitter.on('DOMContentLoaded', function () {
    emitter.emit('log:debug', 'Loading todos model')

    // CRUD
    emitter.on('todos:create', create)
    emitter.on('todos:update', update)
    emitter.on('todos:delete', del)

    // Special
    emitter.on('todos:input', oninput)

    // Shorthand
    emitter.on('todos:edit', edit)
    emitter.on('todos:unedit', unedit)
    emitter.on('todos:toggle', toggle)
    emitter.on('todos:toggleAll', toggleAll)
    emitter.on('todos:deleteCompleted', deleteCompleted)
  })

  function oninput (text) {
    state.todos.input = text
  }

  function create (name) {
    var item = {
      id: state.todos.idCounter,
      editing: false,
      done: false,
      name: name
    }

    state.todos.idCounter += 1
    state.todos.active.push(item)
    state.todos.all.push(item)
    emitter.emit('render')
  }

  function edit (id) {
    state.todos.all.forEach(function (todo) {
      if (todo.id === id) todo.editing = true
    })
    emitter.emit('render')
  }

  function unedit (id) {
    state.todos.all.forEach(function (todo) {
      if (todo.id === id) todo.editing = false
    })
    emitter.emit('render')
  }

  function update (newTodo) {
    var todo = state.todos.all.filter(function (todo) {
      return todo.id === newTodo.id
    })[0]

    if (newTodo.done && todo.done === false) {
      state.todos.active.splice(state.todos.active.indexOf(todo), 1)
      state.todos.done.push(todo)
    } else if (newTodo.done === false && todo.done) {
      state.todos.done.splice(state.todos.done.indexOf(todo), 1)
      state.todos.active.push(todo)
    }

    mutate(todo, newTodo)
    emitter.emit('render')
  }

  function del (id) {
    var i = null
    var todo = null
    state.todos.all.forEach(function (_todo, j) {
      if (_todo.id === id) {
        i = j
        todo = _todo
      }
    })
    state.todos.all.splice(i, 1)

    if (todo.done) {
      var done = state.todos.done
      var doneIndex
      done.forEach(function (_todo, j) {
        if (_todo.id === id) {
          doneIndex = j
        }
      })
      done.splice(doneIndex, 1)
    } else {
      var active = state.todos.active
      var activeIndex
      active.forEach(function (_todo, j) {
        if (_todo.id === id) {
          activeIndex = j
        }
      })
      active.splice(activeIndex, 1)
    }
    emitter.emit('render')
  }

  function deleteCompleted (data) {
    var done = state.todos.done
    done.forEach(function (todo) {
      var index = state.todos.all.indexOf(todo)
      state.todos.all.splice(index, 1)
    })
    state.todos.done = []
    emitter.emit('render')
  }

  function toggle (id) {
    var todo = state.todos.all.filter(function (todo) {
      return todo.id === id
    })[0]
    var done = todo.done
    todo.done = !done
    var arr = done ? state.todos.done : state.todos.active
    var target = done ? state.todos.active : state.todos.done
    var index = arr.indexOf(todo)
    arr.splice(index, 1)
    target.push(todo)
    emitter.emit('render')
  }

  function toggleAll (data) {
    var todos = state.todos.all
    var allDone = state.todos.all.length &&
      state.todos.done.length === state.todos.all.length

    todos.forEach(function (todo) {
      todo.done = !allDone
    })

    if (allDone) {
      state.todos.done = []
      state.todos.active = state.todos.all
    } else {
      state.todos.done = state.todos.all
      state.todos.active = []
    }

    emitter.emit('render')
  }
}

function Footer (state, emit) {
  var filter = window.location.hash.replace(/^#/, '')
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

var debounce = Microbounce(256)
var nextFrame = Microframe()
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
      nextFrame(function () {
        emit('todos:input', '')
        emit('todos:create', value)
      })
    } else {
      debounce(function () {
        nextFrame(function () {
          emit('todos:input', value)
        })
      })
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
  var filter = window.location.hash.replace(/^#/, '')
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
