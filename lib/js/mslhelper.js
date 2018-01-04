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
    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
    ];
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

module.exports = mslhelper;
