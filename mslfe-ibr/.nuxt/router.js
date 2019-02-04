import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _2a45bb6b = () => interopDefault(import('..\\pages\\colors\\index.vue' /* webpackChunkName: "pages_colors_index" */))
const _f841e29c = () => interopDefault(import('..\\pages\\kelvin\\index.vue' /* webpackChunkName: "pages_kelvin_index" */))
const _18fe98ae = () => interopDefault(import('..\\pages\\modes\\index.vue' /* webpackChunkName: "pages_modes_index" */))
const _457ebd10 = () => interopDefault(import('..\\pages\\white\\index.vue' /* webpackChunkName: "pages_white_index" */))
const _b80e5238 = () => interopDefault(import('..\\pages\\whiteonly\\index.vue' /* webpackChunkName: "pages_whiteonly_index" */))
const _3a92d832 = () => interopDefault(import('..\\pages\\zones\\index.vue' /* webpackChunkName: "pages_zones_index" */))
const _73063af8 = () => interopDefault(import('..\\pages\\modes\\effect\\index.vue' /* webpackChunkName: "pages_modes_effect_index" */))
const _1d94bcef = () => interopDefault(import('..\\pages\\modes\\effectLegacy\\index.vue' /* webpackChunkName: "pages_modes_effectLegacy_index" */))
const _78aa494a = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

Vue.use(Router)

if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected and scrollToTop is not explicitly disabled
  if (
    to.matched.length < 2 &&
    to.matched.every(r => r.components.default.options.scrollToTop !== false)
  ) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/colors",
      component: _2a45bb6b,
      name: "colors"
    }, {
      path: "/kelvin",
      component: _f841e29c,
      name: "kelvin"
    }, {
      path: "/modes",
      component: _18fe98ae,
      name: "modes"
    }, {
      path: "/white",
      component: _457ebd10,
      name: "white"
    }, {
      path: "/whiteonly",
      component: _b80e5238,
      name: "whiteonly"
    }, {
      path: "/zones",
      component: _3a92d832,
      name: "zones"
    }, {
      path: "/modes/effect",
      component: _73063af8,
      name: "modes-effect"
    }, {
      path: "/modes/effectLegacy",
      component: _1d94bcef,
      name: "modes-effectLegacy"
    }, {
      path: "/",
      component: _78aa494a,
      name: "index"
    }],

    fallback: false
  })
}
