var html = require('nanohtml')

module.exports = filterButton

function filterButton (name, filter, currentFilter, emit) {
  var filterClass = filter === currentFilter
    ? 'selected'
    : ''

  var uri = '#' + name.toLowerCase()
  if (uri === '#all') uri = '/'

  return html`<li>
    <a href=${uri} class=${filterClass}>
      ${name}
    </a>
  </li>`
}
