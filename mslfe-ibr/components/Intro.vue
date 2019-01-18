<template>
  <v-avatar tile :size="resize + 'px'">
    <img src="~assets/msl-start-web-alpha.png">
  </v-avatar>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: {
      newsize: 0
    },
    computed: {
      resize () {
        if (this.newsize > 600) {
          return 600
        }

        return this.newsize
      }
    }
  }
</script>
