const pkg = require("./package");

const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: "universal",

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    title: "iobroker - milight",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "~/assets/msl-start-web.png" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#fa923f", height: "4px", duration: 5000 },
  loadingIndicator: { name: "circle", color: "#fa923f", background: "#303030" },

  /*
  ** Global CSS
  */
  css: ["~/assets/style/app.styl"],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "@/plugins/vuelogger",
    "@/plugins/vuetify",
    { src: "@/plugins/get-websocket-port", ssr:false },
    { src: "@/plugins/connection", ssr: false },
    { src: "@/plugins/vuefullscreen", ssr: false },

  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // "@nuxtjs/pwa",
    "@nuxtjs/axios",
    "@nuxtjs/redirect-module"
  ],
  env: {
    // WS_URL: process.env.WS_URL || "http://192.168.2.110:15756",
    // dev: process.env.NODE_ENV !== "production"
  },
  redirect: [
    { from: "^/(.+)$", to: "/" } // Many urls to one
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },
  /*manifest: {
    name: "milight-smart-light FE for iobroker",
    scope: "/",
    display: "standalone",
    start_url: "/",
    orientation: "portrait-primary",
    background_color: "#fff",
    theme_color: "#3f51b5",
    description: "A FE for iobroker.milight-smart-light Adapter.",
    dir: "ltr",
    lang: "de",
    short_name: "mslfe"
  },*/
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  }
}
