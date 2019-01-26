<template>
  <v-container fill-height fluid>
    <v-layout
      v-resize="onResize"
      row
    >
      <v-flex
        layout
        align-center
        justify-center
      >
        <msl-intro :newsize="windowSize" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import mslIntro from '~/components/Intro'

export default {
  components: {
    mslIntro
  },
  // middleware: 'connection',
  data() {
    return {
      windowSize: 0
    }
  },
  mounted() {
    this.onResize()
  },
  methods: {
    onResize() {
      this.windowSize = window.innerWidth - 64
    }
  }
}
</script>
