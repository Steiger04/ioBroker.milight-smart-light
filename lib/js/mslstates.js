'use strict';

class States {
    constructor () {
        this._states = {
            on: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'On',
                    defAck: true,
                    _def: false,
                    write: true,
                    read: true
                },
                mslZoneTypesV6: ['bridge', 'white', 'rgb', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: ['white', 'rgb', 'rgbw']
            },
            off: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Off',
                    defAck: true,
                    _def: true,
                    write: true,
                    read: true
                },
                mslZoneTypesV6: ['bridge', 'white', 'rgb', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: ['white', 'rgb', 'rgbw']
            },
            onoff: {
                common: {
                    smartName: {
                        smartType: 'LIGHT'
                    },
                    type: 'boolean',
                    role: 'switch',
                    name: 'On/Off',
                    defAck: true,
                    _def: false,
                    write: true,
                    read: true
                },
                mslZoneTypesV6: ['white', 'bridge', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: ['white', 'rgbw']
            },
            allOn: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'All On',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: [],
                mslZoneTypesLegacy: []
            },
            allOff: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'All Off',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: true
                },
                mslZoneTypesV6: [],
                mslZoneTypesLegacy: []
            },
            link: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Link',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                // mslZoneTypesV6: ['white', 'rgb', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesV6: [],
                mslZoneTypesLegacy: []
            },
            unlink: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Unlink',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                // mslZoneTypesV6: ['white', 'rgb', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesV6: [],
                mslZoneTypesLegacy: []
            },
            whiteMode: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'WhiteMode',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: ['bridge', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: ['rgbw']
            },
            whiteTemperature: {
                common: {
                    smartName: {
                        byON: '-',
                        smartType: 'LIGHT'
                    },
                    type: 'number',
                    role: 'level.color.temperature',
                    unit: 'K',
                    name: 'white Temperature',
                    defAck: true,
                    min: 2700,
                    max: 6500,
                    _def: 2700,
                    desc: 'temperature values 0x00 to 0x64 : examples: 00 = 2700K (Warm White), 19 = 3650K, 32 = 4600K, 4B, = 5550K, 64 = 6500K (Cool White)',
                    write: true,
                    read: true
                },
                mslZoneTypesV6: ['fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: []
            },
            nightMode: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Night Mode',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: ['bridge', 'white', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: ['white', 'rgbw']
            },
            brightnessOnly: {
                common: {
                    smartName: false,
                    type: 'number',
                    role: 'level.dimmer',
                    name: 'Brightness only',
                    defAck: true,
                    min: 1,
                    max: 100,
                    unit: '%',
                    write: true,
                    read: true,
                    _def: 50
                },
                mslZoneTypesV6: ['bridge', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: ['rgbw']
            },
            brightness: {
                common: {
                    smartName: {
                        byON: '-',
                        smartType: 'LIGHT'
                    },
                    type: 'number',
                    role: 'level.dimmer',
                    name: 'Brightness',
                    defAck: true,
                    min: 0,
                    max: 100,
                    unit: '%',
                    write: true,
                    read: true,
                    _def: 0
                },
                mslZoneTypesV6: ['bridge', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: ['rgbw']
            },
            brightness2: {
                smartName: false,
                common: {
                    type: 'number',
                    role: 'level.dimmer',
                    name: 'Brightness 2',
                    defAck: true,
                    min: 0,
                    max: 100,
                    unit: '%',
                    write: true,
                    read: true,
                    _def: 0
                },
                mslZoneTypesV6: [],
                mslZoneTypesLegacy: []
            },
            saturation: {
                common: {
                    smartName: false,
                    type: 'number',
                    role: 'level.color.saturation',
                    name: 'Saturation',
                    defAck: true,
                    min: 0,
                    max: 100,
                    unit: '%',
                    write: true,
                    read: true,
                    _def: 0
                },
                mslZoneTypesV6: ['fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: []
            },
            hsvToMilightColor: {
                common: {
                    smartName: false,
                    type: 'number',
                    role: 'level.dimmer',
                    name: 'Hsv To Milight Color',
                    defAck: true,
                    min: 0,
                    max: 360,
                    write: true,
                    read: true
                },
                mslZoneTypesV6: [],
                mslZoneTypesLegacy: []
            },
            hue: {
                common: {
                    smartName: false,
                    type: 'number',
                    role: 'level.color.hue',
                    name: 'Color HUE',
                    defAck: true,
                    min: 0,
                    max: 360,
                    write: true,
                    read: true,
                    _def: 0
                },
                mslZoneTypesV6: ['bridge', 'rgb', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: ['rgb', 'rgbw']
            },
            rgb: {
                common: {
                    smartName: {
                        byON: '-',
                        smartType: 'LIGHT'
                    },
                    type: 'string',
                    role: 'level.color.rgb',
                    name: 'Color RGB',
                    defAck: true,
                    write: true,
                    read: false,
                    _def: '#000000'
                },
                mslZoneTypesV6: ['bridge', 'rgb', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: ['rgbw']
            },
            effectMode: {
                common: {
                    smartName: false,
                    type: 'number',
                    role: 'level.effect',
                    name: 'Effect Mode',
                    defAck: true,
                    min: 1,
                    max: 9,
                    write: true,
                    read: true,
                    _def: 1
                },
                mslZoneTypesV6: ['bridge', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: []
            },
            effectModeNext: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Effect Speed Next',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: ['bridge', 'rgb', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: ['rgbw']
            },
            effectModeUp: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Effect Mode Up',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: ['rgb'],
                mslZoneTypesLegacy: []
            },
            effectModeDown: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Effect Mode Down',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: ['rgb'],
                mslZoneTypesLegacy: []
            },
            effectSpeedUp: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Effect Speed Up',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: ['bridge', 'rgb', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: ['rgb', 'rgbw']
            },
            effectSpeedDown: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Effect Speed Down',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: ['bridge', 'rgb', 'rgbw', 'fullColor', 'fullColor8Zone'],
                mslZoneTypesLegacy: ['rgb', 'rgbw']
            },
            brightUp: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Bright Up',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: ['white', 'rgb'],
                mslZoneTypesLegacy: ['white', 'rgb']
            },
            brightDown: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Bright Down',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: ['white', 'rgb'],
                mslZoneTypesLegacy: ['white', 'rgb']
            },
            maxBright: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Max Bright',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: ['white'],
                mslZoneTypesLegacy: ['white']
            },
            warmer: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Warmer',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: ['white'],
                mslZoneTypesLegacy: ['white']
            },
            cooler: {
                common: {
                    smartName: false,
                    type: 'boolean',
                    role: 'button',
                    name: 'Cooler',
                    defAck: true,
                    write: true,
                    read: true,
                    _def: false
                },
                mslZoneTypesV6: ['white'],
                mslZoneTypesLegacy: ['white']
            }
        }; // Alle States
    }

    getCommon (dp) {
        return this._states[dp].common;
    }

    statesList (ct, tz) {
        const _statesList = [];

        Object.keys(this._states).forEach(key => {
            if (ct === 'legacy' && this._states[key].mslZoneTypesLegacy.indexOf(tz) !== -1) {
                _statesList.push(key);
            }

            if (ct === 'v6' && this._states[key].mslZoneTypesV6.indexOf(tz) !== -1) {
                _statesList.push(key);
            }
        });

        return _statesList;
    }
}

module.exports = new States();
