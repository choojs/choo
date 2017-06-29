<h1 align="center">choo</h1>

<div align="center">
  :steam_locomotive::train::train::train::train::train:
</div>
<div align="center">
  <strong>Fun functional programming</strong>
</div>
<div align="center">
  A <code>4kb</code> framework for creating sturdy frontend applications
</div>

<br />

<div align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square"
      alt="API stability" />
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/choo">
    <img src="https://img.shields.io/npm/v/choo.svg?style=flat-square"
      alt="NPM version" />
  </a>
  <!-- Build Status -->
  <a href="https://travis-ci.org/yoshuawuyts/choo">
    <img src="https://img.shields.io/travis/yoshuawuyts/choo/master.svg?style=flat-square"
      alt="Build Status" />
  </a>
  <!-- Test Coverage -->
  <a href="https://codecov.io/github/yoshuawuyts/choo">
    <img src="https://img.shields.io/codecov/c/github/yoshuawuyts/choo/master.svg?style=flat-square"
      alt="Test Coverage" />
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/choo">
    <img src="https://img.shields.io/npm/dm/choo.svg?style=flat-square"
      alt="Downloads" />
  </a>
  <!-- Standard -->
  <a href="https://standardjs.com">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square"
      alt="Standard" />
  </a>
</div>

<div align="center">
  <h3>
    <a href="https://choo.io">
      Website
    </a>
    <span> | </span>
    <a href="https://github.com/yoshuawuyts/choo-handbook">
      Handbook
    </a>
    <span> | </span>
    <a href="https://github.com/YerkoPalma/awesome-choo">
      Ecosystem
    </a>
    <span> | </span>
    <!-- <a href="https://github.com/trainyard/choo-cli"> -->
    <!--   CLI -->
    <!-- </a> -->
    <!-- <span> | </span> -->
    <a href="https://github.com/yoshuawuyts/choo/blob/master/.github/CONTRIBUTING.md">
      Contributing
    </a>
    <span> | </span>
    <a href="https://webchat.freenode.net/?channels=choo">
      Chat
    </a>
  </h3>
</div>

<div align="center">
  <sub>The little framework that could. Built with ❤︎ by
  <a href="https://twitter.com/yoshuawuyts">Yoshua Wuyts</a> and
  <a href="https://github.com/yoshuawuyts/choo/graphs/contributors">
    contributors
  </a>
</div>

