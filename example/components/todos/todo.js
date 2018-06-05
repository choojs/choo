var html = require('bel')

module.exports = Todo

function Todo (todo, emit) {
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
    if (e.keyCode === 13) update(e) // Enter
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
