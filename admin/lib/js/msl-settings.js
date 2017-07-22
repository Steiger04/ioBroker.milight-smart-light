$(document).ready(function () { // jshint ignore:line

  // !!! Überschreibt den Eintrag aus adapter-settings.js !!!
  // !!! In keiner Sprache verändern !!! Do not change in any language !!!
  systemDictionary.none = {'en': '0', 'de': '0', 'ru': '0'}; // jshint ignore:line
  systemDictionary.nonerooms = { // jshint ignore:line
    'en': '-------------------------',
    'de': '-------------------------',
    'ru': '-------------------------',
  };
  systemDictionary.nonefunctions = { // jshint ignore:line
    'en': '----------------------------------------',
    'de': '----------------------------------------',
    'ru': '----------------------------------------',
  };

  $('#tabs').tabs().on('tabsbeforeactivate', function (event) { // jshint ignore:line
    if ($('#tabs').tabs('option', 'active') === 0) { // jshint ignore:line
      if (mslvalidator.form() === false) { // jshint ignore:line
        event.preventDefault();
        confirmMessage(_('conError'), _('msgError'), 'alert', ['Ok']); // jshint ignore:line
      }
    }
  });

  mslvalidator = $('#controller').validate({ // jshint ignore:line
    rules: {
      controllerType: {
        required: true,
      },
      controllerIp: {
        required: true,
        ipv4: true,
      },
      controllerPort: {
        required: true,
        digits: true,
      },
      commandRepeat: {
        required: true,
        digits: true,
      },
      delayBetweenCommands: {
        required: true,
        digits: true,
      },
      broadcastMode: {
        required: true,
      },
      sendKeepAlive: {
        required: true,
      },
    },

    messages: { //TODO: Übersetzung fertigstellen.
      controllerType: {
        required: 'Die iBox-Version muss eingegeben werden!',
      },
      controllerIp: {
        required: 'Die IP der iBox muss eingegeben werden!',
        ipv4: function () {
          return _('conIpError'); // jshint ignore:line
        },
      },
      controllerPort: {
        required: 'Die Portnummer muss eingegeben werden!',
        digits: function () {
          return _('conPortError'); // jshint ignore:line
        },
      },
      commandRepeat: {
        required: 'Die Anzahl der Befehlswiederholungen muss eingegeben werden!',
        digits: function () {
          return _('conRepeatCommandError'); // jshint ignore:line
        },
      },
      delayBetweenCommands: {
        required: 'Die Pause zwischen den Befehlen muss eingegeben werden!',
        digits: function () {
          return _('conPauseBetweenCommandsError'); // jshint ignore:line
        },
      },
      broadcastMode: {
        required: 'Die Auswahl des Broadcast-Modus muss erfolgen!',
      },
      sendKeepAlive: {
        required: 'Die Auswahl von Send Keepalive muss erfolgen!',
      },
    },
    errorClass: 'msl-controller-error',
  });
});