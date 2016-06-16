<h1 align="center">choo</h1>

<div align="center">
  :steam_locomotive::train::train::train::train::train:
</div>
<div align="center">
  <strong>Fun functional programming</strong>
</div>
<div align="center">
  A <code>7kb</code> framework for creating sturdy frontend applications
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
  <a href="https://codecov.io/github/yoshuawuyts/choo">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square"
      alt="Standard" />
  </a>
</div>

<br />

<div align="center">
  <sub>The little framework that could. Built with ❤︎ by
  <a href="https://twitter.com/yoshuawuyts">Yoshua Wuyts</a> and
  <a href="https://github.com/yoshuawuyts/choo/graphs/contributors">
    contributors
  </a>
</div>

## Table of Content
- [Features](#features)
- [Demos](#demos)
- [Getting started](#getting-started)
- [Concepts](#concepts)
  - [Models](#models)
  - [Actions](#actions)
  - [Effects](#effects)
  - [Subscriptions](#subscriptions)
  - [Router](#router)
  - [Views](#views)
- [Common actions](#common-actions)
  - [HTTP](#http)
  - [Server sent events](#server-sent-events-sse)
  - [Keyboard](#keyboard)
  - [Websockets](#websockets)
  - [Forms](#forms)
  - [Links](#links)
  - [Rendering in Node](#rendering-in-node)
- [API](#api)
- [Errors](#errors)
- [FAQ](#faq)
- [Installation](#installation)
- [See Also](#see-also)
- [License](#license)

## Features
- __minimal size:__ weighing `7kb`, `choo` is a tiny little framework
- __single state:__ immutable single state helps reason about changes
- __small api:__ with only 6 methods, there's not a lot to learn
- __minimal tooling:__ built for the cutting edge `browserify` compiler
- __transparent side effects:__ using `effects` and `subscriptions` brings
  clarity to IO
- __omakase:__ composed out of a balanced selection of open source packages
- __idempotent:__ renders seamlessly in both Node and browsers
- __very cute:__ choo choo!

## Demos
- [Input example](https://github.com/yoshuawuyts/choo/tree/master/examples/title)
  ([requirebin](http://requirebin.com/?gist=e589473373b3100a6ace29f7bbee3186))
- [HTTP effects example](https://fork-fang.hyperdev.space/)
  ([hyperdev](https://hyperdev.com/#!/project/fork-fang))
- [Mailbox routing example](https://github.com/yoshuawuyts/choo/tree/master/examples/mailbox)
  (@examples directory)
- [TodoMVC](http://shuheikagawa.com/todomvc-choo/)
  ([github](https://github.com/shuhei/todomvc-choo))

_note: If you've built something cool using `choo` or are using it in
production, we'd love to hear from you!_

## Getting started
Let's create an input box that changes the content of a textbox in real time.
[Click here to see the final app](http://requirebin.com/?gist=e589473373b3100a6ace29f7bbee3186).

First we import `choo` and create a new instance:
```js
const choo = require('choo')
const app = choo()
```

Then we define a model. We set an initial value of `state` and a `reducer` that
can be called to modify it:
```js
app.model({
  state: { title: 'Set the title' },
  reducers: {
    update: (action, state) => ({ title: action.value })
  }
})
```

Then we create a new view. It has an `h1` tag which displays the current title,
and an `<input>` field which sends the current value of the text box on every
input:
```js
const mainView = (params, state, send) => choo.view`
  <main>
    <h1>${state.title}</h1>
    <input
      type="text"
      oninput=${(e) => send('update', { value: e.target.value })}>
  </main>
`
```

_Note_: if an `id` property is defined on the outer-most element it will be
replaced.

We then bind the view to the `/` route on our application
```js
app.router((route) => [
  route('/', mainView)
])
```

And then start the app and append it to the DOM. You can now run it and [see it
in action!](http://requirebin.com/?gist=e589473373b3100a6ace29f7bbee3186)
```js
const tree = app.start()
document.body.appendChild(tree)
```

And all together now:
```js
const choo = require('choo')
const app = choo()

app.model({
  state: { title: 'Set the title' },
  reducers: {
    update: (action, state) => ({ title: action.value })
  }
})

const mainView = (params, state, send) => choo.view`
  <main>
    <h1>${state.title}</h1>
    <input
      type="text"
      oninput=${(e) => send('update', { value: e.target.value })}>
  </main>
`

app.router((route) => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
```

## Concepts
`choo` cleanly structures internal data flow, so that all pieces of logic can
be combined into a nice, cohesive machine. Internally all logic lives within
`models` that contain several properties. `subscriptions` are functions that
are called at startup and have `send()` passed in, so they act as read-only
sources of data. `effects` react to changes, perform an `action` and can then
post the results. `reducers` take data, modify it, and update the internal
`state`.

Communication of data is done using objects called `actions`. Each `action` has
any number of properties for data, and a unique `type` that can trigger
properties on the models.

When a `reducer` modifies `state`, the `router` is called, which in turn calls
`views`. `views` take `state` and return [DOM][dom] nodes which are then
efficiently rendered on the screen.

In turn when the `views` are rendered, the `user` can interact with elements by
clicking on them, triggering `actions` which then flow back into the
application logic. This is the _unidirectional_ architecture of `choo`.
```txt
 ┌─────────────────┐
 │  Subscriptions ─┤     User ───┐
 └─ Effects  ◀─────┤             ▼
 ┌─ Reducers ◀─────┴──Actions── DOM ◀┐
 │                                   │
 └▶ Router ─────State ───▶ Views ────┘
```
- __user:__ 🙆
- __DOM:__ the [Document Object Model][dom] is what is currently displayed in
  your browser
- __actions:__ a named event with optional properties attached. Used to call
  `effects` and `reducers` that have been registered in `models`
- __model:__ optionally namespaced object containing `subscriptions`,
  `effects`, `reducers` and initial `state`
- __subscriptions:__ read-only data sources that emit `actions`
- __effects:__ asynchronous functions that emit an `action` when done
- __reducers:__ synchronous functions that modify `state`
- __state:__ a single object that contains __all__ the values used in your
  application
- __router:__ determines which `view` to render
- __views:__ take `state` and returns a new `DOM tree` that is rendered in the
  browser

## Models
`models` are objects that contain initial `state`, `subscriptions`, `effects`
and `reducers`. They're generally grouped around a theme (or domain, if you
like). To provide some sturdiness to your `models`, they can either be
namespaced or not. Namespacing means that only state within the model can be
accessed. Models can still trigger actions on other models, though it's
recommeded to keep that to a minimum.

So say we have a `todos` namespace, an `add` reducer and a `todos` model.
Outside the model they're called by `send('todos:add')` and
`state.todos.todos`. Inside the namespaced model they're called by
`send('todos:add')` and `state.todos`. An example namespaced model:
```js
const app = choo()
app.model({
  namespace: 'todos',
  state: { todos: [] },
  reducers: {
    add: (state, action) => ({ todos: state.todos.concat(action.payload) })
  }
})
```

In most cases using namespaces is beneficial, as having clear boundries makes
it easier to follow logic. But sometimes you need to call `actions` that
operate over multiple domains (such as a "logout" `action`), or have a
`subscription` that might trigger multiple `reducers` (such as a `websocket`
that calls a different `action` based on the incoming data).

In these cases you probably want to have a `model` that doesn't use namespaces,
and has access to the full application state. Try and keep the logic in these
`models` to a minimum, and declare as few `reducers` as possible. That way the
bulk of your logic will safely shielded, with only a few points touching every
part of your application.

## Effects
Side effects are done through `effects` declared in `app.model()`. Unlike
`reducers` they cannot modify the state by returning objects, but get a
callback passed which is used to emit `actions` to handle results. Use effects
every time you don't need to modify the state object directly, but wish to
respond to an action.

A typical `effect` flow looks like:

1. An action is received
2. An effect is triggered
3. The effect performs an async call
4. When the async call is done, either a success or error action is emitted
5. A reducer catches the action and updates the state

## Subscriptions
Subscriptions are a way of receiving data from a source. For example when
listening for events from a server using `SSE` or `Websockets` for a
chat app, or when catching keyboard input for a videogame.

An example subscription that logs `"dog?"` every second:
```js
const app = choo()
choo.model({
  subscriptions: [
    (send) => setTimeout(() => send('app:print', { payload: 'dog?' }), 1000)
  ],
  effects: {
    'app:print': (state, action) => console.log(action.payload)
  }
})
```

## Router
The `router` manages which `views` are rendered at any given time. It also
supports rendering a default `view` if no routes match.

```js
const app = choo()
app.router('/404', (route) => [
  route('/', require('./views/empty')),
  route('/404', require('./views/error')),
  route('/:mailbox', require('./views/mailbox'), [
    route('/:message', require('./views/email'))
  ])
])
```

Routes on the `router` are passed in as a nested array. This means that the
entry point of the application also becomes a site map, making it easier to
figure out how views relate to each other.

Under the hood `choo` uses [sheet-router][sheet-router]. Internally the
currently rendered route is kept in `state.app.location`. If you want to modify
the location programmatically the `reducer` for the location can be called
using `send('app:location', { location: href })`. This will not work from
within namespaced `models`, and usage should preferably be kept to a minimum.
Changing views all over the place tends to lead to messiness.

## Views
[docs wip]

## Common Actions
### HTTP
`choo` ships with a built-in [`http` module](https://github.com/Raynos/xhr)
that weighs only `2.4kb`:
```js
const http = require('choo/http')
const choo = require('choo')
const app = choo()

app.model({
  effects: {
    'app:error': (state, event) => console.error(`error: ${event.payload}`)),
    'app:print': (state, event) => console.log(`http: ${event.payload}`),
    'http:get_json': getJson,
    'http:post_json': postJson,
    'http:delete': httpDelete
  }
})

function getJson (state, action, send) {
  http.get('/my-endpoint', { json: true }, function (err, res, body) {
    if (err) return send('app:error', { payload: err.message })
    if (res.statusCode !== 200 || !body) {
      return send('app:error', { payload:'something went wrong' })
    }
    send('app:print', { payload: body })
  })
}

function postJson (state, action, send) {
  const body = { foo: 'bar' }
  http.post('/my-endpoint', { json: body }, function (err, res, body) {
    if (err) return send('app:error', { payload: err.message })
    if (res.statusCode !== 200 || !body) {
      return send('app:error', { payload:'something went wrong' })
    }
    send('app:print', { payload: body })
  })
}

function httpDelete (state, action, send) {
  const body = { foo: 'bar' }
  http.post('/my-endpoint', { json: body }, function (err, res, body) {
    if (err) return send('app:error', { payload: err.message })
    if (res.statusCode !== 200) {
      return send('app:error', { payload:'something went wrong' })
    }
  })
}
```
Note that `http` only runs in the browser to prevent accidental requests when
rendering in Node. For more details view the [`raynos/xhr`
documentation](https://github.com/Raynos/xhr).

### Server Sent Events (SSE)
[Server Sent Events (SSE)][sse] allow servers to push data to the browser.
They're the unidirectional cousin of `websockets` and compliment `HTTP`
brilliantly. To enable `SSE`, create a new `EventSource`, point it at a local
uri (generally `/sse`) and setup a `subscription`:
```js
const stream = new document.EventSource('/sse')

app.model({
  subscriptions: [
    function (send) {
      stream.onerror = (e) => send('app:error', { payload: JSON.stringify(e) })
      stream.onmessage = (e) => send('app:print', { payload: e.data })
    }
  ],
  effects: {
    'sse:close': () => stream.close()
    'app:error': (state, event) => console.error(`error: ${event.payload}`),
    'app:print': (state, event) => console.log(`sse: ${event.payload}`)
  }
})
```
This code does not handle reconnects, server timeouts, exponential backoff and
queueing data. You might want to use a package from `npm` or [write your
own][sse-reconnect] if you're building something for production.

### Keyboard
Most browsers have [basic support for keyboard events][keyboard-support]. To
capture keyboard events, setup a `subscription`:
```js
app.model({
  namespace: 'input',
  subscriptions: [
    function (send) {
      onkeypress = (e) => send('input:print', { payload: e.keyCode })
    }
  ],
  effects: {
    print: (state) => console.log(`pressed key: ${state.payload}`)
  }
})
```

### WebSockets
[WebSockets][ws] allow for bidirectional communication between servers and
browsers:
```js
const socket = new document.WebSocket('ws://localhost:8081')

app.model({
  subscriptions: [
    function (send) {
      socket.onerror = (e) => send('app:error', { payload: JSON.stringify(e) })
      socket.onmessage = (e) => send('app:print', { payload: e.data })
    }
  ],
  effects: {
    'ws:close': () => socket.close(),
    'ws:send': (state, event) => socket.send(JSON.stringify(event.payload)),
    'app:error': (state, event_ => console.error(`error: ${event.payload}`)),
    'app:print': (state, event) => console.log(`ws: ${event.payload}`)
  }
})
```
This code does not handle reconnects, server timeouts, exponential backoff and
queueing data. You might want to use a package from `npm` or [write your
own][ws-reconnect] if you're building something for production.

### Forms
Forms and lists are probably the most used concepts on any page. Together with
links they comprise most of what can be done on web pages.
```js
const document = require('global/document')
const choo = require('choo')
const http = require('choo/http')
const app = choo()

function view (params, state, send) {
  return choo.view`
    <form onsubmit=${onSubmit}>
      <fieldset>
        <label>username</label>
        <input type="text" name="username" autofocus>
      </fieldset>
      <fieldset>
        <label>password</label>
        <input type="password" name="password">
      </fieldset>
      <input type="submit" value="Submit">
    </form>
  `

  function onSubmit (event) {
    send('login', { data: new FormData(event.target) })
    event.preventDefault()
  }
}

app.model({
  effects: {
    login: (action, state, send) => {
      http.post('/login', { body: action.data }, (err, res, body) => {
        send('authorize', { payload: body })
      })
    }
  }
})

app.router((route) => [
  route('/', view)
])

app.start()
```

If you want a form element to be selected when it's loaded, add the
[`autofocus`][html-input] property.
```js
const view = choo.view`
  <form>
    <input type="text" autofocus>
  </form>
`
```

### Links
In HTML links are represented with the `<a href="/some-location">` tag. By
default `choo` enables a `subscription` for all `a` tags on a page. When a link
is clicked, the click event is caught, and the value of `href` is passed into
the router causing a state change. If you want to disable this behavior, set
`app.start({ href: false })`.
```js
const nav = choo.view`
  <a href="/">home</a>
  <a href="/first-link">first link</a>
  <a href="/second-link">second link</a>
`
```

### Rendering in Node
Sometimes it's necessary to render code inside of Node; for serving hyper fast
first requests, testing or other purposes. Applications that are capable of
being rendered in both Node and the browser are called
_[isomorphic][isomorphic]_.

Rendering in Node is slightly different than in the browser. First off, to
maintain performance all calls to `subscriptions`, `effects`, and `reducers`
are disabled. That means you need to know what the state of your application is
going to be _before_ you render it - no cheating!

Secondly, the `send()` method inside `router` and `view` has been disabled. If
you call it your program will crash. Disabling all these things means that your
program will render [`O(n)`][big-o], which is super neat. Off to [10.000
QPS][qps] we go!

To render in Node call the `.toString()` method instead of `.start()`. The
first argument is the path that should be rendered, the second is the state:
```js
const http = require('http')
const client = require('./client')  // path to client entry point
http.createServer(function (req, res) {
  const html = client.toString('/', { message: 'hello server!' })
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(html)
})
```

In order to make our `choo` app call `app.start()` in the browser and be
`require()`-able in Node, we check if [`module.parent`][module-parent] exists:
```js
const choo = require('choo')
const app = choo()

app.router((route) => [
  route('/', (params, state, send) => choo.view`
    <h1>${state.message}</h1>
  `)
])

if (module.parent) module.exports = app
else document.body.appendChild(app.start())
```

#### Rehydration
Now that your application is succesfully rendering in Node, the next step would
be to make it load a JavaScript bundle once has loaded the HTML. To do this we
will use a technique called _rehydration_.

_Rehydration_ is when you take the static, server-rendered version of your
application (static HTML, _dehydrated_ because it has no logic) and _rehydrate_
it by booting up the JS and attaching event handlers on the DOM to make it
dynamic again. It's like restoring flavor to cup noodles by adding hot water.

Because we're using something called `morphdom` under the hood, all we need is
point at an `id` at the root of the application. The syntax for this is
slightly different from what we've seen so far, because we're _updating_ a
dehydrated DOM nodes to make them dynamic, rather than a new DOM tree and
attaching it to the DOM.
```js
const choo = require('choo')
const app = choo()

app.router((route) => [
  route('/', (params, state, send) => choo.view`
    <h1 id="app-root">${state.message}</h1>
  `)
])

if (module.parent) module.exports = app
else app.start('#app-root'))
```

When the JS is booted on top of the dehydrated application, it will look for
the `#app-root` id and load on top of it. You can choose any name you like for
the id, but __make sure it's the same on every possible top level DOM node__,
or else things might break. Furthermore to ensure things go smoothly, try and
keep the initial state identical on both the server and the client.

And that's it! If you want to go down the route of mad performance, consider
make all first request static and caching them using something like [bl][bl],
[nginx][nginx], [varnish][varnish] or a global CDN.

## API
### app = choo()
Create a new `choo` app

### app.model(obj)
Create a new model. Models modify data and perform IO. Takes the following
arguments:
- __namespace:__ optional namespace that prefixes the keys in `state`,
  `reducers` and `effects`. Also limits `actions` called by `send()` to
  in-namespace only.
- __state:__ object. Key value store of initial values
- __reducers:__ object. Syncronous functions that modify state. Each function
  has a signature of `(action, state)`
- __effects:__ object. Asyncronous functions that perform IO. Each function has
  a signature of `(action, state, send)` where `send` is a reference to
  `app.send()`

### choo.view\`html\`
Tagged template string HTML builder. See
[`yo-yo`](https://github.com/maxogden/yo-yo) for full documentation. Views
should be passed to `app.router()`

### app.router(params, state, send)
Creates a new router. See
[`sheet-router`](https://github.com/yoshuawuyts/sheet-router) for full
documentation. Registered views have a signature of `(params, state, send)`,
where `params` is URI partials.

### html = app.toString(route, state)
Render the application to a string of HTML. Useful for rendering on the server.
First argument is a path that's passed to the router. Second argument is the
state object. When calling `.toString()` instead of `.start()`, all calls to
`send()` are disabled, and `subscriptions`, `effects` and `reducers` aren't
loaded. See [rendering in Node](#rendering-in-node) for an in-depth guide.

### tree = app.start(rootId?, opts)
Start the application. Returns a tree of DOM nodes that can be mounted using
`document.body.appendChild()`. If a valid `id` selector is passed in as the
first argument, the tree will diff against the selected node rather than be
returned. This is useful for [rehydration](#rehydration). Opts can contain the
following values:
- __opts.history:__ default: `true`. Enable a `subscription` to the browser
  history API. e.g. updates the internal `state.location` state whenever the
  browser "forward" and "backward" buttons are pressed.
- __opts.href:__ default: `true`. Handle all relative `<a
  href="<location>"></a>` clicks and update internal `state.location`
  accordingly.
- __opts.hash:__ default: `false`. Enable a `subscription` to the hash change
  event, updating the internal `state.location` state whenever the URL hash
  changes (eg `localhost/#posts/123`). Enabling this option automatically
  disables `opts.history` and `opts.href`.

## Errors
### Could not find DOM node (#id) to update
This means that a re-render of the DOM was triggered before the first render
was done. This is usually the case when `send()` is called inside a
`subscription` before the DOM is done rendering. Instead try listening for a
`'DOMContentLoaded'` event:
```js
document.addEventListener('DOMContentLoaded', (e) => send('init'))
```

### send() cannot be called on the server
This means a `send()` event was triggered in Node. In Node, `reducers`,
`effects` and `subscriptions` are disabled for performance reasons, so if
`send()` was called to trigger an action it wouldn't work. Try finding where in
the DOM tree `send()` is called, and disable it when called from within Node.

## FAQ
### Why did you build this?
`choo` is nothing but a formalization of how I've been building my applications
for the past year. I originally used `virtual-dom` with `virtual-app` and
`wayfarer` where now it's `yo-yo` with `send-action` and `sheet-router`. The
main benefit of using `choo` over these technologies separately is that it
becomes easier for teams to pick up and gather around. The code base for `choo`
itself is super petite (`~200` LOC) and mostly acts to enforce structure around
some excellent npm packages. This is my take on modular frameworks; I hope
you'll find it pleasant.

### Why is it called choo?
Because I thought it sounded cute. All these programs talk about being
"performant", "rigid", "robust" - I like programming to be light, fun and
non-scary. `choo` embraces that.

Also imagine telling some business people you chose to rewrite something
critical to the company using the `choo` framework.
:steam_locomotive::train::train::train:

### Why is it a framework, and not a library?
I love small libraries that do one thing well, but when working in a team,
having an undocumented combination of packages often isn't great. `choo()` is a
small set of packages that work well together, wrapped in an an architectural
pattern. This means you get all the benefits of small packages, but get to be
productive right from the start.

### How does choo compare to X?
Ah, so this is where I get to rant. `choo` (_chugga-chugga-chugga-choo-choo!_)
was built because other options didn't quite cut it for me, so instead of
presenting some faux-objective chart with skewed benchmarks and checklists I'll
give you my opinions directly instead. Ready?  Here goes:
- __react:__ `react` is kind of big (`155kb` was it?), has a lot of new, odd
  words and does weird things with versioning. They also like classes a lot,
  and enforce a _lot_ of abstractions. It also encourages the use of `JSX` and
  `babel` which break _JavaScript, The Language™_. And all that without even
  making clear how code should flow, which is bad in a team setting. I don't
  like complicated things and in my view `react` is one of them. `react` is not
  for me.
- __mithril:__ never used it, never will. I didn't like the API, but if you
  like it maybe it's worth a shot - the API seems small enough. I wouldn't know
  how pleasant it is past face value.
- __preact:__ a pretty cool idea; seems to fix most of what is wrong with
  `react` - except what is broken by design (the API). It also doesn't fix the
  large dependencies `react` seems to use (e.g. `react-router` and friends). If
  `react` is your jam, and you will not budge, sitting at `3kb` this is
  probably a welcome gift.
- __angular:__ definitely not for me. I like small things with a clear mental
  model; `angular` doesn't tick any box in my book of nice things.
- __angular2:__ I'm not sure what's exactly changed, but I know the addition of
  `TypeScript` and `RxJS` definitely hasn't made things simpler. Last I checked
  it was `~200kb` in size before including some monstrous extra deps. I guess
  `angular` and I will just never get along.
- __mercury:__ ah, `mercury` is an interesting one. It seemed like a brilliant
  idea until I started using it - the abstractions felt heavy, and it took team
  members a long time to pick up. In the end I think using `mercury` helped
  greatly in getting `choo` where it is now.
- __deku:__ `deku` is fun. I even contributed a bit in the early days. It could
  probably best be described as "a functional version of `react`". The
  dependence on `JSX` isn't great, but give it a shot if you think it looks
  neat.

### Which packages was choo built on?
- __views:__ [`yo-yo`](https://github.com/maxogden/yo-yo)
- __models:__ [`send-action`](https://github.com/sethvincent/send-action),
  [`xtend`](https://github.com/raynos/xtend)
- __routes:__ [`sheet-router`](https://github.com/yoshuawuyts/sheet-router)
- __http:__ [`xhr`](https://github.com/Raynos/xhr)

### Does choo use a virtual-dom?
`choo` uses [morphdom][morphdom], which diffs real DOM nodes instead of virtual
nodes. It turns out that [browsers are actually ridiculously good at dealing
with DOM nodes][morphdom-bench], and it has the added benefit of working with
_any_ library that produces valid DOM nodes. So to put a long answer short:
we're using something even better.

### What packages do you recommend to pair with choo?
- [tachyons](https://github.com/tachyons-css/tachyons) - functional CSS for
  humans
- [sheetify](https://github.com/stackcss/sheetify) - modular CSS bundler for
  browserify
- [pull-stream](https://github.com/pull-stream/pull-stream) - minimal streams

### How can I optimize choo?
`choo` really shines when coupled with `browserify` transforms. They can do
things like reduce file size, prune dependencies and clean up boilerplate code.
Consider running some of the following:
- [unassertify](https://github.com/twada/unassertify) - remove `assert()`
  statements which reduces file size. Use as a `--global` transform
- [es2020](https://github.com/yoshuawuyts/es2020) - backport `const`,
  `fat-arrows` and `template strings` to older browsers
- [uglifyify](https://github.com/hughsk/uglifyify) - minify your code using
  UglifyJS2. Use as a `--global` transform
- [bulkify](https://www.npmjs.com/package/bulkify) - transform inline
  [bulk-require](https://www.npmjs.com/package/bulk-require) calls into
  statically resolvable require maps
- [envify](https://github.com/hughsk/envify) - replace `process.env` values
  with plain strings

Generally for production builds you'll want to run:
```sh
$ NODE_ENV=production browserify \
  -t envify \
  -g unassertify \
  -g es2020 \
  -g uglifyify \
  | uglifyjs
```

## Hey, doesn't this look a lot like Elm?
Yup, it's greatly inspired by the `elm` architecture. But contrary to `elm`,
`choo` doesn't introduce a completely new language to build web applications.

### Is it production ready?
Sure.

## Installation
```sh
$ npm install choo
```

## See Also
- [budo](https://github.com/mattdesl/budo) - quick prototyping tool for
  `browserify`
- [stack.gl](http://stack.gl/) - open software ecosystem for WebGL

## License
[MIT](https://tldrlegal.com/license/mit-license)

[dom]: https://en.wikipedia.org/wiki/Document_Object_Model
[keyboard-support]: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Browser_compatibility
[sse]: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
[ws]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
[isomorphic]: https://en.wikipedia.org/wiki/Isomorphism
[big-o]: https://rob-bell.net/2009/06/a-beginners-guide-to-big-o-notation/
[qps]: https://en.wikipedia.org/wiki/Queries_per_second
[morphdom]: https://github.com/patrick-steele-idem/morphdom
[morphdom-bench]: https://github.com/patrick-steele-idem/morphdom#benchmarks
[module-parent]: https://nodejs.org/dist/latest-v6.x/docs/api/modules.html#modules_module_parent
[sse-reconnect]: http://stackoverflow.com/questions/24564030/is-an-eventsource-sse-supposed-to-try-to-reconnect-indefinitely
[ws-reconnect]: http://stackoverflow.com/questions/13797262/how-to-reconnect-to-websocket-after-close-connection
[bl]: https://github.com/rvagg/bl
[varnish]: https://varnish-cache.org
[nginx]: http://nginx.org/
[dom]: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
[sheet-router]: https://github.com/yoshuawuyts/sheet-router
[html-input]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
