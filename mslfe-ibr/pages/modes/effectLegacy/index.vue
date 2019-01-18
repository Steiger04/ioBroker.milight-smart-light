<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout column>
      <v-flex xs4 d-inline-flex align-center>
        <v-layout row justify-space-around text-xs-center>
          <v-flex xs12>
            <v-btn round dark large color="blue darken-2"
               @click="UPDATE_DP_FROM_CLIENT({value: true, dp: 'effectModeNext', delay: 500})"
            >
              <v-icon left dark>arrow_upward</v-icon>
              next mode
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
  
      <v-flex xs4 d-inline-flex align-center>
        <msl-slider
           style="padding:0;"
           @callback="bo"
           v-bind:value="brightnessOnly"
           v-bind="sliderSettings"/>
      </v-flex>
      
      <v-flex xs4 d-inline-flex align-center>
        <v-layout row justify-space-around text-xs-center>
          <v-flex xs4>
            <v-btn fab dark large color="light-blue lighten-2"
               @click="UPDATE_DP_FROM_CLIENT({value: true, dp: 'effectSpeedUp', delay: 500})"
            >
              <v-icon dark>keyboard_arrow_up</v-icon>
            </v-btn>
          </v-flex>
          
          <v-flex xs4>
            <v-btn fab dark large color="blue darken-4"
               @click="UPDATE_DP_FROM_CLIENT({value: true, dp: 'effectSpeedDown', delay: 500})"
            >
              <v-icon dark>keyboard_arrow_down</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>

     

      <!--<v-flex xs4 d-inline-flex align-end>
        <v-layout row justify-space-around text-xs-center>
          <v-flex xs12>
            <v-btn round dark large color="blue darken-2"
                   @click="$router.push('/modes')"
            >
              <v-icon left dark>undo</v-icon>
              modes
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>-->
    </v-layout>
  </v-container>
</template>

<script>
  import mslSlider from 'vue-slider-component'
  import {mapActions, mapGetters} from 'vuex'

  export default {
    data() {
      return {
        sliderSettings: {
          tooltip: false,
          min: 1,
          max: 100,
          height: 90,
          dotWidth: 32,
          dotHeight: 86,
          processStyle: {
            backgroundColor: "transparent"
          },
          bgStyle: {
            borderRadius: "6px",
            backgroundImage: "-webkit-linear-gradient(left, #000000, #ffffff)",

          },
          sliderStyle: {
            borderRadius: "6px",
            backgroundColor: "transparent",

            boxShadow: "1px 1px 8px 1px rgba(0, 0, 0, 0.6)"
          }
        }
      }
    },
    components: {
      mslSlider
    },
    computed: {
      ...mapGetters(['LOADED_ZONE', 'DPS']),
      brightnessOnly() {
        return this.DPS[this.LOADED_ZONE._id + '.brightnessOnly'].val
      }
    },
    methods: {
      ...mapActions(['UPDATE_DP_FROM_CLIENT', 'UPDATE_DP']),
      bo(options) {
        this.UPDATE_DP_FROM_CLIENT({value: options, dp: 'brightnessOnly', delay: 500})
      }
    }
  }
</script>

<style scoped>
</style>
