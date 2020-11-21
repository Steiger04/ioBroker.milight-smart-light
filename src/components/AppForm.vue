<template>
  <div class="row justify-center">
    <q-card
        class="app-card"
        :class="{'bg-grey-4': !$q.dark.isActive}"
    >
      <q-card-section>
        <q-toggle
            v-model="activeApp"
            :label="$t('appForm.activeApp')"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
        />
      </q-card-section>

      <q-separator/>

      <q-card-section
          :disabled="!activeApp"
      >
        <q-input
            v-model="$v.serverPort.$model"
            :label="$t('appForm.serverPort')"
            :error="$v.serverPort.$error"
            :error-message="validationMsg($v.serverPort, $t('appForm.serverPort'))"
            :disable="!activeApp"
        >
          <template v-slot:append>
            <q-icon
                name="close"
                @click="$v.serverPort.$model=''"
                class="cursor-pointer"
            />
          </template>
        </q-input>
        <q-input
            v-model="$v.socketPort.$model"
            :label="$t('appForm.socketPort')"
            :error="$v.socketPort.$error"
            :error-message="validationMsg($v.socketPort, $t('appForm.socketPort'))"
            :disable="!activeApp"
        >
          <template v-slot:append>
            <q-icon
                name="close"
                @click="$v.socketPort.$model=''"
                class="cursor-pointer"
            />
          </template>
        </q-input>
        <q-input
            v-model="$v.debounceTime.$model"
            :label="$t('appForm.debounceTime')"
            :error="$v.debounceTime.$error"
            :error-message="validationMsg($v.debounceTime, $t('appForm.debounceTime'))"
            :disable="!activeApp"
        >
          <template v-slot:append>
            <q-icon
                name="close"
                @click="$v.debounceTime.$model=''"
                class="cursor-pointer"
            />
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {
  required, numeric, maxLength, between, minValue,
} from 'vuelidate/lib/validators';
import { validationMessage } from 'vuelidate-messages';
import { fieldsTemplate } from '../mixin/fieldsTemplate';
import { messages } from '../js/vuelidate-messages';

export default {
  name: 'AppForm',
  mixins: [fieldsTemplate],
  data() {
    return {};
  },
  methods: {
    validationMsg: validationMessage(messages),
  },
  watch: {
    '$v.$anyError': function (val) {
      this.isValidApp = !val;
    },
  },
  validations: {
    serverPort: {
      required,
      numeric,
      maxLength: maxLength(5),
      between: between(1024, 64738),
    },
    socketPort: {
      required,
      numeric,
      maxLength: maxLength(5),
      between: between(1024, 64738),
    },
    debounceTime: {
      required,
      numeric,
      maxLength: maxLength(4),
      minValue: minValue(100),
    },
  },
  created() {
    this.$v.$touch();
  },
};
</script>

<style
    lang="sass"
    scoped
>
.app-card
  width: 600px
  max-width: 100%
</style>
