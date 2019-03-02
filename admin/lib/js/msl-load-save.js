/* eslint-disable no-unused-vars */
'use strict';

let vm = null;

function load (settings, onChange) {
    if(vm !== null) {
        vm.options = settings;
        onChange(false);

        return;
    }

    // eslint-disable-next-line no-undef
    vm = createVueInstance(settings, onChange);
    onChange(false);
}

function save (callback) {
    callback(vm.options);
}
