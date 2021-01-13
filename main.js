/* eslint-disable radix */
const path = require('path');
const _ = require('lodash');
const utils = require('@iobroker/adapter-core');

const { startAppServer } = require(path.join(__dirname, '/lib/js/mslfeServer/mslfeServer'));
const mslcommandsV6 = require(path.join(__dirname, '/lib/js/mslcommandsV6'));
const mslcommands2 = require(path.join(__dirname, '/lib/js/mslcommands2'));

const MslStatestore = require(path.join(__dirname, '/lib/js/mslstatestore/mslstatestore'));
const States = require(path.join(__dirname, '/lib/js/mslstates'));

const Milight = require('node-milight-promise').MilightController;

class MilightSmartLight extends utils.Adapter {
  constructor(options) {
    super({
      ...options,
      name: 'milight-smart-light',
    });

    this.zonesFromAdmin = [];
    this.addZonesToStorage = [];

    this.mslStatestore = new MslStatestore(this);
    this.mslcommandsV6 = mslcommandsV6(this, this.mslStatestore);
    this.mslcommands2 = mslcommands2(this, this.mslStatestore);
    this.states = new States();

    this.on('ready', this.onReady.bind(this));
    this.on('stateChange', this.onStateChange.bind(this));
    this.on('objectChange', this.onObjectChange.bind(this));
    this.on('message', this.onMessage.bind(this));
    this.on('unload', this.onUnload.bind(this));
  }

  async onReady() {
    if (this.config.controllerIp !== '') {
      await this.main();
    } else {
      this.log.info(`milight-smart-light Adpter must be configured first!`);
    }
  }

  onObjectChange(id, obj) {
    // Warning, obj can be null if it was deleted
    this.log.debug(`on:objectChange->${id} ${JSON.stringify(obj)}`);
  }

  async onStateChange(_id, state) {
    let start;
    // you can use the ack flag to detect if it is status (true) or command (false)
    if (this.common.loglevel === 'debug') {
      start = Date.now();
    }

    if (!state || state.ack) {
      /* if (state.ack) {
        this.log.debug(`on:stateChange:ack=true->${_id}::state->${JSON.stringify(state)}`);
      } */
      return;
    }

    this.log.debug(`on:stateChange:ack=false->${_id}::state->${JSON.stringify(state)}`);

    const options = {};

    const _dcs = this.idToDCS(_id);

    const mslZoneType = _.split(_dcs.channel, '-')[0];
    const mslZoneNumber = _.split(_dcs.channel, '-')[1];
    const dp = _dcs.state;

    const channelPath = `${this._DCS2ID(_dcs.device, _dcs.channel, '')}.`;
    const fullChannelPath = `${this.namespace}.${channelPath}`;

    options.channelPath = channelPath;
    options.fullChannelPath = fullChannelPath;

    options.mslZoneType = mslZoneType;
    options.mslZoneNumber = mslZoneNumber - 0;

    options.dp = dp;

    options.val = state.val;
    options.ack = state.ack;

    await this.mslStatestore.setState({
      dp: options.dp,
      val: state.val,
      params: options,
    });
    this.log.debug(`on:stateChange:mslStatestore.setState || ${Date.now() - start}ms`);

    switch (this.config.controllerType) {
      case 'v6':
        try {
          await this.smartLight.sendCommands(await this.mslcommandsV6[mslZoneType][dp](options));
          this.log.debug(`mslcommandsV6 executed::${Date.now() - start}ms`);
        } catch (err) {
          this.log.error(`on:stateChange:mslcommandsV6->${err.message}`);
        }
        break;

      case 'legacy':
        try {
          await this.smartLight.sendCommands(await this.mslcommands2[mslZoneType][dp](options));
          this.log.debug(`mslcommands2 executed::${Date.now() - start}ms`);
        } catch (err) {
          this.log.error(`on:stateChange:mslcommands2->::${err.message}`);
        }
        break;

      default:
        break;
    }
  }

