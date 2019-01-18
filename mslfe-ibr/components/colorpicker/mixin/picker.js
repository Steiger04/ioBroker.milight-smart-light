import Vue from 'vue'
import {mapGetters, mapActions} from 'vuex'

export default {
  computed: {
    ...mapGetters(['LOADED_ZONE', 'DPS']),
    colors1: {
      get() {
        return this.DPS[this.LOADED_ZONE._id + '.rgb'].val
      },
      set(options) {
        this.UPDATE_DP_FROM_CLIENT({value: options.hex.toLowerCase(), dp: 'rgb', delay: 500})
      }
    }
  },
  methods: {
    ...mapActions(['UPDATE_DP_FROM_CLIENT', 'UPDATE_DP'])
  }
}
