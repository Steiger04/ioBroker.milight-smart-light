import { mapFields } from 'vuex-map-fields';

const fieldsApp = {
  computed: {
    ...mapFields('app', [
      'changed',
      'connected',
      'loaded',
      'isConfigurationError',
      'errorText',
    ]),
  },
};

export { fieldsApp };
