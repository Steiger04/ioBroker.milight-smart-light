importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/01d2eb3d715f2aff8b21.js",
    "revision": "bc77a0e8989819d27ab9601a3debaa9a"
  },
  {
    "url": "/_nuxt/01eea6e97c740f713ce1.js",
    "revision": "f00b461c0a9e4ad1249dc9402db59249"
  },
  {
    "url": "/_nuxt/21dd364462dc50da118b.js",
    "revision": "6b1a981ea0a0a6dd4181b5931b7cc862"
  },
  {
    "url": "/_nuxt/24da9bc089fc57ed9c66.js",
    "revision": "27d559bd38eb950692bc0567b864aa0d"
  },
  {
    "url": "/_nuxt/57642a03b5b178112a65.js",
    "revision": "64bf5a74c612e2460bf422fee484775e"
  },
  {
    "url": "/_nuxt/7c14b60679a2d7c2367f.js",
    "revision": "bd5918197673d433ddba1acf0d9570a8"
  },
  {
    "url": "/_nuxt/9a9f77f63b53ccac05a7.js",
    "revision": "0ae6f51abec3fbc00f9e51e9c9f57121"
  },
  {
    "url": "/_nuxt/afeaa9f1bda6fa1664b3.js",
    "revision": "7a73f9a826ec5283375c5b6b932df212"
  },
  {
    "url": "/_nuxt/b97a4b1c30599c52d78e.js",
    "revision": "3bac1572d19041d6aecd491b2ff56078"
  },
  {
    "url": "/_nuxt/bc3366ad03c62a9d0bad.js",
    "revision": "079fd827f28a65603c19325f34ce67d3"
  },
  {
    "url": "/_nuxt/cece6629858e1d6701bd.js",
    "revision": "6c12354c8c931ef62ec6c44278c55d13"
  },
  {
    "url": "/_nuxt/db3da4d809915407bdd2.js",
    "revision": "f3abf0fe3fccd5e961f84537d20ecd8f"
  },
  {
    "url": "/_nuxt/e2cddc82e2a212202f40.js",
    "revision": "910bd4f4fd3b2c5eeb32ee83bfeac518"
  },
  {
    "url": "/_nuxt/eeb37e092e2c4e20332a.js",
    "revision": "37162b45891a49ea50b91a66b699746b"
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
