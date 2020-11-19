import { nanoid } from 'nanoid';
import { updateField } from 'vuex-map-fields';

export { updateField };

export const addZone = (state, touch) => {
    state.native.zones.push({
        id: nanoid(9),
        mslZoneActive: false,
        mslZoneNumber: null,
        mslGroupName: null,
        mslZoneType: null,
        mslColorOffset: null,
        mslZoneName: null,
        mslRoom: null,
        mslFunc: [],
    });

    touch();
};

export const deleteZone = (state, id) => {
    const idx = state.native.zones.findIndex((zone) => zone.id === id);
    state.native.zones.splice(idx, 1);
};

export const deleteAllZones = (state) => {
    state.native.zones.length = 0;
};
