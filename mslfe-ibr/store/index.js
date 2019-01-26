/* eslint-disable eqeqeq */
import Vuex from 'vuex'
import servConn from '~/ws/conn.js'

const createStore = () => {
  return new Vuex.Store({
    state: {
      dps: {},
      zones: {},
      bridges: [],
      loadedBridge: {},
      loadedZone: {},
      showBottomNav: {
        picker: false,
        colors: false,
        kelvin: false,
        white: false,
        whiteOnly: false,
        modes: false
      },
      pause: false,
      loadedPicker: 'Slider',
      websocketPort: null
    },
    getters: {
      DPS(state) {
        return state.dps
      },
      ZONES(state) {
        return state.zones
      },
      BRIDGES(state) {
        return state.bridges.map(payload => JSON.parse(payload))
      },
      LOADED_BRIDGE(state) {
        return state.loadedBridge
      },
      LOADED_ZONE(state) {
        return state.loadedZone
      },
      SHOW_BOTTOM_NAV(state) {
        return state.showBottomNav
      },
      LOADED_PICKER(state) {
        return state.loadedPicker
      },
      WEBSOCKET_PORT(state) {
        return state.websocketPort
      }
    },
    mutations: {
      LOAD_DPS(state, payload) {
        state.dps = payload
      },
      SET_DP(state, payload) {
        if (state.dps[payload.id].val !== payload.state.val) {
          state.dps[payload.id] = payload.state
        }
      },
      LOAD_ZONES_AND_BRIDGES(state, payload) {
        const tmp = new Set()

        state.zones = payload

        // eslint-disable-next-line no-unused-vars
        for (const [key, value] of Object.entries(payload)) {
          tmp.add(
            JSON.stringify({
              type: value.common.controllerType,
              box: value.common.iBox,
              number: value.common.instanceNumber,
              instance: value.common.instance,
              name: 'Bridge::' + value.common.instanceNumber
            })
          )
        }

        state.bridges = [...tmp].sort(
          (a, b) => JSON.parse(a).number - JSON.parse(b).number
        )
      },
      SET_LOADED_BRIDGE(state, payload) {
        state.loadedBridge = payload
        this.$router.push('/zones')
      },
      SET_LOADED_ZONE(state, payload) {
        state.loadedZone = payload

        // eslint-disable-next-line prettier/prettier
        if (['fullColor', 'fullColor8Zone'].indexOf(payload.common.mslZoneType) != -1) {
          state.showBottomNav = {
            colors: true,
            kelvin: true,
            white: false,
            whiteOnly: false,
            modes: true,
            picker: true
          }
        }

        if (['rgbw', 'bridge'].indexOf(payload.common.mslZoneType) != -1) {
          state.showBottomNav = {
            colors: true,
            kelvin: false,
            white: true,
            whiteOnly: false,
            modes: true,
            picker: true
          }
        }

        if (payload.common.mslZoneType == 'white') {
          state.showBottomNav = {
            colors: false,
            kelvin: false,
            white: false,
            whiteOnly: true,
            modes: false,
            picker: false
          }
        }

        if (state.showBottomNav.colors) {
          this.$router.push('/colors')
          return null
        }

        if (state.showBottomNav.whiteOnly) {
          this.$router.push('/whiteonly')
          return null
        }
      },
      UPDATE_DP(state, payload) {
        state.dps[state.loadedZone._id + '.' + payload.dp].val = payload.value
      },
      SET_LOADED_PICKER(state, payload) {
        state.loadedPicker = payload
      },
      SET_WEBSOCKET_PORT(state, payload) {
        state.websocketPort = payload
      }
    },
    actions: {
      UPDATE_DP_FROM_CLIENT({ dispatch, state }, options) {
        if (state.pause) return

        dispatch('UPDATE_DP', { value: options.value, dp: options.dp })

        servConn.setState(
          state.loadedZone._id + '.' + options.dp,
          options.value
        )

        if (options.delay && options.delay > 0) {
          state.pause = true
          setTimeout(() => (state.pause = false), options.delay)
        }
      },
      UPDATE_DP({ commit }, payload) {
        commit('UPDATE_DP', payload)
      },
      SET_DP({ commit }, payload) {
        commit('SET_DP', payload)
      }
    }
  })
}

export default createStore
