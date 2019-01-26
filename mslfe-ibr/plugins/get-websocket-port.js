import Vue from 'vue'

export default async ({ app, env }, inject) => {
  const payload = await app.$axios.$get(document.location.href + 'port') // nur für prod

  app.store.commit('SET_WEBSOCKET_PORT', payload.port)

  Vue.console.log('VUE::get-websocket-port::' + JSON.stringify(payload))
}
