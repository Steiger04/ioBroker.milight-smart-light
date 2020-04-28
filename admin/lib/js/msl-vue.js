/* eslint-disable no-undef,eqeqeq,no-prototype-builtins */
'use strict';
Vue.use(window.vuelidate.default);

// eslint-disable-next-line no-unused-vars
function createVueInstance (settings, onChange) {
    return new Vue({
        el: '#msl',
        data: {
            M: M,
            options: settings,
            numberZones: {
                v6: ['select', 'zone1', 'zone2', 'zone3', 'zone4', 'zone5', 'zone6', 'zone7', 'zone8', 'zone9'],
                legacy: ['select', 'zone1', 'zone2', 'zone3', 'zone4']
            },
            mslZoneTypes: {
                v6: ['select', 'white', 'rgbw', 'fullColor', 'fullColor8Zone', 'bridge'],
                legacy: ['select', 'white', 'rgbw']
            },
            mslRooms: {},
            mslFuncs: {},
            controllerIps: []
        },
        computed: {
            deviceCount () {
                return this.options.zones.length;
            },
            maxDevices () {
                if (this.options.controllerType === 'legacy') {
                    return 4;
                }

                if (this.options.controllerType === 'v6') {
                    if (this.options.iBox === 'iBox1') {
                        if (this.options.maxZones === '4') {
                            return 5;
                        } else {
                            return 9;
                        }
                    } else {
                        if (this.options.maxZones === '4') {
                            return 4;
                        } else {
                            return 8;
                        }
                    }
                }
            },
            controllerPort: {
                get () {
                    if (this.options.controllerType === 'v6') {
                        return this.options.controllerPortV6;
                    }

                    if (this.options.controllerType === 'legacy') {
                        return this.options.controllerPortLegacy;
                    }
                },
                set (value) {
                    if (this.options.controllerType === 'v6') {
                        this.options.controllerPortV6 = value;
                        this.options.controllerPort = value;
                    }
                    if (this.options.controllerType === 'legacy') {
                        this.options.controllerPortLegacy = value;
                        this.options.controllerPort = value;
                    }
                }
            }
        },
        validations: {
            controllerPort: {
                required: validators.required,
                integer: validators.integer,
                minValue: validators.minValue(1024),
                maxValue: validators.maxValue(64738)
            },
            options: {
                serverPort: {
                    required: validators.requiredIf((vm) => vm.activeApp),
                    integer: validators.integer,
                    minValue: validators.minValue(1024),
                    maxValue: validators.maxValue(64738)
                },
                socketPort: {
                    required: validators.requiredIf((vm) => vm.activeApp),
                    integer: validators.integer,
                    minValue: validators.minValue(1024),
                    maxValue: validators.maxValue(64738)
                },
                debounceTime: {
                    required: validators.requiredIf((vm) => vm.activeApp),
                    integer: validators.integer,
                    minValue: validators.minValue(100)
                },
                controllerIp: {
                    required: validators.required,
                    ipAddress: validators.ipAddress
                },
                commandRepeat: {
                    required: validators.required,
                    integer: validators.integer,
                    minValue: validators.minValue(1),
                    maxValue: validators.maxValue(9)
                },
                delayBetweenCommands: {
                    required: validators.required,
                    integer: validators.integer,
                    minValue: validators.minValue(10),
                    maxValue: validators.maxValue(1000)
                },
                zones: {
                    $each: {
                        mslZoneNumber: {
                            reqired: validators.required,
                            isunique (value) {
                                let i = 0;
                                for (const device of this.options.zones) {
                                    if (device.mslZoneNumber === value) i++;
                                }
                                return !(i > 1);
                            },
                            isbridge (value, vm) {
                                if (this.options.iBox === 'iBox2' || this.options.controllerType === 'legacy') {
                                    return true;
                                }

                                if (value == this.maxDevices && vm.mslZoneType === 'bridge') {
                                    return true;
                                }

                                if (value != this.maxDevices && vm.mslZoneType !== 'bridge') {
                                    return true;
                                }

                                return false;
                            }
                        },
                        mslGroupName: {
                            required: validators.required,
                            areNotForbiddenChars (value) {
                                return !RegExp('[\\]\\[*,;\'"`<>\\\\?]').test(value);
                            }
                        },
                        mslZoneType: {
                            required: validators.required,
                            defaultColorOffset (value, vm) {
                                if ((value === 'fullColor' || value === 'fullColor8Zone') && !vm.mslColorOffset) {
                                    vm.mslColorOffset = '0x48';
                                }
                                return true;
                            },
                            isbridge (value, vm) {
                                if (this.options.iBox === 'iBox2' || this.options.controllerType === 'legacy') {
                                    return true;
                                }

                                if (vm.mslZoneNumber == this.maxDevices && value === 'bridge') {
                                    return true;
                                }

                                if (vm.mslZoneNumber != this.maxDevices && value !== 'bridge') {
                                    return true;
                                }

                                return false;
                            }
                        },
                        mslColorOffset: {
                            areNotForbiddenChars (value, vm) {
                                if (vm.mslZoneType === 'fullColor' || vm.mslZoneType === 'fullColor8Zone') {
                                    return RegExp('(0x)?[0-9a-f]{2}', 'i').test(value);
                                }

                                vm.mslColorOffset = null;

                                return true;
                            }
                        }
                    }
                }
            },
            controllerGroup: ['controllerPort', 'options.controllerIp', 'options.commandRepeat', 'options.delayBetweenCommands'],
            mslAppGroup: ['options.serverPort', 'options.socketPort', 'options.debounceTime']
        },
        methods: {
            __: _,
            onChange: onChange,
            getEnums: getEnums,
            showMessage: showMessage,
            getIsAdapterAlive: getIsAdapterAlive,
            sendTo: sendTo,
            mslOnChange (change) {
                if (this.$v.$anyError) {
                    return this.onChange(false);
                }

                this.onChange(change);
            },
            addDevice () {
                this.options.zones.push({
                    mslZoneActive: false,
                    mslZoneNumber: null,
                    mslGroupName: null,
                    mslZoneType: null,
                    mslColorOffset: null,
                    mslZoneName: null,
                    mslRoom: null,
                    mslFunc: []
                });

                this.$v.options.zones.$touch();
                this.mslOnChange(false);
            },
            delDevice (index) {
                this.options.zones.splice(index, 1);
                this.$v.options.zones.$touch();
                this.mslOnChange(true);
            },
            deleteAllDevices () {
                this.options.zones = [];
                this.mslOnChange(true);
            },
            provideControllerIps () {
                this.controllerIps = [];
                this.$refs.refreshButton.setAttribute('disabled', true);

                this.getIsAdapterAlive((isAlive) => {
                    if (!isAlive) {
                        this.$refs.refreshButton.removeAttribute('disabled');
                        return this.showMessage(__('noInstance'), __('msgWarning'), 'info'); // TODO: Nachricht anpassen
                    }

                    this.sendTo(null, 'discover', null, (list) => {
                        if (!list || !list.length) {
                            this.controllerIps = [];
                            this.$refs.refreshButton.removeAttribute('disabled');

                            return this.showMessage(__('noController'), __('msgWarning'), 'info');
                        }

                        this.$refs.refreshButton.removeAttribute('disabled');
                        this.controllerIps = list;
                    });
                });
            },
            changeControllerIp (event) {
                this.options.controllerIp = event.target.value;
                this.controllerIps = [];
                onChange(true);
            }
        },
        created () {
            // eslint-disable-next-line no-return-assign,handle-callback-err
            this.getEnums('rooms', (err, list) => this.mslRooms = getMslRooms(list));
            // eslint-disable-next-line no-return-assign,handle-callback-err
            this.getEnums('functions', (err, list) => this.mslFuncs = getMslFunctions(list));

            this.$v.$touch();
        },
        mounted () {
            /*this.M.updateTextFields();

            const mslTabs = document.querySelectorAll('#msl tabs');
            this.M.Tabs.init(mslTabs);

            const mslSelect = document.querySelectorAll('#msl select');
            this.M.FormSelect.init(mslSelect);*/
        },
        beforeUpdate () {
            this.$nextTick(function () {
                // this.M.updateTextFields();

                const mslSelect = document.querySelectorAll('#msl select');
                this.M.FormSelect.init(mslSelect);
            });
        }
    });
}

function getMslRooms (list) {
    const result = {};
    const nnames = [];

    for (const n in list) {
        if (list.hasOwnProperty(n)) {
            nnames.push(n);
        }
    }
    nnames.sort(function (a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    });

    for (let l = 0; l < nnames.length; l++) {
        result[nnames[l]] = list[nnames[l]].common.name || l;
        if (typeof result[nnames[l]] === 'object') {
            result[nnames[l]] = result[nnames[l]][systemLang] || result[nnames[l]].en;
        }
    }

    return result;
}

function getMslFunctions (list) {
    const result = {};

    const nnames = [];
    for (const n in list) {
        if (list.hasOwnProperty(n)) {
            nnames.push(n);
        }
    }
    nnames.sort(function (a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    });

    for (let l = 0; l < nnames.length; l++) {
        result[nnames[l]] = list[nnames[l]].common.name || l;
        if (typeof result[nnames[l]] === 'object') {
            result[nnames[l]] = result[nnames[l]][systemLang] || result[nnames[l]].en;
        }
    }

    return result;
}
