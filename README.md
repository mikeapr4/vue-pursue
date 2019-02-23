# vue-pursue

[![Build Status](https://travis-ci.org/mikeapr4/vue-pursue.png?branch=master)](https://travis-ci.org/mikeapr4/vue-pursue)
[![Coverage Status](https://coveralls.io/repos/github/mikeapr4/vue-pursue/badge.svg?branch=master)](https://coveralls.io/github/mikeapr4/vue-pursue)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Vue.js Plugin to examine the dependencies that reactive data has. Intended to be used during development to aid optimization and an understanding of the reactive flow of data.

If reactive data is passed into `VuePursue`, it will return a list of:
* `computed` properties
* store `getters`
* components

These will all refresh if this reactive data is modified.

## Why?

Why bother? Well sometimes when writing `computed` properties or store `getters` it isn't immediately obvious the impact on performance. In a complex system, long chains of computed/getters can form. Often if data is being *denormalized* for easy consumption in components or component templates, it can lead to *'overreactivity'*, where changes to seemly unrelated data can trigger widespread unwanted/unnecessary refreshes.

## Installation

    npm install vue-pursue

## Usage

The library is both a Vue and Vuex plugin, so you can use it in either of the following ways:

    Vue.use(VuePursue);

Or as a Vuex store plugin:

    new Vuex.Store({ plugins: [VuePursue] });

Note that installing it as a Vuex plugin will automatically install it as a Vue plugin.

Considering the plugin is not intended for production use, but rather as a development aid, a good approach is to include it conditionally:

    new Vuex.Store({
      plugins: [
        process.env.NODE_ENV !== 'production' ? VuePursue : () => {}
      ]
    });

## Debugging

Once the plugin is installed, the `pursue` function will be available globally
via `Vue.pursue` or `VuePursue`. The reason it needs to be global is that the best way to use it is within the **Developer tools console** in your browser.

If I want to find out the impact of changing the value of some reactive data, add a breakpoint just before you plan to change the data (ensuring reactivity has been registered, i.e. all the relevant components depending on this data have been mounted).

Now within the console try any of the following call signatures:

1. Object - `VuePursue(reactiveObject)`
1. Array - `VuePursue(reactiveArray)`
1. Object Property - `VuePursue(reactiveObject, 'property')`
1. Function - `VuePursue(() => reactiveObject.property)`

The last option may seem like the best, but be careful with chained access as all levels of reactivity will be examined. (i.e. `VuePursue(() => a.b.c)` will return reactivity for `b` and `c`)

## Output

The returned data is an object with the following properties:

* `computed` - a list of computed properties (`'Component.computedProperty'` or `'computedProperty'` will be returned depending on whether the component name is available). This list also contains Vuex getters.
* `components` - a list of components that will update, i.e. perform a render and use the VDOM to patch the DOM.
* `unrecognised` - a count of other watchers that don't fall into the above categories. Should be zero, but if not, a deeper investigation may be needed.

## License

[MIT](http://opensource.org/licenses/MIT)
