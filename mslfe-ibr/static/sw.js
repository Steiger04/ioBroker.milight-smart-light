importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/2f8f620f0371367b84df.js",
    "revision": "4f6bd91b24eea08a8c47b7d4eac0fc2f"
  },
  {
    "url": "/_nuxt/31b09b912969e91776ec.js",
    "revision": "9c90769ed548146a81e09ce0b515e5ff"
  },
  {
    "url": "/_nuxt/4d6521f3bdb711fd3535.js",
    "revision": "96bc1c8e82b86fc5370dae03f729da28"
  },
  {
    "url": "/_nuxt/56a4b796b86bd195d3e8.js",
    "revision": "5089a3a25118442a12002f42f4f998fd"
  },
  {
    "url": "/_nuxt/5cfc89687d92e820bc93.js",
    "revision": "55b7180430107f1fb7165b348308f57f"
  },
  {
    "url": "/_nuxt/6c728d002ea9cf4e3f30.js",
    "revision": "35a1429baa2c61b2b4787d6f26172bf0"
  },
  {
    "url": "/_nuxt/7d54e70aa31838d90784.js",
    "revision": "88311a19409f68e30ece07f234119656"
  },
  {
    "url": "/_nuxt/99a82b6aecc9f8b28855.js",
    "revision": "52a3d99ee2befc65b218587d872625ee"
  },
  {
    "url": "/_nuxt/b8437b1fbcf0ae08e30a.js",
    "revision": "c2763de560629ac12281969da9232d81"
  },
  {
    "url": "/_nuxt/c60ceb8179d118ea331d.js",
    "revision": "bb1fdfa38e8456ee43066bfc61832727"
  },
  {
    "url": "/_nuxt/c846d3c352e2f33df276.js",
    "revision": "83cd0bc8e4caaeff4d286f9fd9a4b28d"
  },
  {
    "url": "/_nuxt/d853b8aef9ddb9ad4e55.js",
    "revision": "5ed70223e973bcc0ba1f9a481ce759c5"
  },
  {
    "url": "/_nuxt/d9fe8cb19e7a083841c3.js",
    "revision": "15242026ef6aabeb9ddbad847a3edd03"
  },
  {
    "url": "/_nuxt/e530c0a262cc1837623b.js",
    "revision": "0f6f650bb847db3e19a611d26c0c63c7"
  },
  {
    "url": "/_nuxt/ef3d314713467230858b.js",
    "revision": "4b5e420b11c88f76f991b1d2a5220144"
  }
], {
  "cacheId": "mslfe-ibr",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
