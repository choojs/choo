# choo [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

A framework for creating sturdy web applications. Built on years of industry
experience and distills the essence of functional architectures into a
productive package.

## Features
- __minimal size:__ weighing under `15kb`, `choo` is a tiny little framework
- __single state:__ immutable single state helps reason about changes
- __minimal tooling:__ built for the cutting edge `browserify` compiler
- __transparent side effects:__ using "effects" and "subscriptions" brings
  clarity to IO
- __omakase:__ composed out of a balanced selection of open source packages
- __idempotent:__ renders seemlessly in both Node and browsers
- __very cute:__ choo choo!

## Usage
```js
const choo = require('choo')

const app = choo()
app.model('title', {
  state: { title: 'my-demo-app' },
  reducers: {
    'update': (action, state) => ({ title: action.payload })
  },
  effects: {
    'update': (action, state) => document.title = action.title
  }
})

const mainView = choo.view((state, send) => `
  <main class="app">
    <h1>${state.title}</h1>
    <label>Set the title</label>
    <input
      type="text"
      placeholder=${state.title}
      oninput=${(e) => send('title:update', { payload: e.target.value })}>
  </main>
`)

app.router((route) => [
  route('/', mainView)
])

const node = app.start()
document.appendChild(node)
```

## Concepts
- __state:__
- __reducers:__
- __effects:__
- __subscriptions:__

## API
### choo

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
