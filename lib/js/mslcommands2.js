'use strict'

const path = require ('path')
const _ = require ('lodash')
const commands2 = require ('node-milight-promise').commands2
const mslhelper = require (path.join (__dirname, 'mslhelper'))
const convert = require ('color-convert')

function mslcommands2 (adapter, mslStatestore) {
  /* ------------------------------------------------------------- Wrapper rgbw ------------------------------------------------------------- */

  // wrapper rgbw on
  commands2.rgbw.constructor.prototype.on = _.wrap (commands2.rgbw.on, function (func, options) {
    if (typeof options !== 'object') {
      return func (options)
    }

    const _idRgb = options.channelPath + 'rgb'

    const _idOn = options.channelPath + 'on'
    const _idOff = options.channelPath + 'off'
    const _idOnOff = options.channelPath + 'onoff'

    if (options.val === false) {
      options.val = true
      mslStatestore.setState ({ dp: 'off', val: true, params: options })

      return this.off (options)
    }

    mslStatestore.setState ({ dp: 'off', val: false, params: options })
    mslStatestore.setState ({ dp: 'onoff', val: true, params: options })

    let _brightness = mslStatestore.getState (options.fullChannelPath + 'brightness')

    _brightness = ( _brightness.val > 0 ? _brightness.val : ( _brightness.oldVal > 0 ? _brightness.oldVal : 100 ) )

    mslStatestore.setState ({ dp: 'brightness', val: _brightness, params: options })

    return [
      func (options.mslZoneNumber),
      ...this.rgb (options)
    ]
  })

  // wrapper rgbw off
  commands2.rgbw.constructor.prototype.off = _.wrap (commands2.rgbw.off, function (func, options) {
    if (typeof options !== 'object') {
      return func (options)
    }

    const _idRgb = options.channelPath + 'rgb'

    const _idOn = options.channelPath + 'on'
    const _idOff = options.channelPath + 'off'
    const _idOnOff = options.channelPath + 'onoff'

    if (options.val === false) {
      options.val = true
      mslStatestore.setState ({ dp: 'on', val: true, params: options })

      return this.on (options)
    }

    mslStatestore.setState ({ dp: 'on', val: false, params: options })
    mslStatestore.setState ({ dp: 'onoff', val: false, params: options })

    mslStatestore.setState ({ dp: 'rgb', val: '#000000', params: options })

    return [
      func (options.mslZoneNumber), ...this.rgb (options)
    ]
  })

  // wrapper rgbw allOn -> in mslstate.js nicht aktiviert!
  commands2.rgbw.constructor.prototype.allOn = _.wrap (commands2.rgbw.allOn, function (func) {
    return func ()
  })

  // wrapper rgbw allOff -> in mslstate.js nicht aktiviert!
  commands2.rgbw.constructor.prototype.allOff = _.wrap (commands2.rgbw.allOff, function (func) {
    return func ()
  })

  // wrapper rgbw whiteMode
  commands2.rgbw.constructor.prototype.whiteMode = _.wrap (commands2.rgbw.whiteMode, function (func, options) {
    if (typeof options !== 'object') {
      return func (options)
    }

    const _idRgb = options.channelPath + 'rgb'

    let _brightness = mslStatestore.getState (options.fullChannelPath + 'brightness')

    _brightness = ( _brightness.val > 0 ? _brightness.val : ( _brightness.oldVal > 0 ? _brightness.oldVal : 100 ) )

    mslStatestore.setState ({ dp: 'brightness', val: _brightness, params: options })
    mslStatestore.setState ({ dp: 'saturation', val: 0, params: options })

    return this.rgb (options)
  })

  // wrapper rgbw nightMode
  commands2.rgbw.constructor.prototype.nightMode = _.wrap (commands2.rgbw.nightMode, function (func, options) {
    const _idOn = options.channelPath + 'on'
    const _idOff = options.channelPath + 'off'
    const _idOnOff = options.channelPath + 'onoff'

    if (mslStatestore.getState (options.fullChannelPath + 'on').val === true) {
      mslStatestore.setState ({ dp: 'on', val: false, params: options })
      mslStatestore.setState ({ dp: 'off', val: true, params: options })
      mslStatestore.setState ({ dp: 'onoff', val: false, params: options })
    }

    return func (options.mslZoneNumber)
  })

  // wrapper rgbw brightness2 -> in mslstate.js nicht aktiviert!
  commands2.rgbw.constructor.prototype.brightness2 = _.wrap (commands2.rgbw.brightness2, function (func, options) {
    if (typeof options !== 'object') {
      return func (_.parseInt (options))
    }

    return this.rgb (options)
  })

  // wrapper rgbw brightness
  commands2.rgbw.constructor.prototype.brightness = _.wrap (commands2.rgbw.brightness, function (func, options) {
    if (typeof options !== 'object') {
      return func (_.parseInt (options))
    }

    return this.rgb (options)
  })

  // wrapper rgbw hue
  commands2.rgbw.constructor.prototype.hue = _.wrap (commands2.rgbw.hue, function (func, options) {
    if (typeof options !== 'object') {
      return func (_.parseInt (options))
    }

    return this.rgb (options)
  })

  // Wrapper rgbw rgb255 -> rgb255 !!!
  commands2.rgbw.constructor.prototype.rgb = _.wrap (commands2.rgbw.rgb255, function (func, options) {
    const _hue = mslStatestore.getState (options.fullChannelPath + 'hue')
    const _saturation = mslStatestore.getState (options.fullChannelPath + 'saturation')
    const _brightness = mslStatestore.getState (options.fullChannelPath + 'brightness')

    const _idOn = options.channelPath + 'on'
    const _idOff = options.channelPath + 'off'
    const _idOnOff = options.channelPath + 'onoff'

    const _idHue = options.channelPath + 'hue'
    const _idBn = options.channelPath + 'brightness'

    let _on = []

    if (_brightness.val === 0) {
      if (mslStatestore.getState (options.fullChannelPath + 'on').val === true) {
        mslStatestore.setState ({ dp: 'on', val: false, params: options })
        mslStatestore.setState ({ dp: 'off', val: true, params: options })
        mslStatestore.setState ({ dp: 'onoff', val: false, params: options })
      }

      return this.off (options.mslZoneNumber)
    }

    if (mslStatestore.getState (options.fullChannelPath + 'on').val === false) {

      mslStatestore.setState ({ dp: 'on', val: true, params: options })
      mslStatestore.setState ({ dp: 'off', val: false, params: options })
      mslStatestore.setState ({ dp: 'onoff', val: true, params: options })

      _on.push (...this.on (options.mslZoneNumber))
    }

    if (_saturation.val === 0) {
      return [
        _on,
        this.whiteMode (options.mslZoneNumber),
        this.brightness (_brightness.val)
      ]
    }

    const _rgb = convert.hex.rgb (mslStatestore.getState (options.fullChannelPath + 'rgb').val) // eventuell optimieren

    return [
      _on,
      ...func.call (commands2.rgbw, _rgb[ 0 ], _rgb[ 1 ], _rgb[ 2 ])
    ]
  })

  // wrapper rgbw effectModeNext
  commands2.rgbw.constructor.prototype.effectModeNext = _.wrap (commands2.rgbw.effectModeNext, function (func, options) {
    return [
      ...func (),
      this.brightnessOnly (options.mslZoneNumber, mslStatestore.getState(options.fullChannelPath + 'brightnessOnly').val)
    ]
  })

  // wrapper rgbw effectSpeedUp
  commands2.rgbw.constructor.prototype.effectSpeedUp = _.wrap (commands2.rgbw.effectSpeedUp, function (func, options) {
    return func ()
  })

  // wrapper rgbw effectSpeedDown
  commands2.rgbw.constructor.prototype.effectSpeedDown = _.wrap (commands2.rgbw.effectSpeedDown, function (func, options) {
    return func ()
  })

  /* --------------------------------------------------------- Additional Function rgbw ------------------------------------------------- */

  commands2.rgbw.constructor.prototype.onoff = function (options) {
    const _idOn = options.channelPath + 'on'
    const _idOff = options.channelPath + 'off'

    if (options.val === true) {
      mslStatestore.setState ({ dp: 'on', val: true, params: options })

      return this.on (options)
    }
    else {
      options.val = true
      mslStatestore.setState ({ dp: 'off', val: true, params: options })

      return this.off (options)
    }
  }

  // rgbw brightnessOnly
  commands2.rgbw.constructor.prototype.brightnessOnly = function (options) {
    if (typeof options !== 'object') {
      return this.brightness (_.parseInt (options))
    }

    return this.brightness (options.val)
  }

  /* ------------------------------------------------------------- Wrapper white ------------------------------------------------------------- */

  // wrapper white on
  commands2.white.constructor.prototype.on = _.wrap (commands2.white.on, function (func, options) {
    if (typeof options !== 'object') {
      return func (options)
    }

    const _idOn = options.channelPath + 'on'
    const _idOff = options.channelPath + 'off'
    const _idOnOff = options.channelPath + 'onoff'


    if (options.val === false) {
      options.val = true
      mslStatestore.setState({ dp: 'off', val: true, params: options })

      return this.off (options)
    }

    mslStatestore.setState({ dp: 'off', val: false, params: options })
    mslStatestore.setState({ dp: 'onoff', val: true, params: options })

    return func (options.mslZoneNumber)
  })

  // wrapper white off
  commands2.white.constructor.prototype.off = _.wrap (commands2.white.off, function (func, options) {
    if (typeof options !== 'object') {
      return func (options)
    }

    const _idOn = options.channelPath + 'on'
    const _idOff = options.channelPath + 'off'
    const _idOnOff = options.channelPath + 'onoff'

    if (options.val === false) {
      options.val = true
      mslStatestore.setState({ dp: 'on', val: true, params: options })

      return this.on (options)
    }

    mslStatestore.setState({ dp: 'on', val: false, params: options })
    mslStatestore.setState({ dp: 'onoff', val: false, params: options })

    return func (options.mslZoneNumber)
  })

  // wrapper white brightUp
  commands2.white.constructor.prototype.brightUp = _.wrap (commands2.white.brightUp, function (func) {
    return func ()
  })

  // wrapper white brightDown
  commands2.white.constructor.prototype.brightDown = _.wrap (commands2.white.brightDown, function (func) {
    return func ()
  })

  // wrapper white maxBright
  commands2.white.constructor.prototype.maxBright = _.wrap (commands2.white.maxBright, function (func, options) {
    const _idOn = options.channelPath + 'on'
    const _idOff = options.channelPath + 'off'
    const _idOnOff = options.channelPath + 'onoff'

    if (mslStatestore.getState(options.fullChannelPath + 'off').val === true) {
      mslStatestore.setState({ dp: 'on', val: true, params: options })
      mslStatestore.setState({ dp: 'off', val: false, params: options })
      mslStatestore.setState({ dp: 'onoff', val: true, params: options })
    }

    return func (options.mslZoneNumber)
  })

  // wrapper white nightMode
  commands2.white.constructor.prototype.nightMode = _.wrap (commands2.white.nightMode, function (func, options) {
    const _idOn = options.channelPath + 'on'
    const _idOff = options.channelPath + 'off'
    const _idOnOff = options.channelPath + 'onoff'

    if (mslStatestore.getState(options.fullChannelPath + 'on').val === true) {
      mslStatestore.setState({ dp: 'on', val: false, params: options })
      mslStatestore.setState({ dp: 'off', val: true, params: options })
      mslStatestore.setState({ dp: 'onoff', val: false, params: options })
    }

    return func (options.mslZoneNumber)
  })

  // wrapper white warmer
  commands2.white.constructor.prototype.warmer = _.wrap (commands2.white.warmer, function (func) {
    return func ()
  })

  // wrapper white cooler
  commands2.white.constructor.prototype.cooler = _.wrap (commands2.white.cooler, function (func) {
    return func ()
  })

  /* --------------------------------------------------------- Additional Function white -------------------------------------------------- */

  // white onoff
  commands2.white.constructor.prototype.onoff = function (options) {
    const _idOn = options.channelPath + 'on'
    const _idOff = options.channelPath + 'off'

    if (options.val === true) {
      mslStatestore.setState({ dp: 'on', val: true, params: options })

      return this.on (options)
    }
    else {
      options.val = true
      mslStatestore.setState({ dp: 'off', val: true, params: options })

      return this.off (options)
    }
  }
  /* --------------------------------------------------------------------------------------------------------------------------------------- */

  return commands2
}

module.exports = mslcommands2
