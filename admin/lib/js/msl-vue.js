/* eslint-disable no-undef,eqeqeq */
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

                    this.options.controllerPort = value;
                }
            }
        },
        validations: {
            controllerPort: {
                required: validators.required
            },
            options: {
                serverPort: {
                    required: validators.requiredIf((vm) => vm.activeApp)
                },
                websocketPort: {
                    required: validators.requiredIf((vm) => vm.activeApp)
                },
                controllerIp: {
                    required: validators.required,
                    ipAddress: validators.ipAddress
                },
                commandRepeat: {
                    required: validators.required
                },
                delayBetweenCommands: {
                    required: validators.required
                },
                zones: {
                    $each: {
                        mslZoneNumber: {
                            reqired: validators.required,
                            isunique (value) {
                                let i = 0;
                                for (let device of this.options.zones) {
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
                            required: validators.required
                        },
                        mslZoneType: {
                            reqired: validators.required,
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
                        }
                    }
                }
            },
            controllerGroup: ['controllerPort', 'options.controllerIp', 'options.commandRepeat', 'options.delayBetweenCommands'],
            mslAppGroup: ['options.serverPort', 'options.websocketPort']
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
                    mslZoneName: null,
                    mslRoom: null,
                    mslFunc: []
                });

                if (this.options.zones.length == this.maxDevices) {
                    this.$refs.addDeviceButton.setAttribute('disabled', true);
                }

                this.$v.options.zones.$touch();
                this.mslOnChange(false);
            },
            delDevice (index) {
                if (this.options.zones.length == this.maxDevices) {
                    this.$refs.addDeviceButton.removeAttribute('disabled');
                }

                this.options.zones.splice(index, 1);
                this.$v.options.zones.$touch();
                this.mslOnChange(true);
            },
            deleteAllDevices () {
                this.$refs.addDeviceButton.removeAttribute('disabled');
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
            /* this.$nextTick (function () {
              this.M.updateTextFields();

              let mslTabs = document.querySelectorAll('#msl tabs')
              this.M.Tabs.init(mslTabs)

              let mslSelect = document.querySelectorAll('#msl select')
              this.M.FormSelect.init(mslSelect)
            }) */
        },
        updated () {
            this.$nextTick(function () {
                this.M.updateTextFields();

                let mslTabs = document.querySelectorAll('#msl tabs');
                this.M.Tabs.init(mslTabs);

                let mslSelect = document.querySelectorAll('#msl select');
                this.M.FormSelect.init(mslSelect);
            });
        }
    });
}

function getMslRooms (list) {
    let result = {};
    let nnames = [];

    for (let n in list) {
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

    for (var l = 0; l < nnames.length; l++) {
        result[nnames[l]] = list[nnames[l]].common.name || l;
        if (typeof result[nnames[l]] === 'object') {
            result[nnames[l]] = result[nnames[l]][systemLang] || result[nnames[l]].en;
        }
    }

    return result;
}

function getMslFunctions (list) {
    let result = {};

    let nnames = [];
    for (let n in list) {
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
