const createLocation = require('sheet-router/create-location')
const onHistoryChange = require('sheet-router/history')
const document = require('global/document')
const onHref = require('sheet-router/href')

module.exports = createLocationModel

// application location model
// obj -> obj
function createLocationModel (opts) {
  return {
    namespace: 'location',
    state: createLocation(null, document.location),
    subscriptions: createSubscriptions(opts),
    effects: { set: setLocation },
    reducers: { update: update }
  }

  function update (location, state) {
    return location
  }

  function setLocation (patch, state, send, done) {
    const location = createLocation(state, patch)
    if (opts.history !== false && location.href !== state.href) {
      window.history.pushState({}, null, location.href)
    }
    send('location:update', location, done)
  }

  function createSubscriptions (opts) {
    const subs = {}

    if (opts.history !== false) {
      subs.handleHistory = function (send, done) {
        onHistoryChange(function navigate (pathname) {
          send('location:set', { pathname: pathname }, done)
        })
      }
    }

    if (opts.href !== false) {
      subs.handleHref = function (send, done) {
        onHref(function navigate (pathname) {
          send('location:set', { pathname: pathname }, done)
        })
      }
    }

    return subs
  }
}
