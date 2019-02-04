<!--suppress HtmlRequiredAltAttribute -->
<template>
  <v-avatar tile :size="resize + 'px'">
    <img src="~/assets/msl-start-web-alpha.png">
  </v-avatar>
</template>

<script>
export default {
  name: 'Intro',
  props: {
    // eslint-disable-next-line vue/require-default-prop,vue/require-prop-type-constructor
    newsize: 0
  },
  data() {
    return {}
  },
  computed: {
    resize() {
      if (this.newsize > 600) {
        return 600
      }

      return this.newsize
    }
  }
}
</script>
