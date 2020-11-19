/* eslint-disable no-underscore-dangle,no-console,no-unused-expressions,no-plusplus,no-restricted-syntax,no-prototype-builtins,no-bitwise */
import { i18n } from '../boot/i18n';
import Connection, { PROGRESS } from './Connection';

class GenericApp {
    constructor(props, settings) {
        this.store = props.store;
        this.state = props.store.state.template;

        const query = (window.location.search || '').replace(/^\?/, '')
            .replace(/#.*$/, '');
        const args = {};
        query.trim()
            .split('&')
            .filter((t) => t)
            .forEach((b) => {
                const parts = b.split('=');
                args[parts[0]] = parts.length === 2 ? parts[1] : true;
            });

        // extract instance from URL
        this.instance = args.instance !== undefined ? parseInt(args.instance, 10) || 0 : (parseInt(window.location.search.slice(1), 10) || 0);
        // extract adapter name from URL
        const tmp = window.location.pathname.split('/');
        this.adapterName = (settings && settings.adapterName) || props.adapterName || window.adapterName || tmp[tmp.length - 2] || 'iot';
        // console.log('Adapter Name:', this.adapterName);

        this.instanceId = `system.adapter.${this.adapterName}.${this.instance}`;
        this.selectedTab = window.localStorage[`${this.adapterName}-adapter`] || '';
        this.selectedTabNum = -1;

        try {
            this.isIFrame = window.self !== window.top;
        } catch (e) {
            this.isIFrame = true;
        }

        this.savedNative = {}; // to detect if the config changed

        this.encryptedFields = props.encryptedFields || (settings && settings.encryptedFields) || [];

        this.socket = new Connection({
            ...((props && props.socket) || (settings && settings.socket)),
            name: this.adapterName,
            doNotLoadAllObjects: (settings && settings.doNotLoadAllObjects),
            onProgress: (progress) => {
                if (progress === PROGRESS.CONNECTING) {
                    this.store.commit('app/updateField', {
                        path: 'connected',
                        value: false,
                    });
                } else if (progress === PROGRESS.READY) {
                    this.store.commit('app/updateField', {
                        path: 'connected',
                        value: true,
                    });
                } else {
                    this.store.commit('app/updateField', {
                        path: 'connected',
                        value: true,
                    });
                }
            },
            // eslint-disable-next-line no-unused-vars
            onReady: async (objects, scripts) => {
                i18n.locale = this.socket.systemLang;

                await this.getSystemConfig()
                    .then((obj) => {
                        this._secret = (typeof obj !== 'undefined' && obj.native && obj.native.secret) || 'Zgfr56gFe87jJOM';
                        return this.socket.getObject(this.instanceId);
                    })
                    .then((obj) => {
                        if (obj) {
                            this.common = obj && obj.common;
                            this.onPrepareLoad(obj.native); // decode all secrets

                            this.native = JSON.parse(JSON.stringify(obj.native));
                            this.savedNative = JSON.parse(JSON.stringify(obj.native));

                            this.store.commit('template/updateField', {
                                path: 'native',
                                value: obj.native,
                            });
                            this.store.commit('app/updateField', {
                                path: 'loaded',
                                value: true,
                            });
                            // noinspection JSUnresolvedVariable,JSUnresolvedFunction
                            this.onConnectionReady && this.onConnectionReady();
                        } else {
                            console.warn('Cannot load instance settings');
                            this.store.commit('template/updateField', {
                                path: 'native',
                                value: {},
                            });
                            this.store.commit('app/updateField', {
                                path: 'loaded',
                                value: true,
                            });
                            // noinspection JSUnresolvedVariable,JSUnresolvedFunction
                            this.onConnectionReady && this.onConnectionReady();
                        }
                    });

                await this.socket.getEnums('rooms')
                    .then((rooms) => {
                        const options = [];
                        const list = this.getMslRooms(rooms);

                        for (const [key, value] of Object.entries(list)) {
                            options.push({
                                label: value,
                                value: key,
                            });
                        }

                        this.store.commit('template/updateField', {
                            path: 'roomOptions',
                            value: options,
                        });
                    });

                await this.socket.getEnums('functions')
                    .then((functions) => {
                        const options = [];
                        const list = this.getMslFunctions(functions);

                        for (const [key, value] of Object.entries(list)) {
                            options.push({
                                label: value,
                                value: key,
                            });
                        }

                        this.store.commit('template/updateField', {
                            path: 'funcOptions',
                            value: options,
                        });
                    });
            },
            onError: (err) => {
                this.showError(err);
            },
        });
    }

    getSystemConfig() {
        if (this.socket.objects && this.socket.objects['system.config']) {
            return Promise.resolve(this.socket.objects['system.config']);
        }
        return this.socket.getObject('system.config');
    }

    onPrepareLoad(settings) {
        // here you can encode values
        this.encryptedFields && this.encryptedFields.forEach((attr) => {
            if (settings[attr]) {
                settings[attr] = this.decrypt(settings[attr]);
            }
        });
    }

    onPrepareSave(settings) {
        // here you can encode values
        this.encryptedFields && this.encryptedFields.forEach((attr) => {
            if (settings[attr]) {
                settings[attr] = this.encrypt(settings[attr]);
            }
        });
    }

    getExtendableInstances() {
        return new Promise((resolve) => {
            this.socket.socket.emit('getObjectView', 'system', 'instance', null, (err, doc) => {
                if (err) {
                    resolve([]);
                } else {
                    resolve(doc.rows.filter((item) => item.value.common.webExtendable)
                        .map((item) => item.value));
                }
            });
        });
    }

    getIpAddresses(host) {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            this.socket.socket.emit('getHostByIp', host || this.common.host, (ip, _host) => {
                const IPs4 = [{
                    name: `[IPv4] 0.0.0.0 - ${i18n.t('Listen on all IPs')}`,
                    address: '0.0.0.0',
                    family: 'ipv4',
                }];
                const IPs6 = [{
                    name: '[IPv6] ::',
                    address: '::',
                    family: 'ipv6',
                }];
                if (_host) {
                    host = _host;
                    if (host.native.hardware && host.native.hardware.networkInterfaces) {
                        Object.keys(host.native.hardware.networkInterfaces)
                            .forEach((eth) => host.native.hardware.networkInterfaces[eth].forEach((inter) => {
                                if (inter.family !== 'IPv6') {
                                    IPs4.push({
                                        name: `[${inter.family}] ${inter.address} - ${eth}`,
                                        address: inter.address,
                                        family: 'ipv4',
                                    });
                                } else {
                                    IPs6.push({
                                        name: `[${inter.family}] ${inter.address} - ${eth}`,
                                        address: inter.address,
                                        family: 'ipv6',
                                    });
                                }
                            }));
                    }
                    // eslint-disable-next-line no-shadow
                    IPs6.forEach((ip) => IPs4.push(ip));
                }
                resolve(IPs4);
            });
        });
    }

    getIsChanged(native) {
        native = native || this.state.native;
        const isChanged = JSON.stringify(native) !== JSON.stringify(this.savedNative);

        if (isChanged) {
            window.changed = true;
        } else {
            window.changed = false;
        }
        return isChanged;
    }

    decrypt(value) {
        let result = '';
        for (let i = 0; i < value.length; i++) {
            // eslint-disable-next-line no-bitwise
            result += String.fromCharCode(this._secret[i % this._secret.length].charCodeAt(0) ^ value.charCodeAt(i));
        }
        return result;
    }

    encrypt(value) {
        let result = '';
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode(this._secret[i % this._secret.length].charCodeAt(0) ^ value.charCodeAt(i));
        }
        return result;
    }

    selectTab(tab, index) {
        window.localStorage[`${this.adapterName}-adapter`] = tab;
        this.selectedTab = tab;
        this.selectedTabNum = index;
        // this.setState({ selectedTab: tab, selectedTabNum: index });
    }

    onLoadConfig(newNative) {
        if (JSON.stringify(newNative) !== JSON.stringify(this.state.native)) {
            this.store.commit('template/updateField', {
                path: 'native',
                value: newNative,
            });
            this.store.commit('app/updateField', {
                path: 'changed',
                value: this.getIsChanged(newNative),
            });
        }
    }

    onSave(isClose) {
        let oldObj;
        if (this.state.isConfigurationError) {
            this.store.commit('app/updateField', {
                path: 'errorText',
                value: this.state.isConfigurationError,
            });
            return;
        }

        this.socket.getObject(this.instanceId)
            .then((_oldObj) => {
                oldObj = _oldObj || {};

                for (const a in this.state.native) {
                    if (this.state.native.hasOwnProperty(a)) {
                        oldObj.native[a] = this.state.native[a];
                    }
                }

                if (this.state.common) {
                    for (const b in this.state.common) {
                        if (this.state.common.hasOwnProperty(b)) {
                            oldObj.common[b] = this.state.common[b];
                        }
                    }
                }

                this.onPrepareSave(oldObj.native);

                return this.socket.setObject(this.instanceId, oldObj);
            })
            .then(() => {
                this.savedNative = JSON.parse(JSON.stringify(oldObj.native));
                this.store.commit('app/updateField', {
                    path: 'changed',
                    value: false,
                });

                window.changed = false;
                isClose && GenericApp.onClose();
            });
    }

    static onClose() {
        if (typeof window.parent !== 'undefined' && window.parent) {
            try {
                if (window.parent.$iframeDialog && typeof window.parent.$iframeDialog.close === 'function') {
                    window.parent.$iframeDialog.close();
                } else {
                    window.parent.postMessage('close', '*');
                }
            } catch (e) {
                window.parent.postMessage('close', '*');
            }
        }
    }

    showError(text) {
        this.store.commit('app/updateField', {
            path: 'errorText',
            value: text,
        });
    }

    setConfigurationError(errorText) {
        if (this.state.isConfigurationError !== errorText) {
            this.store.commit('app/updateField', {
                path: 'isConfigurationError',
                value: errorText,
            });
        }
    }

    static generateFile(filename, obj) {
        const el = window.document.createElement('a');
        el.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(obj, null, 2))}`);
        el.setAttribute('download', filename);

        el.style.display = 'none';
        window.document.body.appendChild(el);

        el.click();

        window.document.body.removeChild(el);
    }

    handleFileSelect(evt) {
        const f = evt.target.files[0];
        if (f) {
            const r = new window.FileReader();
            r.onload = (e) => {
                const contents = e.target.result;
                try {
                    const json = JSON.parse(contents);
                    if (json.native && json.common) {
                        if (json.common.name !== this.common.name) {
                            this.showError(i18n.t('otherConfig', { msg: json.common.name }));
                        } else {
                            this.onLoadConfig(json.native);
                        }
                    } else {
                        this.showError(i18n.t('invalidConfig'));
                    }
                    // eslint-disable-next-line no-shadow
                } catch (e) {
                    this.showError(e.toString());
                }
            };
            r.readAsText(f);
        } else {
            this.showError('Failed to open JSON File');
        }
    }

    download() {
        const result = {
            _id: `system.adapter.${this.common.name}.${this.instance}`,
            common: JSON.parse(JSON.stringify(this.common)),
            native: this.native,
        };
        // remove unimportant information
        if (result.common.news) {
            delete result.common.news;
        }
        if (result.common.titleLang) {
            delete result.common.titleLang;
        }
        if (result.common.desc) {
            delete result.common.desc;
        }

        // window.open('data:application/iobroker; content-disposition=attachment; filename=' + result._id + '.json,' + JSON.stringify(result, null, 2));
        GenericApp.generateFile(`${result._id}.json`, result);
    }

    upload() {
        const input = window.document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('id', 'files');
        input.setAttribute('opacity', 0);
        input.addEventListener('change', (e) => this.handleFileSelect(e, () => {}), false);
        (input.click)();
    }

    getMslRooms(list) {
        const result = {};
        const nnames = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const n in list) {
            // eslint-disable-next-line no-prototype-builtins
            if (list.hasOwnProperty(n)) {
                nnames.push(n);
            }
        }
        nnames.sort((a, b) => {
            a = a.toLowerCase();
            b = b.toLowerCase();
            if (a > b) {
                return 1;
            }
            if (a < b) {
                return -1;
            }
            return 0;
        });

        // eslint-disable-next-line no-plusplus
        for (let l = 0; l < nnames.length; l++) {
            result[nnames[l]] = list[nnames[l]].common.name || l;
            if (typeof result[nnames[l]] === 'object') {
                result[nnames[l]] = result[nnames[l]][this.socket.systemLang] || result[nnames[l]].en;
            }
        }

        return result;
    }

    getMslFunctions(list) {
        const result = {};

        const nnames = [];
        for (const n in list) {
            if (list.hasOwnProperty(n)) {
                nnames.push(n);
            }
        }
        nnames.sort((a, b) => {
            a = a.toLowerCase();
            b = b.toLowerCase();
            if (a > b) {
                return 1;
            }
            if (a < b) {
                return -1;
            }
            return 0;
        });

        for (let l = 0; l < nnames.length; l++) {
            result[nnames[l]] = list[nnames[l]].common.name || l;
            if (typeof result[nnames[l]] === 'object') {
                result[nnames[l]] = result[nnames[l]][this.socket.systemLang] || result[nnames[l]].en;
            }
        }

        return result;
    }
}

export default GenericApp;
