'use strict'; // jscs:ignore validateLineBreaks

class States {
  constructor() {
    this._states = {
      link: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Link',
          def: false,
          write: true,
          read: true,
        },
        typeZonesV6: ['white', 'rgb', 'rgbw', 'fullColor'],
        typeZonesLegacy: [],
      },
      unlink: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Unlink',
          def: false,
          write: true,
          read: true,
        },
        typeZonesV6: ['white', 'rgb', 'rgbw', 'fullColor'],
        typeZonesLegacy: [],
      },
      on: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'On',
          def: false,
          write: true,
          read: true,
        },
        typeZonesV6: ['bridge', 'white', 'rgb', 'rgbw', 'fullColor'],
        typeZonesLegacy: ['white', 'rgb', 'rgbw'],
      },
      off: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Off',
          def: false,
          write: true,
          read: true,
        },
        typeZonesV6: ['bridge', 'white', 'rgb', 'rgbw', 'fullColor'],
        typeZonesLegacy: ['white', 'rgb', 'rgbw'],
      },
      allOn: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'All On',
          def: false,
          write: true,
          read: true,
        },
        typeZonesV6: [],
        typeZonesLegacy: ['white', 'rgbw'],
      },
      allOff: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'All Off',
          def: false,
          write: true,
          read: true,
        },
        typeZonesV6: [],
        typeZonesLegacy: ['white', 'rgbw'],
      },
      whiteMode: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'WhiteMode',
          def: false,
          write: true,
          read: true,
        },
        typeZonesV6: ['bridge', 'rgbw', 'fullColor'],
        typeZonesLegacy: ['rgbw'],
      },
      whiteTemperature: {
        common: {
          type: 'number',
          role: 'level.temperature',
          name: 'white Temperature',
          min: 0,
          max: 100,
          def: 0,
          desc: 'temperature values 0x00 to 0x64 : examples: 00 = 2700K (Warm White), 19 = 3650K, 32 = 4600K, 4B, = 5550K, 64 = 6500K (Cool White)',
          write: true,
          read: true,
        },
        typeZonesV6: ['fullColor'],
        typeZonesLegacy: [],
      },
      nightMode: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Night Mode',
          write: true,
          read: true,
          def: false,
        },
        typeZonesV6: ['bridge', 'white', 'rgbw', 'fullColor'],
        typeZonesLegacy: ['white', 'rgbw'],
      },
      brightness: {
        common: {
          type: 'number',
          role: 'level.dimmer',
          name: 'Brightness',
          min: 0,
          max: 100,
          def: 100,
          unit: '%',
          write: true,
          read: true,
        },
        typeZonesV6: ['bridge', 'rgbw', 'fullColor'],
        typeZonesLegacy: ['rgbw'],
      },
      brightness2: {
        common: {
          type: 'number',
          role: 'level.dimmer',
          name: 'Brightness 2',
          min: 0,
          max: 100,
          def: 100,
          unit: '%',
          write: true,
          read: true,
        },
        typeZonesV6: [],
        typeZonesLegacy: ['rgbw'],
      },
      saturation: {
        common: {
          type: 'number',
          role: 'level.dimmer',
          name: 'Saturation',
          min: 0,
          max: 100,
          def: 100,
          unit: '%',
          write: true,
          read: true,
        },
        typeZonesV6: ['fullColor'],
        typeZonesLegacy: [],
      },
      hsvToMilightColor: {
        common: {
          type: 'number',
          role: 'level.dimmer',
          name: 'Hsv To Milight Color',
          min: 0,
          max: 360,
          def: 240,
          write: true,
          read: true,
        },
        typeZonesV6: [],
        typeZonesLegacy: [],
      },
      hue: {
        common: {
          type: 'number',
          role: 'level.dimmer',
          name: 'Color HUE',
          min: 0,
          max: 360,
          def: 0,
          write: true,
          read: true,
        },
        typeZonesV6: ['bridge', 'rgb', 'rgbw', 'fullColor'],
        typeZonesLegacy: ['rgb', 'rgbw'],
      },
      rgb: {
        common: {
          type: 'string',
          role: 'level.rgb',
          name: 'Color RGB',
          def: '#0000ff',
          write: true,
          read: false,
        },
        typeZonesV6: ['bridge', 'rgb', 'rgbw', 'fullColor'],
        typeZonesLegacy: ['rgbw'],
      },
      effectMode: {
        common: {
          type: 'number',
          role: 'level.effect',
          name: 'Effect Mode',
          min: 1,
          max: 9,
          def: 1,
          write: true,
          read: true,
        },
        typeZonesV6: ['bridge', 'rgbw', 'fullColor'],
        typeZonesLegacy: [],
      },
      effectModeNext: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Effect Speed Next',
          write: true,
          read: true,
          def: false,
        },
        typeZonesV6: ['bridge', 'rgb', 'rgbw', 'fullColor'],
        typeZonesLegacy: ['rgbw'],
      },
      effectModeUp: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Effect Mode Up',
          write: true,
          read: true,
          def: false,
        },
        typeZonesV6: ['rgb'],
        typeZonesLegacy: [],
      },
      effectModeDown: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Effect Mode Down',
          write: true,
          read: true,
          def: false,
        },
        typeZonesV6: ['rgb'],
        typeZonesLegacy: [],
      },
      effectSpeedUp: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Effect Speed Up',
          write: true,
          read: true,
          def: false,
        },
        typeZonesV6: ['bridge', 'rgb', 'rgbw', 'fullColor'],
        typeZonesLegacy: ['rgb', 'rgbw'],
      },
      effectSpeedDown: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Effect Speed Down',
          write: true,
          read: true,
          def: false,
        },
        typeZonesV6: ['bridge', 'rgb', 'rgbw', 'fullColor'],
        typeZonesLegacy: ['rgb', 'rgbw'],
      },
      brightUp: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Bright Up',
          write: true,
          read: true,
          def: false,
        },
        typeZonesV6: ['white', 'rgb'],
        typeZonesLegacy: ['white', 'rgb'],
      },
      brightDown: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Bright Down',
          write: true,
          read: true,
          def: false,
        },
        typeZonesV6: ['white', 'rgb'],
        typeZonesLegacy: ['white', 'rgb'],
      },
      maxBright: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Max Bright',
          write: true,
          read: true,
          def: false,
        },
        typeZonesV6: ['white'],
        typeZonesLegacy: ['white'],
      },
      warmer: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Warmer',
          write: true,
          read: true,
          def: false,
        },
        typeZonesV6: ['white'],
        typeZonesLegacy: ['white'],
      },
      cooler: {
        common: {
          type: 'boolean',
          role: 'button',
          name: 'Cooler',
          write: true,
          read: true,
          def: false,
        },
        typeZonesV6: ['white'],
        typeZonesLegacy: ['white'],
      },
    }; // Alle States
  }

  getCommon(dp) {
    return this._states[dp].common;
  }

  statesList(ct, tz) {
    let _statesList = [];

    Object.keys(this._states).forEach((key) => {
      if (ct === 'legacy' && this._states[key].typeZonesLegacy.indexOf(tz) !== -1) {
        _statesList.push(key);
      }

      if (ct === 'v6' && this._states[key].typeZonesV6.indexOf(tz) !== -1) {
        _statesList.push(key);
      }
    });

    return _statesList;
  }
}

module.exports = new States();
