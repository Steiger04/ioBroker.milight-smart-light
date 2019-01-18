<template>
    <v-layout row justify-space-around text-xs-center>
      <v-flex xs6>
        <v-btn fab dark large color="green"
               @click="on"
        >
          <v-icon dark>done</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs6>
        <v-btn fab dark large color="red"
               @click="off"
        >
          <v-icon dark>clear</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    methods: {
      ...mapActions(['UPDATE_DP', 'UPDATE_DP_FROM_CLIENT']),
      on() {
        this.UPDATE_DP_FROM_CLIENT ({ value: true, dp: 'on', delay: 500 })
      },
      off() {
        this.UPDATE_DP_FROM_CLIENT ({ value: true, dp: 'off', delay: 500 })
      }
    }
  }
</script>
