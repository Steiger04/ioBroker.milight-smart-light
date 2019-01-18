<template>
    <v-container fill-height fluid grid-list-xl>
      <v-layout column>
        <v-flex xs6>
          <msl-slider
            v-if="LOADED_PICKER=='Slider'"
          />
          <msl-swatches
            v-if="LOADED_PICKER=='Swatches'"
          />
        </v-flex>
        <v-flex xs6 d-inline-flex align-end>
          <msl-on-off/>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
  import mslSlider from '@/components/colorpicker/Slider'
  import mslSwatches from '@/components/colorpicker/Swatches'
  import mslOnOff from '@/components/OnOff'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      mslSlider,
      mslSwatches,
      mslOnOff
    },
    computed: {
      ...mapGetters(['LOADED_PICKER'])
    }
  }
</script>

<style scoped>
</style>