  async onMessage(obj) {
    if (typeof obj === 'object') {
      if (obj.command === 'discover') {
        let discoverIp = this.config.controllerIp;

        if (discoverIp === '') {
          discoverIp = '255.255.255.255';
        } else {
          discoverIp = discoverIp.split('.');
          discoverIp.pop();
          discoverIp.push('255');
          discoverIp = discoverIp.join('.');
        }

        const { discoverBridges } = require('node-milight-promise');

        try {
          const results = await discoverBridges({
            type: 'all',
            address: discoverIp,
            timeout: 1000,
          });
          this.log.debug(`on:message:discover bridges->${JSON.stringify(results)}`);

          if (obj.callback) {
            this.sendTo(obj.from, obj.command, results, obj.callback);
          }
        } catch (err) {
          this.log.error(`on:message:discover bridges->${err}`);
        }
      } else if (obj.command === 'stopInstance') { // "supportStopInstance" : true in common{...}
        // deleteEnums ()
        if (this.smartLight) {
          try {
            await this.smartLight.close();
            this.log.info('on:message:stopInstance->All command have been executed - closing MiLight!');
          } catch (err) {
            this.log.error(`on:message:stopInstance->${err}`);
          }
        }
      } else {
        this.log.warn(`on:message:Unknown command->${obj.command}`);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onUnload(callback) {
    try {
      // deleteEnums ()

      callback();
    } catch (err) {
      callback();
    }
  }

  async main() {
    this.smartLight = new Milight({
      ip: this.config.controllerIp,
      type: this.config.controllerType,
      delayBetweenCommands: parseInt(this.config.delayBetweenCommands),
      commandRepeat: parseInt(this.config.commandRepeat),
      port: parseInt(this.config.controllerPort),
      fullSync: true,
    });

    try {
      await this.configAsync();
      this.log.info('main->::all MiLight zones and states were created!');

      await this.subscribeStatesAsync('*');
      this.log.info('main->::all states were subscribed!');

      if (this.config.activeApp) {
        await startAppServer(this);
      }

      this.log.info('main->::milight-smart-light adapter was started successfully!');
    } catch (err) {
      this.log.error(`main->::${err}`);
    }

    process.on('unhandledRejection', (reason, promise) => {
      this.log.error(`${(new Date()).toUTCString()} unhandledRejection at: ${promise}`);
      this.log.error(`${(new Date()).toUTCString()} unhandledRejection reason:${promise}`);
      // process.exit(1);
    });
  }

  async configAsync() {
    if (this.config.zones.length > 0) {
      _.forEach(this.config.zones, (zone) => {
        this.zonesFromAdmin.push({
          instance: this.namespace,
          instanceNumber: this.instance,
          group_id: `${this.namespace}.${zone.mslGroupName.replace(/\s+/g, '_')}`,

          controllerType: this.config.controllerType,
          iBox: this.config.iBox,

          mslZoneActive: zone.mslZoneActive,
          mslZoneNumber: zone.mslZoneNumber,
          mslGroupNameCommon: zone.mslGroupName,
          mslGroupName: zone.mslGroupName.replace(/\s+/g, '_'),
          mslZoneType: zone.mslZoneType,

          mslColorOffset: zone.mslColorOffset,

          mslZoneName: _.isEmpty(zone.mslZoneName) ? `${zone.mslZoneType}-${zone.mslZoneNumber}` : zone.mslZoneName,

          mslRoom: zone.mslRoom === null ? [] : [zone.mslRoom],
          mslFunc: zone.mslFunc.length < 1 ? [] : zone.mslFunc,

          mslZoneTypeNumber: `${zone.mslZoneType}-${zone.mslZoneNumber}`,

          channelPath: `${zone.mslGroupName}.${zone.mslZoneType}-${zone.mslZoneNumber}.`.replace(/\s+/g, '_'),
          fullChannelPath: `${this.namespace}.${zone.mslGroupName}.${zone.mslZoneType}-${zone.mslZoneNumber}.`.replace(/\s+/g, '_'),

          name: _.isEmpty(zone.mslZoneName) ? `${zone.mslZoneType}-${zone.mslZoneNumber}` : zone.mslZoneName,
        });
      });

      _.remove(this.zonesFromAdmin, (val) => val.mslZoneActive === false || _.isEmpty(val.mslZoneNumber) || _.isEmpty(val.mslGroupName) || _.isEmpty(val.mslZoneType));
    }

    const groupsFromStorage = await this.getDevicesAsync();
    const zonesFromStorage = _.flatten(await Promise.all(groupsFromStorage.map((device) => this.getChannelsOfAsync(device._id))));
    let deleteZonesFromStorage = _.differenceWith(zonesFromStorage, this.zonesFromAdmin, (zoneStorage, zoneAdmin) => _.isEqual(zoneStorage.common, zoneAdmin));

    deleteZonesFromStorage = _.map(deleteZonesFromStorage, (zone) => this.idToDCS(zone._id));
    this.addZonesToStorage = _.differenceWith(this.zonesFromAdmin, zonesFromStorage, (zoneAdmin, zoneStorage) => _.isEqual(zoneStorage.common, zoneAdmin));

    const zonesInStorage = _.differenceWith(this.zonesFromAdmin, this.addZonesToStorage, (zoneAdmin, zoneStorage) => _.isEqual(zoneStorage, zoneAdmin));

    // mslStatestore für unveränderte Zonen initialisieren
    if (zonesInStorage.length > 0) {
      for (const zone of zonesInStorage) {
        for (const dp of this.states.statesList(this.config.controllerType, zone.mslZoneType)) {
          const state = await this.getStateAsync(zone.fullChannelPath + dp);
          await this.mslStatestore.initState({
            dp,
            val: state.val,
            params: zone,
          });
        }
      }
    }

    // MiLight-Zonen aus deleteZonesFromStorage aus dem Speicher löschen
    if (deleteZonesFromStorage.length > 0) {
      for (const DCS of deleteZonesFromStorage) {
        await this.deleteChannelAsync(DCS.device, DCS.channel);
        this.log.debug(`configAsync->::deleted MiLight zone:${DCS.device}.${DCS.channel}`);

        const channels = await this.getChannelsOfAsync(DCS.device);

        if (channels.length < 1) {
          await this.deleteDeviceAsync(DCS.device);
          this.log.debug(`configAsync->::deleted MiLight group:${DCS.device}`);
        }

        await this.deleteChannelFromEnumAsync(null, DCS.device, DCS.channel);
        this.log.debug(`configAsync->::${this.namespace}.${DCS.device}.${DCS.channel}: all associated enums have been deleted!`);
      }
    }

    // MiLight-Zonen und Enums aus addZonesToStorage anlegen
    if (this.addZonesToStorage.length > 0) {
      for (const addZone of this.addZonesToStorage) {
        // device für addZonesToStorage anlegen
        await this.createDeviceAsync(addZone.mslGroupName, { name: addZone.mslGroupNameCommon });
        this.log.debug(`configAsync->::MiLight group :${this.namespace}.${addZone.mslGroupName}: was created!`);

        // channel für addZonesToStorage anlegen
        await this.createChannelAsync(addZone.mslGroupName, addZone.mslZoneTypeNumber, addZone);
        this.log.debug(`configAsync->::MiLight zone :${this.namespace}.${addZone.mslGroupName}.${addZone.mslZoneTypeNumber}: was created!`);

        // States für addZonesToStorage anlegen und mslStatestore initialisieren
        for (const dp of this.states.statesList(this.config.controllerType, addZone.mslZoneType)) {
          await this.createStateAsync(addZone.mslGroupName, addZone.mslZoneTypeNumber, dp, this.states.getCommon(dp));
          await this.mslStatestore.initState({
            dp,
            val: this.states.getCommon(dp)._def,
            params: addZone,
          });
        }

        await this.deleteChannelFromEnumAsync(null, addZone.mslGroupName, addZone.mslZoneTypeNumber);
        for (const enumName of _.concat(addZone.mslFunc, addZone.mslRoom)) {
          if (enumName) {
            await this.addChannelToEnumAsync(enumName, enumName, addZone.mslGroupName, addZone.mslZoneTypeNumber);
            this.log.debug(`configAsync->::${this.namespace}.${addZone.mslGroupName}.${addZone.mslZoneTypeNumber}: was assigned to enum->::${enumName}`);
          }
        }
      }
    }
  }

  /* async deleteEnums() {
    for (const zone of _.flatten([this.addZonesToStorage, this.zonesFromAdmin])) {
      try {
        await this.deleteChannelFromEnumAsync(null, zone.mslGroupName, zone.mslZoneTypeNumber);
        this.log.debug('deleteEnums->::Channel was deleted from enum (room and function)!');
      } catch (err) {
        this.log.error(`deleteEnums->::${err.message}`);
      }
    }
  } */
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
  // Export the constructor in compact mode
  /**
   * @param {Partial<utils.AdapterOptions>} [options={}]
   */
  module.exports = (options) => new MilightSmartLight(options);
} else {
  // otherwise start the instance directly
  new MilightSmartLight();
}
