/* eslint-disable no-unused-vars */
import tinycolor from 'tinycolor2'

import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

function _colorChange(data, oldHue) {
  const alpha = data && data.a
  let color

  // hsl is better than hex between conversions
  if (data && data.hsl) {
    color = tinycolor(data.hsl)
  } else if (data && data.hex && data.hex.length > 0) {
    color = tinycolor(data.hex)
  } else {
    if (data.s === 0) {
      data.s = 0.6649
      data.v = 0.749
    }
    color = tinycolor(data)
  }

  if (color && (color._a === undefined || color._a === null)) {
    color.setAlpha(alpha || 1)
  }

  const hsl = color.toHsl()
  const hsv = color.toHsv()

  if (hsl.s === 0) {
    hsv.h = hsl.h = data.h || (data.hsl && data.hsl.h) || oldHue || 0
  }

  /* --- comment this block to fix #109, may cause #25 again --- */
  // when the hsv.v is less than 0.0164 (base on test)
  // because of possible loss of precision
  // the result of hue and saturation would be miscalculated
  // if (hsv.v < 0.0164) {
  //   hsv.h = data.h || (data.hsv && data.hsv.h) || 0
  //   hsv.s = data.s || (data.hsv && data.hsv.s) || 0
  // }

  // if (hsl.l < 0.01) {
  //   hsl.h = data.h || (data.hsl && data.hsl.h) || 0
  //   hsl.s = data.s || (data.hsl && data.hsl.s) || 0
  // }
  /* ------ */

  return {
    hsl: hsl,
    hex: color.toHexString().toUpperCase(),
    rgba: color.toRgb(),
    hsv: hsv,
    oldHue: data.h || oldHue || hsl.h,
    source: data.source,
    a: data.a || color.getAlpha()
  }
}

export default {
  model: {
    prop: 'fromColors1'
  },
  props: {
    fromColors1: String
  },
  data() {
    return {
      val: this.fromColors1
    }
  },
  computed: {
    colors2: {
      get() {
        return _colorChange(this.val)
      },
      set(newVal) {
        this.val = newVal
        this.$emit('input', newVal)
      }
    }
  },
  watch: {
    fromColors1(newVal) {
      this.val = _colorChange(newVal)
    }
  },
  methods: {
    ...mapActions(['UPDATE_DP']),
    colorChange(data, oldHue) {
      this.oldHue = this.colors2.hsl.h
      this.colors2 = _colorChange(data, oldHue || this.oldHue)
    },
    isValidHex(hex) {
      return tinycolor(hex).isValid()
    },
    simpleCheckForValidColor(data) {
      const keysToCheck = ['r', 'g', 'b', 'a', 'h', 's', 'l', 'v']
      let checked = 0
      let passed = 0

      for (let i = 0; i < keysToCheck.length; i++) {
        const letter = keysToCheck[i]
        if (data[letter]) {
          checked++
          if (!isNaN(data[letter])) {
            passed++
          }
        }
      }

      if (checked === passed) {
        return data
      }
    }
  }
}
