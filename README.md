<h1 align="center">choo</h1>

<div align="center">
  :steam_locomotive::train::train::train::train::train:
</div>
<div align="center">
  <strong>Fun functional programming</strong>
</div>
<div align="center">
  A <code>5kb</code> framework for creating sturdy frontend applications
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

<div align="center">
  <h3>
    <a href="https://yoshuawuyts.gitbooks.io/choo/content">
      Handbook
    </a>
    <span> | </span>
      <a href="https://github.com/YerkoPalma/awesome-choo">
        Ecosystem
      </a>
    <span> | </span>
      <a href="https://github.com/trainyard/choo-cli">
        CLI
      </a>
    <span> | </span>
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

<h2>Table of Contents</h2>
<details>
  <summary>Table of Contents</summary>
  <li><a href="#features">Features</a></li>
  <li><a href="#demos">Demos</a></li>
  <li><a href="#example">Example</a></li>
  <li><a href="#philosophy">Philosophy</a></li>
  <li><a href="#concepts">Concepts</a></li>
  <li><a href="#badges">Badges</a></li>
  <li><a href="#api">API</a></li>
  <li><a href="#faq">FAQ</a></li>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#see-also">See Also</a></li>
  <li><a href="#support">Support</a></li>
</details>

## Features
- __minimal size:__ weighing `5kb`, `choo` is a tiny little framework
- __single state:__ immutable single state helps reason about changes
- __small api:__ with only 6 methods, there's not a lot to learn
- __minimal tooling:__ built for the cutting edge `browserify` compiler
- __transparent side effects:__ using `effects` and `subscriptions` brings
  clarity to IO
- __omakase:__ composed out of a balanced selection of open source packages
- __isomorphic:__ renders seamlessly in both Node and browsers
- __very cute:__ choo choo!

