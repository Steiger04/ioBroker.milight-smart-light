'use strict';

const os = require('os'); // win32? -> supportStopInstance erforderlich in common{...}
const Promise = require('bluebird'); // jshint ignore:line
const _ = require('lodash');

const utils = require(`${__dirname}/lib/utils`);

let adapter = utils.adapter({
  name: 'milight-smart-light',
});

const mslcommandsV6 = require(`${__dirname}/lib/js/mslcommandsV6`)(adapter);
const mslcommands2 = require(`${__dirname}/lib/js/mslcommands2`)(adapter);
const mslcommands = require(`${__dirname}/lib/js/mslcommands`)(adapter);

const states = require(`${__dirname}/lib/js/mslstates`);

const Milight = require('node-milight-promise').MilightController;

let smartLight = null;

// Some message was sent to adapter instance over message box. Used by email, pushover, text2speech
adapter.on('message', (obj) => {
  if (typeof obj === 'object') {
    switch (obj.command) {
      case 'discover':
        let discoverIp = adapter.config.controllerIp;

        if (discoverIp === '') {
          discoverIp = '255.255.255.255';
        }
        else {
          discoverIp = discoverIp.split('.');
          discoverIp.pop();
          discoverIp.push('255');
          discoverIp = discoverIp.join('.');
        }

        const discoverBridges = require('node-milight-promise').discoverBridges;
        discoverBridges({
          type: 'all', address: discoverIp,
        }).then((results) => {
          adapter.log.debug(`on:message:discover bridges->${JSON.stringify(results)}`);
          if (obj.callback) {
            adapter.sendTo(obj.from, obj.command, results, obj.callback);
          }
        }).catch((err) => {
          adapter.log.error(`on:message:discover bridges->${err.message}`);
        });

        break;

      case 'deletedevices':
        let count;

        adapter.log.debug('on:message:deletedevices . . .');

        adapter.getDevicesAsync().then((devicesFromStorage) => {
          count = devicesFromStorage.length;

          Promise.mapSeries(_.flatten([addChannelsToStorage, devicesFromAdmin]),
              addDevice => adapter.deleteChannelFromEnumAsync(null, addDevice.nameZone, addDevice.typeNumberZone)).then(() => {
            Promise.each(devicesFromStorage, device => adapter.deleteDeviceAsync(device.common.name));
          }).then(() => {
            if (obj.callback) {
              adapter.sendTo(obj.from, obj.command, count, obj.callback);
            }
          }).catch((err) => {
            adapter.log.error(`on:message:deletedevices->${err.message}`);
          });
        });

        break;

      case 'deleteenums':
        adapter.log.debug('on:message:deleteenums . . .');
        Promise.mapSeries(_.flatten([addChannelsToStorage, devicesFromAdmin]),
            addDevice => adapter.deleteChannelFromEnumAsync(null, addDevice.nameZone, addDevice.typeNumberZone)).catch((err) => {
          adapter.log.error(`on:message:deleteenums->${err.message}`);
        });

        break;

      case 'stopInstance': // "supportStopInstance" : true in common{...}
        if (os.platform() === 'win32') {
          if (smartLight) {
            smartLight.close().then(() => {
              adapter.log.debug('on:message:stopInstance->All command have been executed - closing Milight!');
            });
          }

          adapter.sendTo(adapter.namespace, 'deleteenums', null);

          // adapter.sendTo(adapter.namespace, 'deletedevices', null);
        }

        break;

      default:
        adapter.log.warn(`on:message:Unknown command->${obj.command}`);

        if (obj.callback) {
          adapter.sendTo(obj.from, obj.command, obj.message, obj.callback);
        }

        break;
    }
  }
});

adapter.on('unload', (callback) => {
  try {
    if (smartLight) {
      smartLight.close().then(() => {
        adapter.log.debug('on:unload->All command have been executed - closing Milight!');
      });
    }

    adapter.sendTo(adapter.namespace, 'deleteenums', null);

    // adapter.sendTo(adapter.namespace, 'deletedevices', null);

    callback();
  }
  catch (err) {
    callback();
  }
});

adapter.on('objectChange', (id, obj) => {
  // Warning, obj can be null if it was deleted
  adapter.log.debug(`on:objectChange->${id} ${JSON.stringify(obj)}`);
});

adapter.on('stateChange', (_id, state) => {
  // you can use the ack flag to detect if it is status (true) or command (false)
  if (!state || state.ack || !smartLight) { // TODO: !smartLight erforderlich?
    adapter.log.debug(`on:stateChange:ack=true->${_id} ${JSON.stringify(state)}`);
    return;
  }

  // Warning, state can be null if it was deleted
  adapter.log.debug(`on:stateChange:ack=false->${_id} ${JSON.stringify(state)}`);

  const options = {};
  const _dcs = adapter.idToDCS(_id);

  const typeZone = _.split(_dcs.channel, '-')[0];
  const numberZone = _.split(_dcs.channel, '-')[1];
  const dp = _dcs.state;

  options.numberZone = numberZone - 0;
  options.typeZone = typeZone;
  options.dp = dp;
  options.val = state.val;
  options.dcs = _dcs;

  switch (adapter.config.controllerType) {
    case 'v6':
      adapter.setStateAsync(_id, state.val, true);

      smartLight.sendCommands(mslcommandsV6[typeZone][dp](options)).then(() => {
        // adapter.setStateAsync(_id, state.val, true);
      }).catch((err) => {
        adapter.log.error(`on:stateChange:mslcommandsV6->${err.message}`);
      });

      // adapter.setStateAsync(_id, state.val, true);
      break;

    case 'legacy':
      adapter.setStateAsync(_id, state.val, true);

      smartLight.sendCommands(mslcommands2[typeZone][dp](options)).then(() => {
        // adapter.setStateAsync(_id, state.val, true);
      }).catch((err) => {
        adapter.log.error(`on:stateChange:mslcommands2->${err.message}`);
      });

      // adapter.setStateAsync(_id, state.val, true);
      break;

    default:
      break;
  }
});

