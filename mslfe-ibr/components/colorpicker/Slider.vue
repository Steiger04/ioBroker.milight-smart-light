<template>
  <div>
    <slider v-model="colors1" />
  </div>
</template>


<script>
import Slider from '@/components/colorpicker/slider/Slider'
import pickerMixin from '~/components/colorpicker/mixin/picker'

export default {
  components: {
    Slider
  },
  mixins: [pickerMixin]
}
</script>
