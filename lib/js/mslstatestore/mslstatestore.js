const tinycolor = require('tinycolor2');

class MslStatestore {
  constructor(adapter) {
    this.adapter = adapter;
    // eslint-disable-next-line no-new-object
    this.state = {};
  }

  async initState(options) {
    const { fullChannelPath } = options.params;
    const { mslZoneType: zoneType } = options.params;
    const { dp } = options;

    if ((zoneType === 'rgbw' || zoneType === 'bridge') && dp === 'rgb') {
      // const hsv = tinycolor(options.val).toHsv();
      // await this._setValue({ id: fullChannelPath + 'saturation', val: hsv.s * 100, ack: false }); // Fake id
      const saturation = tinycolor(options.val)
        .toHsv().s * 100;
      await this._setValue({
        id: `${fullChannelPath}saturation`,
        val: saturation,
        ack: true,
        zoneType,
        dp,
      }); // Fake id
    }

    await this._setValue({
      id: fullChannelPath + options.dp,
      val: options.val,
      ack: false,
      zoneType,
      dp,
    });
  }

  async setState(options) {
    const { dp } = options;
    const { fullChannelPath } = options.params;
    const { mslZoneType: zoneType } = options.params;
    const { controllerType } = options.params;

    if (typeof options.val === 'string') {
      options.val = options.val.toLowerCase();
    }

    await this._setValue({
      id: fullChannelPath + dp,
      val: options.val,
      ack: options.params.ack,
      zoneType,
      dp,
    });
    options.params.ack = true; // erforderlich für Quittung bei gleichem Wert für den State

    if ((dp === 'rgb' || dp === 'hue' || dp === 'saturation' || dp === 'brightness') && controllerType !== 'legacy') {
      await this._setValue({
        id: `${fullChannelPath}effectOff`,
        val: true,
        params: options,
        zoneType,
        dp,
      });
      await this._setValue({
        id: `${fullChannelPath}effectOn`,
        val: false,
        params: options,
        zoneType,
        dp,
      });
      await this._setValue({
        id: `${fullChannelPath}effectOnOff`,
        val: false,
        params: options,
        zoneType,
        dp,
      });
    }

    if (dp === 'rgb') {
      if (options.val === '#000000') {
        await this._setValue({
          id: `${fullChannelPath}brightness`,
          val: 0,
          zoneType,
          dp,
        });

        return;
      }

      const hsv = tinycolor(options.val)
        .toHsv();

      await this._setValue({
        id: `${fullChannelPath}hue`,
        val: hsv.h,
        zoneType,
        dp,
      });
      await this._setValue({
        id: `${fullChannelPath}saturation`,
        val: hsv.s * 100,
        zoneType,
        dp: 'saturation',
      });
      await this._setValue({
        id: `${fullChannelPath}brightness`,
        val: hsv.v * 100,
        zoneType,
        dp,
      });

      return;
    }

    if (dp === 'saturation') {
      const rgb = tinycolor({
        h: this.getState(`${fullChannelPath}hue`).val,
        s: options.val,
        v: this.getState(`${fullChannelPath}brightness`).val,
      })
        .toHexString();
      await this._setValue({
        id: `${fullChannelPath}rgb`,
        val: rgb,
        zoneType,
        dp,
      });

      return;
    }

    if (dp === 'hue') {
      const rgb = tinycolor({
        h: options.val,
        s: this.getState(`${fullChannelPath}saturation`).val,
        v: this.getState(`${fullChannelPath}brightness`).val,
      })
        .toHexString();
      await this._setValue({
        id: `${fullChannelPath}rgb`,
        val: rgb,
        zoneType,
        dp,
      });

      return;
    }

    if (dp === 'brightness') {
      const rgb = tinycolor({
        h: this.getState(`${fullChannelPath}hue`).val,
        s: this.getState(`${fullChannelPath}saturation`).val,
        v: options.val,
      })
        .toHexString();
      await this._setValue({
        id: `${fullChannelPath}rgb`,
        val: rgb,
        zoneType,
        dp,
      });

      return;
    }

    if (dp === 'effectOn' || dp === 'effectOff' || dp === 'effectMode') {
      await this._setValue({
        id: `${fullChannelPath}off`,
        val: true,
        zoneType,
        dp,
      });
      await this._setValue({
        id: `${fullChannelPath}on`,
        val: false,
        zoneType,
        dp,
      });
      await this._setValue({
        id: `${fullChannelPath}onoff`,
        val: false,
        zoneType,
        dp,
      });

      await this._setValue({
        id: `${fullChannelPath}rgb`,
        val: '#000000',
        zoneType,
        dp,
      });
      await this._setValue({
        id: `${fullChannelPath}brightness`,
        val: 0,
        zoneType,
        dp,
      });
    }
  }

  async _setValue(options) {
    this.state[options.id] = {
      oldVal: this.state[options.id] === undefined ? options.val : this.state[options.id].val,
      val: options.val,
    };

    if ((options.zoneType === 'rgbw' || options.zoneType === 'bridge') && options.dp === 'saturation') return;

    if (options.val !== this.state[options.id].oldVal || options.ack === false) {
      await this.adapter.setStateAsync(options.id, options.val, true);
      this.adapter.log.debug(`_setVal->setStateAsync->::${options.id}::${options.val}`);
    }
  }

  getState(id) {
    return this.state[id];
  }
}

module.exports = MslStatestore;
