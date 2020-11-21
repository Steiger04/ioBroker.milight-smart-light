const messages = {
  required(_, name) {
    return this.$t('validateMsg.required', { field: name });
  },
  ipAddress({ $model }) {
    return this.$t('validateMsg.ip', { field: $model });
  },
  numeric(_, name) {
    return this.$t('validateMsg.numeric', { field: name });
  },
  maxLength({ $params }, name) {
    return this.$t('validateMsg.max', {
      field: name,
      length: $params.maxLength.max,
    });
  },
  between({ $params }, name) {
    return this.$t('validateMsg.between', {
      field: name,
      min: $params.between.min,
      max: $params.between.max,
    });
  },
  minValue({ $params }, name) {
    return this.$t('validateMsg.minValue', {
      field: name,
      min: $params.minValue.min,
    });
  },
  isunique(_, name) {
    return this.$t('validateMsg.isunique', { field: name });
  },
  isAllowedZoneNumber({ $model }, name) {
    return this.$t('validateMsg.isAllowedZoneNumber', {
      field: name,
      value: this.$t(`zonesForm.zone${$model}`)
    });
  },
  isAllowedZoneType({ $model }, name) {
    return this.$t('validateMsg.isAllowedZoneType', {
      field: name,
      value: this.$t(`zonesForm.${$model}`)
    });
  },
  regexColorOffset({ $model }, name) {
    return this.$t('validateMsg.regexColorOffset', {
      field: name,
      value: $model
    });
  },
  regexGroupAndName({ $model }, name) {
    return this.$t('validateMsg.regexGroupAndName', {
      field: name,
      value: $model
    });
  },
};

export { messages };
