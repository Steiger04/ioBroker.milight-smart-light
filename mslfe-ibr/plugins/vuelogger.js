import Vue from 'vue'
import Vuelogger from 'vue-logger'

Vue.use(Vuelogger, {
  prefix: () => {
    const ts = new Date()
    return (
      ts.toDateString() +
      ' :: ' +
      ts.toLocaleTimeString() +
      ' (' +
      ts.getMilliseconds() +
      ')'
    )
  },
  dev: process.env.NODE_ENV !== 'production',
  shortname: true,
  levels: ['log', 'warn', 'debug', 'error', 'dir']
})
