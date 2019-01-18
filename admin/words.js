'use strict'

systemDictionary = {
  'none': {'en': '0', 'de': '0', 'ru': '0'},
  'nonerooms': {
    'en': '-------------------------',
    'de': '-------------------------',
    'ru': '-------------------------',
  },
  'nonefunctions': {
    'en': '----------------------------------------',
    'de': '----------------------------------------',
    'ru': '----------------------------------------',
  },
  'adapterSettings': {
    'en': 'Configure the controller and select the Zones',
    'de': 'Konfiguration des WiFi iBox Controllers und der Zonen',
    'ru': 'Настройка контроллера и выбор зон',
  },
  'onSaveAdapter': {
    'en': 'on save adapter restarts with new config immediately!',
    'de': 'Werden Einstellungen gespeichert, startet der Adapter sofort neu!',
    'ru': 'Сразу после сохранения настроек драйвер перезапуститься с новыми значениями!',
  },
  'requiredFields': {
    'en': 'A zone is only created in the object tree if the fields "active", "Zone", "Name (Zone)" and "Type" have been set.',
    'de': 'Eine Zone wird im Objektbaum nur angelegt, wenn die Felder "aktiv", "Zone", "Name(Zone)" und "Typ" gesetzt wurden.',
    'ru': 'A zone is only created in the object tree if the fields: "active", "Zone", "Name (Zone)" and "Type" have been set.'
  },
  'selectController': {'en': 'Please select controller . . ', 'de': 'Bitte Controller wählen . . .', 'ru': 'Выберите контроллер'},

  // Tabs
  'tabMslApp': {'en': 'MSL App', 'de': 'MSL App', 'ru': 'MSL App'},
  'tabController': {'en': 'Controller', 'de': 'Controller', 'ru': 'Контроллер'},
  'tabZones': {'en': 'Zones', 'de': 'Zonen', 'ru': 'Зоны'},

  'controllerParameter': {'en': 'Controller-Parameter', 'de': 'Controller-Parameter', 'ru': 'Параметры контроллера'},
  'createZones': {'en': 'Create zones', 'de': 'Zonen anlegen', 'ru': 'Создать зоны'},

  // Controller
  'conType': {'en': 'Type', 'de': 'Typ', 'ru': 'Тип'},
  'conIp': {'en': 'IP', 'de': 'IP', 'ru': 'IP'},
  'conPort': {'en': 'Port', 'de': 'Port', 'ru': 'Порт'},
  'conRepeatCommand': {'en': 'Repetition of Commands', 'de': 'Befehlswiederholungen', 'ru': 'Повтор команд'},
  'conPauseBetweenCommands': {'en': 'Pause between two commands', 'de': 'Pause zwischen zwei Befehlen', 'ru': 'Пауза между командами'},
  'conIps': {'en': 'Controller IP\'s', 'de': 'Controller IP\'s', 'ru': 'Controller IP\'s'},

  // MSL App
  'activeApp': {'en': 'Activate the milight-smart-light app', 'de': 'Aktivieren der milight-smart-light App', 'ru': '???'},
  'serverPort': {'en': 'Server Port', 'de': 'Server Port', 'ru': '???'},
  'websocketPort': {'en': 'Websocket Port', 'de': 'Websocket Port', 'ru': '???'},


  // Controller Error
  'noController': {
    'en': 'There is no controller in your network.',
    'de': 'Es wurde kein Controller im Netzwerk gefunden.',
    'ru': 'Ничего не найдено',
  },
  'noInstance': {
    'en': 'The instance is not activted.',
    'de': 'Die Instanz ist nicht aktiviert.',
    'ru': '???',
  },
  'conError': {'en': 'Error in your controller-parameter!', 'de': 'Fehler in Controller-Parameter!', 'ru': 'Ошибка в настройках контроллера'},
  'conIpError': {'en': 'IP has a wrong format.', 'de': 'IP hat ein falsches Format.', 'ru': 'Неверный формат IP'},
  'conPortError': {
    'en': 'Wrong format (you can only use integers)',
    'de': 'Das Format ist nicht korrekt (nur ganze Zahlen sind erlaubt)!',
    'ru': 'Неправильный формат (разрешены только целые числа)',
  },
  'conRepeatCommandError': {
    'en': 'Wrong format (you can only use integers)',
    'de': 'Das Format ist nicht korrekt (nur ganze Zahlen sind erlaubt)!',
    'ru': 'Неправильный формат (разрешены только целые числа)?',
  },
  'conPauseBetweenCommandsError': {
    'en': 'Wrong format (you can only use integers)',
    'de': 'Das Format ist nicht korrekt (nur ganze Zahlen sind erlaubt)!',
    'ru': 'Неправильный формат (разрешены только целые числа)',
  },

  // Zonen
  'thactive': {'en': 'active', 'de': 'aktiv', 'ru': 'активно'},
  'thzonenumber': {'en': 'Zone', 'de': 'Zone', 'ru': 'Зона'},
  'thgroupname': {'en': 'Group (Zone)', 'de': 'Gruppe (Zone)', 'ru': '???'},
  'thzonetype': {'en': 'Type (Zone)', 'de': 'Typ (Zone)', 'ru': '???'},
  'thzonename': {'en': 'Name (Zone)', 'de': 'Name (Zone)', 'ru': '???'},
  'throom': {'en': 'Room', 'de': 'Raum', 'ru': 'Комната'},
  'thfunction': {'en': 'Function(s)', 'de': 'Gruppe(n)', 'ru': 'Функция'},

  'select': {'en': 'Please select', 'de': 'Bitte auswählen', 'ru': 'Выберите'},

  'zone1': {'en': 'one', 'de': 'eins', 'ru': 'один'},
  'zone2': {'en': 'two', 'de': 'zwei', 'ru': 'два'},
  'zone3': {'en': 'three', 'de': 'drei', 'ru': 'три'},
  'zone4': {'en': 'four', 'de': 'vier', 'ru': 'четыре'},
  'zone5': {'en': 'five', 'de': 'fünf', 'ru': 'пять'},
  'zone6': {'en': 'six', 'de': 'sechs', 'ru': 'пять'},
  'zone7': {'en': 'seven', 'de': 'sieben', 'ru': '???'},
  'zone8': {'en': 'eight', 'de': 'acht', 'ru': '???'},
  'zone9': {'en': 'nine', 'de': 'neun', 'ru': '???'},

  'white': {'en': 'White', 'de': 'Weiß', 'ru': 'White'},
  'rgbw': {'en': 'RGB(W)', 'de': 'RGB(W)', 'ru': 'RGB(W)'},
  'fullColor': {'en': 'RGB + CWWW', 'de': 'RGB + CWWW', 'ru': 'RGB + CWWW'},
  'fullColor8Zone': {'en': 'RGB(8) + CWWW', 'de': 'RGB(8) + CWWW', 'ru': 'RGB(8) + CWWW'},
  'bridge': {'en': 'Bridge (iBox1)', 'de': 'Bridge (iBox1)', 'ru': 'Bridge (iBox1)'},


  //Messages
  'msgWarning': {'en': 'Warning', 'de': 'Warnung', 'ru': 'Ошибка'},
  'msgError': {'en': 'Error', 'de': 'Fehler', 'ru': 'Ошибка'},

  'msgMultipleZones': {
    'en': 'Don\'t use equal zones.', 'de': 'Zonen dürfen nicht doppelt belegt werden.', 'ru': 'Нельзя использовать зоны дважды',
  },

  'msgOnlyOneBridge': {
    'en': 'Only one iBox1 zone (zone 5)  can be of type bridge.',
    'de': 'Nur eine Zone (Zone 5) der iBox1 kann vom Typ Bridge sein.',
    'ru': 'Только одна зона (зона 5) в iBox1 может иметь тип Bridge',
  },

  'msgChangeCT': {
    'en': 'Changing controller type will delete all zones.',
    'de': 'Durch die Änderung des Controllertyps werden alle Zonen gelöscht.',
    'ru': 'При измении типа контроллера все зоны будут удалены',
  },
};
