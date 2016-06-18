/**
 * Pebble Universal Controller
 *
 * Main file
 *
 * Copyright 2016 - Parakoopa <parakoopa@live.de>
 * Licensed under MIT. See LICENSE file for details.
 */

var settings = require('app.settings');
var menuController = require('app.menu');
settings.initDefaults();
settings.addListeners();

if (settings.get('servers').length === 0) {
  menuController.notSetUp();
} else {
  menuController.start();
}