## Demos
- :truck: [Input example](http://requirebin.com/?gist=229bceda0334cf30e3044d5f5c600960)
  ([repo](examples/title/))
- :water_buffalo: [HTTP effects example](https://fork-fang.hyperdev.space/)
  ([repo](https://hyperdev.com/#!/project/fork-fang))
- :mailbox: [Mailbox routing](examples/mailbox/)
- :ok_hand: [TodoMVC](http://shuheikagawa.com/todomvc-choo/)
  ([repo](https://github.com/shuhei/todomvc-choo))
- :fire: [Choo-firebase](https://github.com/fyrkant/choo-firebase)
- :seedling: [Grow](https://grow.static.land/)
  ([repo](https://github.com/sethvincent/grow))
- :newspaper: [Hacker News Reader](https://hackernews-choo.surge.sh/) ([repo](https://github.com/kvnneff/hackernews-choo))

_note: If you've built something cool using `choo` or are using it in
production, we'd love to hear from you!_

## Example
Let's create an input box that changes the content of a textbox in real time.
[Click here to see the app running](http://requirebin.com/?gist=229bceda0334cf30e3044d5f5c600960).
```js
const html = require('choo/html')
const choo = require('choo')
const app = choo()

app.model({
  state: { title: 'Not quite set yet' },
  reducers: {
    update: (state, data) => ({ title: data })
  }
})

function mainView (state, prev, send) {
  return html`
    <main>
      <h1>Title: ${state.title}</h1>
      <input
        type="text"
        oninput=${(e) => send('update', e.target.value)}>
    </main>
  `
}

app.router(['/', mainView])

const tree = app.start()
document.body.appendChild(tree)
```

To run it, save it as `client.js` and run with [bankai][bankai]. `bankai` is
convenient but any [browserify][browserify] based tool should do:
```sh
# run and reload on port 8080
$ bankai client.js -p 8080 --open

# compile to static files in `./dist/`
$ bankai build index.js dist/

# deploy to github pages using `tschaub/gh-pages`
$ gh-pages -d dist/
```

## Philosophy
We believe programming should be fun and light, not stern and stressful. It's
cool to be cute; using serious words without explaining them doesn't make for
better results - if anything it scares people off. We don't want to be scary,
we want to be nice and fun, and then _casually_ be the best choice around.
_Real casually._

We believe frameworks should be disposable, and components recyclable. We don't
like the current state of web development where walled gardens jealously
compete with one another. We want you to be free, not shackled to a damp
dungeon wall. By making the DOM the lowest common denominator, switching from
one framework to another becomes frictionless. Components should run anywhere
that has a DOM, regardless of the framework. `choo` is modest in its design; we
don't believe it will be top of the class forever, so we've made it as easy to
toss out as it is to pick up.

We don't believe that bigger is better. Big APIs, big dependencies, large file
sizes - we see them as omens of impending userland complexity. We  want
everyone on a team, no matter the size, to fully understand how an application
is laid out. And once an application is built, we want it to be small,
performant and easy to reason about. All of which makes for easy to debug code,
better results and super smiley faces.

## Concepts
`choo` cleanly structures internal data flow, so that all pieces of logic can
be combined into a nice, cohesive machine. Roughly speaking there are two parts
to `choo`: the views and the models. Models take care of state and logic, and
have the `call()` function available to call `actions`. Views are responsible
for displaying the interface and have the `send()` call available to call
`actions` to respond to user interactions.

The core abstraction of `choo` is `state`. It is a single object that contains
values. Using `namespaces` and `reducers` this state is carefully managed in
logical pieces, updated and modified. Whenever a modification happens, the
`views` receive a new version of the `state` which they can use to safely
render a complete new representation of the DOM, which we then use to
efficiently update the DOM on the screen.

Models are split up in several parts. They have the static `state` and
`namespace` property available to create an uniquely named piece of inital
state that can be updated. They also have `reducers`, `effects` and
`subscriptions` available which we call `actions`.

The types of `actions` available in Models perform different roles. `reducers`
can be called by views or other `actions`, and return an updated version of the
state that causes the views to re-render. `subscriptions` are called once when
the DOM loads, and can call other `actions`. `effects` can be called by views
or other `actions` and can call other `actions`. This is the `choo`
architecture:

```txt
 ┌─────────────────┐
 │  Subscriptions ─┤     User ───┐
 └─ Effects  ◀─────┤             ▼
 ┌─ Reducers ◀─────┴─────────── DOM ◀┐
 │                                   │
 └▶ Router ─────State ───▶ Views ────┘
```

In practice this means we use `reducers` to update our state, `subscriptions`
to to call other `actions` (such as whenever a key is pressed on the keyboard
or a websocket event is received) and `effects` to do a thing and then call
another `action` when done.

`actions` can be called using either `send()` from within views or `call()`
from inside other `actions`. The difference between `send()` and `call()` is
that `call()` expects a callback as the last argument, which can be used to
handle errors and respond to values being returned. `views` are only there to
show elements, and register things users can interact with, so that's why
`send()` can only call actions, but not handle errors (there's a `hook`
available to handle top-level errors called `onError` - but more hooks later).

### Models
`models` are objects that contain initial `state`, `subscriptions`, `effects`
and `reducers`. They're generally grouped around a theme (or domain, if you
like). To provide some sturdiness to your `models`, they can either be
namespaced or not. Namespacing means that only state within the model can be
accessed. Models can still trigger actions on other models, though it's
recommended to keep that to a minimum.

So say we have a `todos` namespace, an `add` reducer and a `todos` model.
Outside the model they're called by `send('todos:add')` and
`state.todos.items`. Inside the namespaced model they're called by
`send('todos:add')` and `state.items`. An example namespaced model:
```js
const app = choo()
app.model({
  namespace: 'todos',
  state: { items: [] },
  reducers: {
    add: (state, data) => ({ items: state.items.concat(data.payload) })
  }
})
```

In most cases using namespaces is beneficial, as having clear boundaries makes
it easier to follow logic. But sometimes you need to call `actions` that
operate over multiple domains (such as a "logout" `action`), or have a
`subscription` that might trigger multiple `reducers` (such as a `websocket`
that calls a different `action` based on the incoming data).

In these cases you probably want to have a `model` that doesn't use namespaces,
and has access to the full application state. Try and keep the logic in these
`models` to a minimum, and declare as few `reducers` as possible. That way the
bulk of your logic will safely shielded, with only a few points touching every
part of your application.

### Effects
`effects` are used to do a thing, and call another `action` when the thing is
done. When the `effect` itself is done (e.g. when the `action` is called is
also done) it calls the `done()` callback with either an error or a value.

This is an example `effect` that is called once when the application loads and
calls the `'todos:add'` `reducer` when it receives data from the server:

```js
const model = require('choo-model')
const choo = require('choo')
const http = require('xhr')
const app = choo()

const todoModel = model('todos')
todoModel.state({ todos: [] })

todoModel.reducer('add', (data, state) => {
  return { todos: data }
})

todoModel.effect('addAndSave', function (state, data, send, done) {
  const opts = { body: data.payload, json: true }
  http.post('/todo', opts, (err, res, body) => {
    data.payload.id = body.id
    send('todos:add', data, (err, value) => {
      if (err) return done(err)
      done(null, value)
    })
  })
})

todoModel.subscription('called-once-when-the-app-loads', (send, done) => {
  send('todos:addAndSave', done)
})
```

### Subscriptions
Subscriptions are a way of receiving data from a source. For example when
listening for events from a server using `SSE` or `Websockets` for a
chat app, or when catching keyboard input for a videogame.

An example subscription that logs `"dog?"` every second:
```js
const model = require('choo-model')
const choo = require('choo')

const app = choo()
const appModel = model('app')

appModel.effect('print', (state, data) => console.log(data.payload))

appModel.subscription('callDog', (send, done) => {
  setInterval(() => {
    send('app:print', { payload: 'dog?', myOtherValue: 1000 }, (err) => {
      if (err) return done(err)
    })
  }, 1000)
})
```

If a `subscription` runs into an error, it can call `done(err)` to signal the
error to the error hook.

### Router
The `router` manages which `views` are rendered at any given time. It also
supports rendering a default `view` if no routes match.

```js
const app = choo()
app.router({ default: '/404' }, [
  [ '/', require('./views/empty') ],
  [ '/404', require('./views/error') ],
  [ '/:mailbox', require('./views/mailbox'), [
    [ '/:message', require('./views/email') ]
  ]]
])
```

Routes on the `router` are passed in as a nested array. This means that the
entry point of the application also becomes a site map, making it easier to
figure out how views relate to each other.

Under the hood `choo` uses [sheet-router][sheet-router]. Internally the
currently rendered route is kept in `state.location`. If you want to modify
the location programmatically the `reducer` for the location can be called
using `send('location:setLocation', { location: href })`. This will not work
from within namespaced `models`, and usage should preferably be kept to a
minimum. Changing views all over the place tends to lead to messiness.

### Views
Views are pure functions that return a DOM tree for the router to render.
They’re passed the current state, and any time the state changes they’re run
again with the new state.

Views are also passed the `send` function, which they can use to dispatch
actions that can update the state. For example, the DOM tree can have an
`onclick` handler that dispatches an `add` action.

```js
function view (state, prev, send) => {
  return html`
    <div>
      <h1>Total todos: ${state.todos.length}</h1>
      <button onclick=${(e) => send('add', {title: 'demo'})}>
        Add
      </button>
    </div>
  `
}
```

In this example, when the `Add` button is clicked, the view will dispatch an
`add` action that the model’s `add` reducer will receive. [As seen
above](#models), the reducer will add an item to the state’s `todos` array. The
state change will cause this view to be run again with the new state, and the
resulting DOM tree will be used to [efficiently patch the
DOM](#does-choo-use-a-virtual-dom).

### Plugins
Sometimes it's necessary to change the way `choo` itself works. For example to
report whenever an action is triggered, handle errors globally or perist state
somewhere. This is done through something called `plugins`. Plugins are objects
that contain `hook` and `wrap` functions and are passed to `app.use()`:

```js
const log = require('choo-log')
const choo = require('choo')
const app = choo()

app.use(log())

const tree = app.start()
document.body.appendChild(tree)
```

Generally people using `choo` shouldn't be too worried about the specifics of
`plugins`, as the internal API is (unfortunately by necessity) quite complex.
After all they're the most powerful way to modify a `choo` application.

__:warning: Warning :warning:: plugins should only be used as a last resort.
It creates peer dependencies which makes upgrading versions and switching
frameworks a lot harder. Please exhaust all other options before using
plugins.__

If you want to learn more about creating your own `plugins`, and which `hooks`
and `wrappers` are available, head on over to [app.use()](#appusehooks).

## Badges
Using `choo` in a project? Show off which version you've used using a badge:


[![built with choo v4](https://img.shields.io/badge/built%20with%20choo-v4-ffc3e4.svg?style=flat-square)](https://github.com/yoshuawuyts/choo)
```md
[![built with choo v4](https://img.shields.io/badge/built%20with%20choo-v4-ffc3e4.svg?style=flat-square)](https://github.com/yoshuawuyts/choo)
```

## API
This section provides documentation on how each function in `choo` works. It's
intended to be a technical reference. If you're interested in learning choo for
the first time, consider reading through the [handbook][handbook] or
[concepts](#concepts) first :sparkles:

### app = choo(opts)
Initialize a new `choo` app. Takes an optional object of handlers that is
passed to [app.use()](#appusehooks).

### app.model(obj)
Create a new model. Models modify data and perform IO. Takes the following
arguments:
- __namespace:__ namespace the model so that it cannot access any properties
  and handlers in other models
- __state:__ initial values of `state` inside the model
- __reducers:__ synchronous operations that modify state. Triggered by
  `actions`. Signature of `(state, data)`.
- __effects:__ asynchronous operations that don't modify state directly.
  Triggered by `actions`, can call `actions`. Signature of `(state, data,
  send, done)`
- __subscriptions:__ asynchronous read-only operations that don't modify state
  directly. Can call `actions`. Signature of `(send, done)`.

#### send(actionName, data?[,callback])
Send a new action to the models with optional data attached. Namespaced models
can be accessed by prefixing the name with the namespace separated with a `:`,
e.g. `namespace:name`.

When sending data from inside a `model` it expects exactly three arguments: the name of the action you're calling, the data you want to send, and finally a callback to handle errors through the global `onError()` hook. So if you want to send two values, you'd have to either send an array or object containing them.

#### done(err?, res?)
When an `effect` or `subscription` is done executing, or encounters an error,
it should call the final `done(err, res)` callback. If an `effect` was called
by another `effect` it will call the callback of the caller. When an error
propegates all the way to the top, the `onError` handler will be called,
registered in `choo(handlers)`. If no callback is registered, errors will
`throw`.

### app.router(defaultRoute?, (route) => [routes])
Creates a new router. Takes a function that exposes a single `route` function,
and that expects a tree of `routes` to be returned. See
[`sheet-router`](https://github.com/yoshuawuyts/sheet-router) for full
documentation. Registered views have a signature of `(state, prev, send)`,
where `state` is the current `state`, `prev` is the last state, `state.params`
is URI partials and `send()` can be called to trigger actions. If
`defaultRoute` is passed in, that will be called if no paths match. If no
`defaultRoute` is specified it will throw instead.

### app.use(hooks)
Register an object of hooks on the application. This is useful to extend the
way `choo` works, adding custom behavior and listeners. Generally returning
objects of `hooks` is done by returning them from functions (which we call
`plugins` throughout the documentation).

There are several `hooks` and `wrappers` that are picked up by `choo`:
- __onError(err, state, createSend):__ called when an `effect` or
  `subscription` emit an error. If no handler is passed, the default handler
  will `throw` on each error.
- __onAction(state, data, name, caller, createSend):__ called when an
  `action` is fired.
- __onStateChange(state, data, prev, caller, createSend):__ called after a
  reducer changes the `state`.
- __wrapSubscriptions(fn):__ wraps a `subscription` to add custom behavior
- __wrapReducers(fn):__ wraps a `reducer` to add custom behavior
- __wrapEffects(fn):__ wraps an `effect` to add custom behavior
- __wrapInitialState(fn):__ mutate the complete initial `state` to add custom
  behavior - useful to mutate the state before starting up

__:warning: Warning :warning:: plugins should only be used as a last resort.
It creates peer dependencies which makes upgrading versions and switching
frameworks a lot harder. Please exhaust all other options before using
plugins.__

`createSend()` is a special function that allows the creation of a new named
`send()` function. The first argument should be a string which is the name, the
second argument is a boolean `callOnError` which can be set to `true` to call
the `onError` hook istead of a provided callback. It then returns a
`send(actionName, data?)` function.

Hooks should be used with care, as they're the most powerful interface into
the state. For application level code it's generally recommended to delegate to
actions inside models using the `send()` call, and only shape the actions
inside the hooks.

### html = app.toString(route, state?)
Render the application to a string of HTML. Useful for rendering on the server.
First argument is a path that's passed to the router. Second argument is an
optional state object. When calling `.toString()` instead of `.start()`, all
calls to `send()` are disabled, and `subscriptions`, `effects` and `reducers`
aren't loaded.

### tree = app.start(opts)
Start the application. Returns a tree of DOM nodes that can be mounted using
`document.body.appendChild()`. Opts can contain the following values:
- __opts.history:__ default: `true`. Enable a `subscription` to the browser
  history API. e.g. updates the internal `location.href` state whenever the
  browsers "forward" and "backward" buttons are pressed.
- __opts.href:__ default: `true`. Handle all relative `<a
  href="<location>"></a>` clicks and update internal `state.location`
  accordingly.
- __opts.hash:__ default: `false`. Enable a `subscription` to the hash change
  event, updating the internal `state.location` state whenever the URL hash
  changes (eg `localhost/#posts/123`). Enabling this option automatically
  disables `opts.history` and `opts.href`.

### view = require('choo/html')\`html\`
Tagged template string HTML builder. Built on top of [yo-yo][yo-yo], [bel][bel]
and [hyperx][hyperx]. To register a view on the `router` it should be wrapped
in a function with the signature of `(state, prev, send)` where `state` is the
current `state`, `prev` is the last state, `state.params` is URI partials and
`send()` can be called to trigger actions.

To create listeners for events, create interpolated attributes on elements.
```js
const html = require('choo/html')
html`
  <button onclick=${(e) => console.log(e)}>click for bananas</button>
`
```
Example listeners include: `onclick`, `onsubmit`, `oninput`, `onkeydown`,
`onkeyup`. A full list can be found [at the yo-yo
repo](https://github.com/maxogden/yo-yo/blob/master/update-events.js). When
creating listeners always remember to call `e.preventDefault()` and
`e.stopPropagation()` on the event so it doesn't bubble up and do stuff like
refreshing the full page or the like.

To trigger lifecycle events on any part of a view, set the `onload=${(el) =>
{}}` and `onunload=${() => {el}}` attributes. These parameters are useful when
creating self-contained widgets that take care of their own state and lifecycle
(e.g. a maps widget) or to trigger animations. Most elements shouldn't have a
need for these hooks though.

## FAQ
### Why is it called choo?
Because I thought it sounded cute. All these programs talk about being
_"performant"_, _"rigid"_, _"robust"_ - I like programming to be light, fun and
non-scary. `choo` embraces that.

Also imagine telling some business people you chose to rewrite something
critical to the company using `choo`.
:steam_locomotive::train::train::train:

### Why is it a framework, and not a library?
I love small libraries that do one thing well, but when working in a team,
having an undocumented combination of packages often isn't great. `choo()` is a
small set of packages that work well together, wrapped in an an architectural
pattern. This means you get all the benefits of small packages, but get to be
productive right from the start without needing to plough through layers of
boilerplate.

### Is it called choo, choo.js or...?
It's called "choo", though we're fine if you call it "choo-choo" or
"chugga-chugga-choo-choo" too. The only time "choo.js" is tolerated is if /
when you shimmy like you're a locomotive.

### How does choo compare to X?
Ah, so this is where I get to rant. `choo` (_chugga-chugga-chugga-choo-choo!_)
was built because other options didn't quite cut it for me, so instead of
presenting some faux-objective chart with skewed benchmarks and checklists I'll
give you my opinions directly. Ready?  Here goes:
- __react:__ despite being at the root of a giant paradigm shift for frontend
  (thank you forever!), `react` is kind of big (`155kb` was it?). They also
  like classes a lot, and enforce a _lot_ of abstractions. It also encourages
  the use of `JSX` and `babel` which break _JavaScript, The Language™_. And all
  that without making clear how code should flow, which is crucial in a team
  setting. I don't like complicated things and in my view `react` is one of
  them. `react` is not for me.
- __mithril:__ never used it, never will. I didn't like the API, but if you
  like it maybe it's worth a shot - the API seems small enough. I wouldn't know
  how pleasant it is past face value.
- __preact:__ a pretty cool idea; seems to fix most of what is wrong with
  `react`. However it doesn't fix the large dependencies `react` seems to use
  (e.g. `react-router` and friends) and doesn't help at all with architecture.
  If `react` is your jam, and you will not budge, sitting at `3kb` this is
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
  shaped `choo` greatly, despite not working out for me.
- __deku:__ `deku` is fun. I even contributed a bit in the early days. It could
  probably best be described as "a functional version of `react`". The
  dependence on `JSX` isn't great, but give it a shot if you think it looks
  neat.
- __cycle:__ `cycle`'s pretty good - unlike most frameworks it lays out a clear
  architecture which helps with reasoning about it. That said, it's built on
  `virtual-dom` and `xstream` which are a bit heavy for my taste. `choo` works
  pretty well for FRP style programming, but something like [inu][inu] might be
  an interesting alternative.
- __vue:__ like `cycle`, `vue` is pretty good. But it also uses tech that
  provides framework lock in, and additionally doesn't have a clean enough
  architecture. I appreciate what it does, but don't think it's the answer.

### Why can't send() be called on the server?
In Node, `reducers`, `effects` and `subscriptions` are disabled for performance
reasons, so if `send()` was called to trigger an action it wouldn't work. Try
finding where in the DOM tree `send()` is called, and disable it when called
from within Node.

### Which packages was choo built on?
- __views:__ [`yo-yo`](https://github.com/maxogden/yo-yo),
  [`bel`](https://github.com/shama/bel)
- __models:__ [`barracks`](https://github.com/yoshuawuyts/barracks),
  [`xtend`](https://github.com/raynos/xtend)
- __routes:__ [`sheet-router`](https://github.com/yoshuawuyts/sheet-router)
- __http:__ [`xhr`](https://github.com/Raynos/xhr)

### Does choo use a virtual-dom?
`choo` uses [morphdom][morphdom], which diffs real DOM nodes instead of virtual
nodes. It turns out that [browsers are actually ridiculously good at dealing
with DOM nodes][morphdom-bench], and it has the added benefit of working with
_any_ library that produces valid DOM nodes. So to put a long answer short:
we're using something even better.

### How can I optimize choo?
`choo` really shines when coupled with `browserify` transforms. They can do
things like reduce file size, prune dependencies and clean up boilerplate code.
Consider running some of the following:
- [unassertify](https://github.com/twada/unassertify) - remove `assert()`
  statements which reduces file size. Use as a `--global` transform
- [es2020](https://github.com/yoshuawuyts/es2020) - backport `const`,
  `fat-arrows` and `template strings` to older browsers. Should be run as a
  `--global` transform
- [yo-yoify](https://github.com/shama/yo-yoify) - replace the internal `hyperx`
  dependency with `document.createElement` calls; greatly speeds up performance
  too
- [uglifyify](https://github.com/hughsk/uglifyify) - minify your code using
  UglifyJS2. Use as a `--global` transform
- [bulkify](https://www.npmjs.com/package/bulkify) - transform inline
  [bulk-require](https://www.npmjs.com/package/bulk-require) calls into
  statically resolvable require maps
- [envify](https://github.com/hughsk/envify) - replace `process.env` values
  with plain strings

### Choo + Internet Explorer &amp; Safari
Out of the box `choo` only supports runtimes which support:
* `const`
* `fat-arrow` functions (e.g. `() => {}`)
* `template-strings`

This does not include Safari 9 or any version of IE. If support for these
platforms is required you will have to provide some sort of transform that
makes this functionality available in older browsers.  The test suite uses
[es2020](https://github.com/yoshuawuyts/es2020) as a global transform, but
anything else which might satisfy this requirement is fair game.

Generally for production builds you'll want to run:
```sh
$ NODE_ENV=production browserify \
  -t envify \
  -g yo-yoify \
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

## Browser Test Status
<a href="https://saucelabs.com/u/yoshuawuyts">
  <img
    src="https://saucelabs.com/browser-matrix/yoshuawuyts.svg"
    alt="Sauce Test Status"/>
</a>

## Installation
```sh
$ npm install choo
```

## See Also
- [choo-handbook](https://github.com/yoshuawuyts/choo-handbook) - the little
  `choo` guide
- [awesome-choo](https://github.com/YerkoPalma/awesome-choo) - Awesome things
  related with choo framework
- [budo](https://github.com/mattdesl/budo) - quick prototyping tool for
  `browserify`
- [stack.gl](http://stack.gl/) - open software ecosystem for WebGL
- [yo-yo](https://github.com/maxogden/yo-yo) - tiny library for modular UI
- [bel](https://github.com/shama/bel) - composable DOM elements using template
  strings
- [tachyons](https://github.com/tachyons-css/tachyons) - functional CSS for
  humans
- [sheetify](https://github.com/stackcss/sheetify) - modular CSS bundler for
  `browserify`
- [pull-stream](https://github.com/pull-stream/pull-stream) - minimal streams
- [es2020](https://github.com/yoshuawuyts/es2020) - because in hindsight we
  don't need most of ES6

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
[inu]: https://github.com/ahdinosaur/inu
[yo-yo]: https://github.com/maxogden/yo-yo
[bel]: https://github.com/shama/bel
[hyperx]: https://github.com/substack/hyperx
[budo]: https://github.com/mattdesl/budo
[es2020]: https://github.com/yoshuawuyts/es2020
[bankai]: https://github.com/yoshuawuyts/bankai
[browserify]: https://github.com/substack/node-browserify
[localstorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[handbook]: https://github.com/yoshuawuyts/choo-handbook
