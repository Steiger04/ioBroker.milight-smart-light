importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/034820e53bc17b39c2b1.js",
    "revision": "bf38dfc0c9ed879184e726dfb6a9650a"
  },
  {
    "url": "/_nuxt/0bd63f6b7e333de9c79f.js",
    "revision": "8f7587bb2688dc193403484c131fb96f"
  },
  {
    "url": "/_nuxt/153b804f85c1a37ba7a8.js",
    "revision": "5c20ddf372084bdb0a6726f9167b4efc"
  },
  {
    "url": "/_nuxt/23d2c7d3f82e90a0b112.js",
    "revision": "5805ea0c2b189abf17114c5f0a2e8cea"
  },
  {
    "url": "/_nuxt/2c2390994ba628df7aa4.js",
    "revision": "2edda94b14c87efbb1241b39a2c4d400"
  },
  {
    "url": "/_nuxt/2f71cdb6476734e0c4bb.js",
    "revision": "79812f185a74fda6902addddaca7eab5"
  },
  {
    "url": "/_nuxt/3ee1a55e1561873d4ef3.js",
    "revision": "f5de1f831185a96ec9b090946d9c5178"
  },
  {
    "url": "/_nuxt/4b08c4b65522e0c84700.js",
    "revision": "6a7d966eae31a034961c337f5b6cdf4d"
  },
  {
    "url": "/_nuxt/4ea0d94e954d990079f1.js",
    "revision": "de8fe84628d593cb33643d72b6b5a674"
  },
  {
    "url": "/_nuxt/631f9f2f8d80fbf5a46b.js",
    "revision": "cb2a288730c4ad4a8532358974976a86"
  },
  {
    "url": "/_nuxt/6917a6d63811b3e904ba.js",
    "revision": "daf30226a7151502cbfd1b49f751cfa3"
  },
  {
    "url": "/_nuxt/80e97e03eb32c13f58fa.js",
    "revision": "0c79ec2a493d80f71a4ef591522af8e1"
  },
  {
    "url": "/_nuxt/8a1bcc9a89cf3bd25eed.js",
    "revision": "97b6909f4d1dd910b8e7124cebac39e3"
  },
  {
    "url": "/_nuxt/9c2e973b07d234d96493.js",
    "revision": "ac70ef14fbc0bbeeb06d9e3f539f411e"
  },
  {
    "url": "/_nuxt/f7b82da44b7008270be8.js",
    "revision": "9b26921e1e4b5ae877be1d9d30cab0df"
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
