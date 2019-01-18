import Vue      from 'vue'
import servConn from '~/ws/conn.js'

export default async function (context) {
  return new Promise ((resolve, reject) => {
    servConn.init ({
      name: 'milight-smart-light.0',  // optional - default 'vis.0' -> ???
      connLink: 'http://' + document.domain + ':' + context.store.getters.WEBSOCKET_PORT, socketSession: '',           // optional - used by authentication
      subscribePattern: 'milight-smart-light*'
    }, {
      onConnChange: function (isConnected) {
        if (isConnected) {
          // load all subscribed states
          let promStates = new Promise ((resolve, reject) => {
            servConn.getStates ('milight-smart-light*', function (err, _states) {
              if (err) {
                reject (err)
              }

              resolve (_states)
            })
          }).then ((states) => {
            context.store.commit ('LOAD_DPS', states)
            Vue.console.log ('subscribed states: ' + Object.keys (context.store.getters.DPS).length)
          })

          // load all zones and bridges for all instances
          let promZones = new Promise ((resolve, reject) => {
            servConn._socket.emit ('getObjectView', 'system', 'channel', {
              startkey: 'milight-smart-light.', endkey: 'milight-smart-light.\u9999'
            }, function (err, channels) {
              if (err) {
                reject (err)
              }

              let _channels = {}
              for (let i = 0; i < channels.rows.length; i++) {
                _channels[ channels.rows[ i ].id ] = channels.rows[ i ].value
              }
              resolve (_channels)
            })
          }).then ((channels) => {
            context.store.commit ('LOAD_ZONES_AND_BRIDGES', channels)
            Vue.console.log ('zones: ' + JSON.stringify (channels, null, '|'))
          })

          resolve (Promise.all ([ promStates, promZones ]))
        }
        else {
          Vue.console.log ('disconnected')
        }
      }, onUpdate: function (id, state) {
        if (state && state.ack) {
          context.store.dispatch ('SET_DP', { id, state })
          Vue.console.log ('onUpdate::NEW VALUE of ' + id + ': ' + JSON.stringify (state, null, '|'))
        }
      }
    })
  }).catch ((err) => Vue.console.error ('[middleware:connection]: ' + err))
}
