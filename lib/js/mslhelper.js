/* eslint-disable eqeqeq,no-var */
'use strict'; // jscs:ignore validateLineBreaks

const mslhelper = require('node-milight-promise').helper;

mslhelper.hsvToRgb = function (h, s, v) {
    // noinspection ES6ConvertVarToLetConst
    var r, g, b; // jscs:ignore disallowMultipleVarDecl
    var i;
    var f, p, q, t; // jscs:ignore disallowMultipleVarDecl

    function rgb2hex (red, green, blue) {
        var rgb = blue | (green << 8) | (red << 16); // jshint ignore:line
        return '#' + (0x1000000 + rgb).toString(16).slice(1);
    }

    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    s /= 100;
    v /= 100;

    // eslint-disable-next-line eqeqeq
    if (s == 0) {
        r = g = b = v;
        return rgb2hex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
    }

    h /= 60;
    i = Math.floor(h);
    f = h - i;
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch (i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;

        case 1:
            r = q;
            g = v;
            b = p;
            break;

        case 2:
            r = p;
            g = v;
            b = t;
            break;

        case 3:
            r = p;
            g = q;
            b = v;
            break;

        case 4:
            r = t;
            g = p;
            b = v;
            break;

        default:
            r = v;
            g = p;
            b = q;
    }

    return rgb2hex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
};

/* mslhelper.hsvToRgb = function (h, s, v) {
  function padding(num) {
    num = num.toString(16);
    if (num.length < 2) num = '0' + num;
    return num;
  }

  h /= 360;
  s /= 100;
  v/=100;

  let r;
  let g;
  let b;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch(i % 6){
    case 0:
      r = v;
      g = t;
      b = p;
      break;

    case 1:
      r = q;
      g = v;
      b = p;
      break;

    case 2:
      r = p;
      g = v;
      b = t;
      break;

    case 3:
      r = p;
      g = q;
      b = v;
      break;

    case 4:
      r = t;
      g = p;
      b = v;
      break;

    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  return '#' + padding(Math.round(r * 255)) + padding(Math.round(g * 255)) + padding(Math.round(b * 255));
} */

mslhelper.rgbToHsv = function (r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h;
    var s;
    var v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
    // return [ h*360, (s*100).toFixed(2), (v*100).toFixed(2) ];
};

mslhelper.hueToMilightColor = function (hsv) {
    // On the HSV color circle (0..360) with red at 0 degree. We need to convert to the Milight color circle
    // which has 256 values with red at position 176
    return (256 + 176 - Math.floor(Number(hsv) / 360.0 * 255.0)) % 256;
};


mslhelper.kelvinToPercent = function (val) {
    const minK = 2700;
    const maxK = 6500;
    const minM = 0;
    const maxM = 100;

    val = Math.max(minK, Math.min(val, maxK));
    val = 100 * ((val - maxK) / (maxK - minK) + 1);
    val = Math.round(val);
    val = Math.max(minM, Math.min(val, maxM));

    return val;
};

// eslint-disable-next-line indent
module.exports = mslhelper;
