// These are methods which will refresh the computed watchers
const vuexApiMethods = ["registerModule", "unregisterModule", "hotUpdate"];

let Vue;

// Marks getter watchers with the getter name, so it can be retrieved
// in some data's deps.
// app.vuex.state.task.records.__ob__.dep.subs.map((s) => s.getter.name || s.watcherName)
const vuexPlugin = store => {
  const markWatchers = ({ _vm }) => {
    Object.keys(_vm._computedWatchers).forEach(k => {
      _vm._computedWatchers[k].watcherName = k;
    });
  };

  markWatchers(store);
  vuexApiMethods.forEach(method => {
    store[method] = (...args) => {
      store.prototype[method].apply(store, args);
      markWatchers(store);
    };
  });
};

// vnode tags are in the format: `vue-component-N-MyComponent`
const stripTagPrefix = tag => {
  let withNum = tag.slice("vue-component-".length);
  const index = withNum.indexOf("-");
  return index < 0 ? "" : withNum.slice(index + 1);
};

// Acceptable params: reactive obj / array, reactive obj and prop, or a watcher function
// which may return a reactive obj / array
const pursue = (reactive, prop) => {
  const fn =
    typeof reactive === "function" ? reactive : prop ? () => reactive[prop] : () => reactive;
  const retval = fn();
  const subs = new Set();

  if (retval.__ob__) {
    retval.__ob__.dep.subs.forEach(s => subs.add(s));
  }
  // here we need to add a watcher on the prop in order to pull the dep
  const tempVm = new Vue();
  tempVm.$watch(fn, () => {});
  const tempWatch = tempVm._watchers[0];
  // now pull the subs from the deps ;)
  tempWatch.deps.forEach(dep => dep.subs.filter(s => s !== tempWatch).forEach(s => subs.add(s)));

  let unrecognised = 0;
  const computed = [];
  const components = [];
  subs.forEach(sub => {
    // computed on component
    if (sub.getter.name) {
      let comp =
        sub.vm.name || (sub.vm.$vnode && sub.vm.$vnode.tag && stripTagPrefix(sub.vm.$vnode.tag));

      if (sub.getter.name === "updateComponent" && sub.expression.includes("vm._update")) {
        if (comp) {
          components.push(comp);
        } else {
          unrecognised++;
        }
      } else if (!["mappedState", "mappedGetter"].includes(sub.getter.name)) {
        computed.push(`${comp && comp + "."}${sub.getter.name}`);
      }
    }
    // vuex getter
    else if (sub.watcherName) {
      computed.push(sub.watcherName);
    }
  });
  return { computed, components, unrecognised };
};

// Add pursue to the Vue global
const install = _Vue => {
  Vue = _Vue;
  Vue.pursue = pursue;
  if (window) {
    window.VuePursue = pursue;
  }
};

// Exports Dual Vue/Vuex Plugin
const dualPlugin = function(store) {
  install(store._vm.constructor);
  vuexPlugin(store);
};
dualPlugin.install = install;

export default dualPlugin;
