<template>
  <v-flex>
    <div class="vc-slider">
      <div class="vc-slider-hue-warp">
        <hue v-model="colors2" @change="hueChange"></hue>
      </div>
      <div class="vc-margin">
        <div class="vc-slider-swatches"
             v-for="(offset, index) in swatches" :data-index="index"
             v-if="index%3==0"
        >
          <div
            class="vc-slider-swatch"
            @click="handleSwClick(index+n-1, swatches[index+n-1])"
            v-for="n in 3"
          >
            <div class="vc-slider-swatch-picker"
                 :class="{'vc-slider-swatch-picker--active': swatches[index+n-1] == activeOffset}"
                 :style="{background: 'hsl(' + colors2.hsl.h + ', 50%, ' + (swatches[index+n-1] * 100) + '%)'}"

            />
          </div>
        </div>
      </div>
    </div>
  </v-flex>
</template>

<script>
  import colorMixin from '~/components/colorpicker/mixin/color'
  import hue from '~/components/colorpicker/common/Hue.vue'

  export default {
    name: 'Slider',
    mixins: [colorMixin],
    props: {
      direction: String
    },
    components: {
      hue
    },
    computed: {
      activeOffset() {
        if (Math.round(this.colors2.hsl.s * 100) >= 0.49) { //TODO: Warum 0.49 ok?
          return Math.round(this.colors2.hsl.l * 100) / 100
        }
        return 0
      }
    },
    data() {
      return {
        swatches: ['.95', '.80', '.70', '.60', '.50', '.40', '.30', '.20', '.05']
      }
    },
    methods: {
      hueChange(data) {
        this.colorChange(data)
      },
      handleSwClick(index, offset) {
        this.colorChange({
          h: this.colors2.hsl.h,
          s: 0.5,
          l: offset,
          source: 'hsl'
        })
      }
    }
  }
</script>

<style>
  .vc-margin {
    margin-top: 30px;
  }

  .vc-slider {
    position: relative;
    width: auto;
  }

  .vc-slider-hue-warp {
    height: 54px;
    position: relative;
    border-radius: 6px;
  }

  .vc-slider-hue-warp .vc-hue-picker {
    width: 30px;
    height: 50px;
    border-radius: 6px;
    transform: translate(-15px, 1px);
    background-color: transparent;
    box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.6);
  }

  .vc-slider-swatches {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .vc-slider-swatch {
    justify-content: space-around;
    margin: 0.4rem;
    width: 60px;
    height: 45px;
  }

  .vc-slider-swatch .vc-slider-swatch-picker {
    border-radius: 6px;
  }

  .vc-slider-swatch-picker {
    cursor: pointer;
    height: 40px;
  }

  .vc-slider-swatch-picker--active {
    transform: scale(1.15);
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 1.0);
  }
</style>
