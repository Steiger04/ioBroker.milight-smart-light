/* eslint-disable no-console */
export const addZone = ({ commit }, touch) => {
    commit('addZone', touch);
};

export const deleteZone = ({ commit }, id) => {
    commit('deleteZone', id);
};

export const deleteAllZones = ({ commit }) => {
    commit('deleteAllZones');
};
