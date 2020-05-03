const path = require('path');
const _ = require('lodash');
const utils = require('@iobroker/adapter-core');

let smartLight = null;

class Adapter extends utils.Adapter {
    constructor (options) {
        super({
            ...options,
            name: 'milight-smart-light'
        });

        this.on('ready', this.onReady.bind(this));
        this.on('objectChange', this.onObjectChange.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    async onReady () {
        await main();
    }

    onObjectChange (id, obj) {
        // Warning, obj can be null if it was deleted
        this.log.debug(`on:objectChange->${id} ${JSON.stringify(obj)}`);
    }

    async onStateChange (_id, state) {
        let start;
        // you can use the ack flag to detect if it is status (true) or command (false)
        if (this.common.loglevel === 'debug') {
            start = Date.now();
        }

        if (!state || state.ack) {
            /* if (state.ack) {
                        adapter.log.debug (`on:stateChange:ack=true->${_id}::state->${JSON.stringify (state)}`)
                   } */
            return;
        }

        this.log.debug(`on:stateChange:ack=false->${_id}::state->${JSON.stringify(state)}`);

        const options = {};

        const _dcs = this.idToDCS(_id);

        const mslZoneType = _.split(_dcs.channel, '-')[0];
        const mslZoneNumber = _.split(_dcs.channel, '-')[1];
        const dp = _dcs.state;

        const channelPath = this._DCS2ID(_dcs.device, _dcs.channel, '') + '.';
        const fullChannelPath = this.namespace + '.' + channelPath;

        options.channelPath = channelPath;
        options.fullChannelPath = fullChannelPath;

        options.mslZoneType = mslZoneType;
        options.mslZoneNumber = mslZoneNumber - 0;

        options.dp = dp;

        options.val = state.val;
        options.ack = state.ack;

        await mslStatestore.setState({ dp: options.dp, val: state.val, params: options });
        this.log.debug('on:stateChange:mslStatestore.setState || ' + (Date.now() - start) + 'ms');

        switch (this.config.controllerType) {
            case 'v6':
                try {
                    await smartLight.sendCommands(await mslcommandsV6[mslZoneType][dp](options));
                    this.log.debug('mslcommandsV6 executed::' + (Date.now() - start) + 'ms');
                } catch (err) {
                    this.log.error(`on:stateChange:mslcommandsV6->${err.message}`);
                }
                break;

            case 'legacy':
                try {
                    await smartLight.sendCommands(await mslcommands2[mslZoneType][dp](options));
                    this.log.debug('mslcommands2 executed::' + (Date.now() - start) + 'ms');
                } catch (err) {
                    this.log.error(`on:stateChange:mslcommands2->::${err.message}`);
                }
                break;

            default:
                break;
        }
    }

    async onMessage (obj) {
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

                const discoverBridges = require('node-milight-promise').discoverBridges;

                try {
                    const results = await discoverBridges({ type: 'all', address: discoverIp, timeout: 1000 });
                    this.log.debug(`on:message:discover bridges->${JSON.stringify(results)}`);

                    if (obj.callback) {
                        this.sendTo(obj.from, obj.command, results, obj.callback);
                    }
                } catch (err) {
                    this.log.error(`on:message:discover bridges->${err}`);
                }
            } else if (obj.command === 'stopInstance') { // "supportStopInstance" : true in common{...}
                // deleteEnums ()
                if (smartLight) {
                    try {
                        await smartLight.close();
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

    onUnload (callback) {
        try {
            // deleteEnums ()

            callback();
        } catch (err) {
            callback();
        }
    }
}

const adapter = new Adapter();

const startAppServer = require(path.join(__dirname, '/lib/js/mslfeServer/mslfeServer')).startAppServer;
const mslStatestore = new (require(path.join(__dirname, '/lib/js/mslstatestore/mslstatestore')))(adapter);
const mslcommandsV6 = require(path.join(__dirname, '/lib/js/mslcommandsV6'))(adapter, mslStatestore);
const mslcommands2 = require(path.join(__dirname, '/lib/js/mslcommands2'))(adapter, mslStatestore);

const states = require(path.join(__dirname, '/lib/js/mslstates'));
const Milight = require('node-milight-promise').MilightController;

async function main () {
    smartLight = new Milight({
        ip: adapter.config.controllerIp,
        type: adapter.config.controllerType,
        delayBetweenCommands: parseInt(adapter.config.delayBetweenCommands),
        commandRepeat: parseInt(adapter.config.commandRepeat),
        port: parseInt(adapter.config.controllerPort),
        fullSync: true
    });

    try {
        await configAsync();
        adapter.log.info('main->::all MiLight zones and states were created!');

        await adapter.subscribeStatesAsync('*');
        adapter.log.info('main->::all states were subscribed!');

        if (adapter.config.activeApp) {
            await startAppServer(adapter);
        }

        adapter.log.info('main->::milight-smart-light adapter was started successfully!');
    } catch (err) {
        adapter.log.error(`main->::${err}`);
    }

    process.on('unhandledRejection', function (err) {
        adapter.log.error((new Date).toUTCString() + ' unhandledRejection:', err.message);
        adapter.log.error(err.stack);
        // process.exit(1);
    });
}

const zonesFromAdmin = [];
let addZonesToStorage = [];

async function configAsync () {
    if (adapter.config.zones.length > 0) {
        _.forEach(adapter.config.zones, zone => {
            zonesFromAdmin.push({
                instance: adapter.namespace,
                instanceNumber: adapter.instance,
                group_id: `${adapter.namespace}.${zone.mslGroupName.replace(/\s+/g, '_')}`,

                controllerType: adapter.config.controllerType,
                iBox: adapter.config.iBox,

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
                fullChannelPath: `${adapter.namespace}.${zone.mslGroupName}.${zone.mslZoneType}-${zone.mslZoneNumber}.`.replace(/\s+/g, '_'),

                name: _.isEmpty(zone.mslZoneName) ? `${zone.mslZoneType}-${zone.mslZoneNumber}` : zone.mslZoneName
            });
        });

        _.remove(zonesFromAdmin, val => val.mslZoneActive === false || _.isEmpty(val.mslZoneNumber) || _.isEmpty(val.mslGroupName) || _.isEmpty(val.mslZoneType));
    }

    const groupsFromStorage = await adapter.getDevicesAsync();
    const zonesFromStorage = _.flatten(await Promise.all(groupsFromStorage.map(device => adapter.getChannelsOfAsync(device._id))));
    let deleteZonesFromStorage = _.differenceWith(zonesFromStorage, zonesFromAdmin, (zoneStorage, zoneAdmin) => _.isEqual(zoneStorage.common, zoneAdmin));

    deleteZonesFromStorage = _.map(deleteZonesFromStorage, zone => adapter.idToDCS(zone._id));
    addZonesToStorage = _.differenceWith(zonesFromAdmin, zonesFromStorage, (zoneAdmin, zoneStorage) => _.isEqual(zoneStorage.common, zoneAdmin));

    const zonesInStorage = _.differenceWith(zonesFromAdmin, addZonesToStorage, (zoneAdmin, zoneStorage) => _.isEqual(zoneStorage, zoneAdmin));

    // mslStatestore für unveränderte Zonen initialisieren
    if (zonesInStorage.length > 0) {
        for (const zone of zonesInStorage) {
            for (const dp of states.statesList(adapter.config.controllerType, zone.mslZoneType)) {
                const state = await adapter.getStateAsync(zone.fullChannelPath + dp);
                await mslStatestore.initState({ dp: dp, val: state.val, params: zone });
            }
        }
    }

    // MiLight-Zonen aus deleteZonesFromStorage aus dem Speicher löschen
    if (deleteZonesFromStorage.length > 0) {
        for (const DCS of deleteZonesFromStorage) {
            await adapter.deleteChannelAsync(DCS.device, DCS.channel);
            adapter.log.debug('configAsync->::deleted MiLight zone:' + DCS.device + '.' + DCS.channel);

            const channels = await adapter.getChannelsOfAsync(DCS.device);

            if (channels.length < 1) {
                await adapter.deleteDeviceAsync(DCS.device);
                adapter.log.debug('configAsync->::deleted MiLight group:' + DCS.device);
            }

            await adapter.deleteChannelFromEnumAsync(null, DCS.device, DCS.channel);
            adapter.log.debug(`configAsync->::${adapter.namespace}.${DCS.device}.${DCS.channel}: all associated enums have been deleted!`);
        }
    }

    // MiLight-Zonen und Enums aus addZonesToStorage anlegen
    if (addZonesToStorage.length > 0) {
        for (const addZone of addZonesToStorage) {
            // device für addZonesToStorage anlegen
            await adapter.createDeviceAsync(addZone.mslGroupName, { name: addZone.mslGroupNameCommon });
            adapter.log.debug(`configAsync->::MiLight group :${adapter.namespace}.${addZone.mslGroupName}: was created!`);

            // channel für addZonesToStorage anlegen
            await adapter.createChannelAsync(addZone.mslGroupName, addZone.mslZoneTypeNumber, addZone);
            adapter.log.debug(`configAsync->::MiLight zone :${adapter.namespace}.${addZone.mslGroupName}.${addZone.mslZoneTypeNumber}: was created!`);

            // States für addZonesToStorage anlegen und mslStatestore initialisieren
            for (const dp of states.statesList(adapter.config.controllerType, addZone.mslZoneType)) {
                await adapter.createStateAsync(addZone.mslGroupName, addZone.mslZoneTypeNumber, dp, states.getCommon(dp));
                await mslStatestore.initState({ dp: dp, val: states.getCommon(dp)._def, params: addZone });
            }

            await adapter.deleteChannelFromEnumAsync(null, addZone.mslGroupName, addZone.mslZoneTypeNumber);
            for (const enumName of _.concat(addZone.mslFunc, addZone.mslRoom)) {
                if (enumName) {
                    await adapter.addChannelToEnumAsync(enumName, enumName, addZone.mslGroupName, addZone.mslZoneTypeNumber);
                    adapter.log.debug(
                        `configAsync->::${adapter.namespace}.${addZone.mslGroupName}.${addZone.mslZoneTypeNumber}: was assigned to enum->::${enumName}`);
                }
            }
        }
    }
}

/* async function deleteEnums() {
    for (const zone of _.flatten([addZonesToStorage, zonesFromAdmin])) {
        try {
            await adapter.deleteChannelFromEnumAsync(null, zone.mslGroupName, zone.mslZoneTypeNumber);
            adapter.log.debug('deleteEnums->::Channel was deleted from enum (room and function)!');
        } catch (err) {
            adapter.log.error(`deleteEnums->::${err.message}`);
        }
    }
} */
