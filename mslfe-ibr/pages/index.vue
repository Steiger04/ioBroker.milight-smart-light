<template>
  <v-container fill-height fluid>
    <v-layout row
              v-resize="onResize"
    >
      <v-flex
        layout
        align-center
        justify-center
      >
        <msl-intro :newsize="windowSize"></msl-intro>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import mslIntro from '~/components/Intro'

  export default {
    // middleware: 'connection',
    data() {
      return {
        windowSize: 0
      }
    },
    mounted() {
      this.onResize()
    },
    components: {
      mslIntro
    },
    methods: {
      onResize() {
        this.windowSize = window.innerWidth - 64
      }
    }
  }
</script>
