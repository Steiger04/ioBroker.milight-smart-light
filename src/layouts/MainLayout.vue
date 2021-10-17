<template>
  <q-layout view="lHh lpr lFf">
    <q-header :style="{background: $q.dark.isActive ? '#64b5f7' : '#efefef'}">
      <q-toolbar class="q-py-xs">
        <q-avatar
            rounded
            color="grey-6"
            size="56px"
        >
          <img src="~assets/milight-smart-light.png"/>
        </q-avatar>
        <q-btn
            flat type="a"
            target="__blank"
            href="https://steiger04.github.io/milight-smart-light-doku/">
          <q-icon
              size="56px"
              name="import_contacts"
              color="grey-6"/>
        </q-btn>

        <q-space/>

        <div class="q-gutter-xs">
          <q-btn
              :title="$t('readme')"
              type="a"
              :href="$connection.common.readme"
              target="__blank"
              round
              size="10.5px"
              color="blue-6"
          >
            <q-avatar
                size="22px"
                text-color="white"
                icon="live_help"
            />
          </q-btn>
          <q-btn
              @click="$connection.upload()"
              :title="$t('load configuration from file')"
              round
              size="10.5px"
              color="blue-6"
          >
            <q-avatar
                size="22px"
                text-color="white"
                icon="publish"
            />
          </q-btn>
          <q-btn
              @click="$connection.download()"
              :title="$t('save configuration to file')"
              round
              size="10.5px"
              color="blue-6"
          >
            <q-avatar
                size="22px"
                text-color="white"
                icon="get_app"
            />
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <!--    <q-footer
            class="bg-blue-4"
            :style="{ marginBottom: $connection.isIFrame ? '38px' : '0px' }"
        >-->
    <q-footer
        class="bg-blue-4"
        :style="'marginBottom: 0px'"
    >
      <q-toolbar class="q-py-md">
        <div class="q-gutter-xs">
          <q-btn
              @click="$connection.onSave(false)"
              :color="btnColor"
              :disabled="!changed"
              icon="save"
              :label="$t('save')"
          />
          <q-btn
              @click="$connection.onSave(true)"
              :color="btnColor"
              :disabled="!changed"
              icon="save"
              icon-right="close"
              :label="$t('save and close')"
          />
        </div>
        <q-toolbar-title/>
        <div>
          <q-btn
              @click="$onClose()"
              class="self-end"
              color="blue-6"
              icon="close"
              :label="changed ? $t('cancel') : $t('close')"
          />
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MainLayout',
  computed: {
    ...mapState('app', ['changed']),
    btnColor() {
      return this.changed ? 'blue-6' : 'grey-11 text-grey-6';
    },
  },
};
</script>
