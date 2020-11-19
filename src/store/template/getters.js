import { getField } from 'vuex-map-fields';

export { getField };

export const isValidAll = (state) => state.validForms.bridge && state.validForms.zones && state.validForms.app;
