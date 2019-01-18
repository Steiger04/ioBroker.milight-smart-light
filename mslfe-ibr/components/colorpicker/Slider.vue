<template>
  <div>
    <slider v-model="colors1"/>
  </div>
</template>


<script>
  import Slider from '@/components/colorpicker/slider/Slider'
  import pickerMixin from '~/components/colorpicker/mixin/picker'

  export default {
    mixins: [pickerMixin],
    components: {
      Slider
    }
  }
</script>
