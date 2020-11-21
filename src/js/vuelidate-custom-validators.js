export function isunique(value) {
  let count = 0;

  this.zones.forEach((zone) => {
    if (zone.mslZoneNumber === value) {
      count++;
    }
  });

  return !(count > 1);
}

export function defaultColorOffset(value, zone) {
  if ((value === 'fullColor' || value === 'fullColor8Zone') && !zone.mslColorOffset) {
    zone.mslColorOffset = '0x48';
  }
  return true;
}

export function isAllowedZoneNumber(value, zone) {
  if ((value === '5' && this.maxZones === '4') || value === '9') {
    return zone.mslZoneType === 'bridge';
  }

  return zone.mslZoneType !== 'bridge';
}

export function isAllowedZoneType(value, zone) {
  if ((zone.mslZoneNumber === '5' && this.maxZones === '4') || zone.mslZoneNumber === '9') {
    return value === 'bridge';
  }

  return value !== 'bridge';
}

export function regexColorOffset(value, zone) {
  if (zone.mslZoneType === 'fullColor' || zone.mslZoneType === 'fullColor8Zone') {
    return RegExp('^(0x)?[0-9a-f]{2}$', 'i')
      .test(value);
  }

  zone.mslColorOffset = null;

  return true;
}

export function regexGroupAndName(value) {
  return !RegExp('[\\]\\[*,;\'"`´<>\\\\?]')
    .test(value);
}
