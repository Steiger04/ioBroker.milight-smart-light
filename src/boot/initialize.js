import GenericApp from '../js/GenericApp';

export default ({ Vue, store }) => {
    const props = {
        adapterName: 'milight-smart-light',
        encryptedFields: ['pass'],
        socket: { port: parseInt(window.location.port, 10) },
        store,
    };

    if (props.socket.port === 8080) {
        props.socket.port = 8081;
    }

    Vue.prototype.$connection = new GenericApp(props);
    Vue.prototype.$onClose = GenericApp.onClose;
};
