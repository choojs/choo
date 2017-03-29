## `5.1.0` Timing API support
In order to improve, we must measure first. Specifically when it comes to
framerate there are very specific numbers we can rely on: `~16ms` for any given
frame to achieve 60fps. That's why in `5.1.0` we're adding support for the
[window.Performance](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
API.

We hope that by adding support for timers, people building applications on
`choo` will become more aware of their application's performance and learn how
and when to optimize. Hopefully this will help in making applications
accessible to all sorts of devices, and not just the latest and greatest.

Timing support will be enabled by default, and can be toggled off by passing
`{ timing: false }` to the `var app = choo()` constructor.

Timing calls will not run in browsers that don't support it out of the box.
For unsupported browser's there's a polyfill available at
[nolanlawson/marky](https://github.com/nolanlawson/marky). The timing marks are
`choo:renderStart`, `choo:renderEnd`. The resulting diff is stored as
`choo:render`.

We hope you'll enjoy this release; thanks heaps for using choo!

### changes
- added out of the box support for performance timings (`window.performance`)
- updated `nanobus` to `3.0.0`; `'*'` events now run after named events

---

## `5.0.0` Welp Welp Welp
So it turns out Choo could be radically simplified. We're now comfortably
sitting at `~4kb`, have removed a whole bunch of words from the API and should
be a whole lot faster. We've [written about it
before](https://medium.com/@yoshuawuyts/choo-v5-bc775b007b5e); if you're
interested we recommend reading through that post.

We're now using an event emitter, mutable state and explicit re-renders. Some
people might frown at first at the words "mutable state", but if you think it
through the mental model doesn't change. "State" has always been a concept of
an object that changes over time; we then render the DOM as a snapshot of that
state.

What we've done is change the way we mutate that state - we no longer generate
a ton of expensive intermediate objects to mutate the state, but instead mutate
the state directly. In turn we've also removed the magic re-rendering and made
it explicit. This enables people to create tight render loops that can even be
used in GC constrained environments like games or music production. We think
this change was well worth it, and will make a lot of sense going forward.

People might also wonder why we've moved away from `flux`/`elm` and are using
an event emitter now. It turns out that the previous architecture had a lot of
confusing words that made it harder to learn than it should. It was also not
possible to react to changes; the thing that changed always had to specify what
needed to respond to it. By using event emitters we've changed this, which will
make relations in the application more expressive. All in all, it turned out
that all we needed for this was a simple event emitter - we think this was well
worth the change and breaking away from what we were previously doing.

_Pretty much everything about the API changed in this version. There's
literally nothing left to remove from the API tho so this is probably the last
time we get to break anything in a significant way._

### changes
- :exclamation: state is now mutable and renders are triggered through
  `.emit('render')`.
- :exclamation: we've replaced `.use()`, `.model()` and the rest of the choo
  architecture with a reworked `.use()` method. It's called once on boot, and
  exposes a mutable reference to `state` and [an event
  emitter](https://github.com/yoshuawuyts/nanobus/) that's compatible with
  Node's
  [`require('events').EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter)
- :exclamation: the `.router()` method has been replaced with `.route()`,
  replacing the nested array API. This should be easier to remember and more
  performant.
- :exclamation: we've replaced `morphdom`/`yo-yo` with `nanomorph`. The two
  algorithms are very comparable. The differences are that the new algorithm
  is smaller and the value of input fields on re-rendering will be whatever the
  `value=""` attribute is.
- :exclamation: `choo/mount` is now available as `app.mount()` and calls
  `app.start()` internally now

---

## `4.0.0` The routing patch
This patch changes the way we handle routes. It introduces query string
support (!), and changes the router to use a lisp-like syntax. It also inverts
the argument order of effects and reducers to be more intuitive. We also
managed to sneak in some performance upgrades :sparkles: - We hope you enjoy
it!

### changes
- :exclamation: slim down server side rendering API |
  [issue](https://github.com/yoshuawuyts/choo/issues/191) |
  [pull-request](https://github.com/yoshuawuyts/choo/pull/203)
- :exclamation: update router API to be lisp-like
- :exclamation: swap `state` and `data` argument order |
  [issue](https://github.com/yoshuawuyts/choo/issues/179)
- :exclamation: remove `choo/http`. Use [xhr](https://github.com/naugtur/xhr)
  instead | [pull-request](https://github.com/yoshuawuyts/choo/pull/269)
- update `router` to use memoization |
  [issue](https://github.com/yoshuawuyts/sheet-router/issues/17) |
  [pull-request](https://github.com/yoshuawuyts/sheet-router/pull/34)
- support inline anchor links |
  [issue](https://github.com/yoshuawuyts/choo/issues/65)
- allow bypassing of link clicks in `sheet-router` |
  [issue](https://github.com/yoshuawuyts/sheet-router/issues/15) |
  [pull-request](https://github.com/yoshuawuyts/sheet-router/pull/27)
- update router API to handle hashes by default
- update router to provide out of the box support for Electron
- update `location` state to expose `search` parameters (query strings) |
  [issue](https://github.com/yoshuawuyts/sheet-router/issues/31)

---

## `3.3.0`
Yay, `plugins` now support `wrappers` which is a segway onto HMR, time travel
and other cool plugins. These changes have come through in barracks `v8.3.0`
and a lil fix in `v8.3.1`. This is a lil patch before `4.0.0` comes through,
but should be super valuable. Wooh!

### changes
- updated barracks to `v8.3.1`

---

## `3.2.0`
Wooh, `plugins` are a first class citizen now thanks to the `.use()` API. It's
a multiplexed version of the old `app = choo(hooks)`. It should enable
attaching multiple hooks onto the same API, which is useful to create re-usable
extensions to `choo`. They should be used with care though, and be as generic
as possible, but the docs should provide enough backdrop for that. Anyway,
have fun with plugins! :tada:

### changes
- added `app.use()`

---

## `3.1.0`
And another patch down. This time around it's mostly maintenance and a bit of
perf:
- The addition of the [nanoraf](https://github.com/yoshuawuyts/nanoraf)
  dependency prevents bursts of DOM updates thrashing application performance,
  quite possibly making choo amongst the fastest frameworks out there.
- We now ship standalone `UMD` bundles on each release, available through
  [https://unpkg.com/choo](https://unpkg.com/choo). The goal of this is to
  support sites like codepen and the like; __this should not be used for
  production__.

---

## `3.0.0`
Woooh, happy third birthday `choo` - _thanks dad_. You're all grown up now;
look at how far you've come in the last month. You've grown... tinier? But yet
you do more? I love you `choo` - _shut up dad_.

### Notable changes
#### Who's the tiniest of them all?
`choo` is now `5kb` optimized! That's `2kb` less compared to v2. _Woah, how?_
We now support [yo-yoify](https://github.com/shama/yo-yoify) which optimizes
those lil template tags to `document.createElement()` calls. So not only is it
smaller, creating elements now has no overhead. Pretty nifty eh? Mad shoutout
to [Shama](http://twitter.com/shamakry) for building this!

#### Captain Hook(s)
V3 introduces `hooks` - powerful functions that are called at certain points in
the refresh cycle. Unlike functions in `models` these functions have unfiltered
access to all properties, call stacks and more. They're super useful when
building error handling, logging or persisting for stuff like `hot reloading`.
I quite like them, and I'm def keen to see what uses people will come up with!

#### Effect Composition :train::train::train::train:
`effects` are now composable by calling a `done(err, res)` callback when
they're done executing. This means that multiple namespaced effects can be
chained together to form some higher level behavior.

Think of cases like "logout" - multiple models must be cleared, perhaps tokens
invalidated on the server, all in a certain order. This requires multiple
models to work in tandem. - And now that's possible! :sparkles:

#### Pathfinders guide
We've started work on the [choo
handbook](https://github.com/yoshuawuyts/choo-handbook) - a lil manual to help
you get started, not only with choo, but with web development in general. It's
super modest still, only containing a single `choo` tutorial, but we'll be
expanding this over the coming months. If you want to contribute some docs,
there's [a whole section of
ideas](https://github.com/yoshuawuyts/choo-handbook/issues/10) on stuff that
might be neat to write. Any lil bits are welcome! Shout out to
[Tim](https://twitter.com/timwis) for making this happen :tada:

#### The Cycle of Life
`views` have gone through a bit of a change - they're now required using
`require('choo/html')` so they can be factored out of a project into standalone
[bel](https://github.com/shama/bel) components at any time. But additionally
these components have gained super powers through the adition of `onload` and
`onunload` hooks. Components can now react to being mounted or not, which makes
them ideal to implement standalone widgets. This behavior uses [html5
MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
under the hood, so it will work anywhere with a DOM!  Again, this was all
[Shama](http://twitter.com/shamakry)'s hard work.

#### Test coverage
`choo` has gained a beaut blanket of tests, courtesy of
[Todd](https://twitter.com/whale_eat_squid) and
[Ben](https://twitter.com/bendrucker/). We've got server, browser and
_pretty-much-all-browsers-known-to-mankind_ style testing which should give us
a pretty good idea if stuff breaks. Neat!

#### Core dump
Internally we've moved the core of `choo` into a separate package -
[barracks](https://github.com/yoshuawuyts/barracks). `choo` is now mere glue
code around `barracks`, `yo-yo` and `sheet-router`. This is good news for folks
who like `choo`, but don't agree with all decisions. Go forth and build your
own lil framework!

### Changelog
- move `choo.view` out to `require('choo/html')` #71 | pr #103
- streamline view API #35 | pr #111
- higher order functions #34 | pr #104
- create lifecycle hooks #1 | feature addition in dependency covered by semver
- implement state hooks #15 | pr #104
- add yo-yoify #3 | pr #110
- rename "app" namespace #82 | pr #111
- enable browser testing | pr #86
- propagating actions creates infinite loop #114 | pr #104
- state is now immutable in `reducers` and `effects`

### Thanks
Huge thanks to everyone who's collaborated on this, provided feedback or
even mentioned it anywhere. It's been a hella lot of people, but seriously,
you're the best :steam_locomotive::train::train::train::train::train:

---

## `2.3.1`
- [76](https://github.com/yoshuawuyts/choo/pull/76) - fix router arguments

---

## `2.3.0`
- [55](https://github.com/yoshuawuyts/choo/pull/55) - load subscriptions once
  DOM is ready
- heaps of documentation fixes; looks like choo is taking off 🐨

---

## `2.2.2`
- [53](https://github.com/yoshuawuyts/choo/pull/53) - fix assert call for
  subscriptions
- [52](https://github.com/yoshuawuyts/choo/pull/52) - fix naming rootId

---

## `2.0.0`
### breaking changes
- namespaces are now enforced more strictly
- models now only accept a single argument
- the `namespace` key was introduced inside of models (was prior the leading
  string in models)
- namespaced models can now only operate within themselves

---

## `1.0.0`
- first version of choo
