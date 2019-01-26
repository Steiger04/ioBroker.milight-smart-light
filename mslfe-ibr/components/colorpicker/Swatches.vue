<template>
  <swatches v-model="colors1"/>
</template>


<script>
import Swatches from '@/components/colorpicker/swatches/Swatches'
import pickerMixin from '~/components/colorpicker/mixin/picker'

export default {
  mixins: [pickerMixin],
  data() {
    return {
      palette: [
        ['#F64272', '#F6648B', '#F493A7', '#F891A6', '#FFCCD5'],
        ['#8b5aff', '#a27bff', '#b99cff', '#d0bdff', '#e8deff'],
        ['#51e5db', '#74ebe3', '#96f0ea', '#b9f5f1', '#dcfaf8'],
        ['#ffa51a', '#ffb748', '#ffc976', '#ffdba3', '#ffedd1']
      ]
    }
  },
  components: {
    Swatches
  }
}
</script>

<style>
</style>
