<template>
  <div>
    <div
        v-if="loaded"
        id="q-app"
    >
      <router-view/>
    </div>
    <div
        v-else
        class="fixed-center"
    >
      <q-circular-progress
          indeterminate
          show-value
          font-size="10px"
          class="q-ma-md"
          size="300px"
          :thickness="0.15"
          color="light-blue-7"
          track-color="grey-3"
      >
        <q-avatar size="200px">
          <img src="~assets/iobroker-progress.png"/>
        </q-avatar>
      </q-circular-progress>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { fieldsApp } from './mixin/fieldsApp';
import { fieldsTemplate } from './mixin/fieldsTemplate';

export default {
  name: 'App',
  mixins: [fieldsApp, fieldsTemplate],
  methods: {
    ...mapMutations('app', ['updateField']),
  },
  watch: {
    native: {
      handler() {
        setTimeout(() => {
          const changed = this.$connection.getIsChanged() && this.isValidAll;
          this.updateField({
            path: 'changed',
            value: changed,
          });
        }, 50);
      },
      deep: true,
    },
    errorText(errMsg) {
      if (errMsg) {
        const settings = {
          message: errMsg,
          ...{
            type: 'negative',
            timeout: 3000,
            position: 'top',
            classes: 'glossy',
          },
        };
        this.$q.notify(settings);
        this.updateField({
          path: 'errorText',
          value: '',
        });
      }
    },
  },
  beforeCreate() {
    this.$q.dark.set('auto');
    window.addEventListener('onhashchange', this.$connection.onHashChangedBound);
  },
  beforeDestroy() {
    window.removeEventListener('onhashchange', this.$connection.onHashChangedBound);
  },
};
</script>

<style lang="sass">
.body--light
  background: #efefef
</style>
