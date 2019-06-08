module.exports = todoStore

function todoStore (state, emitter) {
  state.todos = {
    clock: 0,
    idCounter: 0,
    active: [],
    done: [],
    all: []
  }

  emitter.on('DOMContentLoaded', function () {
    emitter.on('todos:create', create)
    emitter.on('todos:update', update)
    emitter.on('todos:delete', del)
    emitter.on('todos:edit', edit)
    emitter.on('todos:unedit', unedit)
    emitter.on('todos:toggle', toggle)
    emitter.on('todos:toggleAll', toggleAll)
    emitter.on('todos:deleteCompleted', deleteCompleted)
  })

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
    render()
  }

  function edit (id) {
    state.todos.all.forEach(function (todo) {
      if (todo.id === id) todo.editing = true
    })
    render()
  }

  function unedit (id) {
    state.todos.all.forEach(function (todo) {
      if (todo.id === id) todo.editing = false
    })
    render()
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

    Object.assign(todo, newTodo)
    render()
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
    render()
  }

  function deleteCompleted (data) {
    var done = state.todos.done
    done.forEach(function (todo) {
      var index = state.todos.all.indexOf(todo)
      state.todos.all.splice(index, 1)
    })
    state.todos.done = []
    render()
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
    render()
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

    render()
  }

  function render () {
    state.todos.clock += 1
    emitter.emit('render')
  }
}
