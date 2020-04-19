'use strict';

const _ = require('lodash');
const commandsV6 = require('node-milight-promise').commandsV6;
const mslhelper = require('./mslhelper');
const tinycolor = require('tinycolor2');

function mslcommandsV6 (adapter, mslStatestore) {
    /* -------------------------------------------------------- Wrapper bridge (iBox1 ) -> wie rgbw -------------------------------------------------------- */

    // wrapper bridge on
    commandsV6.bridge.constructor.prototype.on = _.wrap(commandsV6.bridge.on, function (func, options) {
        if (typeof options !== 'object') {
            return func();
        }

        if (options.val === false) {
            options.val = true;
            mslStatestore.setState({ dp: 'off', val: true, params: options });

            return this.off(options);
        }

        mslStatestore.setState({ dp: 'off', val: false, params: options });
        mslStatestore.setState({ dp: 'onoff', val: true, params: options });

        let _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        _brightness = (_brightness.val > 0 ? _brightness.val : (_brightness.oldVal > 0
            ? _brightness.oldVal : 100));

        mslStatestore.setState({ dp: 'brightness', val: _brightness, params: options });

        return [
            func(),
            ...this.rgb(options)
        ];
    });

    // wrapper bridge off
    commandsV6.bridge.constructor.prototype.off = _.wrap(commandsV6.bridge.off, function (func, options) {
        if (typeof options !== 'object') {
            return func();
        }

        if (options.val === false) {
            options.val = true;
            mslStatestore.setState({ dp: 'on', val: true, params: options });

            return this.on(options);
        }

        mslStatestore.setState({ dp: 'on', val: false, params: options });
        mslStatestore.setState({ dp: 'onoff', val: false, params: options });

        mslStatestore.setState({ dp: 'rgb', val: '#000000', params: options });

        return [
            func(),
            ...this.rgb(options)
        ];
    });

    // wrapper bridge whiteMode
    commandsV6.bridge.constructor.prototype.whiteMode = _.wrap(commandsV6.bridge.whiteMode, function (func, options) {
        if (typeof options !== 'object') {
            return func();
        }

        let _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        _brightness = (_brightness.val > 0 ? _brightness.val : (_brightness.oldVal > 0
            ? _brightness.oldVal : 100));

        mslStatestore.setState({ dp: 'brightness', val: _brightness, params: options });
        mslStatestore.setState({ dp: 'saturation', val: 0, params: options });

        return this.rgb(options);
    });

    // wrapper bridge nightMode
    commandsV6.bridge.constructor.prototype.nightMode = _.wrap(commandsV6.bridge.nightMode, function (func, options) {
        if (mslStatestore.getState(options.fullChannelPath + 'on').val === true) {
            mslStatestore.setState({ dp: 'on', val: false, params: options });
            mslStatestore.setState({ dp: 'off', val: true, params: options });
            mslStatestore.setState({ dp: 'onoff', val: false, params: options });
        }

        return func();
    });

    // wrapper bridge brightness
    commandsV6.bridge.constructor.prototype.brightness = _.wrap(commandsV6.bridge.brightness, function (func, options) {
        if (typeof options !== 'object') {
            return func(_.parseInt(options));
        }

        return this.rgb(options);
    });

    // wrapper bridge hue
    commandsV6.bridge.constructor.prototype.hue = _.wrap(commandsV6.bridge.hue, function (func, options, ...argv) {
        if (typeof options !== 'object') {
            return func(_.parseInt(options), argv[0]);
        }

        return this.rgb(options);
    });

    // Wrapper bridge rgb
    commandsV6.bridge.constructor.prototype.rgb = _.wrap(commandsV6.bridge.rgb, function (func, options) {
        const _saturation = mslStatestore.getState(options.fullChannelPath + 'saturation');
        const _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        const _on = [];

        if (_brightness.val === 0) {
            if (mslStatestore.getState(options.fullChannelPath + 'on').val === true) {
                mslStatestore.setState({ dp: 'on', val: false, params: options });
                mslStatestore.setState({ dp: 'off', val: true, params: options });
                mslStatestore.setState({ dp: 'onoff', val: false, params: options });
            }

            return this.off();
        }

        if (mslStatestore.getState(options.fullChannelPath + 'on').val === false) {
            mslStatestore.setState({ dp: 'on', val: true, params: options });
            mslStatestore.setState({ dp: 'off', val: false, params: options });
            mslStatestore.setState({ dp: 'onoff', val: true, params: options });

            _on.push(...this.on());
        }

        if (_saturation.val === 0) {
            return [
                _on,
                this.whiteMode(),
                this.brightness(_brightness.val)
            ];
        }

        const _rgb = tinycolor(mslStatestore.getState(options.fullChannelPath + 'rgb').val).toRgb(); // eventuell optimieren

        return [
            _on,
            func.call(commandsV6.bridge, _rgb.r, _rgb.g, _rgb.b),
            this.brightness(_brightness.val)
        ];
    });

    // wrapper bridge effectMode
    commandsV6.bridge.constructor.prototype.effectMode = _.wrap(commandsV6.bridge.effectMode, function (func, options) {
        return [
            func(options.val),
            this.brightnessOnly(mslStatestore.getState(options.fullChannelPath + 'brightnessOnly').val)
        ];
    });

    // wrapper bridge effectModeNext
    commandsV6.bridge.constructor.prototype.effectModeNext = _.wrap(commandsV6.bridge.effectModeNext, function (func, options) {
        return [
            func(),
            this.brightnessOnly(mslStatestore.getState(options.fullChannelPath + 'brightnessOnly').val)
        ];
    });

    // wrapper bridge effectSpeedUp
    commandsV6.bridge.constructor.prototype.effectSpeedUp = _.wrap(commandsV6.bridge.effectSpeedUp, function (func) {
        return func();
    });

    // wrapper bridge effectSpeedDown
    commandsV6.bridge.constructor.prototype.effectSpeedDown = _.wrap(commandsV6.bridge.effectSpeedDown, function (func) {
        return func();
    });

    /* --------------------------------------------------------- Additional Function bridge ------------------------------------------------- */

    commandsV6.bridge.constructor.prototype.onoff = function (options) {
        if (options.val === true) {
            mslStatestore.setState({ dp: 'on', val: true, params: options });

            return this.on(options);
        } else {
            options.val = true;
            mslStatestore.setState({ dp: 'off', val: true, params: options });

            return this.off(options);
        }
    };

    // bridge brightnessOnly
    commandsV6.bridge.constructor.prototype.brightnessOnly = function (options) {
        if (typeof options !== 'object') {
            return this.brightness(options);
        }

        return this.brightness(options.val);
    };

    /* ------------------------------------------------------------- Wrapper rgbw ------------------------------------------------------------- */

    // wrapper rgbw on
    commandsV6.rgbw.constructor.prototype.on = _.wrap(commandsV6.rgbw.on, function (func, options) {
        if (typeof options !== 'object') {
            return func(options);
        }

        if (options.val === false) {
            options.val = true;
            mslStatestore.setState({ dp: 'off', val: true, params: options });

            return this.off(options);
        }

        mslStatestore.setState({ dp: 'off', val: false, params: options });
        mslStatestore.setState({ dp: 'onoff', val: true, params: options });

        let _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        _brightness = (_brightness.val > 0 ? _brightness.val : (_brightness.oldVal > 0
            ? _brightness.oldVal : 100));

        mslStatestore.setState({ dp: 'brightness', val: _brightness, params: options });

        return [
            func(options.mslZoneNumber),
            ...this.rgb(options)
        ];
    });

    // wrapper rgbw off
    commandsV6.rgbw.constructor.prototype.off = _.wrap(commandsV6.rgbw.off, function (func, options) {
        if (typeof options !== 'object') {
            return func(options);
        }

        if (options.val === false) {
            options.val = true;
            mslStatestore.setState({ dp: 'on', val: true, params: options });

            return this.on(options);
        }

        mslStatestore.setState({ dp: 'on', val: false, params: options });
        mslStatestore.setState({ dp: 'onoff', val: false, params: options });

        mslStatestore.setState({ dp: 'rgb', val: '#000000', params: options });

        return [
            func(options.mslZoneNumber),
            ...this.rgb(options)
        ];
    });

    // wrapper rgbw whiteMode
    commandsV6.rgbw.constructor.prototype.whiteMode = _.wrap(commandsV6.rgbw.whiteMode, function (func, options) {
        if (typeof options !== 'object') {
            return func(options);
        }

        let _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        _brightness = (_brightness.val > 0 ? _brightness.val : (_brightness.oldVal > 0
            ? _brightness.oldVal : 100));

        mslStatestore.setState({ dp: 'brightness', val: _brightness, params: options });
        mslStatestore.setState({ dp: 'saturation', val: 0, params: options });

        return this.rgb(options);
    });

    // wrapper rgbw nightMode
    commandsV6.rgbw.constructor.prototype.nightMode = _.wrap(commandsV6.rgbw.nightMode, function (func, options) {
        if (mslStatestore.getState(options.fullChannelPath + 'on').val === true) {
            mslStatestore.setState({ dp: 'on', val: false, params: options });
            mslStatestore.setState({ dp: 'off', val: true, params: options });
            mslStatestore.setState({ dp: 'onoff', val: false, params: options });
        }

        return func(options.mslZoneNumber);
    });

    // wrapper rgbw brightness
    commandsV6.rgbw.constructor.prototype.brightness = _.wrap(commandsV6.rgbw.brightness, function (func, options, ...argv) {
        if (typeof options !== 'object') {
            return func(options, _.parseInt(argv[0]));
        }

        return this.rgb(options);
    });

    // wrapper rgbw hue
    commandsV6.rgbw.constructor.prototype.hue = _.wrap(commandsV6.rgbw.hue, function (func, options, ...argv) {
        if (typeof options !== 'object') {
            return func(options, _.parseInt(argv[0]), argv[1]);
        }

        return this.rgb(options);
    });

    // Wrapper rgbw rgb
    commandsV6.rgbw.constructor.prototype.rgb = _.wrap(commandsV6.rgbw.rgb, function (func, options) {
        const _saturation = mslStatestore.getState(options.fullChannelPath + 'saturation');
        const _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        const _on = [];

        if (_brightness.val === 0) {
            if (mslStatestore.getState(options.fullChannelPath + 'on').val === true) {
                mslStatestore.setState({ dp: 'on', val: false, params: options });
                mslStatestore.setState({ dp: 'off', val: true, params: options });
                mslStatestore.setState({ dp: 'onoff', val: false, params: options });
            }

            return this.off(options.mslZoneNumber);
        }

        if (mslStatestore.getState(options.fullChannelPath + 'on').val === false) {
            mslStatestore.setState({ dp: 'on', val: true, params: options });
            mslStatestore.setState({ dp: 'off', val: false, params: options });
            mslStatestore.setState({ dp: 'onoff', val: true, params: options });

            _on.push(...this.on(options.mslZoneNumber));
        }

        if (_saturation.val === 0) {
            return [
                _on,
                this.whiteMode(options.mslZoneNumber),
                this.brightness(options.mslZoneNumber, _brightness.val)
            ];
        }

        const _rgb = tinycolor(mslStatestore.getState(options.fullChannelPath + 'rgb').val).toRgb(); // eventuell optimieren

        return [
            _on,
            func.call(commandsV6.rgbw, options.mslZoneNumber, _rgb.r, _rgb.g, _rgb.b),
            this.brightness(options.mslZoneNumber, _brightness.val)
        ];
    });

    // wrapper rgbw effectMode
    commandsV6.rgbw.constructor.prototype.effectMode = _.wrap(commandsV6.rgbw.effectMode, function (func, options) {
        return [
            func(options.mslZoneNumber, options.val),
            this.brightnessOnly(options.mslZoneNumber, mslStatestore.getState(options.fullChannelPath + 'brightnessOnly').val)
        ];
    });

    // wrapper rgbw effectModeNext
    commandsV6.rgbw.constructor.prototype.effectModeNext = _.wrap(commandsV6.rgbw.effectModeNext, function (func, options) {
        return [
            func(options.mslZoneNumber),
            this.brightnessOnly(options.mslZoneNumber, mslStatestore.getState(options.fullChannelPath + 'brightnessOnly').val)
        ];
    });

    // wrapper rgbw effectSpeedUp
    commandsV6.rgbw.constructor.prototype.effectSpeedUp = _.wrap(commandsV6.rgbw.effectSpeedUp, function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper rgbw effectSpeedDown
    commandsV6.rgbw.constructor.prototype.effectSpeedDown = _.wrap(commandsV6.rgbw.effectSpeedDown, function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper rgbw link
    commandsV6.rgbw.constructor.prototype.link = _.wrap(commandsV6.rgbw.link, function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper rgbw unlink
    commandsV6.rgbw.constructor.prototype.unlink = _.wrap(commandsV6.rgbw.unlink, function (func, options) {
        return func(options.mslZoneNumber);
    });

    /* --------------------------------------------------------- Additional Function rgbw ------------------------------------------------- */

    commandsV6.rgbw.constructor.prototype.onoff = function (options) {
        if (options.val === true) {
            mslStatestore.setState({ dp: 'on', val: true, params: options });

            return this.on(options);
        } else {
            options.val = true;
            mslStatestore.setState({ dp: 'off', val: true, params: options });

            return this.off(options);
        }
    };

    // rgbw brightnessOnly
    commandsV6.rgbw.constructor.prototype.brightnessOnly = function (options, ...argv) {
        if (typeof options !== 'object') {
            return this.brightness(options, argv[0]);
        }

        return this.brightness(options.mslZoneNumber, options.val);
    };

    /* ------------------------------------------------------------- Wrapper fullColor ------------------------------------------------------------- */

    // wrapper fullColor on
    commandsV6.fullColor.constructor.prototype.on = _.wrap(commandsV6.fullColor.on, function (func, options) {
        if (typeof options !== 'object') {
            return func(options);
        }

        if (options.val === false) {
            options.val = true;
            mslStatestore.setState({ dp: 'off', val: true, params: options });

            return this.off(options);
        }

        mslStatestore.setState({ dp: 'off', val: false, params: options });
        mslStatestore.setState({ dp: 'onoff', val: true, params: options });

        let _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        _brightness = (_brightness.val > 0 ? _brightness.val : (_brightness.oldVal > 0
            ? _brightness.oldVal : 100));

        mslStatestore.setState({ dp: 'brightness', val: _brightness, params: options });

        return [
            func(options.mslZoneNumber),
            ...this.rgb(options)
        ];
    });

    // wrapper fullColor off
    commandsV6.fullColor.constructor.prototype.off = _.wrap(commandsV6.fullColor.off, function (func, options) {
        if (typeof options !== 'object') {
            return func(options);
        }

        if (options.val === false) {
            options.val = true;
            mslStatestore.setState({ dp: 'on', val: true, params: options });

            return this.on(options);
        }

        mslStatestore.setState({ dp: 'on', val: false, params: options });
        mslStatestore.setState({ dp: 'onoff', val: false, params: options });

        mslStatestore.setState({ dp: 'rgb', val: '#000000', params: options });

        return [
            func(options.mslZoneNumber),
            ...this.rgb(options)
        ];
    });

    // wrapper fullColor whiteMode
    commandsV6.fullColor.constructor.prototype.whiteMode = _.wrap(commandsV6.fullColor.whiteMode, function (func, options) {
        if (typeof options !== 'object') {
            return func(options);
        }

        let _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        _brightness = (_brightness.val > 0 ? _brightness.val : (_brightness.oldVal > 0
            ? _brightness.oldVal : 100));

        mslStatestore.setState({ dp: 'brightness', val: _brightness, params: options });
        mslStatestore.setState({ dp: 'saturation', val: 0, params: options });

        mslStatestore.setState({ dp: 'whiteTemperature', val: 2700, params: options });

        return this.rgb(options);
    });

    // wrapper fullColor nightMode
    commandsV6.fullColor.constructor.prototype.nightMode = _.wrap(commandsV6.fullColor.nightMode, function (func, options) {
        if (mslStatestore.getState(options.fullChannelPath + 'on').val === true) {
            mslStatestore.setState({ dp: 'on', val: false, params: options });
            mslStatestore.setState({ dp: 'off', val: true, params: options });
            mslStatestore.setState({ dp: 'onoff', val: false, params: options });
        }

        return func(options.mslZoneNumber);
    });

    // wrapper fullColor whiteTemperature
    commandsV6.fullColor.constructor.prototype.whiteTemperature = _.wrap(commandsV6.fullColor.whiteTemperature, function (func, options, ...argv) {
        if (typeof options !== 'object') {
            return func(options, mslhelper.kelvinToPercent(argv[0]));
        }

        let _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        _brightness = (_brightness.val > 0 ? _brightness.val : (_brightness.oldVal > 0
            ? _brightness.oldVal : 100));

        mslStatestore.setState({ dp: 'brightness', val: _brightness, params: options });
        mslStatestore.setState({ dp: 'saturation', val: 0, params: options });

        mslStatestore.setState({ dp: 'whiteTemperature', val: options.val, params: options });

        return this.rgb(options);
    });

    // wrapper fullColor brightness
    commandsV6.fullColor.constructor.prototype.brightness = _.wrap(commandsV6.fullColor.brightness, function (func, options, ...argv) {
        if (typeof options !== 'object') {
            return func(options, _.parseInt(argv[0]));
        }

        return this.rgb(options);
    });

    // wrapper fullColor saturation
    commandsV6.fullColor.constructor.prototype.saturation = _.wrap(commandsV6.fullColor.saturation, function (func, options, ...argv) {
        if (typeof options !== 'object') {
            return func(options, _.parseInt(argv[0]), argv[1]);
        }

        return this.rgb(options);
    });

    // wrapper fullColor hue
    commandsV6.fullColor.constructor.prototype.hue = _.wrap(commandsV6.fullColor.hue, function (func, options, ...argv) {
        if (typeof options !== 'object') {
            return func(options, _.parseInt(argv[0]), argv[1]);
        }

        return this.rgb(options);
    });

    // Wrapper fullColor rgb
    commandsV6.fullColor.constructor.prototype.rgb = _.wrap(commandsV6.fullColor.rgb, function (func, options) {
        const _saturation = mslStatestore.getState(options.fullChannelPath + 'saturation');
        const _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        const _whiteTemperature = mslStatestore.getState(options.fullChannelPath + 'whiteTemperature');

        const _on = [];

        if (_brightness.val === 0) {
            if (mslStatestore.getState(options.fullChannelPath + 'on').val === true) {
                mslStatestore.setState({ dp: 'on', val: false, params: options });
                mslStatestore.setState({ dp: 'off', val: true, params: options });
                mslStatestore.setState({ dp: 'onoff', val: false, params: options });
            }

            return this.off(options.mslZoneNumber);
        }

        if (mslStatestore.getState(options.fullChannelPath + 'on').val === false) {
            mslStatestore.setState({ dp: 'on', val: true, params: options });
            mslStatestore.setState({ dp: 'off', val: false, params: options });
            mslStatestore.setState({ dp: 'onoff', val: true, params: options });

            _on.push(...this.on(options.mslZoneNumber));
        }

        if (_saturation.val === 0) {
            return [
                _on,
                this.whiteTemperature(options.mslZoneNumber, _whiteTemperature.val),
                this.brightness(options.mslZoneNumber, _brightness.val)
            ];
        }

        const _rgb = tinycolor(mslStatestore.getState(options.fullChannelPath + 'rgb').val).toRgb(); // eventuell optimieren

        return [
            _on,
            ...func.call(commandsV6.fullColor, options.mslZoneNumber, _rgb.r, _rgb.g, _rgb.b)
        ];
    });

    // wrapper fullColor effectMode
    commandsV6.fullColor.constructor.prototype.effectMode = _.wrap(commandsV6.fullColor.effectMode, function (func, options) {
        return [
            func(options.mslZoneNumber, options.val),
            this.brightnessOnly(options.mslZoneNumber, mslStatestore.getState(options.fullChannelPath + 'brightnessOnly').val)
        ];
    });

    // wrapper fullColor effectModeNext
    commandsV6.fullColor.constructor.prototype.effectModeNext = _.wrap(commandsV6.fullColor.effectModeNext, function (func, options) {
        return [
            func(options.mslZoneNumber),
            this.brightnessOnly(options.mslZoneNumber, mslStatestore.getState(options.fullChannelPath + 'brightnessOnly').val)
        ];
    });

    // wrapper fullColor effectSpeedUp
    commandsV6.fullColor.constructor.prototype.effectSpeedUp = _.wrap(commandsV6.fullColor.effectSpeedUp, function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper fullColor effectSpeedDown
    commandsV6.fullColor.constructor.prototype.effectSpeedDown = _.wrap(commandsV6.fullColor.effectSpeedDown, function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper fullColor link
    commandsV6.fullColor.constructor.prototype.link = _.wrap(commandsV6.fullColor.link, function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper fullColor unlink
    commandsV6.fullColor.constructor.prototype.unlink = _.wrap(commandsV6.fullColor.unlink, function (func, options) {
        return func(options.mslZoneNumber);
    });

    /* --------------------------------------------------------- Additional Function fullColor-------------------------------------------------- */

    // fullColor onoff
    commandsV6.fullColor.constructor.prototype.onoff = function (options) {
        if (options.val === true) {
            mslStatestore.setState({ dp: 'on', val: true, params: options });

            return this.on(options);
        } else {
            options.val = true;
            mslStatestore.setState({ dp: 'off', val: true, params: options });

            return this.off(options);
        }
    };

    // fullColor brightnessOnly
    commandsV6.fullColor.constructor.prototype.brightnessOnly = function (options, ...argv) {
        if (typeof options !== 'object') {
            return this.brightness(options, argv[0]);
        }

        return this.brightness(options.mslZoneNumber, options.val);
    };

    /* ------------------------------------------------------------- Wrapper fullColor8Zone ------------------------------------------------------------- */

    // wrapper fullColor8Zone on
    commandsV6.fullColor8Zone.constructor.prototype.on = _.wrap(commandsV6.fullColor8Zone.on, async function (func, options) {
        if (typeof options !== 'object') {
            return func(options);
        }

        if (options.val === false) {
            options.val = true;
            await mslStatestore.setState({ dp: 'off', val: true, params: options });

            return this.off(options);
        }

        await mslStatestore.setState({ dp: 'off', val: false, params: options });
        await mslStatestore.setState({ dp: 'onoff', val: true, params: options });

        let _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        _brightness = (_brightness.val > 0 ? _brightness.val : (_brightness.oldVal > 0
            ? _brightness.oldVal : 100));

        await mslStatestore.setState({ dp: 'brightness', val: _brightness, params: options });

        return [
            func(options.mslZoneNumber),
            ...await this.rgb(options)
        ];
    });

    // wrapper fullColor8Zone off
    commandsV6.fullColor8Zone.constructor.prototype.off = _.wrap(commandsV6.fullColor8Zone.off, async function (func, options) {
        if (typeof options !== 'object') {
            return func(options);
        }

        if (options.val === false) {
            options.val = true;
            await mslStatestore.setState({ dp: 'on', val: true, params: options });

            return this.on(options);
        }

        await mslStatestore.setState({ dp: 'on', val: false, params: options });
        await mslStatestore.setState({ dp: 'onoff', val: false, params: options });

        await mslStatestore.setState({ dp: 'rgb', val: '#000000', params: options });

        return [
            func(options.mslZoneNumber),
            ...await this.rgb(options)
        ];
    });

    // wrapper fullColor8Zone whiteMode
    commandsV6.fullColor8Zone.constructor.prototype.whiteMode = _.wrap(commandsV6.fullColor8Zone.whiteMode, async function (func, options) {
        if (typeof options !== 'object') {
            return func(options);
        }

        let _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        _brightness = (_brightness.val > 0 ? _brightness.val : (_brightness.oldVal > 0
            ? _brightness.oldVal : 100));

        await mslStatestore.setState({ dp: 'brightness', val: _brightness, params: options });
        await mslStatestore.setState({ dp: 'saturation', val: 0, params: options });

        await mslStatestore.setState({ dp: 'whiteTemperature', val: 2700, params: options });

        return this.rgb(options);
    });

    // wrapper fullColor8Zone nightMode
    commandsV6.fullColor8Zone.constructor.prototype.nightMode = _.wrap(commandsV6.fullColor8Zone.nightMode, async function (func, options) {
        if (mslStatestore.getState(options.fullChannelPath + 'on').val === true) {
            await mslStatestore.setState({ dp: 'on', val: false, params: options });
            await mslStatestore.setState({ dp: 'off', val: true, params: options });
            await mslStatestore.setState({ dp: 'onoff', val: false, params: options });
        }

        return func(options.mslZoneNumber);
    });

    // wrapper fullColor8Zone whiteTemperature
    commandsV6.fullColor8Zone.constructor.prototype.whiteTemperature = _.wrap(commandsV6.fullColor8Zone.whiteTemperature, async function (func, options, ...argv) {
        if (typeof options !== 'object') {
            return func(options, mslhelper.kelvinToPercent(argv[0]));
        }

        let _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        _brightness = (_brightness.val > 0 ? _brightness.val : (_brightness.oldVal > 0
            ? _brightness.oldVal : 100));

        await mslStatestore.setState({ dp: 'brightness', val: _brightness, params: options });
        await mslStatestore.setState({ dp: 'saturation', val: 0, params: options });

        await mslStatestore.setState({ dp: 'whiteTemperature', val: options.val, params: options });

        return this.rgb(options);
    });

    // wrapper fullColor8Zone brightness
    commandsV6.fullColor8Zone.constructor.prototype.brightness = _.wrap(commandsV6.fullColor8Zone.brightness, async function (func, options, ...argv) {
        if (typeof options !== 'object') {
            return func(options, _.parseInt(argv[0]));
        }

        return this.rgb(options);
    });

    // wrapper fullColor8Zone saturation
    commandsV6.fullColor8Zone.constructor.prototype.saturation = _.wrap(commandsV6.fullColor8Zone.saturation, async function (func, options, ...argv) {
        if (typeof options !== 'object') {
            return func(options, _.parseInt(argv[0]), argv[1]);
        }

        return this.rgb(options);
    });

    // wrapper fullColor8Zone hue
    commandsV6.fullColor8Zone.constructor.prototype.hue = _.wrap(commandsV6.fullColor8Zone.hue, async function (func, options, ...argv) {
        if (typeof options !== 'object') {
            return func(options, _.parseInt(argv[0]), argv[1]);
        }

        return this.rgb(options);
    });

    // Wrapper fullColor8Zone rgb
    commandsV6.fullColor8Zone.constructor.prototype.rgb = _.wrap(commandsV6.fullColor8Zone.rgb, async function (func, options) {
        const _saturation = mslStatestore.getState(options.fullChannelPath + 'saturation');
        const _brightness = mslStatestore.getState(options.fullChannelPath + 'brightness');

        const _whiteTemperature = mslStatestore.getState(options.fullChannelPath + 'whiteTemperature');

        const _on = [];

        if (_brightness.val === 0) {
            if (mslStatestore.getState(options.fullChannelPath + 'on').val === true) {
                await mslStatestore.setState({ dp: 'on', val: false, params: options });
                await mslStatestore.setState({ dp: 'off', val: true, params: options });
                await mslStatestore.setState({ dp: 'onoff', val: false, params: options });
            }

            return await this.off(options.mslZoneNumber);
        }

        if (mslStatestore.getState(options.fullChannelPath + 'on').val === false) {
            await mslStatestore.setState({ dp: 'on', val: true, params: options });
            await mslStatestore.setState({ dp: 'off', val: false, params: options });
            await mslStatestore.setState({ dp: 'onoff', val: true, params: options });

            _on.push(...await this.on(options.mslZoneNumber));
        }

        if (_saturation.val === 0) {
            return [
                _on,
                await this.whiteTemperature(options.mslZoneNumber, _whiteTemperature.val),
                await this.brightness(options.mslZoneNumber, _brightness.val)
            ];
        }

        const _rgb = tinycolor(mslStatestore.getState(options.fullChannelPath + 'rgb').val).toRgb(); // eventuell optimieren

        return [
            _on,
            ...await Promise.all(func.call(commandsV6.fullColor8Zone, options.mslZoneNumber, _rgb.r, _rgb.g, _rgb.b))
        ];
    });

    // wrapper fullColor8Zone effectMode
    commandsV6.fullColor8Zone.constructor.prototype.effectMode = _.wrap(commandsV6.fullColor8Zone.effectMode, async function (func, options) {
        return [
            func(options.mslZoneNumber, options.val),
            await this.brightnessOnly(options.mslZoneNumber, mslStatestore.getState(options.fullChannelPath + 'brightnessOnly').val)
        ];
    });

    // wrapper fullColor8Zone effectModeNext
    commandsV6.fullColor8Zone.constructor.prototype.effectModeNext = _.wrap(commandsV6.fullColor8Zone.effectModeNext, async function (func, options) {
        return [
            func(options.mslZoneNumber),
            await this.brightnessOnly(options.mslZoneNumber, mslStatestore.getState(options.fullChannelPath + 'brightnessOnly').val)
        ];
    });

    // wrapper fullColor8Zone effectSpeedUp
    commandsV6.fullColor8Zone.constructor.prototype.effectSpeedUp = _.wrap(commandsV6.fullColor8Zone.effectSpeedUp, async function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper fullColor8Zone effectSpeedDown
    commandsV6.fullColor8Zone.constructor.prototype.effectSpeedDown = _.wrap(commandsV6.fullColor8Zone.effectSpeedDown, async function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper fullColor8Zone link
    commandsV6.fullColor8Zone.constructor.prototype.link = _.wrap(commandsV6.fullColor8Zone.link, async function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper fullColor8Zone unlink
    commandsV6.fullColor8Zone.constructor.prototype.unlink = _.wrap(commandsV6.fullColor8Zone.unlink, async function (func, options) {
        return func(options.mslZoneNumber);
    });

    /* --------------------------------------------------------- Additional Function fullColor8Zone -------------------------------------------------- */

    // fullColor8Zone onoff
    commandsV6.fullColor8Zone.constructor.prototype.onoff = async function (options) {
        if (options.val === true) {
            await mslStatestore.setState({ dp: 'on', val: true, params: options });

            return this.on(options);
        } else {
            options.val = true;
            await mslStatestore.setState({ dp: 'off', val: true, params: options });

            return this.off(options);
        }
    };

    // fullColor8Zone brightnessOnly
    commandsV6.fullColor8Zone.constructor.prototype.brightnessOnly = async function (options, ...argv) {
        if (typeof options !== 'object') {
            return this.brightness(options, argv[0]);
        }

        return this.brightness(options.mslZoneNumber, options.val);
    };

    /* ------------------------------------------------------------- Wrapper white ------------------------------------------------------------- */

    // wrapper white on
    commandsV6.white.constructor.prototype.on = _.wrap(commandsV6.white.on, function (func, options) {
        if (typeof options !== 'object') {
            return func(options);
        }

        if (options.val === false) {
            options.val = true;
            mslStatestore.setState({ dp: 'off', val: true, params: options });

            return this.off(options);
        }

        mslStatestore.setState({ dp: 'off', val: false, params: options });
        mslStatestore.setState({ dp: 'onoff', val: true, params: options });

        return func(options.mslZoneNumber);
    });

    // wrapper white off
    commandsV6.white.constructor.prototype.off = _.wrap(commandsV6.white.off, function (func, options) {
        if (typeof options !== 'object') {
            return func(options);
        }

        if (options.val === false) {
            options.val = true;
            mslStatestore.setState({ dp: 'on', val: true, params: options });

            return this.on(options);
        }

        mslStatestore.setState({ dp: 'on', val: false, params: options });
        mslStatestore.setState({ dp: 'onoff', val: false, params: options });

        return func(options.mslZoneNumber);
    });

    // wrapper white brightUp
    commandsV6.white.constructor.prototype.brightUp = _.wrap(commandsV6.white.brightUp, function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper white brightDown
    commandsV6.white.constructor.prototype.brightDown = _.wrap(commandsV6.white.brightDown, function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper white maxBright
    commandsV6.white.constructor.prototype.maxBright = _.wrap(commandsV6.white.maxBright, function (func, options) {
        if (mslStatestore.getState(options.fullChannelPath + 'off').val === true) {
            mslStatestore.setState({ dp: 'on', val: true, params: options });
            mslStatestore.setState({ dp: 'off', val: false, params: options });
            mslStatestore.setState({ dp: 'onoff', val: true, params: options });
        }

        return func(options.mslZoneNumber);
    });

    // wrapper white nightMode
    commandsV6.white.constructor.prototype.nightMode = _.wrap(commandsV6.white.nightMode, function (func, options) {
        if (mslStatestore.getState(options.fullChannelPath + 'on').val === true) {
            mslStatestore.setState({ dp: 'on', val: false, params: options });
            mslStatestore.setState({ dp: 'off', val: true, params: options });
            mslStatestore.setState({ dp: 'onoff', val: false, params: options });
        }

        return func(options.mslZoneNumber);
    });

    // wrapper white warmer
    commandsV6.white.constructor.prototype.warmer = _.wrap(commandsV6.white.warmer, function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper white cooler
    commandsV6.white.constructor.prototype.cooler = _.wrap(commandsV6.white.cooler, function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper white link
    commandsV6.white.constructor.prototype.link = _.wrap(commandsV6.white.link, function (func, options) {
        return func(options.mslZoneNumber);
    });

    // wrapper white unlink
    commandsV6.white.constructor.prototype.unlink = _.wrap(commandsV6.white.unlink, function (func, options) {
        return func(options.mslZoneNumber);
    });

    /* --------------------------------------------------------- Additional Function white -------------------------------------------------- */

    // white onoff
    commandsV6.white.constructor.prototype.onoff = function (options) {
        if (options.val === true) {
            mslStatestore.setState({ dp: 'on', val: true, params: options });

            return this.on(options);
        } else {
            options.val = true;
            mslStatestore.setState({ dp: 'off', val: true, params: options });

            return this.off(options);
        }
    };
    /* --------------------------------------------------------------------------------------------------------------------------------------- */

    return commandsV6;
}

module.exports = mslcommandsV6;