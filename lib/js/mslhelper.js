'use strict'; // jscs:ignore validateLineBreaks

const mslhelper = require('node-milight-promise').helper;

mslhelper.hsvToRgb = function(h, s, v) {
  //noinspection ES6ConvertVarToLetConst
  var r, g, b; // jscs:ignore disallowMultipleVarDecl
  var i;
  var f, p, q, t; // jscs:ignore disallowMultipleVarDecl

  function rgb2hex(red, green, blue) {
    var rgb = blue | (green << 8) | (red << 16); // jshint ignore:line
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
  }

  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  v = Math.max(0, Math.min(100, v));

  s /= 100;
  v /= 100;

  //noinspection EqualityComparisonWithCoercionJS
  if (s == 0) { // jshint ignore:line
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

mslhelper.rgbToHsv = function(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ Math.round(h*360), Math.round(s*100), Math.round(v*100) ];
};

module.exports = mslhelper;