adapter.on('ready', () => {
  main();
});

function main() {
  const configSyncAsync = Promise.promisify(configSync);

  adapter.log.info('adapter:main->:::milight-smart-light::: wurde gestartet!');
  adapter = Promise.promisifyAll(adapter); // erst hier möglich wegen initStates(prepareInitAdapter)

  smartLight = new Milight({
    ip: adapter.config.controllerIp,
    type: adapter.config.controllerType,
    delayBetweenCommands: parseInt(adapter.config.delayBetweenCommands),
    commandRepeat: parseInt(adapter.config.commandRepeat),
    port: adapter.config.controllerType === 'v6' ? parseInt(adapter.config.controllerPortV6) : parseInt(adapter.config.controllerPortLegacy),
    fullSync: false,
  });

  configSyncAsync().then(() => {
    adapter.subscribeStates('*');
  }).catch((err) => {
    adapter.log.error(`main|configSyncAsync->${err.message}`);
  });
}

let devicesFromAdmin = [];
let addChannelsToStorage = [];

function configSync(callback) {
  let deleteChannelsFromStorage = [];

  adapter.log.debug(`config_Sync: Konfigurierte Devices in adapter.config.devices->${JSON.stringify(adapter.config.devices)}`);

  if (adapter.config.devices && adapter.config.devices.length) { // Gibt es Devices im Admin?
    _.forEach(adapter.config.devices, (device) => {
      devicesFromAdmin.push({
        controllerType: adapter.config.controllerType,

        room: (device.room === '' || device.room === '0') ? [] : [device.room],
        func: device.func === '' ? [] : device.func,
        activeZone: device.activeZone,
        nameZone: _.isEmpty(device.nameZone) ? '' : device.nameZone,
        typeZone: device.typeZone === '0' ? '' : device.typeZone,
        nameType: _.isEmpty(device.nameType) ? `${device.typeZone}-${device.numberZone}` : device.nameType,
        numberZone: device.numberZone === '0' ? '' : device.numberZone,
        typeNumberZone: `${device.typeZone}-${device.numberZone}`,
        channelId: `${adapter.name}.${adapter.instance}.${device.nameZone}.${device.typeZone}-${device.numberZone}`,
      });
    });
  }

  _.remove(devicesFromAdmin, val => val.activeZone === false || val.numberZone === '' || val.nameZone === '' || val.typeZone === '');

  adapter.getDevicesAsync().
      then(devicesFromStorage => Promise.mapSeries(devicesFromStorage, device => adapter.getChannelsOfAsync(device._id))).
      then((channelsFromStorage) => {
        channelsFromStorage = _.flatten(channelsFromStorage);

        deleteChannelsFromStorage = _.differenceWith(channelsFromStorage, devicesFromAdmin,
            (channel, device) => channel._id === device.channelId && channel.common.name === device.nameType);

        deleteChannelsFromStorage = _.map(deleteChannelsFromStorage, channel => adapter.idToDCS(channel._id));

        addChannelsToStorage = _.differenceWith(devicesFromAdmin, channelsFromStorage, (device, channel) => device.channelId === channel);
      }).
      then(() => {
        // Channels aus deleteChannelsFromStorage aus dem Speicher löschen
        Promise.mapSeries(deleteChannelsFromStorage, DCS => adapter.deleteDeviceAsync(DCS.device)).
            then(() => {
              // Devices aus addChannelsToStorage anlegen
              Promise.mapSeries(addChannelsToStorage, addDevice => adapter.createDeviceAsync(addDevice.nameZone)).
                  then(() => {
                    // Channels aus addChannelsToStorage anlegen
                    Promise.mapSeries(addChannelsToStorage, addDevice => adapter.createChannelAsync(addDevice.nameZone, addDevice.typeNumberZone,
                        {name: addDevice.nameType, type: addDevice.typeZone, controllerType: addDevice.controllerType})).
                        then(() => {
                          // States hinzufügen
                          Promise.mapSeries(addChannelsToStorage,
                              addDevice => Promise.mapSeries(states.statesList(adapter.config.controllerType, addDevice.typeZone),
                                  dp => adapter.createStateAsync(addDevice.nameZone, addDevice.typeNumberZone, dp, states.getCommon(dp)))).
                              then(() => {
                                // Enums löschen und hinzufügen
                                Promise.mapSeries(_.flatten([addChannelsToStorage, devicesFromAdmin]),
                                    addDevice => adapter.deleteChannelFromEnumAsync(null, addDevice.nameZone, addDevice.typeNumberZone).
                                        then(() => Promise.mapSeries(_.flatten([addDevice.room, addDevice.func]),
                                            enumName => adapter.addChannelToEnumAsync(enumName, enumName, addDevice.nameZone, addDevice.typeNumberZone).
                                                then(() => {
                                                  adapter.log.debug(
                                                      `config_Sync->::${ adapter.namespace }.${addDevice.nameZone }.${addDevice.typeNumberZone}:: wurde Enum->::${enumName }:: zugeordnet!`);
                                                }))));
                              });
                        });
                  });
            });
      }).
      then(() => {
        if (callback) {
          callback(null);
        }
      }).
      catch((err) => {
        if (callback) {
          callback(err);
        }
      });
}
