// mount.js
const documentReady = require('document-ready')
const assert = require('assert')
const yo = require('yo-yo')

module.exports = mount

function mount (selector, tree) {
  assert.equal(typeof selector, 'string')
  assert.equal(typeof tree, 'object')

  documentReady(function onReady () {
    const oldTree = document.querySelector(selector)
    assert.ok(oldTree, 'could not query selector: ' + selector)
    const newNode = yo.update(oldTree, tree)
    assert.equal(newNode, oldTree, 'choo/mount: The DOM node: \n' +
      newNode.outerHTML + '\n is not equal to \n' + oldTree.outerHTML +
      'choo cannot begin diffing.' +
      ' Make sure the same initial tree is rendered in the browser' +
      ' as on the server. Check out the choo handbook for more information')
  })
}
