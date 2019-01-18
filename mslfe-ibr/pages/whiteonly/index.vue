<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout row wrap align-center>
      <v-flex xs4>
        <v-btn fab dark large
               style="boxShadow: inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36);
                backgroundImage: -webkit-linear-gradient(bottom, #000000, #ffffff);"
               @click="UPDATE_DP_FROM_CLIENT({value: true, dp: 'brightUp', delay: 500})"
        >
          <v-icon dark>keyboard_arrow_up</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs4 text-xs-center caption font-weight-bold class="grey--text lighten-5">
        bright up / bright down
      </v-flex>

      <v-flex xs4 text-xs-right>
        <v-btn fab dark large
               style="boxShadow: inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36);
                backgroundImage: -webkit-linear-gradient(bottom, #ffffff, #000000);"
               @click="UPDATE_DP_FROM_CLIENT({value: true, dp: 'brightDown', delay: 500})"
        >
          <v-icon dark>keyboard_arrow_up</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs4>
        <v-btn fab dark large
               style="boxShadow: inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36);
                backgroundImage: -webkit-linear-gradient(bottom, #FFFDE7, #0000ff);"
               @click="UPDATE_DP_FROM_CLIENT({value: true, dp: 'cooler', delay: 500})"
        >
          <v-icon dark>keyboard_arrow_up</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs4 text-xs-center caption font-weight-bold class="grey--text lighten-5">
        cooler / warmer
      </v-flex>

      <v-flex xs4 text-xs-right>
        <v-btn fab dark large
               style="boxShadow: inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36);
                backgroundImage: -webkit-linear-gradient(bottom, #0000ff, #FFFDE7);"
               @click="UPDATE_DP_FROM_CLIENT({value: true, dp: 'warmer', delay: 500})"
        >
          <v-icon dark>keyboard_arrow_up</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs4>
        <v-btn fab dark large color="white black--text"
               style="boxShadow: inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36);"
               @click="UPDATE_DP_FROM_CLIENT({value: true, dp: 'maxBright', delay: 500})"
        >
          <v-icon dark>panorama_fish_eye</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs4 text-xs-center caption font-weight-bold class="grey--text lighten-5">
        max bright / night
      </v-flex>

      <v-flex xs4 text-xs-right>
        <v-btn fab dark large color="black white--text"
               style="boxShadow: inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36);"
               @click="UPDATE_DP_FROM_CLIENT({value: true, dp: 'nightMode', delay: 500})"
        >
          <v-icon dark>panorama_fish_eye</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs12 align-end>
        <v-divider/>
      </v-flex>

      <v-flex xs12/>

      <v-flex xs6 text-xs-center>
        <v-btn fab dark large color="green"
               @click="UPDATE_DP_FROM_CLIENT({value: true, dp: 'on', delay: 500})"
        >
          <v-icon dark>done</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs6 text-xs-center>
        <v-btn fab dark large color="red"
               @click="UPDATE_DP_FROM_CLIENT({value: true, dp: 'off', delay: 500})"
        >
          <v-icon dark>clear</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import mslOnOff from '@/components/OnOff'

  export default {
    data() {
      return {}
    },
    methods: {
      ...mapActions(['UPDATE_DP_FROM_CLIENT'])
    },
    components: {
      mslOnOff
    }
  }
</script>

<style scoped>

</style>
