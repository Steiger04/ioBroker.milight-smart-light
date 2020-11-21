<template>
  <div class="row justify-center">
    <q-card
        class="bridge-card"
        :class="{'bg-grey-4': !$q.dark.isActive}"
    >
      <q-card-section>
        <q-select
            @input="deleteAllZones"
            v-model="controllerType"
            :options="controllerTypeOptions"
            emit-value
            map-options
            :label="$t('bridgeForm.type')"
            transition-show="scale"
            transition-hide="scale"
            :hint="$t('bridgeForm.changeMessage')"
        />
        <div
            v-if="isVersion6"
            class="row q-pt-lg justify-around"
        >
          <div class="row">
            <div class="col">
              <q-option-group
                  @input="deleteAllZones"
                  v-model="iBox"
                  :options="iboxOptions"
                  inline
                  color="primary"
              />
              <q-item>
                <q-item-section>
                  <q-item-label caption>{{ $t('bridgeForm.changeMessage') }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <q-separator
                vertical
                inset
            />

            <div class="col">
              <q-option-group
                  @input="deleteAllZones"
                  v-model="maxZones"
                  :options="maxZonesOptions"
                  inline
                  color="primary"
              />
              <q-item>
                <q-item-section>
                  <q-item-label caption>{{ $t('bridgeForm.changeMessage') }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <div class="row">
          <div class="col">
            <q-input
                v-model="$v.controllerIp.$model"
                :label="$t('bridgeForm.controllerIp')"
                :error="$v.controllerIp.$error"
                :error-message="validationMsg($v.controllerIp, $t('bridgeForm.controllerIp'))"
            >
              <template v-slot:append>
                <q-icon
                    name="close"
                    @click="$v.controllerIp.$model=''"
                    class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>
          <div class="col-auto q-pl-lg self-center">
            <q-btn
                round
                color="primary"
                icon="refresh"
            />
          </div>
        </div>
        <q-input
            v-model="$v.controllerPort.$model"
            :label="$t('bridgeForm.controllerPort')"
            :error="$v.controllerPort.$error"
            :error-message="validationMsg($v.controllerPort, $t('bridgeForm.controllerPort'))"
        >
          <template v-slot:append>
            <q-icon
                name="close"
                @click="$v.controllerPort.$model=''"
                class="cursor-pointer"
            />
          </template>
        </q-input>
        <q-input
            v-model="$v.commandRepeat.$model"
            :label="$t('bridgeForm.commandRepeat')"
            :error="$v.commandRepeat.$error"
            :error-message="validationMsg($v.commandRepeat, $t('bridgeForm.commandRepeat'))"
        >
          <template v-slot:append>
            <q-icon
                name="close"
                @click="$v.commandRepeat.$model=''"
                class="cursor-pointer"
            />
          </template>
        </q-input>
        <q-input
            v-model="$v.delayBetweenCommands.$model"
            :label="$t('bridgeForm.delayBetweenCommands')"
            :error="$v.delayBetweenCommands.$error"
            :error-message="validationMsg($v.delayBetweenCommands, $t('bridgeForm.delayBetweenCommands'))"
        >
          <template v-slot:append>
            <q-icon
                name="close"
                @click="$v.delayBetweenCommands.$model=''"
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
  required, ipAddress, numeric, maxLength, between,
} from 'vuelidate/lib/validators';
import { validationMessage } from 'vuelidate-messages';
import { mapActions } from 'vuex';
import { fieldsTemplate } from '../mixin/fieldsTemplate';

import { messages } from '../js/vuelidate-messages';

export default {
  name: 'BridgeForm',
  mixins: [fieldsTemplate],
  data() {
    return {
      controllerTypeOptions: [
        {
          label: this.$t('bridgeForm.v6'),
          value: 'v6',
        },
        {
          label: this.$t('bridgeForm.legacy'),
          value: 'legacy',
        },
      ],
      iboxOptions: [
        {
          label: this.$t('bridgeForm.ibox1'),
          value: 'iBox1',
        },
        {
          label: this.$t('bridgeForm.ibox2'),
          value: 'iBox2',
        },
      ],
      maxZonesOptions: [
        {
          label: this.$t('bridgeForm.4zones'),
          value: '4',
        },
        {
          label: this.$t('bridgeForm.8zones'),
          value: '8',
        },
      ],
    };
  },
  computed: {
    isVersion6() {
      return this.controllerType === 'v6';
    },
  },
  methods: {
    ...mapActions('template', ['deleteAllZones']),
    validationMsg: validationMessage(messages),
  },
  watch: {
    isVersion6(val) {
      if (val) {
        this.controllerPort = '5987';
      } else {
        this.controllerPort = '8899';
      }
    },
    '$v.$anyError': function (val) {
      this.isValidBridge = !val;
    },
  },
  created() {
    this.$v.$touch();
  },
  validations: {
    controllerIp: {
      required,
      ipAddress,
    },
    controllerPort: {
      required,
      numeric,
      maxLength: maxLength(5),
      between: between(1024, 64738),
    },
    commandRepeat: {
      required,
      numeric,
      between: between(1, 9),
    },
    delayBetweenCommands: {
      required,
      numeric,
      between: between(20, 1000),
    },
  },
};
</script>

<style
    lang="sass"
    scoped
>
.bridge-card
  width: 600px
  max-width: 100%
</style>
