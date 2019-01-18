<template>
  <v-layout column align-center>
    <v-flex xs12>
      <v-carousel style="box-shadow: none;"
                  height="300"
                  hide-delimiters
                  hide-controls
                  :cycle="false">
        <v-carousel-item
          v-for="(group, $idx) in palette" :key="$idx"
          v-if="$idx%4==0"
        >
          <div v-for="n in 4"
               class="vc-swatches-color-group"
          >
            <div :class="['vc-swatches-color-it', {'vc-swatches-color--white': c === '#FFFFFF' }]"
                 v-for="c in palette[$idx+n-1]" :key="c"
                 :data-color="c"
                 :style="{background: c}"
                 @click="handlerClick(c)"
            >
              <div class="vc-swatches-pick" v-show="equal(c)">
                <svg style="width: 24px; height:24px;" viewBox="0 0 24 24">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                </svg>
              </div>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-layout>
</template>

<script>
  import material from 'material-colors'
  import colorMixin from '~/components/colorpicker/mixin/color'

  /*var colorMap = [
    'red', 'pink', 'purple', 'deepPurple',
    'indigo', 'blue', 'lightBlue', 'cyan',
    'teal', 'green', 'lightGreen', 'lime',
    'yellow', 'amber', 'orange', 'deepOrange',
    'brown', 'blueGrey', 'black'
  ]*/
  var colorMap = [
    'red', 'pink', 'purple', 'deepPurple',
    'indigo', 'blue', 'lightBlue', 'cyan',
    'teal', 'green', 'lightGreen', 'lime',
    'yellow', 'amber', 'orange', 'deepOrange'
  ]

  var colorLevel = ['800', '700', '600', '500', '400', '300', '200', '100']
  var defaultColors = (() => {
    var colors = []
    colorMap.forEach((type) => {
      var typeColor = []
      if (type.toLowerCase() === 'black' || type.toLowerCase() === 'white') {
        typeColor = typeColor.concat(['#000000', '#FFFFFF'])
      } else {
        colorLevel.forEach((level) => {
          const color = material[type][level]
          typeColor.push(color.toUpperCase())
        })
      }
      colors.push(typeColor)
    })
    return colors
  })()

  export default {
    name: 'Swatches',
    mixins: [colorMixin],
    props: {
      palette: {
        type: Array,
        default() {
          return defaultColors
        }
      }
    },
    computed: {
      pick() {
        return this.colors2.hex
      }
    },
    methods: {
      equal(color) {
        return color.toLowerCase() === this.colors2.hex.toLowerCase()
      },
      handlerClick(c) {
        this.colorChange({
          hex: c,
          source: 'hex'
        })
      }
    }

  }
</script>

<style>
  .vc-swatches {
    width: auto;
    height: auto;
    /*background-color: #fff;*/
  }

  .vc-swatches-box {
    padding: 0;

  }

  .vc-swatches-color-group {
    width: 50px;
    float: left;
    margin-right: 5px;
    margin-left: 5px;
  }

  .vc-swatches-color-it {
    box-sizing: border-box;
    width: 50px;
    height: 34px;
    cursor: pointer;
    background: #880e4f;
    margin-bottom: 10px;
    overflow: hidden;
    -ms-border-radius: 6px;
    -moz-border-radius: 6px;
    -o-border-radius: 6px;
    -webkit-border-radius: 6px;
    border-radius: 6px;
  }

  .vc-swatches-color--white {
    border: 1px solid #DDD;
  }

  .vc-swatches-pick {
    fill: rgb(255, 255, 255);
    margin-left: 14px;
    margin-top: 4px;
    display: block;
  }

  .vc-swatches-color--white .vc-swatches-pick {
    fill: rgb(51, 51, 51);
  }
</style>
