// mount.js
const documentReady = require('document-ready')
const assert = require('assert')
const yo = require('yo-yo')

module.exports = mount

// (str, html) -> null
function mount (selector, newTree) {
  assert.equal(typeof selector, 'string', 'choo/mount: selector should be a string')
  assert.equal(typeof newTree, 'object', 'choo/mount: newTree should be an object')

  const done = newTree.done

  documentReady(function onReady () {
    const _rootNode = document.querySelector(selector)
    assert.ok(_rootNode, 'could not query selector: ' + selector)

    // copy script tags from the old newTree to the new newTree so
    // we can pass a <body> element straight up
    if (_rootNode.nodeName === 'BODY') {
      const children = _rootNode.childNodes
      for (var i = 0; i < children.length; i++) {
        if (children[i].nodeName === 'SCRIPT') {
          newTree.appendChild(children[i].cloneNode(true))
        }
      }
    }

    const newNode = yo.update(_rootNode, newTree)
    assert.equal(newNode, _rootNode, 'choo/mount: The DOM node: \n' +
      newNode.outerHTML + '\n is not equal to \n' + newTree.outerHTML +
      'choo cannot begin diffing.' +
      ' Make sure the same initial tree is rendered in the browser' +
      ' as on the server. Check out the choo handbook for more information')

    // pass the node we mounted on back into choo
    if (done) done(newNode)
  })
}
