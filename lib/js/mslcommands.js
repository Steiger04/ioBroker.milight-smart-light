'use strict'; // jscs:ignore validateLineBreaks

const Promise = require('bluebird'); // jshint ignore:line
const _ = require('lodash');

const commands = require('node-milight-promise').commands;
const mslhelper = require('./mslhelper');

function mslcommands(adapter) {
  /* ------------------------------------------------------------- Wrapper rgbw ------------------------------------------------------------- */

  // wrapper rgbw on
  commands.rgbw.constructor.prototype.on = _.wrap(commands.rgbw.on, function (func, options, ...argv) {
    if (options === null) {
      return func(argv[0]);
    }

    const _dcs = options.dcs;
    const _idOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'off');
    const _idOnOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'onoff');

    if (options.val === true || options.val === 1) {
      Promise.all([adapter.setStateAsync(_idOff, false, true), adapter.setStateAsync(_idOnOff, true, true)]).catch(function (err) {
        adapter.log.error('commands:wrapper:rgbw:on->' + err.message);
      });

      return func(options.numberZone);
    } else {
      Promise.all([adapter.setStateAsync(_idOff, true, true), adapter.setStateAsync(_idOnOff, false, true)]).catch(function (err) {
        adapter.log.error('commands:wrapper:rgbw:on->' + err.message);
      });

      return this.off(null, options.numberZone);
    }
  });

  // wrapper rgbw off
  commands.rgbw.constructor.prototype.off = _.wrap(commands.rgbw.off, function (func, options, ...argv) {
    if (options === null) {
      return func(argv[0]);
    }

    const _dcs = options.dcs;
    const _idOn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'on');
    const _idOnOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'onoff');

    if (options.val === true || options.val === 1) {
      Promise.all([adapter.setStateAsync(_idOn, false, true), adapter.setStateAsync(_idOnOff, false, true)]).catch(function (err) {
        adapter.log.error('commands:wrapper:rgbw:off->' + err.message);
      });

      return func(options.numberZone);
    } else {
      Promise.all([adapter.setStateAsync(_idOn, true, true), adapter.setStateAsync(_idOnOff, true, true)]).catch(function (err) {
        adapter.log.error('commands:wrapper:rgbw:off->' + err.message);
      });

      return this.on(null, options.numberZone);
    }
  });

  // wrapper rgbw allOn
  commands.rgbw.constructor.prototype.allOn = _.wrap(commands.rgbw.allOn, function (func, options) {
    return func();
  });

  // wrapper rgbw allOff
  //noinspection JSUnusedLocalSymbols
  commands.rgbw.constructor.prototype.allOff = _.wrap(commands.rgbw.allOff, function (func, options) {
    return func();
  });

  // wrapper rgbw whiteMode
  commands.rgbw.constructor.prototype.whiteMode = _.wrap(commands.rgbw.whiteMode, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper rgbw nightMode
  commands.rgbw.constructor.prototype.nightMode = _.wrap(commands.rgbw.nightMode, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper rgbw brightness2
  commands.rgbw.constructor.prototype.brightness2 = _.wrap(commands.rgbw.brightness2, function (func, options, ...argv) {
    if (typeof options !== 'object') {
      return func(options); // entspricht return func(brightness) -> Aufruf aus prototype.rgb
    }

    const _dcs = options.dcs;

    const _idRgb = adapter._DCS2ID(_dcs.device, _dcs.channel, 'rgb');

    adapter.getStateAsync(_idRgb).then(function (rgb) {
      const _rgb = _.map(_.words(rgb.val, /[0-9A-F]{2}/gi), function (val) { // TODO: Funktionsprüfung
        return _.parseInt(val, 16);
      });

      const _hsv = mslhelper.rgbToHsv(_rgb[0], _rgb[1], _rgb[2]);

      adapter.setStateAsync(_idRgb, mslhelper.hsvToRgb(_hsv[0], _hsv[1], _.parseInt(options.val)), true);
    }).catch(function (err) {
      adapter.log.error('commands:wrapper:rgbw:brightness->' + err.message);
    });

    return func(_.parseInt(options.val));
  });

  // wrapper rgbw brightness
  commands.rgbw.constructor.prototype.brightness = _.wrap(commands.rgbw.brightness, function (func, options) {
    if (typeof options !== 'object') {
      return func(options); // entspricht return func(brightness) -> Aufruf aus prototype.rgb
    }

    const _dcs = options.dcs;

    const _idRgb = adapter._DCS2ID(_dcs.device, _dcs.channel, 'rgb');

    adapter.getStateAsync(_idRgb).then(function (rgb) {
      const _rgb = _.map(_.words(rgb.val, /[0-9A-F]{2}/gi), function (val) { // TODO: Funktionsprüfung
        return _.parseInt(val, 16);
      });

      const _hsv = mslhelper.rgbToHsv(_rgb[0], _rgb[1], _rgb[2]);

      adapter.setStateAsync(_idRgb, mslhelper.hsvToRgb(_hsv[0], _hsv[1], _.parseInt(options.val)), true);
    }).catch(function (err) {
      adapter.log.error('commands:wrapper:rgbw:brightness->' + err.message);
    });

    return func(_.parseInt(options.val));
  });

  // wrapper rgbw hue
  commands.rgbw.constructor.prototype.hue = _.wrap(commands.rgbw.hue, function (func, options) {
    if (typeof options !== 'object') {
      return func(options); // entspricht return func(hue) -> Aufruf aus prototype.rgb
    }

    const milightHue = (256 + 176 - Math.floor(Number(options.val) / 360.0 * 255.0)) % 256;
    const _dcs = options.dcs;

    const _idRgb = adapter._DCS2ID(_dcs.device, _dcs.channel, 'rgb');

    adapter.getStateAsync(_idRgb).then(function (rgb) {
      const _rgb = _.map(_.words(rgb.val, /[0-9A-F]{2}/gi), function (val) { // TODO: Funktionsprüfung
        return _.parseInt(val, 16);
      });

      const _hsv = mslhelper.rgbToHsv(_rgb[0], _rgb[1], _rgb[2]);
      adapter.setStateAsync(_idRgb, mslhelper.hsvToRgb(_.parseInt(options.val), _hsv[1], _hsv[2]), true);
    }).catch(function (err) {
      adapter.log.error('commands:wrapper:rgbw:hue->' + err.message);
    });

    return func(milightHue);
  });

  // Wrapper rgbw rgb255 -> rgb255 !!!
  commands.rgbw.constructor.prototype.rgb = _.wrap(commands.rgbw.rgb255, function (func, options) {
    const _rgb = _.map(_.words(options.val, /[0-9A-F]{2}/gi), function (val) { // TODO: Funktionsprüfung
      return _.parseInt(val, 16);
    });

    const hsv = mslhelper.rgbToHsv(_rgb[0], _rgb[1], _rgb[2]);
    const hue = hsv[0];
    const brightness = hsv[2];

    const _dcs = options.dcs;

    const _idHue = adapter._DCS2ID(_dcs.device, _dcs.channel, 'hue');
    const _idBn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'brightness');

    Promise.all([adapter.setStateAsync(_idHue, hue, true), adapter.setStateAsync(_idBn, brightness, true)]).catch(function (err) {
      adapter.log.error('commands:wrapper:rgbw:rgb->' + err.message);
    });

    //return [commands.rgbw.on(null, options.numberZone),
    //  _.flattenDepth(func.call(commands.rgbw, _rgb[0], _rgb[1], _rgb[2]), 1)];

    return func.call(commands.rgbw, _rgb[0], _rgb[1], _rgb[2]);
  });

  // wrapper rgbw effectModeNext
  commands.rgbw.constructor.prototype.effectModeNext = _.wrap(commands.rgbw.effectModeNext, function (func, options) {
    return func();
  });

  // wrapper rgbw effectSpeedUp
  commands.rgbw.constructor.prototype.effectSpeedUp = _.wrap(commands.rgbw.effectSpeedUp, function (func, options) {
    return func();
  });

  // wrapper rgbw effectSpeedDown
  commands.rgbw.constructor.prototype.effectSpeedDown = _.wrap(commands.rgbw.effectSpeedDown, function (func, options) {
    return func();
  });

  /* --------------------------------------------------------- Additional Function rgbw ------------------------------------------------- */

  commands.rgbw.constructor.prototype.onoff = function (options) {
    const _dcs = options.dcs;
    const _idOn = adapter._DCS2ID(_dcs.device, _dcs.channel, 'on');
    const _idOff = adapter._DCS2ID(_dcs.device, _dcs.channel, 'off');

    if (options.val === true || options.val === 1) {
      Promise.all([adapter.setStateAsync(_idOn, true, true), adapter.setStateAsync(_idOff, false, true)]).catch(function (err) {
        adapter.log.error('commands:wrapper:rgbw:onoff->' + err.message);
      });

      return this.on(null, options.numberZone);
    } else {
      Promise.all([adapter.setStateAsync(_idOn, false, true), adapter.setStateAsync(_idOff, true, true)]).catch(function (err) {
        adapter.log.error('commands:wrapper:rgbw:onoff->' + err.message);
      });

      return this.off(null, options.numberZone);
    }
  };

  /* ------------------------------------------------------------- Wrapper white ------------------------------------------------------------- */

  // wrapper white on
  commands.white.constructor.prototype.on = _.wrap(commands.white.on, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper white off
  commands.white.constructor.prototype.off = _.wrap(commands.white.off, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper white brightUp
  commands.white.constructor.prototype.brightUp = _.wrap(commands.white.brightUp, function (func, options) {
    return func();
  });

  // wrapper white brightDown
  commands.white.constructor.prototype.brightDown = _.wrap(commands.white.brightDown, function (func, options) {
    return func();
  });

  // wrapper white maxBright
  commands.white.constructor.prototype.maxBright = _.wrap(commands.white.maxBright, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper white nightMode
  commands.white.constructor.prototype.nightMode = _.wrap(commands.white.nightMode, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper white warmer
  commands.white.constructor.prototype.warmer = _.wrap(commands.white.warmer, function (func, options) {
    return func();
  });

  // wrapper white cooler
  commands.white.constructor.prototype.cooler = _.wrap(commands.white.cooler, function (func, options) {
    return func();
  });

  return commands;
}

module.exports = mslcommands;