## Table of Content
- [Features](#features)
- [Example](#example)
- [Philosophy](#philosophy)
- [Events](#events)
- [State](#state)
- [Routing](#routing)
- [Server Rendering](#server-rendering)
- [Optimizations](#optimizations)
- [FAQ](#faq)
- [API](#api)
- [Installation](#installation)
- [See Also](#see-also)
- [Support](#support)

## Features
- __minimal size:__ weighing `4kb`, `choo` is a tiny little framework
- __event based:__ our performant event system makes writing apps easy
- __small api:__ with only 6 methods there's not much to learn
- __minimal tooling:__ built for the cutting edge `browserify` compiler
- __isomorphic:__ renders seamlessly in both Node and browsers
- __very cute:__ choo choo!

## Example
```js
var html = require('choo/html')
var log = require('choo-log')
var choo = require('choo')

var app = choo()
app.use(log())
app.use(countStore)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <h1>count is ${state.count}</h1>
      <button onclick=${onclick}>Increment</button>
    </body>
  `

  function onclick () {
    emit('increment', 1)
  }
}

function countStore (state, emitter) {
  state.count = 0
  emitter.on('increment', function (count) {
    state.count += count
    emitter.emit('render')
  })
}
```
Want to see more examples? Check out the [Choo handbook][handbook].

## Philosophy
We believe programming should be fun and light, not stern and stressful. It's
cool to be cute; using serious words without explaining them doesn't make for
better results - if anything it scares people off. We don't want to be scary,
we want to be nice and fun, and then _casually_ be the best choice around.
_Real casually._

We believe frameworks should be disposable, and components recyclable. We don't
want a web where walled gardens jealously compete with one another. By making
the DOM the lowest common denominator, switching from one framework to another
becomes frictionless. `choo` is modest in its design; we don't believe it will
be top of the class forever, so we've made it as easy to toss out as it is to
pick up.

We don't believe that bigger is better. Big APIs, large complexities, long
files - we see them as omens of impending userland complexity. We want everyone
on a team, no matter the size, to fully understand how an application is laid
out. And once an application is built, we want it to be small, performant and
easy to reason about. All of which makes for easy to debug code, better results
and super smiley faces.

## Events
At the core of Choo is an event emitter, which is used for both application
logic but also to interface with the framework itself. The package we use for
this is [nanobus](https://github.com/yoshuawuyts/nanobus).

You can access the emitter through `app.use(state, emitter)`, `app.route(route,
view(state, emit))` or `app.emitter`. Routes only have access to the
`emitter.emit` method to encourage people to separate business logic from
render logic.

The purpose of the emitter is two-fold: it allows wiring up application code
together, and splitting it off nicely - but it also allows communicating with
the Choo framework itself. All events can be read as constants from
`state.events`. Choo ships with the following events built in:

### `'DOMContentLoaded'`|`state.events.DOMCONTENTLOADED`
Choo emits this when the DOM is ready. Similar to the DOM's
`'DOMContentLoaded'` event, except it will be emitted even if the listener is
added _after_ the DOM became ready. Uses
[document-ready](https://github.com/bendrucker/document-ready) under the hood.

### `'render'`|`state.events.RENDER`
This event should be emitted to re-render the DOM. A common pattern is to
update the `state` object, and then emit the `'render'` event straight after.
Note that `'render'` will only have an effect once the `DOMContentLoaded` event
has been fired.

### `'navigate'`|`state.events.NAVIGATE`
Choo emits this event whenever routes change. This is triggered by either
`'pushState'`, `'replaceState'` or `'popState'`.

### `'pushState'`|`state.events.PUSHSTATE`
This event should be emitted to navigate to a new route. The new route is added
to the browser's history stack, and will emit `'navigate'` and `'render'`.
Similar to
[history.pushState](http://devdocs.io/dom/history_api).

### `'replaceState'`|`state.events.REPLACESTATE`
This event should be emitted to navigate to a new route. The new route replaces
the current entry in the browser's history stack, and will emit `'navigate'`
and `'render'`. Similar to
[history.replaceState](http://devdocs.io/dom/history#history-replacestate).

### `'popState'`|`state.events.POPSTATE`
This event should be emitted to navigate to a previous route. The new route
will be a previous entry in the browser's history stack, and will emit
`'navigate'` and `'render'`. Similar to
[history.popState](http://devdocs.io/dom_events/popstate).

## State
Choo comes with a shared state object. This object can be mutated freely, and
is passed into the view functions whenever `'render'` is emitted. The state
object comes with a few properties set.

### `state.events`
A mapping of Choo's built in events. It's recommended to extend this object
with your application's events. By defining your event names once and setting
them on `state.events`, it reduces the chance of typos, generally autocompletes
better, makes refactoring easier and compresses better.

### `state.params`
The current params taken from the route. E.g. `/foo/:bar` becomes available as
`state.params.bar` If a wildcard route is used (`/foo/*`) it's available as
`state.params.wildcard`.

### `state.query`
An object containing the current queryString. `/foo?bin=baz` becomes `{ bin:
'baz' }`.

### `state.route`
The current name of the route used in the router (e.g. `/foo/:bar`).

## Routing
Choo is an application level framework. This means that it takes care of
everything related to routing and pathnames for you.

### Params
Params can be registered by prepending the routename with `:routename`, e.g.
`/foo/:bar/:baz`. The value of the param will be saved on `state.params` (e.g.
`state.params.bar`). Wildcard routes can be registered with `*`, e.g. `/foo/*`.
The value of the wildcard will be saved under `state.params.wildcard`.

### Default routes
Sometimes a route doesn't match, and you want to display a page to handle it.
You can do this by declaring `app.route('*', handler)` to handle all routes
that didn't match anything else.

### Querystrings
Querystrings (e.g. `?foo=bar`) are ignored when matching routes. An object
containing the key-value mappings exists as `state.query`.

### Hash routing
Using hashes to delimit routes is supported out of the box (e.g. `/foo#bar`).
When a hash is found we also check if there's an available anchor on the same
page, and will scroll the screen to the position. Using both hashes in URLs and
anchor links on the page is generally not recommended.

### Following links
By default all clicks on `<a>` tags are handled by the router. If the `href=""`
attrbibute points to the same `origin` (e.g. the same page), and it doesn't
have a `rel="nooper"` attribute or similar, we handle the route. This can be
disabled application-wide by passing `{ href: false }` to the application
constructor. Uses [nanohref](https://github.com/yoshuawuyts/nanohref) under the
hood.

### Navigating programmatically
To can navigate routes you can emit `'pushState'`, `'popState'` or
`'replaceState'`. See [#events](#events) for more details about these events.

## Server Rendering
Choo was built with Node in mind. To render on the server call `.toString()` on
your application.

```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.route('/', function (state, emit) {
  return html`<div>Hello ${state.name}</div>`
})

var state = { name: 'Node' }
var string = app.toString('/', state)

console.log(string)
// => '<div>Hello Node</div>'
```

## Optimizations
Choo is reasonably fast out of the box. But sometimes you might hit a scenario
where a particular part of the UI slows down the application, and you want to
speed it up. Here are some optimizations that are possible.

### Caching DOM elements
Sometimes we want to tell the algorithm to not evaluate certain nodes (and its
children). This can be because we're sure they haven't changed, or perhaps
because another piece of code is managing that part of the DOM tree. To achieve
this `nanomorph` evaluates the `.isSameNode()` method on nodes to determine if
they should be updated or not.

```js
var el = html`<div>node</div>`

// tell nanomorph to not compare the DOM tree if they're both divs
el.isSameNode = function (target) {
  return (target && target.nodeName && target.nodeName === 'DIV')
}
```

### Reordering lists
It's common to work with lists of elements on the DOM. Adding, removing or
reordering elements in a list can be rather expensive. To optimize this you can
add an `id` attribute to a DOM node. When reordering nodes it will compare
nodes with the same ID against each other, resulting in far fewer re-renders.
This is especially potent when coupled with DOM node caching.

```js
var el = html`
  <section>
    <div id="first">hello</div>
    <div id="second">world</div>
  </section>
`
```

### Pruning dependencies
We use the `require('assert')` module from Node core to provide helpful error
messages in development. In production you probably want to strip this using
[unassertify][unassertify].

To convert inlined HTML to valid DOM nodes we use `require('bel')`. This has
overhead during runtime, so for production environments we should unwrap this
using [yo-yoify][yo-yoify].

Setting up browserify transforms can sometimes be a bit of hassle; to make this
more convenient we recommend using [bankai][bankai] with `--optimize` to
compile your assets for production.

## FAQ
### Why is it called choo?
Because I thought it sounded cute. All these programs talk about being
_"performant"_, _"rigid"_, _"robust"_ - I like programming to be light, fun and
non-scary. `choo` embraces that.

Also imagine telling some business people you chose to rewrite something
critical for serious bizcorp using a train themed framework.
:steam_locomotive::train::train::train:

### Is it called choo, choo.js or...?
It's called "choo", though we're fine if you call it "choo-choo" or
"chugga-chugga-choo-choo" too. The only time "choo.js" is tolerated is if /
when you shimmy like you're a locomotive.

### Does choo use a virtual-dom?
`choo` uses [nanomorph][nanomorph], which diffs real DOM nodes instead of
virtual nodes. It turns out that [browsers are actually ridiculously good at
dealing with DOM nodes][morphdom-bench], and it has the added benefit of
working with _any_ library that produces valid DOM nodes. So to put a long
answer short: we're using something even better.

### How can I support older browsers?
Template strings aren't supported in all browsers, and parsing them creates
significant overhead. To optimize we recommend running `browserify` with
[yo-yoify][yo-yoify] as a global transform or using [bankai][bankai] directly.
```sh
$ browserify -g yo-yoify
```

### Is choo production ready?
Sure.

## API
This section provides documentation on how each function in `choo` works. It's
intended to be a technical reference. If you're interested in learning choo for
the first time, consider reading through the [handbook][handbook] first
:sparkles:

### `app = choo([opts])`
Initialize a new `choo` instance. `opts` can also contain the following values:
- __opts.history:__ default: `true`. Listen for url changes through the
  history API.
- __opts.href:__ default: `true`. Handle all relative `<a
  href="<location>"></a>` clicks and call `emit('render')`

### `app.use(callback(state, emitter))`
Call a function and pass it a `state` and `emitter`. `emitter` is an instance
of [nanobus](https://github.com/yoshuawuyts/nanobus/). You can listen to
messages by calling `emitter.on()` and emit messages by calling
`emitter.emit()`.

See [#events](#events) for an overview of all events.

### `app.route(routeName, handler(state, emit))`
Register a route on the router. The handler function is passed `app.state`
and `app.emitter.emit` as arguments. Uses [nanorouter][nanorouter] under the
hood.

See [#routing](#routing) for an overview of how to use routing efficiently.

### `app.mount(selector)`
Start the application and mount it on the given `querySelector`. Uses
[nanomount][nanomount] under the hood. This will _replace_ the selector provided
with the tree returned from `app.start()`. If you want to add the app as a child
to an element, use `app.start()` to obtain the tree and manually append it.

### `tree = app.start()`
Start the application. Returns a tree of DOM nodes that can be mounted using
`document.body.appendChild()`.

### `app.toString(location, [state])`
Render the application to a string. Useful for rendering on the server.

### `choo/html`
Create DOM nodes from template string literals. Exposes
[bel](https://github.com/shama/bel). Can be optimized using
[yo-yoify][yo-yoify].

## Installation
```sh
$ npm install choo
```

## See Also
- [bankai](https://github.com/yoshuawuyts/bankai) - streaming asset compiler
- [stack.gl](http://stack.gl/) - open software ecosystem for WebGL
- [yo-yo](https://github.com/maxogden/yo-yo) - tiny library for modular UI
- [bel](https://github.com/shama/bel) - composable DOM elements using template
  strings
- [tachyons](https://github.com/tachyons-css/tachyons) - functional CSS for
  humans
- [sheetify](https://github.com/stackcss/sheetify) - modular CSS bundler for
  `browserify`

## Support
Creating a quality framework takes a lot of time. Unlike others frameworks,
Choo is completely independently funded. We fight for our users. This does mean
however that we also have to spend time working contracts to pay the bills.
This is where you can help: by chipping in you can ensure more time is spent
improving Choo rather than dealing with distractions.

### Sponsors
Become a sponsor and help ensure the development of independent quality
software. You can help us keep the lights on, bellies full and work days sharp
and focused on improving the state of the web. [Become a
sponsor](https://opencollective.com/choo#sponsor)

<a href="https://opencollective.com/choo/sponsor/0/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/1/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/2/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/3/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/4/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/5/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/6/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/7/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/8/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/9/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/10/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/11/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/12/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/13/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/14/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/15/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/16/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/17/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/18/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/19/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/20/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/21/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/22/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/23/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/24/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/25/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/26/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/27/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/28/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/29/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/29/avatar.svg"></a>

### Backers
Become a backer, and buy us a coffee (or perhaps lunch?) every month or so.
[Become a backer](https://opencollective.com/choo#backer)

<a href="https://opencollective.com/choo/backer/0/website" target="_blank"><img src="https://opencollective.com/choo/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/1/website" target="_blank"><img src="https://opencollective.com/choo/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/2/website" target="_blank"><img src="https://opencollective.com/choo/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/3/website" target="_blank"><img src="https://opencollective.com/choo/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/4/website" target="_blank"><img src="https://opencollective.com/choo/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/5/website" target="_blank"><img src="https://opencollective.com/choo/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/6/website" target="_blank"><img src="https://opencollective.com/choo/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/7/website" target="_blank"><img src="https://opencollective.com/choo/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/8/website" target="_blank"><img src="https://opencollective.com/choo/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/9/website" target="_blank"><img src="https://opencollective.com/choo/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/10/website" target="_blank"><img src="https://opencollective.com/choo/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/11/website" target="_blank"><img src="https://opencollective.com/choo/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/12/website" target="_blank"><img src="https://opencollective.com/choo/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/13/website" target="_blank"><img src="https://opencollective.com/choo/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/14/website" target="_blank"><img src="https://opencollective.com/choo/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/15/website" target="_blank"><img src="https://opencollective.com/choo/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/16/website" target="_blank"><img src="https://opencollective.com/choo/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/17/website" target="_blank"><img src="https://opencollective.com/choo/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/18/website" target="_blank"><img src="https://opencollective.com/choo/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/19/website" target="_blank"><img src="https://opencollective.com/choo/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/20/website" target="_blank"><img src="https://opencollective.com/choo/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/21/website" target="_blank"><img src="https://opencollective.com/choo/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/22/website" target="_blank"><img src="https://opencollective.com/choo/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/23/website" target="_blank"><img src="https://opencollective.com/choo/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/24/website" target="_blank"><img src="https://opencollective.com/choo/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/25/website" target="_blank"><img src="https://opencollective.com/choo/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/26/website" target="_blank"><img src="https://opencollective.com/choo/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/27/website" target="_blank"><img src="https://opencollective.com/choo/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/28/website" target="_blank"><img src="https://opencollective.com/choo/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/29/website" target="_blank"><img src="https://opencollective.com/choo/backer/29/avatar.svg"></a>

## License
[MIT](https://tldrlegal.com/license/mit-license)

[bankai]: https://github.com/yoshuawuyts/bankai
[bel]: https://github.com/shama/bel
[browserify]: https://github.com/substack/node-browserify
[budo]: https://github.com/mattdesl/budo
[es2020]: https://github.com/yoshuawuyts/es2020
[handbook]: https://github.com/yoshuawuyts/choo-handbook
[hyperx]: https://github.com/substack/hyperx
[morphdom-bench]: https://github.com/patrick-steele-idem/morphdom#benchmarks
[nanomorph]: https://github.com/yoshuawuyts/nanomorph
[nanorouter]: https://github.com/yoshuawuyts/nanorouter
[nanomount]: https://github.com/yoshuawuyts/nanomount
[yo-yo]: https://github.com/maxogden/yo-yo
[yo-yoify]: https://github.com/shama/yo-yoify
[unassertify]: https://github.com/unassert-js/unassertify
[window-performance]: https://developer.mozilla.org/en-US/docs/Web/API/Performance
