const express = require('express')
const consola = require('consola')

const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.SERVER_PORT || 3000

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  /* const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.SERVER_PORT || 3000
  } = nuxt.options.server */

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.get('/port', (req, res) => {
    res.status(200).send({ port: +process.env.WS_PORT })
  })

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
