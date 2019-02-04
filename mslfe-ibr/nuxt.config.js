const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const pkg = require('./package')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '~/assets/msl-start-web.png' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fa923f', height: '4px', duration: 5000 },
  loadingIndicator: { name: 'circle', color: '#fa923f', background: '#303030' },
  /*
  ** Global CSS
  */
  css: ['~/assets/style/app.styl'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuelogger',
    '@/plugins/vuetify',
    { src: '@/plugins/get-websocket-port', ssr: false },
    { src: '@/plugins/connection', ssr: false },
    { src: '@/plugins/vuefullscreen', ssr: false }
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['@nuxtjs/pwa', { workbox: false, onesignal: false }],
    '@nuxtjs/axios',
    '@nuxtjs/redirect-module'
  ],
  redirect: [
    { from: '^/(.+)$', to: '/' } // Many urls to one
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },
  manifest: {
    name: 'milight-smart-light FE for iobroker',
    scope: '/',
    display: 'standalone',
    start_url: '/',
    orientation: 'portrait-primary',
    background_color: '#fff',
    theme_color: '#3f51b5',
    description: 'A FE for iobroker.milight-smart-light Adapter.',
    dir: 'ltr',
    lang: 'de',
    short_name: 'mslfe'
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
