'use strict'

const _ = require ('lodash')
const convert = require ('color-convert')

function MslStatestore (adapter) {
  this.adapter = adapter
  this.state = new Object

  this.initState = function (options) {
    const fullChannelPath = options.params.fullChannelPath
    const zoneType = options.params.mslZoneType

    if((zoneType === 'rgbw' || zoneType === 'bridge') && options.dp === 'rgb'){
      const hsv = convert.hex.hsv (options.val)
      this._setValue({ id: fullChannelPath + 'saturation', val: hsv[1] }) //Fake id
    }

    this._setValue({ id: fullChannelPath + options.dp, val: options.val })
  }

  this.setState = function (options) {
    const dp = options.dp
    const fullChannelPath = options.params.fullChannelPath

    if(typeof options.val === 'string') {
      options.val = options.val.toLowerCase ()
    }

    this._setValue({ id: fullChannelPath + dp, val: options.val, ack: options.params.ack })
    options.params.ack = undefined // erforderlich für Quittung bei gleichem Wert für ein State


    if (dp === 'rgb') {
      if(options.val === '#000000') {
        this._setValue({ id: fullChannelPath + 'brightness', val: 0 })

        return
      }

      const hsv = convert.hex.hsv (options.val)

      this._setValue({ id: fullChannelPath + 'hue', val: hsv[0] })
      this._setValue({ id: fullChannelPath + 'saturation', val: hsv[ 1 ] })
      this._setValue({ id: fullChannelPath + 'brightness', val: hsv[ 2 ] })

      return
    }

    if(dp === 'saturation') {
      const rgb = convert.hsv.hex(this.getState(fullChannelPath + 'hue').val, options.val, this.getState(fullChannelPath + 'brightness').val)
      this._setValue({ id: fullChannelPath + 'rgb', val: '#' + rgb.toLowerCase() })

      return
    }

    if(dp === 'hue') {
      const rgb = convert.hsv.hex(options.val, this.getState(fullChannelPath + 'saturation').val ,this.getState(fullChannelPath + 'brightness').val)
      this._setValue({ id: fullChannelPath + 'rgb', val: '#' + rgb.toLowerCase() })

      return
    }

    if(dp === 'brightness') {
      const rgb = convert.hsv.hex(this.getState(fullChannelPath + 'hue').val, this.getState(fullChannelPath + 'saturation').val ,options.val)
      this._setValue({ id: fullChannelPath + 'rgb', val: '#' + rgb.toLowerCase() })

      return
    }
  }

  this._setValue = function(options) {
    this.state[ options.id ] = {
      oldVal: this.state[ options.id ] === undefined ? options.val : this.state[ options.id ].val,
      val: options.val
    }

    if(options.val !== this.state[ options.id ].oldVal || options.ack === false) {
      adapter.setStateAsync (options.id, options.val, true).then(() => adapter.log.debug('_setVal->setStateAsync->::' + options.id + '::' + options.val))
    }
  }

  this.getState = function(id) {
    return this.state[id]
  }

}

module.exports = MslStatestore
