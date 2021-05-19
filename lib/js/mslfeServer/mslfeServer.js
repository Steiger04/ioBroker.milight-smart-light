const tcpPortUsed = require('tcp-port-used');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

exports.startAppServer = async (adapter) => {
  const port = +adapter.config.serverPort;
  let inUse;

  try {
    inUse = await tcpPortUsed.check(port);
  } catch (err) {
    adapter.log.error(`mslfeServer->::${err.message}`);
  }

  if (!inUse) {
    app.use(cors({preflightContinue: true}));
    app.use(express.static(path.join(__dirname, '..', '..', '..', '/mslfe-ibr-quasar')));

    app.get('/options', (req, res) => res.json({
      port: adapter.config.socketPort,
      debounceTime: adapter.config.debounceTime,
    }));
    app.get('*', (req, res) => res.redirect('/'));

    app.listen(port, adapter.log.info(`mslfeServer->:: Server for app is listening on port ${port}!`));
  } else {
    adapter.log.info(`mslfeServer->::Server for app was not started. Another application is already running with port ${port}!`);
  }
};
