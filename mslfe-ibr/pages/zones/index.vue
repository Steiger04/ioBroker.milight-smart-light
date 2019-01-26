<!--suppress HtmlRequiredAltAttribute -->
<template>
  <v-layout row>
    <v-flex
      xs10
      offset-xs1
      align-center
      justify-center
    >
      <v-list two-line>
        <v-subheader>Zones</v-subheader>
        <v-divider />
        <template
          v-for="zone in ZONES"
        >
          <v-list-tile
            v-if="zone.common.instance==LOADED_BRIDGE.instance"
            :key="zone.common.mslZoneNumber"
            avatar
            @click="SET_LOADED_ZONE(zone)"
          >
            <v-list-tile-avatar tile>
              <img
                v-if="LOADED_BRIDGE.type==='v6' && LOADED_BRIDGE.box==='iBox1'"
                src="~assets/msl-ibox1-web-alpha.png"
              >
              <img
                v-if="LOADED_BRIDGE.type==='v6' && LOADED_BRIDGE.box==='iBox2'"
                src="~assets/msl-ibox2-web-alpha.png"
              >
              <img
                v-if="LOADED_BRIDGE.type==='legacy'"
                src="~assets/msl-legacy-web-alpha.png"
              >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="zone.common.mslGroupName" />
              <v-list-tile-sub-title v-html="zone.common.mslZoneName" />
            </v-list-tile-content>
          </v-list-tile>
          <v-divider :key="zone.common.mslZoneNumber" />
        </template>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters(['LOADED_BRIDGE', 'ZONES'])
  },
  methods: {
    ...mapMutations(['SET_LOADED_ZONE'])
  }
}
</script>
