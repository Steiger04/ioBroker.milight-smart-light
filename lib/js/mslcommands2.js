const _ = require('lodash');
const { commands2 } = require('node-milight-promise');
const tinycolor = require('tinycolor2');

function mslcommands2(adapter, mslStatestore) {
  /* ------------------------------------------------------------- Wrapper rgbw ------------------------------------------------------------- */

  // wrapper rgbw on
  commands2.rgbw.constructor.prototype.on = _.wrap(commands2.rgbw.on, async function (func, options) {
    if (typeof options !== 'object') {
      return func(options);
    }

    if (options.val === false) {
      options.val = true;
      await mslStatestore.setState({
        dp: 'off',
        val: true,
        params: options,
      });

      return this.off(options);
    }

    await mslStatestore.setState({
      dp: 'off',
      val: false,
      params: options,
    });
    await mslStatestore.setState({
      dp: 'onoff',
      val: true,
      params: options,
    });

    let _brightness = mslStatestore.getState(`${options.fullChannelPath}brightness`);

    _brightness = (_brightness.val > 0 ? _brightness.val : (_brightness.oldVal > 0 ? _brightness.oldVal : 100));

    await mslStatestore.setState({
      dp: 'brightness',
      val: _brightness,
      params: options,
    });

    return [
      func(options.mslZoneNumber),
      ...await this.rgb(options),
    ];
  });

  // wrapper rgbw off
  commands2.rgbw.constructor.prototype.off = _.wrap(commands2.rgbw.off, async function (func, options) {
    if (typeof options !== 'object') {
      return func(options);
    }

    if (options.val === false) {
      options.val = true;
      await mslStatestore.setState({
        dp: 'on',
        val: true,
        params: options,
      });

      return this.on(options);
    }

    await mslStatestore.setState({
      dp: 'on',
      val: false,
      params: options,
    });
    await mslStatestore.setState({
      dp: 'onoff',
      val: false,
      params: options,
    });

    await mslStatestore.setState({
      dp: 'rgb',
      val: '#000000',
      params: options,
    });

    return [
      func(options.mslZoneNumber),
      ...await this.rgb(options),
    ];
  });

  // wrapper rgbw allOn -> in mslstate.js nicht aktiviert!
  commands2.rgbw.constructor.prototype.allOn = _.wrap(commands2.rgbw.allOn, async (func) => func());

  // wrapper rgbw allOff -> in mslstate.js nicht aktiviert!
  commands2.rgbw.constructor.prototype.allOff = _.wrap(commands2.rgbw.allOff, async (func) => func());

  // wrapper rgbw whiteMode
  commands2.rgbw.constructor.prototype.whiteMode = _.wrap(commands2.rgbw.whiteMode, async function (func, options) {
    if (typeof options !== 'object') {
      return func(options);
    }

    let _brightness = mslStatestore.getState(`${options.fullChannelPath}brightness`);

    _brightness = (_brightness.val > 0 ? _brightness.val : (_brightness.oldVal > 0 ? _brightness.oldVal : 100));

    await mslStatestore.setState({
      dp: 'brightness',
      val: _brightness,
      params: options,
    });
    await mslStatestore.setState({
      dp: 'saturation',
      val: 0,
      params: options,
    });

    return this.rgb(options);
  });

  // wrapper rgbw nightMode
  commands2.rgbw.constructor.prototype.nightMode = _.wrap(commands2.rgbw.nightMode, async (func, options) => {
    if (mslStatestore.getState(`${options.fullChannelPath}on`).val === true) {
      await mslStatestore.setState({
        dp: 'on',
        val: false,
        params: options,
      });
      await mslStatestore.setState({
        dp: 'off',
        val: true,
        params: options,
      });
      await mslStatestore.setState({
        dp: 'onoff',
        val: false,
        params: options,
      });
    }

    await mslStatestore.setState({
      dp: 'whiteMode',
      val: false,
      params: options,
    });
    await mslStatestore.setState({
      dp: 'brightness',
      val: 0,
      params: options,
    });

    return func(options.mslZoneNumber);
  });

  // wrapper rgbw brightness2 -> in mslstate.js nicht aktiviert!
  commands2.rgbw.constructor.prototype.brightness2 = _.wrap(commands2.rgbw.brightness2, async function (func, options) {
    if (typeof options !== 'object') {
      return func(_.parseInt(options));
    }

    return this.rgb(options);
  });

  // wrapper rgbw brightness
  commands2.rgbw.constructor.prototype.brightness = _.wrap(commands2.rgbw.brightness, async function (func, options) {
    if (typeof options !== 'object') {
      return func(_.parseInt(options));
    }

    return this.rgb(options);
  });

  // wrapper rgbw hue
  commands2.rgbw.constructor.prototype.hue = _.wrap(commands2.rgbw.hue, async function (func, options) {
    if (typeof options !== 'object') {
      return func(_.parseInt(options));
    }

    return this.rgb(options);
  });

  // Wrapper rgbw rgb255 -> rgb255 !!!
  commands2.rgbw.constructor.prototype.rgb = _.wrap(commands2.rgbw.rgb255, async function (func, options) {
    const _saturation = mslStatestore.getState(`${options.fullChannelPath}saturation`);
    const _brightness = mslStatestore.getState(`${options.fullChannelPath}brightness`);

    const _on = [];

    await mslStatestore.setState({
      dp: 'nightMode',
      val: false,
      params: options,
    });

    if (_brightness.val === 0) {
      await mslStatestore.setState({
        dp: 'whiteMode',
        val: false,
        params: options,
      });

      if (mslStatestore.getState(`${options.fullChannelPath}on`).val === true) {
        await mslStatestore.setState({
          dp: 'on',
          val: false,
          params: options,
        });
        await mslStatestore.setState({
          dp: 'off',
          val: true,
          params: options,
        });
        await mslStatestore.setState({
          dp: 'onoff',
          val: false,
          params: options,
        });
      }

      return this.off(options.mslZoneNumber);
    }

    if (mslStatestore.getState(`${options.fullChannelPath}on`).val === false) {
      await mslStatestore.setState({
        dp: 'on',
        val: true,
        params: options,
      });
      await mslStatestore.setState({
        dp: 'off',
        val: false,
        params: options,
      });
      await mslStatestore.setState({
        dp: 'onoff',
        val: true,
        params: options,
      });

      _on.push(...await this.on(options.mslZoneNumber));
    }

    if (_saturation.val === 0) {
      await mslStatestore.setState({
        dp: 'whiteMode',
        val: true,
        params: options,
      });

      return [
        _on,
        await this.whiteMode(options.mslZoneNumber),
        await this.brightness(_brightness.val),
      ];
    }

    await mslStatestore.setState({
      dp: 'whiteMode',
      val: false,
      params: options,
    });

    const _rgb = tinycolor(mslStatestore.getState(`${options.fullChannelPath}rgb`).val)
      .toRgb(); // eventuell optimieren

    return [
      _on,
      ...await Promise.all(func.call(commands2.rgbw, _rgb.r, _rgb.g, _rgb.b)),
    ];
  });

  // wrapper rgbw effectModeNext
  commands2.rgbw.constructor.prototype.effectModeNext = _.wrap(commands2.rgbw.effectModeNext, async function (func, options) {
    return [
      func(),
      await this.brightnessOnly(options.mslZoneNumber, mslStatestore.getState(`${options.fullChannelPath}brightnessOnly`).val),
    ];
  });

  // wrapper rgbw effectSpeedUp
  commands2.rgbw.constructor.prototype.effectSpeedUp = _.wrap(commands2.rgbw.effectSpeedUp, async (func) => func());

  // wrapper rgbw effectSpeedDown
  commands2.rgbw.constructor.prototype.effectSpeedDown = _.wrap(commands2.rgbw.effectSpeedDown, async (func) => func());

  /* --------------------------------------------------------- Additional Function rgbw ------------------------------------------------- */

  commands2.rgbw.constructor.prototype.onoff = async function (options) {
    if (options.val === true) {
      await mslStatestore.setState({
        dp: 'on',
        val: true,
        params: options,
      });

      return this.on(options);
    }
    options.val = true;
    await mslStatestore.setState({
      dp: 'off',
      val: true,
      params: options,
    });

    return this.off(options);
  };

  // rgbw brightnessOnly
  commands2.rgbw.constructor.prototype.brightnessOnly = async function (options) {
    if (typeof options !== 'object') {
      return this.brightness(_.parseInt(options));
    }

    return this.brightness(options.val);
  };

  /* ------------------------------------------------------------- Wrapper white ------------------------------------------------------------- */

  // wrapper white on
  commands2.white.constructor.prototype.on = _.wrap(commands2.white.on, async function (func, options) {
    if (typeof options !== 'object') {
      return func(options);
    }

    if (options.val === false) {
      options.val = true;
      await mslStatestore.setState({
        dp: 'off',
        val: true,
        params: options,
      });

      return this.off(options);
    }

    await mslStatestore.setState({
      dp: 'off',
      val: false,
      params: options,
    });
    await mslStatestore.setState({
      dp: 'onoff',
      val: true,
      params: options,
    });

    return func(options.mslZoneNumber);
  });

  // wrapper white off
  commands2.white.constructor.prototype.off = _.wrap(commands2.white.off, async function (func, options) {
    if (typeof options !== 'object') {
      return func(options);
    }

    if (options.val === false) {
      options.val = true;
      await mslStatestore.setState({
        dp: 'on',
        val: true,
        params: options,
      });

      return this.on(options);
    }

    await mslStatestore.setState({
      dp: 'on',
      val: false,
      params: options,
    });
    await mslStatestore.setState({
      dp: 'onoff',
      val: false,
      params: options,
    });

    return func(options.mslZoneNumber);
  });

  // wrapper white brightUp
  commands2.white.constructor.prototype.brightUp = _.wrap(commands2.white.brightUp, async (func) => func());

  // wrapper white brightDown
  commands2.white.constructor.prototype.brightDown = _.wrap(commands2.white.brightDown, async (func) => func());

  // wrapper white maxBright
  commands2.white.constructor.prototype.maxBright = _.wrap(commands2.white.maxBright, async (func, options) => {
    if (mslStatestore.getState(`${options.fullChannelPath}off`).val === true) {
      await mslStatestore.setState({
        dp: 'on',
        val: true,
        params: options,
      });
      await mslStatestore.setState({
        dp: 'off',
        val: false,
        params: options,
      });
      await mslStatestore.setState({
        dp: 'onoff',
        val: true,
        params: options,
      });
    }

    return func(options.mslZoneNumber);
  });

  // wrapper white nightMode
  commands2.white.constructor.prototype.nightMode = _.wrap(commands2.white.nightMode, async (func, options) => {
    if (mslStatestore.getState(`${options.fullChannelPath}on`).val === true) {
      await mslStatestore.setState({
        dp: 'on',
        val: false,
        params: options,
      });
      await mslStatestore.setState({
        dp: 'off',
        val: true,
        params: options,
      });
      await mslStatestore.setState({
        dp: 'onoff',
        val: false,
        params: options,
      });
    }

    return func(options.mslZoneNumber);
  });

  // wrapper white warmer
  commands2.white.constructor.prototype.warmer = _.wrap(commands2.white.warmer, async (func) => func());

  // wrapper white cooler
  commands2.white.constructor.prototype.cooler = _.wrap(commands2.white.cooler, async (func) => func());

  /* --------------------------------------------------------- Additional Function white -------------------------------------------------- */

  // white onoff
  commands2.white.constructor.prototype.onoff = async function (options) {
    if (options.val === true) {
      await mslStatestore.setState({
        dp: 'on',
        val: true,
        params: options,
      });

      return this.on(options);
    }
    options.val = true;
    await mslStatestore.setState({
      dp: 'off',
      val: true,
      params: options,
    });

    return this.off(options);
  };
  /* --------------------------------------------------------------------------------------------------------------------------------------- */

  return commands2;
}

module.exports = mslcommands2;
