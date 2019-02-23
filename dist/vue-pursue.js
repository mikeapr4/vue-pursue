/*!
 * Vue-Pursue v0.1.0
 * https://github.com/mikeapr4/vue-pursue
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VuePursue"] = factory();
	else
		root["VuePursue"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/vue-pursue.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/vue-pursue.js":
/*!***************************!*\
  !*** ./src/vue-pursue.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// These are methods which will refresh the computed watchers\nvar vuexApiMethods = [\"registerModule\", \"unregisterModule\", \"hotUpdate\"];\nvar Vue; // Marks getter watchers with the getter name, so it can be retrieved\n// in some data's deps.\n// app.vuex.state.task.records.__ob__.dep.subs.map((s) => s.getter.name || s.watcherName)\n\nvar vuexPlugin = function vuexPlugin(store) {\n  var markWatchers = function markWatchers(_ref) {\n    var _vm = _ref._vm;\n    Object.keys(_vm._computedWatchers).forEach(function (k) {\n      _vm._computedWatchers[k].watcherName = k;\n    });\n  };\n\n  markWatchers(store);\n  vuexApiMethods.forEach(function (method) {\n    store[method] = function () {\n      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n        args[_key] = arguments[_key];\n      }\n\n      store.prototype[method].apply(store, args);\n      markWatchers(store);\n    };\n  });\n}; // vnode tags are in the format: `vue-component-N-MyComponent`\n\n\nvar stripTagPrefix = function stripTagPrefix(tag) {\n  var withNum = tag.slice(\"vue-component-\".length);\n  var index = withNum.indexOf(\"-\");\n  return index < 0 ? \"\" : withNum.slice(index + 1);\n}; // Acceptable params: reactive obj / array, reactive obj and prop, or a watcher function\n// which may return a reactive obj / array\n\n\nvar pursue = function pursue(reactive, prop) {\n  var fn = typeof reactive === \"function\" ? reactive : prop ? function () {\n    return reactive[prop];\n  } : function () {\n    return reactive;\n  };\n  var retval = fn();\n  var subs = new Set();\n\n  if (retval.__ob__) {\n    retval.__ob__.dep.subs.forEach(function (s) {\n      return subs.add(s);\n    });\n  } // here we need to add a watcher on the prop in order to pull the dep\n\n\n  var tempVm = new Vue();\n  tempVm.$watch(fn, function () {});\n  var tempWatch = tempVm._watchers[0]; // now pull the subs from the deps ;)\n\n  tempWatch.deps.forEach(function (dep) {\n    return dep.subs.filter(function (s) {\n      return s !== tempWatch;\n    }).forEach(function (s) {\n      return subs.add(s);\n    });\n  });\n  var unrecognised = 0;\n  var computed = [];\n  var components = [];\n  subs.forEach(function (sub) {\n    // computed on component\n    if (sub.getter.name) {\n      var comp = sub.vm.name || sub.vm.$vnode && sub.vm.$vnode.tag && stripTagPrefix(sub.vm.$vnode.tag);\n\n      if (sub.getter.name === \"updateComponent\" && sub.expression.includes(\"vm._update\")) {\n        if (comp) {\n          components.push(comp);\n        } else {\n          unrecognised++;\n        }\n      } else if (![\"mappedState\", \"mappedGetter\"].includes(sub.getter.name)) {\n        computed.push(\"\".concat(comp && comp + \".\").concat(sub.getter.name));\n      }\n    } // vuex getter\n    else if (sub.watcherName) {\n        computed.push(sub.watcherName);\n      }\n  });\n  return {\n    computed: computed,\n    components: components,\n    unrecognised: unrecognised\n  };\n}; // Add pursue to the Vue global\n\n\nvar install = function install(_Vue) {\n  Vue = _Vue;\n  Vue.pursue = pursue;\n\n  if (window) {\n    window.VuePursue = pursue;\n  }\n}; // Exports Dual Vue/Vuex Plugin\n\n\nvar dualPlugin = function dualPlugin(store) {\n  install(store._vm.constructor);\n  vuexPlugin(store);\n};\n\ndualPlugin.install = install;\n/* harmony default export */ __webpack_exports__[\"default\"] = (dualPlugin);\n\n//# sourceURL=webpack://VuePursue/./src/vue-pursue.js?");

/***/ })

/******/ });
});