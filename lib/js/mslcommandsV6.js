'use strict'; // jscs:ignore validateLineBreaks

const Promise = require('bluebird'); // jshint ignore:line
const _ = require('lodash');

const commandsV6 = require('node-milight-promise').commandsV6;
const mslhelper = require('./mslhelper');

function mslcommandsV6(adapter) {
  /* -------------------------------------------------------- Wrapper bridge (iBox1 ) -> wie rgbw -------------------------------------------------------- */

  // wrapper bridge on
  commandsV6.bridge.constructor.prototype.on = _.wrap(commandsV6.bridge.on, function(func, options) {
    if (options === null) {
      return func();
    }

    const _dcs = options.dcs;
    const _idOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'off');
    const _idOnOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'onoff');

    if (options.val === true || options.val === 1) {
      Promise.all([adapter.setStateAsync(_idOff, false, true), adapter.setStateAsync(_idOnOff, true, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:bridge:on->' + err.message);
      });

      return func();
    }
    else {
      Promise.all([adapter.setStateAsync(_idOff, true, true), adapter.setStateAsync(_idOnOff, false, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:bridge:on->' + err.message);
      });

      return this.off(null);
    }
  });

  // wrapper bridge off
  commandsV6.bridge.constructor.prototype.off = _.wrap(commandsV6.bridge.off, function(func, options) {
    if (options === null) {
      return func();
    }

    const _dcs = options.dcs;
    const _idOn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'on');
    const _idOnOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'onoff');

    if (options.val === true || options.val === 1) {
      Promise.all([adapter.setStateAsync(_idOn, false, true), adapter.setStateAsync(_idOnOff, false, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:bridge:off->' + err.message);
      });

      return func();
    }
    else {
      Promise.all([adapter.setStateAsync(_idOn, true, true), adapter.setStateAsync(_idOnOff, true, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:bridge:off->' + err.message);
      });

      return this.on(null);
    }
  });

  // wrapper bridge whiteMode
  //noinspection JSUnusedLocalSymbols
  commandsV6.bridge.constructor.prototype.whiteMode = _.wrap(commandsV6.bridge.whiteMode, function(func, options) {
    return func();
  });

  // wrapper bridge nightMode
  commandsV6.bridge.constructor.prototype.nightMode = _.wrap(commandsV6.bridge.nightMode, function(func, options) {
    return func();
  });

  // wrapper bridge brightness
  commandsV6.bridge.constructor.prototype.brightness = _.wrap(commandsV6.bridge.brightness, function(func, options, ...argv) {
    if (options === null) {
      return func(argv[0]); // entspricht return func(brightness) -> Aufruf aus constructor.prototype.rgb
    }

    const _dcs = options.dcs;

    const _idRgb = adapter._DCS2ID(_dcs.device, _dcs.channel, 'rgb');

    adapter.getStateAsync(_idRgb).then(function(rgb) {
      let _rgb = _.map(_.words(rgb.val, /[0-9A-F]{2}/gi), function(val) { // TODO: Funktionsprüfung
        return _.parseInt(val, 16);
      });

      const _hsv = mslhelper.rgbToHsv(_rgb[0], _rgb[1], _rgb[2]);

      adapter.setStateAsync(_idRgb, mslhelper.hsvToRgb(_hsv[0], _hsv[1], _.parseInt(options.val)), true);
  }).catch(function(err) {
      adapter.log.error('commandsV6:wrapper:rgbw:brightness->' + err.message);
    });

    return func(_.parseInt(options.val));
  });

  // wrapper bridge hue
  commandsV6.bridge.constructor.prototype.hue = _.wrap(commandsV6.bridge.hue, function(func, options, ...argv) {
    if (typeof options !== 'object') {
      return func(_.parseInt(options), argv[0]); // entspricht return func(hue, true) -> Aufruf aus prototype.rgb
    }

    const milightHue = (256 + 176 - Math.floor(Number(options.val) / 360.0 * 255.0)) % 256;
    const _dcs = options.dcs;

    const _idRgb = adapter._DCS2ID(_dcs.device, _dcs.channel, 'rgb');

    adapter.getStateAsync(_idRgb).then(function(rgb) {
      const _rgb = _.map(_.words(rgb.val, /[0-9A-F]{2}/gi), function(val) { // TODO: Funktionsprüfung
        return _.parseInt(val, 16);
      });

      const _hsv = mslhelper.rgbToHsv(_rgb[0], _rgb[1], _rgb[2]);
      adapter.setStateAsync(_idRgb, mslhelper.hsvToRgb(_.parseInt(options.val), _hsv[1], _hsv[2]), true);
    }).catch(function(err) {
      adapter.log.error('commandsV6:wrapper:rgbw:hue->' + err.message);
    });

    return func(milightHue, true);
  });

  // Wrapper bridge rgb
  commandsV6.bridge.constructor.prototype.rgb = _.wrap(commandsV6.bridge.rgb, function(func, options) {
    const _rgb = _.map(_.words(options.val, /[0-9A-F]{2}/gi), function(val) { // TODO: Funktionsprüfung
      return _.parseInt(val, 16);
    });

    const hsv = mslhelper.rgbToHsv(_rgb[0], _rgb[1], _rgb[2]);
    const hue = hsv[0];
    const brightness = hsv[2];

    const _dcs = options.dcs;

    const _idHue = adapter._DCS2ID(_dcs.device, _dcs.channel, 'hue');
    const _idBn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'brightness');

    Promise.all([adapter.setStateAsync(_idHue, hue, true), adapter.setStateAsync(_idBn, brightness, true)]).catch(function(err) {
      adapter.log.error('commandsV6:wrapper:rgbw:rgb->' + err.message);
    });

    return [func.call(commandsV6.bridge, _rgb[0], _rgb[1], _rgb[2]), commandsV6.bridge.brightness(null, brightness)];
  });

  // wrapper bridge effectMode
  commandsV6.bridge.constructor.prototype.effectMode = _.wrap(commandsV6.bridge.effectMode, function(func, options) {
    return func();
  });

  // wrapper bridge effectModeNext
  commandsV6.bridge.constructor.prototype.effectModeNext = _.wrap(commandsV6.bridge.effectModeNext, function(func, options) {
    return func();
  });

  // wrapper bridge effectSpeedUp
  commandsV6.bridge.constructor.prototype.effectSpeedUp = _.wrap(commandsV6.bridge.effectSpeedUp, function(func, options) {
    return func();
  });

  // wrapper bridge effectSpeedDown
  commandsV6.bridge.constructor.prototype.effectSpeedDown = _.wrap(commandsV6.bridge.effectSpeedDown, function(func, options) {
    return func();
  });

  /* --------------------------------------------------------- Additional Function bridge ------------------------------------------------- */

  commandsV6.bridge.constructor.prototype.onoff = function(options) {
    const _dcs = options.dcs;
    const _idOn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'on');
    const _idOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'off');

    if (options.val === true || options.val === 1) {
      Promise.all([adapter.setStateAsync(_idOn, true, true), adapter.setStateAsync(_idOff, false, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:bridge:onoff->' + err.message);
      });

      return this.on(null);
    }
    else {
      Promise.all([adapter.setStateAsync(_idOn, false, true), adapter.setStateAsync(_idOff, true, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:bridge:onoff->' + err.message);
      });

      return this.off(null);
    }
  };

  /* ------------------------------------------------------------- Wrapper rgbw ------------------------------------------------------------- */

  // wrapper rgbw on
  commandsV6.rgbw.constructor.prototype.on = _.wrap(commandsV6.rgbw.on, function(func, options, ...argv) {
    if (options === null) {
      return func(argv[0]);
    }

    const _dcs = options.dcs;
    const _idOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'off');
    const _idOnOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'onoff');

    if (options.val === true || options.val === 1) {
      Promise.all([adapter.setStateAsync(_idOff, false, true), adapter.setStateAsync(_idOnOff, true, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:rgbw:on->' + err.message);
      });

      return func(options.numberZone);
    }
    else {
      Promise.all([adapter.setStateAsync(_idOff, true, true), adapter.setStateAsync(_idOnOff, false, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:rgbw:on->' + err.message);
      });

      return this.off(null, options.numberZone);
    }
  });

  // wrapper rgbw off
  commandsV6.rgbw.constructor.prototype.off = _.wrap(commandsV6.rgbw.off, function(func, options, ...argv) {
    if (options === null) {
      return func(argv[0]);
    }

    const _dcs = options.dcs;
    const _idOn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'on');
    const _idOnOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'onoff');

    if (options.val === true || options.val === 1) {
      Promise.all([adapter.setStateAsync(_idOn, false, true), adapter.setStateAsync(_idOnOff, false, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:rgbw:off->' + err.message);
      });

      return func(options.numberZone);
    }
    else {
      Promise.all([adapter.setStateAsync(_idOn, true, true), adapter.setStateAsync(_idOnOff, true, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:rgbw:off->' + err.message);
      });

      return this.on(null, options.numberZone);
    }
  });

  // wrapper rgbw whiteMode
  commandsV6.rgbw.constructor.prototype.whiteMode = _.wrap(commandsV6.rgbw.whiteMode, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper rgbw nightMode
  commandsV6.rgbw.constructor.prototype.nightMode = _.wrap(commandsV6.rgbw.nightMode, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper rgbw brightness
  commandsV6.rgbw.constructor.prototype.brightness = _.wrap(commandsV6.rgbw.brightness, function(func, options, ...argv) {
    if (options === null) {
      return func(argv[0], argv[1]); // entspricht return func(zone, brightness) -> Aufruf aus constructor.prototype.rgb
    }

    const _dcs = options.dcs;

    const _idRgb = adapter._DCS2ID(_dcs.device, _dcs.channel, 'rgb');

    adapter.getStateAsync(_idRgb).then(function(rgb) {
      const _rgb = _.map(_.words(rgb.val, /[0-9A-F]{2}/gi), function(val) { // TODO: Funktionsprüfung
        return _.parseInt(val, 16);
      });

      const _hsv = mslhelper.rgbToHsv(_rgb[0], _rgb[1], _rgb[2]);
      adapter.setStateAsync(_idRgb, mslhelper.hsvToRgb(_hsv[0], _hsv[1], _.parseInt(options.val)), true);
    }).catch(function(err) {
      adapter.log.error('commandsV6:wrapper:rgbw:brightness->' + err.message);
    });

    return func(options.numberZone, _.parseInt(options.val));
  });

  // wrapper rgbw hue
  commandsV6.rgbw.constructor.prototype.hue = _.wrap(commandsV6.rgbw.hue, function(func, options, ...argv) {
    if (typeof options !== 'object') {
      return func(options, _.parseInt(argv[0]), argv[1]); // entspricht return func(zone, hue, true) -> Aufruf aus prototype.rgb
    }

    const milightHue = (256 + 176 - Math.floor(Number(options.val) / 360.0 * 255.0)) % 256;
    const _dcs = options.dcs;

    const _idRgb = adapter._DCS2ID(_dcs.device, _dcs.channel, 'rgb');

    adapter.getStateAsync(_idRgb).then(function(rgb) {
      const _rgb = _.map(_.words(rgb.val, /[0-9A-F]{2}/gi), function(val) { // TODO: Funktionsprüfung
        return _.parseInt(val, 16);
      });

      const _hsv = mslhelper.rgbToHsv(_rgb[0], _rgb[1], _rgb[2]);
      adapter.setStateAsync(_idRgb, mslhelper.hsvToRgb(_.parseInt(options.val), _hsv[1], _hsv[2]), true);
    }).catch(function(err) {
      adapter.log.error('commandsV6:wrapper:rgbw:hue->' + err.message);
    });

    return func(options.numberZone, milightHue, true);
  });

  // Wrapper rgbw rgb
  commandsV6.rgbw.constructor.prototype.rgb = _.wrap(commandsV6.rgbw.rgb, function(func, options) {
    const _rgb = _.map(_.words(options.val, /[0-9A-F]{2}/gi), function(val) { // TODO: Funktionsprüfung
      return _.parseInt(val, 16);
    });

    const hsv = mslhelper.rgbToHsv(_rgb[0], _rgb[1], _rgb[2]);
    const hue = hsv[0];
    const brightness = hsv[2];

    const _dcs = options.dcs;

    const _idHue = adapter._DCS2ID(_dcs.device, _dcs.channel, 'hue');
    const _idBn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'brightness');

    Promise.all([adapter.setStateAsync(_idHue, hue, true), adapter.setStateAsync(_idBn, brightness, true)]).catch(function(err) {
      adapter.log.error('commandsV6:wrapper:rgbw:rgb->' + err.message);
    });

    return [func.call(commandsV6.rgbw, options.numberZone, _rgb[0], _rgb[1], _rgb[2]), commandsV6.rgbw.brightness(null, options.numberZone, brightness)];
  });

  // wrapper rgbw effectMode
  commandsV6.rgbw.constructor.prototype.effectMode = _.wrap(commandsV6.rgbw.effectMode, function(func, options) {
    return func(options.numberZone, options.val);
  });

  // wrapper rgbw effectModeNext
  commandsV6.rgbw.constructor.prototype.effectModeNext = _.wrap(commandsV6.rgbw.effectModeNext, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper rgbw effectSpeedUp
  commandsV6.rgbw.constructor.prototype.effectSpeedUp = _.wrap(commandsV6.rgbw.effectSpeedUp, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper rgbw effectSpeedDown
  commandsV6.rgbw.constructor.prototype.effectSpeedDown = _.wrap(commandsV6.rgbw.effectSpeedDown, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper rgbw link
  commandsV6.rgbw.constructor.prototype.link = _.wrap(commandsV6.rgbw.link, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper rgbw unlink
  commandsV6.rgbw.constructor.prototype.unlink = _.wrap(commandsV6.rgbw.unlink, function(func, options) {
    return func(options.numberZone);
  });

  /* --------------------------------------------------------- Additional Function rgbw ------------------------------------------------- */

  commandsV6.rgbw.constructor.prototype.onoff = function(options) {
    const _dcs = options.dcs;
    const _idOn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'on');
    const _idOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'off');

    if (options.val === true || options.val === 1) {
      Promise.all([adapter.setStateAsync(_idOn, true, true), adapter.setStateAsync(_idOff, false, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:rgbw:onoff->' + err.message);
      });

      return this.on(null, options.numberZone);
    }
    else {
      Promise.all([adapter.setStateAsync(_idOn, false, true), adapter.setStateAsync(_idOff, true, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:rgbw:onoff->' + err.message);
      });

      return this.off(null, options.numberZone);
    }
  };

  /* ------------------------------------------------------------- Wrapper fullColor ------------------------------------------------------------- */

  // wrapper fullColor on
  commandsV6.fullColor.constructor.prototype.on = _.wrap(commandsV6.fullColor.on, function(func, options, ...argv) {
    if (options === null) {
      return func(argv[0]);
    }

    const _dcs = options.dcs;
    const _idOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'off');
    const _idOnOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'onoff');

    if (options.val === true || options.val === 1) {
      Promise.all([adapter.setStateAsync(_idOff, false, true), adapter.setStateAsync(_idOnOff, true, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:fullColor:on->' + err.message);
      });

      return func(options.numberZone);
    }
    else {
      Promise.all([adapter.setStateAsync(_idOff, true, true), adapter.setStateAsync(_idOnOff, false, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:fullColor:on->' + err.message);
      });

      return this.off(null, options.numberZone);
    }
  });

  // wrapper fullColor off
  commandsV6.fullColor.constructor.prototype.off = _.wrap(commandsV6.fullColor.off, function(func, options, ...argv) {
    if (options === null) {
      return func(argv[0]);
    }

    const _dcs = options.dcs;
    const _idOn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'on');
    const _idOnOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'onoff');

    if (options.val === true || options.val === 1) {
      Promise.all([adapter.setStateAsync(_idOn, false, true), adapter.setStateAsync(_idOnOff, false, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:fullColor:off->' + err.message);
      });

      return func(options.numberZone);
    }
    else {
      Promise.all([adapter.setStateAsync(_idOn, true, true), adapter.setStateAsync(_idOnOff, true, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:fullColor:off->' + err.message);
      });

      return this.on(null, options.numberZone);
    }
  });

  // wrapper fullColor whiteMode
  commandsV6.fullColor.constructor.prototype.whiteMode = _.wrap(commandsV6.fullColor.whiteMode, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper fullColor whiteTemperature
  commandsV6.fullColor.constructor.prototype.whiteTemperature = _.wrap(commandsV6.fullColor.whiteTemperature, function(func, options) {
    return func(options.numberZone, _.parseInt(options.val));
  });

  // wrapper fullColor nightMode
  commandsV6.fullColor.constructor.prototype.nightMode = _.wrap(commandsV6.fullColor.nightMode, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper fullColor brightness
  commandsV6.fullColor.constructor.prototype.brightness = _.wrap(commandsV6.fullColor.brightness, function(func, options, ...argv) {
    if (typeof options !== 'object') {
      return func(options, _.parseInt(argv[0])); // entspricht return func(zone, brightness) -> Aufruf aus prototype.rgb
    }

    const _dcs = options.dcs;

    const _idHue = adapter._DCS2ID(_dcs.device, _dcs.channel, 'hue');
    const _idSt = adapter._DCS2ID(_dcs.device, _dcs.channel, 'saturation');
    const _idRgb = adapter._DCS2ID(_dcs.device, _dcs.channel, 'rgb');

    Promise.all([adapter.getStateAsync(_idHue), adapter.getStateAsync(_idSt)]).then(function(res) {
      adapter.setStateAsync(_idRgb, mslhelper.hsvToRgb(res[0].val, res[1].val, _.parseInt(options.val)), true);
    }).catch(function(err) {
      adapter.log.error('commandsV6:wrapper:fullColor:brightness->' + err.message);
    });

    return func(options.numberZone, _.parseInt(options.val));
  });

  // wrapper fullColor saturation
  commandsV6.fullColor.constructor.prototype.saturation = _.wrap(commandsV6.fullColor.saturation, function(func, options, ...argv) {
    if (typeof options !== 'object') {
      return func(options, _.parseInt(argv[0]), argv[1]); // entspricht return func(zone, saturation, true) -> Aufruf aus prototype.rgb
    }

    const _dcs = options.dcs;

    const _idHue = adapter._DCS2ID(_dcs.device, _dcs.channel, 'hue');
    const _idBn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'brightness');
    const _idRgb = adapter._DCS2ID(_dcs.device, _dcs.channel, 'rgb');

    Promise.all([adapter.getStateAsync(_idHue), adapter.getStateAsync(_idBn)]).then(function(res) {
      adapter.setStateAsync(_idRgb, mslhelper.hsvToRgb(res[0].val, _.parseInt(options.val), res[1].val), true);
    }).catch(function(err) {
      adapter.log.error('commandsV6:wrapper:fullColor:saturation->' + err.message);
    });

    return func(options.numberZone, _.parseInt(options.val), true);
  });

  // wrapper fullColor hue
  commandsV6.fullColor.constructor.prototype.hue = _.wrap(commandsV6.fullColor.hue, function(func, options, ...argv) {
    if (typeof options !== 'object') {
      return func(options, _.parseInt(argv[0]), argv[1]); // entspricht return func(zone, hue, true) -> Aufruf aus prototype.rgb
    }

    const milightHue = (256 + 176 - Math.floor(Number(options.val) / 360.0 * 255.0)) % 256;

    const _dcs = options.dcs;

    const _idSt = adapter._DCS2ID(_dcs.device, _dcs.channel, 'saturation');
    const _idBn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'brightness');
    const _idRgb = adapter._DCS2ID(_dcs.device, _dcs.channel, 'rgb');

    Promise.all([adapter.getStateAsync(_idSt), adapter.getStateAsync(_idBn)]).then(function(res) {
      adapter.setStateAsync(_idRgb, mslhelper.hsvToRgb(_.parseInt(options.val), res[0].val, res[1].val), true);
    }).catch(function(err) {
      adapter.log.error('commandsV6:wrapper:fullColor:hue->' + err.message);
    });

    return func(options.numberZone, milightHue, true);
  });

  // Wrapper fullColor rgb
  commandsV6.fullColor.constructor.prototype.rgb = _.wrap(commandsV6.fullColor.rgb, function(func, options) {
    const _rgb = _.map(_.words(options.val, /[0-9A-F]{2}/gi), function(val) { // TODO: Funktionsprüfung
      return _.parseInt(val, 16);
    });

    const hsv = mslhelper.rgbToHsv(_rgb[0], _rgb[1], _rgb[2]);
    const hue = hsv[0];
    const saturation = hsv[1];
    const brightness = hsv[2];

    const _dcs = options.dcs;

    const _idHue = adapter._DCS2ID(_dcs.device, _dcs.channel, 'hue');
    const _idSt = adapter._DCS2ID(_dcs.device, _dcs.channel, 'saturation');
    const _idBn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'brightness');

    Promise.all([adapter.setStateAsync(_idHue, hue, true), adapter.setStateAsync(_idSt, saturation, true), adapter.setStateAsync(_idBn, brightness, true)]).
        catch(function(err) {
          adapter.log.error('commandsV6:wrapper:fullColor:rgb->' + err.message);
        });

    return func.call(commandsV6.fullColor, options.numberZone, _rgb[0], _rgb[1], _rgb[2]);
  });

  // wrapper fullColor effectMode
  commandsV6.fullColor.constructor.prototype.effectMode = _.wrap(commandsV6.fullColor.effectMode, function(func, options) {
    return func(options.numberZone, options.val);
  });

  // wrapper fullColor effectModeNext
  commandsV6.fullColor.constructor.prototype.effectModeNext = _.wrap(commandsV6.fullColor.effectModeNext, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper fullColor effectSpeedUp
  commandsV6.fullColor.constructor.prototype.effectSpeedUp = _.wrap(commandsV6.fullColor.effectSpeedUp, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper fullColor effectSpeedDown
  commandsV6.fullColor.constructor.prototype.effectSpeedDown = _.wrap(commandsV6.fullColor.effectSpeedDown, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper fullColor link
  commandsV6.fullColor.constructor.prototype.link = _.wrap(commandsV6.fullColor.link, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper fullColor unlink
  commandsV6.fullColor.constructor.prototype.unlink = _.wrap(commandsV6.fullColor.unlink, function(func, options) {
    return func(options.numberZone);
  });

  /* --------------------------------------------------------- Additional Function fullColor-------------------------------------------------- */

  commandsV6.fullColor.constructor.prototype.onoff = function(options) {
    const _dcs = options.dcs;
    const _idOn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'on');
    const _idOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'off');

    if (options.val === true || options.val === 1) {
      Promise.all([adapter.setStateAsync(_idOn, true, true), adapter.setStateAsync(_idOff, false, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:fullColor:onoff->' + err.message);
      });

      return this.on(null, options.numberZone);
    }
    else {
      Promise.all([adapter.setStateAsync(_idOn, false, true), adapter.setStateAsync(_idOff, true, true)]).catch(function(err) {
        adapter.log.error('commandsV6:wrapper:fullColor:onoff->' + err.message);
      });

      return this.off(null, options.numberZone);
    }
  };

  /* ------------------------------------------------------------- Wrapper white ------------------------------------------------------------- */

  // wrapper white on
  commandsV6.white.constructor.prototype.on = _.wrap(commandsV6.white.on, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper white off
  commandsV6.white.constructor.prototype.off = _.wrap(commandsV6.white.off, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper white brightUp
  commandsV6.white.constructor.prototype.brightUp = _.wrap(commandsV6.white.brightUp, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper white brightDown
  commandsV6.white.constructor.prototype.brightDown = _.wrap(commandsV6.white.brightDown, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper white maxBright
  commandsV6.white.constructor.prototype.maxBright = _.wrap(commandsV6.white.maxBright, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper white nightMode
  commandsV6.white.constructor.prototype.nightMode = _.wrap(commandsV6.white.nightMode, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper white warmer
  commandsV6.white.constructor.prototype.warmer = _.wrap(commandsV6.white.warmer, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper white cooler
  commandsV6.white.constructor.prototype.cooler = _.wrap(commandsV6.white.cooler, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper white link
  commandsV6.white.constructor.prototype.link = _.wrap(commandsV6.white.link, function(func, options) {
    return func(options.numberZone);
  });

  // wrapper white unlink
  commandsV6.white.constructor.prototype.unlink = _.wrap(commandsV6.white.unlink, function(func, options) {
    return func(options.numberZone);
  });

  return commandsV6;
}

module.exports = mslcommandsV6;
