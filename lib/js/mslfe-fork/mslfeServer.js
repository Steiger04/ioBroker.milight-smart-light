'use strict';

const path = require('path');
const tcpPortUsed = require('tcp-port-used');
const childProcess = require('child_process');

module.exports = async function (adapter) {
    const p = path.join(__dirname, '..', '..', '..', 'mslfe-ibr');

    const inUse = await tcpPortUsed.check(+adapter.config.serverPort).catch((err) => {
        adapter.log.error('mslfeServer:: ' + err.message);
    });

    if (inUse === true) {
        adapter.log.info('mslfeServer->::server with port ' + adapter.config.serverPort + ' is already in use!');
        return null;
    }

    const server = childProcess.spawn('npm start', [], {
        shell: true,
        cwd: p,
        env: {
            ...process.env,
            HOST: '0.0.0.0',
            WS_PORT: adapter.config.websocketPort,
            SERVER_PORT: adapter.config.serverPort
            // APPDATA: process.APPDATA
        }
    });

    server.on('close', () => {
        adapter.log.debug('mslServer was stopped!');
    });

    server.stderr.on('data', (data) => {
        adapter.log.debug(`mslfeServer:stderr::->${data}`);
    });

    return server;
};
