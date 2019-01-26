<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-list three-line>
          <template v-for="(item, index) in items">
            <v-divider v-if="item.divider" :inset="item.inset" :key="index"></v-divider>

              <v-list-tile to="/modes/effect"
                           :key="item.title"
                           @click.native="setEffectMode(item.modeNumber)"
                           ripple
                           active-class
              >
                <!--<v-list-tile-avatar color="blue">
                  <span class="white&#45;&#45;text headline">{{ item.avatar }}</span>
                </v-list-tile-avatar>-->
                <v-list-tile-content>
                  <v-list-tile-sub-title
                     class="body-1 font-weight-regular"
                     v-if="LOADED_ZONE.common.mslZoneType==='fullColor'"
                     v-html="item.subtitleFullColor">
                  </v-list-tile-sub-title>

                  <v-list-tile-sub-title
                     class="body-1 font-weight-regular"
                     v-if="LOADED_ZONE.common.mslZoneType==='rgbw'"
                     v-html="item.subtitleRgbW">
                  </v-list-tile-sub-title>
  
                  <v-list-tile-sub-title
                     class="body-1 font-weight-regular"
                     v-if="LOADED_ZONE.common.mslZoneType==='fullColor8Zone'"
                     v-html="item.subtitleRgbW8">
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
          </template>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      items: [
        {
          modeNumber: 1,
          avatar: 'M1',
          title: 'Mode 1',
          subtitleRgbW: 'Strobe white',
          subtitleFullColor: 'Fire Mode',
          subtitleRgbW8:
            'Color flashes in red, green, blue, white, yellow, purple',
          divider: false,
          inset: false
        },
        {
          modeNumber: 2,
          avatar: 'M2',
          title: 'Mode 2',
          subtitleRgbW: 'RGBW fade in and fade out',
          subtitleFullColor: 'Several colors gradual changing',
          subtitleRgbW8: 'White color ramp up and flash',
          divider: true,
          inset: false
        },
        {
          modeNumber: 3,
          avatar: 'M3',
          title: 'Mode 3',
          subtitleRgbW:
            'Color flashes in red, green, blue, white, yellow, purple',
          subtitleFullColor: 'Different kelvin changing',
          subtitleRgbW8: 'RGB fade in and fade out',
          divider: true,
          inset: false
        },
        {
          modeNumber: 4,
          avatar: 'M4',
          title: 'Mode 4',
          subtitleRgbW: 'Disco (different colors strobe and flash to change)',
          subtitleFullColor: 'RGB with color temperature changing',
          subtitleRgbW8: 'Seven colors flash',
          divider: true,
          inset: false
        },
        {
          modeNumber: 5,
          avatar: 'M5',
          title: 'Mode 5',
          subtitleRgbW: 'Red color ramp up and flash',
          subtitleFullColor: 'Seven colors flash',
          subtitleRgbW8: 'Random colors flash',
          divider: true,
          inset: false
        },
        {
          modeNumber: 6,
          avatar: 'M6',
          title: 'Mode 6',
          subtitleRgbW: 'Green color ramp up and flash',
          subtitleFullColor: 'Random colors flash',
          subtitleRgbW8: 'Red color ramp up and flash',
          divider: true,
          inset: false
        },
        {
          modeNumber: 7,
          avatar: 'M7',
          title: 'Mode 7',
          subtitleRgbW: 'Blue color ramp up and flash',
          subtitleFullColor: 'Red gradual changing plus flash',
          subtitleRgbW8: 'Green color ramp up and flash',
          divider: true,
          inset: false
        },
        {
          modeNumber: 8,
          avatar: 'M8',
          title: 'Mode 8',
          subtitleRgbW:
            'Several colors fade into each other and then flash randomly',
          subtitleFullColor: 'Green gradual changing plus flash',
          subtitleRgbW8: 'Blue color ramp up and flash',
          divider: true,
          inset: false
        },
        {
          modeNumber: 9,
          avatar: 'M9',
          title: 'Mode 9',
          subtitleRgbW: 'Different colors fade into each other',
          subtitleFullColor: 'Blue gradual changing plus flash',
          subtitleRgbW8: 'White color ramp up and flash',
          divider: true,
          inset: false
        }
      ]
    }
  },
  methods: {
    ...mapActions(['UPDATE_DP_FROM_CLIENT', 'UPDATE_DP']),
    setEffectMode(payload) {
      this.UPDATE_DP_FROM_CLIENT({
        value: payload,
        dp: 'effectMode',
        delay: 500
      })
    }
  },
  computed: {
    ...mapGetters(['SHOW_BOTTOM_NAV', 'LOADED_ZONE'])
  }
}
</script>
