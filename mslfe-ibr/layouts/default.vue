<!--suppress HtmlRequiredAltAttribute -->
<template>
  <fullscreen
    ref="fullscreen"
    :fullscreen.sync="fullscreen"
  >
    <v-app dark>
      <v-navigation-drawer
        v-model="drawer"
        app
        temporary
        fixed
      >
        <v-toolbar
          flat
          class="transparent"
        >
          <v-list class="pa-0">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img src="~assets/msl-start-web.png">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>Mi.Light for ioBroker</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-toolbar>
        <v-divider />
        <v-list class="pt-0">
          <v-list-group
            v-model="listGroupBridges"
          >
            <v-list-tile slot="activator">
              <v-list-tile-avatar tile>
                <img src="~assets/msl-bridges-web-alpha.png">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>BRIDGES</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(bridge, index) in BRIDGES"
              :key="index"
              @click="resetDrawerAndSetLoadedBridge(bridge)"
            >
              <v-list-tile-avatar tile>
                <img
                  v-if="bridge.type==='v6' && bridge.box==='iBox1'"
                  src="~assets/msl-ibox1-web-alpha.png"
                >
                <img
                  v-if="bridge.type==='v6' && bridge.box==='iBox2'"
                  src="~assets/msl-ibox2-web-alpha.png"
                >
                <img
                  v-if="bridge.type==='legacy'"
                  src="~assets/msl-legacy-web-alpha.png"
                >
              </v-list-tile-avatar>
              <v-list-tile-title>{{ bridge.name }}</v-list-tile-title>
            </v-list-tile>
          </v-list-group>
          <v-list-group
            v-if="$route.path==='/colors'"
            v-model="listGroupPicker"
          >
            <v-list-tile slot="activator">
              <v-list-tile-avatar tile>
                <img src="~assets/msl-farbkreis-web-alpha.png">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>PICKER</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="picker in pickers"
              :key="picker"
              @click="resetDrawerAndSetLoadedPicker(picker)"
            >
              <v-list-tile-avatar tile size="40">
                <img
                  v-if="picker==='Swatches'"
                  src="~assets/msl-swatches-web-alpha.png"
                >
                <img
                  v-if="picker==='Slider'"
                  src="~assets/msl-slider-web-alpha.png"
                >
              </v-list-tile-avatar>
              <v-list-tile-title>{{ picker }}</v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar
        app
        color="indigo"
        dark
        fixed
      >
        <v-toolbar-side-icon
          class="hidden-sm-and-up"
          @click.stop="drawer = !drawer"
        />
        <v-spacer />
        <v-toolbar-title>Small FE for milight-smart-light</v-toolbar-title>
        <v-spacer />
        <v-menu
          v-if="SHOW_BOTTOM_NAV.picker"
          offset-y
        >
          <v-btn
            slot="activator"
            class="hidden-xs-only"
            dark
            flat
            value="colors"
          >
            <span>PICKER</span>
            <v-icon right>
              color_lens
            </v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="picker in pickers"
              :key="picker"
              @click="SET_LOADED_PICKER(picker)"
            >
              <v-list-tile-avatar tile size="40">
                <img
                  v-if="picker==='Swatches'"
                  src="~assets/msl-swatches-web-alpha.png"
                >
                <img
                  v-if="picker==='Slider'"
                  src="~assets/msl-slider-web-alpha.png"
                >
              </v-list-tile-avatar>
              <v-list-tile-title>{{ picker }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu offset-y>
          <v-btn
            slot="activator"
            class="hidden-xs-only"
            dark
            flat
            value="bridges"
          >
            <span>BRIDGES</span>
            <v-icon right>
              devices_other
            </v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="(bridge, index) in BRIDGES"
              :key="index"
              @click="SET_LOADED_BRIDGE(bridge)"
            >
              <v-list-tile-avatar tile>
                <img
                  v-if="bridge.type==='v6' && bridge.box==='iBox1'"
                  src="~assets/msl-ibox1-web-alpha.png"
                >
                <img
                  v-if="bridge.type==='v6' && bridge.box==='iBox2'"
                  src="~assets/msl-ibox2-web-alpha.png"
                >
                <img
                  v-if="bridge.type==='legacy'"
                  src="~assets/msl-legacy-web-alpha.png"
                >
              </v-list-tile-avatar>
              <v-list-tile-title>{{ bridge.name }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>

      <v-content>
        <nuxt />
      </v-content>

      <v-footer fixed dark>
        <v-bottom-nav
          app
          absolute
          :value="true"
          color="indigo"
        >
          <v-btn
            v-if="SHOW_BOTTOM_NAV.colors"
            flat
            value="colors"
            to="/colors"
          >
            <span>COLORS</span>
            <v-icon>color_lens</v-icon>
          </v-btn>
          <v-btn
            v-if="SHOW_BOTTOM_NAV.kelvin"
            flat
            value="kelvin"
            to="/kelvin"
          >
            <span>KELVIN</span>
            <v-icon>wb_sunny</v-icon>
          </v-btn>
          <v-btn
            v-if="SHOW_BOTTOM_NAV.white"
            flat
            value="white"
            to="/white"
          >
            <span>WHITE</span>
            <v-icon>wb_sunny</v-icon>
          </v-btn>
          <v-btn
            v-if="SHOW_BOTTOM_NAV.whiteOnly"
            flat
            value="whiteonly"
            to="/whiteonly"
          >
            <span>WHITE</span>
            <v-icon>wb_sunny</v-icon>
          </v-btn>
          <v-btn
            v-if="SHOW_BOTTOM_NAV.modes"
            flat
            value="modes"
            :to="LOADED_BRIDGE.type==='v6' ? '/modes' : '/modes/effectlegacy'"
          >
            <span>MODES</span>
            <v-icon>view_module</v-icon>
          </v-btn>
          <v-btn
            :class="{'btn--active': fullscreen}"
            flat
            value="fullscreen"
            @click="$refs['fullscreen'].toggle()"
          >
            <span>FULLSCREEN</span>
            <v-icon>fullscreen</v-icon>
          </v-btn>
        </v-bottom-nav>
      </v-footer>
    </v-app>
  </fullscreen>
</template>

<script>
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    source: String
  },
  data() {
    return {
      fullscreen: false,
      drawer: false,
      listGroupBridges: false,
      listGroupPicker: false,
      pickers: ['Slider', 'Swatches']
    }
  },
  computed: {
    ...mapGetters(['BRIDGES', 'LOADED_BRIDGE', 'SHOW_BOTTOM_NAV'])
  },
  methods: {
    ...mapMutations(['SET_LOADED_BRIDGE', 'SET_LOADED_PICKER']),
    resetDrawerAndSetLoadedBridge(payload) {
      this.drawer = false
      this.listGroupBridges = false

      this.SET_LOADED_BRIDGE(payload)
    },
    resetDrawerAndSetLoadedPicker(payload) {
      this.drawer = false
      this.listGroupPicker = false

      this.SET_LOADED_PICKER(payload)
    }
  }
}
</script>
