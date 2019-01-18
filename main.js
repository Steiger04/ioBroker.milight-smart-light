'use strict'

const path = require ('path')
const kill = require ('tree-kill')
const os = require ('os') // win32? -> supportStopInstance erforderlich in common{...}
const _ = require ('lodash')

const utils = require (path.join (__dirname, '/lib/utils'))

let adapter = utils.adapter ({ name: 'milight-smart-light' })

let forkedServer = require (path.join (__dirname, '/lib/js/mslfe-fork/mslfeServer'))

let mslStatestore = new ( require (path.join (__dirname, '/lib/js/mslstatestore/mslstatestore')) ) (adapter)

const mslcommandsV6 = require (path.join (__dirname, '/lib/js/mslcommandsV6')) (adapter, mslStatestore)
const mslcommands2 = require (path.join (__dirname, '/lib/js/mslcommands2')) (adapter, mslStatestore)

const states = require (path.join (__dirname, '/lib/js/mslstates'))

const Milight = require ('node-milight-promise').MilightController
let smartLight = null

const FORBIDDEN_CHARS = /[\]\[\s*,;'"`<>\\?]/g

// Some message was sent to adapter instance over message box. Used by email, pushover, text2speech
adapter.on ('message', (obj) => {
  if (typeof obj === 'object') {
    switch (obj.command) {
      case 'discover':
        let discoverIp = adapter.config.controllerIp

        if (discoverIp === '') {
          discoverIp = '255.255.255.255'
        }
        else {
          discoverIp = discoverIp.split ('.')
          discoverIp.pop ()
          discoverIp.push ('255')
          discoverIp = discoverIp.join ('.')
        }

        const discoverBridges = require ('node-milight-promise').discoverBridges
        discoverBridges ({
          type: 'all', address: discoverIp, timeout: 5000
        }).then ((results) => {
          adapter.log.debug (`on:message:discover bridges->${JSON.stringify (results)}`)
          if (obj.callback) {
            adapter.sendTo (obj.from, obj.command, results, obj.callback)
          }
        }).catch ((err) => {
          adapter.log.error (`on:message:discover bridges->${err}`)
        })

        break

      case 'stopInstance': // "supportStopInstance" : true in common{...}
        // deleteEnums ()
        if (smartLight) {
          smartLight.close ().then (() => {
            adapter.log.debug ('on:message:stopInstance->All command have been executed - closing MiLight!')
          })
        }

        if (forkedServer) {
          kill (forkedServer.pid)
        }

        break

      default:
        adapter.log.warn (`on:message:Unknown command->${obj.command}`)

        break
    }
  }
})

adapter.on ('unload', (callback) => {
  try {
    // deleteEnums ()

    callback ()
  } catch (err) {
    callback ()
  }
})

adapter.on ('objectChange', (id, obj) => {
  // Warning, obj can be null if it was deleted
  adapter.log.debug (`on:objectChange->${id} ${JSON.stringify (obj)}`)
})

adapter.on ('stateChange', (_id, state) => {
  // you can use the ack flag to detect if it is status (true) or command (false)
  let start = Date.now ()

  if (!state || state.ack) {
    /*if (state.ack) {
      adapter.log.debug (`on:stateChange:ack=true->${_id}::state->${JSON.stringify (state)}`)
    }*/
    return
  }

  adapter.log.debug (`on:stateChange:ack=false->${_id}::state->${JSON.stringify (state)}`)

  const options = {}

  const _dcs = adapter.idToDCS (_id)

  const mslZoneType = _.split (_dcs.channel, '-')[ 0 ]
  const mslZoneNumber = _.split (_dcs.channel, '-')[ 1 ]
  const dp = _dcs.state

  const channelPath = adapter._DCS2ID (_dcs.device, _dcs.channel, '') + '.'
  const fullChannelPath = adapter.namespace + '.' + channelPath

  options.channelPath = channelPath
  options.fullChannelPath = fullChannelPath

  options.mslZoneType = mslZoneType
  options.mslZoneNumber = mslZoneNumber - 0
  options.dp = dp

  options.val = state.val
  options.ack = state.ack

  mslStatestore.setState ({ dp: options.dp, val: state.val, params: options })
  adapter.log.debug ('mslStatestore.setState->::' + ( Date.now () - start ) + 'ms')

  switch (adapter.config.controllerType) {
    case 'v6':
      let working = false

      smartLight.sendCommands (mslcommandsV6[ mslZoneType ][ dp ] (options)).then (() => {
        adapter.log.debug ('mslcommandsV6 executed::' + ( Date.now () - start ) + 'ms')
      }).catch ((err) => {
        adapter.log.error (`on:stateChange:mslcommandsV6->${err.message}`)
      })
      break

    case 'legacy':
      smartLight.sendCommands (mslcommands2[ mslZoneType ][ dp ] (options)).then (() => {
        adapter.log.debug ('mslcommands2 executed::' + ( Date.now () - start ) + 'ms')
      }).catch ((err) => {
        adapter.log.error (`on:stateChange:mslcommands2->::${err.message}`)
      })
      break

    default:
      break
  }
})

adapter.on ('ready', () => {
  main ()
})

function main () {
  smartLight = new Milight ({
    ip: adapter.config.controllerIp,
    type: adapter.config.controllerType,
    delayBetweenCommands: parseInt (adapter.config.delayBetweenCommands),
    commandRepeat: parseInt (adapter.config.commandRepeat),
    port: parseInt (adapter.config.controllerPort),
    fullSync: true
  })

  configAsync ()
    .then (() => {
      adapter.log.info ('main->::all MiLight zones and states were created!')

      return adapter.subscribeStatesAsync ('*').then (() => {
        adapter.log.info ('main->::all states were subscribed!')
      })
    })
    .then (() => {
      if (adapter.config.activeApp) {
        return forkedServer (adapter)
      }
    })
    .then ((server) => {
      forkedServer = server

      if (forkedServer) {
        adapter.log.info ('main->::server for app was started!')
      }
    })
    .then (() => adapter.log.info ('main->::milight-smart-light adapter was started successfully!'))
    .catch ((err) => {
      adapter.log.error (`main->::${err}`)
    })
}

let zonesFromAdmin = []
let addZonesToStorage = []

async function configAsync () {
  if (adapter.config.zones.length > 0) {
    _.forEach (adapter.config.zones, (zone) => {
      zonesFromAdmin.push ({
        instance: adapter.namespace,
        instanceNumber: adapter.instance,

        controllerType: adapter.config.controllerType,
        iBox: adapter.config.iBox,

        mslZoneActive: zone.mslZoneActive,
        mslZoneNumber: zone.mslZoneNumber,
        mslGroupName: zone.mslGroupName,
        mslZoneType: zone.mslZoneType,
        mslZoneName: _.isEmpty (zone.mslZoneName) ? `${zone.mslZoneType}-${zone.mslZoneNumber}` : zone.mslZoneName,

        mslRoom: zone.mslRoom === null ? [] : [ zone.mslRoom ],
        mslFunc: zone.mslFunc.length < 1 ? [] : zone.mslFunc,

        mslZoneTypeNumber: `${zone.mslZoneType}-${zone.mslZoneNumber}`,

        channelPath: `${zone.mslGroupName}.${zone.mslZoneType}-${zone.mslZoneNumber}.`.replace (/\s+/g, ' ').replace (FORBIDDEN_CHARS, '_'),
        fullChannelPath: `${adapter.namespace}.${zone.mslGroupName}.${zone.mslZoneType}-${zone.mslZoneNumber}.`.replace (/\s+/g, ' ')
          .replace (FORBIDDEN_CHARS, '_'),

        name: _.isEmpty (zone.mslZoneName) ? `${zone.mslZoneType}-${zone.mslZoneNumber}` : zone.mslZoneName
      })
    })

    _.remove (zonesFromAdmin, val => val.mslZoneActive === false || _.isEmpty(val.mslZoneNumber) || _.isEmpty(val.mslGroupName) || _.isEmpty(val.mslZoneType))
  }

  let groupsFromStorage = await adapter.getDevicesAsync ()

  let zonesFromStorage = _.flatten (await Promise.all (groupsFromStorage.map ((device) => adapter.getChannelsOfAsync (device._id))))

  let deleteZonesFromStorage = _.differenceWith (zonesFromStorage, zonesFromAdmin, (zoneStorage, zoneAdmin) => _.isEqual (zoneStorage.common, zoneAdmin))

  deleteZonesFromStorage = _.map (deleteZonesFromStorage, zone => adapter.idToDCS (zone._id))

  addZonesToStorage = _.differenceWith (zonesFromAdmin, zonesFromStorage, (zoneAdmin, zoneStorage) => _.isEqual (zoneStorage.common, zoneAdmin))

  let zonesInStorage = _.differenceWith (zonesFromAdmin, addZonesToStorage, (zoneAdmin, zoneStorage) => _.isEqual (zoneStorage, zoneAdmin))

  // mslStatestore für unveränderte Zonen initialisieren
  if (zonesInStorage.length > 0) {
    for (let zone of zonesInStorage) {
      for (let dp of states.statesList (adapter.config.controllerType, zone.mslZoneType)) {
        let state = await adapter.getStateAsync (zone.fullChannelPath + dp)
        mslStatestore.initState ({ dp: dp, val: state.val, params: zone })
      }
    }
  }

  // MiLight-Zonen aus deleteZonesFromStorage aus dem Speicher löschen
  if (deleteZonesFromStorage.length > 0) {
    for (let DCS of deleteZonesFromStorage) {
      await adapter.deleteChannelAsync (DCS.device, DCS.channel)
      adapter.log.debug ('configAsync->::deleted MiLight zone:' + DCS.device + '.' + DCS.channel)

      let channels = await adapter.getChannelsOfAsync (DCS.device)

      if (channels.length < 1) {
        await adapter.deleteDeviceAsync (DCS.device)
        adapter.log.debug ('configAsync->::deleted MiLight group:' + DCS.device)
      }

      await adapter.deleteChannelFromEnumAsync (null, DCS.device, DCS.channel)
      adapter.log.debug (`configAsync->::${ adapter.namespace }.${DCS.device}.${DCS.channel}: all associated enums have been deleted!`)
    }
  }

  // MiLight-Zonen und Enums aus addZonesToStorage anlegen
  if (addZonesToStorage.length > 0) {
    for (let addZone of addZonesToStorage) {
      await adapter.createDeviceAsync (addZone.mslGroupName)
      adapter.log.debug (`configAsync->::MiLight group :${ adapter.namespace }.${addZone.mslGroupName }: was created!`)

      await adapter.createChannelAsync (addZone.mslGroupName, addZone.mslZoneTypeNumber, addZone)
      adapter.log.debug (`configAsync->::MiLight zone :${ adapter.namespace }.${addZone.mslGroupName }.${addZone.mslZoneTypeNumber}: was created!`)

      for (let enumName of _.concat (addZone.mslFunc, addZone.mslRoom)) {
        if (enumName) {
          await adapter.addChannelToEnumAsync (enumName, enumName, addZone.mslGroupName, addZone.mslZoneTypeNumber)
          adapter.log.debug (
            `configAsync->::${ adapter.namespace }.${addZone.mslGroupName }.${addZone.mslZoneTypeNumber}: was assigned to enum->::${ enumName }`)
        }
      }

      // States für addZonesToStorage anlegen und mslStatestore initialisieren
      for (let dp of states.statesList (adapter.config.controllerType, addZone.mslZoneType)) {
        await adapter.createStateAsync (addZone.mslGroupName, addZone.mslZoneTypeNumber, dp, states.getCommon (dp))
        await adapter.setStateAsync (addZone.fullChannelPath + dp, states.getCommon (dp)._def, true)

        mslStatestore.initState ({ dp: dp, val: states.getCommon (dp)._def, params: addZone })
      }
    }
  }
}

async function deleteEnums () {
  for(let zone of _.flatten ([ addZonesToStorage, zonesFromAdmin ])) {
    try {
      await adapter.deleteChannelFromEnumAsync (null, zone.mslGroupName, zone.mslZoneTypeNumber)
      adapter.log.debug ('deleteEnums->::Channel was deleted from enum (room and function)!')
    } catch (err) {
      adapter.log.error (`deleteEnums->::${err.message}`)
    }
  }
}
