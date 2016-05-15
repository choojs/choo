# choo [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

:steam_locomotive::train::train::train::train::train: - _The little framework
that could._

A framework for creating sturdy web applications. Built on years of industry
experience it distills the essence of functional architectures into a
productive package.

## Features
- __minimal size:__ weighing under `8kb`, `choo` is a tiny little framework
- __single state:__ immutable single state helps reason about changes
- __small api:__ with only 5 methods, there's not a lot to learn
- __minimal tooling:__ built for the cutting edge `browserify` compiler
- __transparent side effects:__ using "effects" and "subscriptions" brings
  clarity to IO
- __omakase:__ composed out of a balanced selection of open source packages
- __idempotent:__ renders seemlessly in both Node and browsers
- __very cute:__ choo choo!

## Demos
- [Input example](https://github.com/yoshuawuyts/choo/tree/master/examples/http)
  (@examples directory)
- [HTTP effects example](https://github.com/yoshuawuyts/choo/tree/master/examples/http)
  (@examples directory)
- [Mailbox routing example](https://github.com/yoshuawuyts/choo/tree/master/examples/mailbox)
  (@examples directory)

## Usage
```js
const choo = require('choo')

const app = choo()
app.model('title', {
  state: {
    title: 'my-demo-app'
  },
  reducers: {
    'update': (action, state) => ({ title: action.payload })
  },
  effects: {
    'update': (action, state, send) => (document.title = action.payload)
  }
})

const mainView = (params, state, send) => choo.view`
  <main class="app">
    <h1>${state.title}</h1>
    <label>Set the title</label>
    <input
      type="text"
      placeholder=${state.title}
      oninput=${(e) => send('title:update', { payload: e.target.value })}>
  </main>
`

app.router((route) => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
```

## Concepts
- __user:__ 🙆
- __DOM:__ the [Document Object Model][dom] is what is currently displayed in
  your browser
- __actions:__ a named event with optional properties attached. Used to call
  `effects` and `reducers` that have been registered in `models`
- __model:__ optionally namespaced object containing `subscriptions`, `effects`
  and `reducers`
- __subscriptions:__ read-only data sources that emit `actions`
- __effects:__ asynchronous functions that emit an `action` when done
- __reducers:__ synchronous functions that modify `state`
- __state:__ a single object that contains __all__ the values used in your
  application
- __router:__ determines which `view` to render
- __views:__ take `state` and returns a new `DOM tree` that is rendered in the
  browser
```txt
 ┌───────────────────────────┐     ┌────────┐
 │    ┌─────────────────┐    │     │  User  │
 ├────│  Subscriptions  │    │     └────────┘
 │    ├─────────────────┤    │          │
 └────│     Effects     │◀───┤          ▼
      ├─────────────────┤  Actions ┌────────┐
      │    Reducers     │◀───┴─────│  DOM   │
    Models──────────────┘          └────────┘
               │                        ▲
             State                   DOM│tree
               ▼                        │
          ┌────────┐               ┌────────┐
          │ Router │─────State ───▶│ Views  │
          └────────┘               └────────┘
```

## Effects
Side effects are done through `effects` declared in `app.model()`. Unlike
`reducers` they cannot modify the state by returning objects, but get a
callback passed hich is used to emit `actions` to handle results.

A typical `effect` flow looks like:

1. An action is received
2. An effect is triggered
3. The effect performs an async call
4. When the async call is done, either a success or error action is emitted
5. A reducer catches the action and updates the state

### HTTP
`choo` ships with a built-in [`http` module](https://github.com/Raynos/xhr)
that weighs only `2.4kb`:
```js
const http = require('choo/http')

// GET JSON
http.get('/my-endpoint', { json: true }, function (err, res, body) {
  if (err) throw err
  if (res.statusCode !== 200 || !body) throw new Error('something went wrong')
})

// POST JSON
const body = { foo: 'bar' }
http.post('/my-endpoint', { json: body }, function (err, res, body) {
  if (err) throw err
  if (res.statusCode !== 200 || !body) throw new Error('something went wrong')
})

// DELETE
http.del('/my-endpoint', function (err, res) {
  if (err) throw err
  if (res.statusCode !== 200) throw new Error('something went wrong')
})
```
Note that `http` only runs in the browser to prevent accidental requests when
rendering in Node. For more details view the [`raynos/xhr`
documentation](https://github.com/Raynos/xhr).

## Subscriptions (wip)
Subscriptions are a way of receiving data from a source. For example when
listening for events from a server using `SSE` or `Websockets` for a
chat app, or when catching keyboard input for a videogame.

### Server Sent Events (SSE)
[tbi] - help and suggestions welcome!

### Keyboard
[tbi] - help and suggestions welcome!

### Websockets
[tbi] - help and suggestions welcome!

## API
### app = choo()
Create a new `choo` app

### app.model(name?, obj)
Create a new model. Models modify data and perform IO. Obj takes the following
arguments:
- __state:__ object. Key value store of initial values
- __reducers:__ object. Syncronous functions that modify state. Each function
  has a signature of `(action, state)`
- __effects:__ object. Asyncronous functions that perform IO. Each function has
  a signature of `(action, state, send)` where `send` is a reference to
  `app.send()`

If a `name` string is passed as a first argument, `reducers` and `signatures`
will be prefixed by the name. So if name is "user" and a reducer called
"update" is registered, it would be accessed as `'user:update'` in `send()`.

### choo.view\`html\`
Tagged template string HTML builder. See
[`yo-yo`](https://github.com/maxogden/yo-yo) for full documentation. Views
should be passed to `app.router()`

### app.router(params, state, send)
Creates a new router. See
[`sheet-router`](https://github.com/yoshuawuyts/sheet-router) for full
documentation. Registered views have a signature of `(params, state, send)`,
where `params` is URI partials.

### tree = app.start()
Start the application. Returns a DOM element that can be mounted using
`document.body.appendChild()`.

## Packages used
- __views:__ [`yo-yo`](https://github.com/maxogden/yo-yo)
- __models:__ [`send-action`](https://github.com/sethvincent/send-action),
  [`xtend`](https://github.com/raynos/xtend)
- __routes:__ [`sheet-router`](https://github.com/yoshuawuyts/sheet-router)
- __http:__ [`xhr`](https://github.com/Raynos/xhr)

## Optimizing
To bring down file size, consider running the following `browserify`
transforms:
- [unassertify](https://github.com/twada/unassertify) - remove `assert()`
  statements which reduces file size. Use as a `--global` transform
- [varify](https://github.com/thlorenz/varify) - replace `const` with `var`
  statements. Use as a `--global` transform
- [uglifyify](https://github.com/hughsk/uglifyify) - minify your code using
  UglifyJS2. Use as a `--global` transform

## Packages that work well together
- [tachyons](https://github.com/tachyons-css/tachyons) - functional CSS for
  humans
- [sheetify](https://github.com/stackcss/sheetify) - modular CSS bundler for
  browserify

## FAQ
### How does choo compare to X?
- __react:__ [tbi]
- __mithril:__ [tbi]
- __preact:__ [tbi]
- __angular2:__ [tbi]

## Installation
```sh
$ npm install choo
```

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/choo.svg?style=flat-square
[3]: https://npmjs.org/package/choo
[4]: https://img.shields.io/travis/yoshuawuyts/choo/master.svg?style=flat-square
[5]: https://travis-ci.org/yoshuawuyts/choo
[6]: https://img.shields.io/codecov/c/github/yoshuawuyts/choo/master.svg?style=flat-square
[7]: https://codecov.io/github/yoshuawuyts/choo
[8]: http://img.shields.io/npm/dm/choo.svg?style=flat-square
[9]: https://npmjs.org/package/choo
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
[dom]: https://en.wikipedia.org/wiki/Document_Object_Model
