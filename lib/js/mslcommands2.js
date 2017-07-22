'use strict'; // jscs:ignore validateLineBreaks

const Promise = require('bluebird'); // jshint ignore:line
const _ = require('lodash');

const commands2 = require('node-milight-promise').commands2;
const mslhelper = require('./mslhelper');

function mslcommands2(adapter) {
  /* ------------------------------------------------------------- Wrapper rgbw ------------------------------------------------------------- */

  // wrapper rgbw on
  commands2.rgbw.constructor.prototype.on = _.wrap(commands2.rgbw.on, function (func, options, ...argv) {
        if (options === null) {
          return func(argv[0]);
        }

        return func(options.numberZone);
      });

  // wrapper rgbw off
  commands2.rgbw.constructor.prototype.off = _.wrap(commands2.rgbw.off, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper rgbw allOn
  commands2.rgbw.constructor.prototype.allOn = _.wrap(commands2.rgbw.allOn, function (func, options) {
    return func();
  });

  // wrapper rgbw allOff
  //noinspection JSUnusedLocalSymbols
  commands2.rgbw.constructor.prototype.allOff = _.wrap(commands2.rgbw.allOff, function (func, options) {
    return func();
  });

  // wrapper rgbw whiteMode
  commands2.rgbw.constructor.prototype.whiteMode = _.wrap(commands2.rgbw.whiteMode, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper rgbw nightMode
  commands2.rgbw.constructor.prototype.nightMode = _.wrap(commands2.rgbw.nightMode, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper rgbw brightness2
  commands2.rgbw.constructor.prototype.brightness2 = _.wrap(commands2.rgbw.brightness2, function (func, options, ...argv) {
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
      adapter.log.error('commands2:wrapper:rgbw:brightness->' + err.message);
    });

    return func(_.parseInt(options.val));
  });

  // wrapper rgbw brightness
  commands2.rgbw.constructor.prototype.brightness = _.wrap(commands2.rgbw.brightness, function (func, options) {
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
      adapter.log.error('commands2:wrapper:rgbw:brightness->' + err.message);
    });

    return func(_.parseInt(options.val));
  });

  // wrapper rgbw hue
  commands2.rgbw.constructor.prototype.hue = _.wrap(commands2.rgbw.hue, function (func, options) {
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
      adapter.log.error('commands2:wrapper:rgbw:hue->' + err.message);
    });

    return func(milightHue);
  });

  // Wrapper rgbw rgb255 -> rgb255 !!!
  commands2.rgbw.constructor.prototype.rgb = _.wrap(commands2.rgbw.rgb255, function (func, options) {
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
      adapter.log.error('commands2:wrapper:rgbw:rgb->' + err.message);
    });

    //return [commands2.rgbw.on(null, options.numberZone),
    //  _.flattenDepth(func.call(commands2.rgbw, _rgb[0], _rgb[1], _rgb[2]), 1)];

    return func.call(commands2.rgbw, _rgb[0], _rgb[1], _rgb[2]);
  });

  // wrapper rgbw effectModeNext
  commands2.rgbw.constructor.prototype.effectModeNext = _.wrap(commands2.rgbw.effectModeNext, function (func, options) {
    return func();
  });

  // wrapper rgbw effectSpeedUp
  commands2.rgbw.constructor.prototype.effectSpeedUp = _.wrap(commands2.rgbw.effectSpeedUp, function (func, options) {
    return func();
  });

  // wrapper rgbw effectSpeedDown
  commands2.rgbw.constructor.prototype.effectSpeedDown = _.wrap(commands2.rgbw.effectSpeedDown, function (func, options) {
    return func();
  });

  /* ------------------------------------------------------------- Wrapper white ------------------------------------------------------------- */

  // wrapper white on
  commands2.white.constructor.prototype.on = _.wrap(commands2.white.on, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper white off
  commands2.white.constructor.prototype.off = _.wrap(commands2.white.off, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper white brightUp
  commands2.white.constructor.prototype.brightUp = _.wrap(commands2.white.brightUp, function (func, options) {
    return func();
  });

  // wrapper white brightDown
  commands2.white.constructor.prototype.brightDown = _.wrap(commands2.white.brightDown, function (func, options) {
    return func();
  });

  // wrapper white maxBright
  commands2.white.constructor.prototype.maxBright = _.wrap(commands2.white.maxBright, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper white nightMode
  commands2.white.constructor.prototype.nightMode = _.wrap(commands2.white.nightMode, function (func, options) {
    return func(options.numberZone);
  });

  // wrapper white warmer
  commands2.white.constructor.prototype.warmer = _.wrap(commands2.white.warmer, function (func, options) {
    return func();
  });

  // wrapper white cooler
  commands2.white.constructor.prototype.cooler = _.wrap(commands2.white.cooler, function (func, options) {
    return func();
  });

  return commands2;
}

module.exports = mslcommands2;
