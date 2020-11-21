import { mapState, mapGetters } from 'vuex';
import { mapFields, mapMultiRowFields } from 'vuex-map-fields';

const fieldsTemplate = {
  computed: {
    ...mapState('template', [
      'native',
    ]),
    ...mapMultiRowFields('template', { zones: 'native.zones' }),
    ...mapFields('template', {
      activeApp: 'native.activeApp',
      serverPort: 'native.serverPort',
      socketPort: 'native.socketPort',
      controllerType: 'native.controllerType',
      controllerIp: 'native.controllerIp',
      controllerPortLegacy: 'native.controllerPortLegacy',
      controllerPortV6: 'native.controllerPortV6',
      controllerPort: 'native.controllerPort',
      commandRepeat: 'native.commandRepeat',
      delayBetweenCommands: 'native.delayBetweenCommands',
      iBox: 'native.iBox',
      maxZones: 'native.maxZones',
      debounceTime: 'native.debounceTime',
      roomOptions: 'roomOptions',
      funcOptions: 'funcOptions',
    }),
    ...mapFields('template', {
      isValidBridge: 'validForms.bridge',
      isValidZones: 'validForms.zones',
      isValidApp: 'validForms.app',
    }),
    ...mapGetters('template', { isValidAll: 'isValidAll' }),
  },
};

export { fieldsTemplate };
