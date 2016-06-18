/**
 * Pebble Universal Controller
 *
 * Menu
 *
 * Copyright 2016 - Parakoopa <parakoopa@live.de>
 * Licensed under MIT. See LICENSE file for details.
 */

var settings = require('app.settings');
var progress = require('app.progress');
var UI = require('ui');

var menu = {
  errors: 0,
  main: undefined,
  nextSectionIndex: 0,
  isLoaded: false,
  mainMenu: undefined,
  sections: [],
  
  start: function(name) {
    menu.showWait();
    
    // TODO: Add support for multiple servers
    var servers = settings.get('servers');
    for (var i = 0; i < servers.length; i++) {
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("error", menu.error);
      oReq.addEventListener("timeout", menu.error);
      oReq.timeout = settings.get('timeout');
      oReq._url = servers[i];
      oReq.open("GET", oReq._url); 
      oReq.addEventListener("load", function() {
        // NOTE 06/12/16: 
        // Due to a bug in CloudPebble this doesn't work in the CloudPebble emulator ("this" is incorrectly the module in the emulator!)
        // This is also the reason I was using menu.xyz instead of this.xyz everywhere...
        menu.loaded(this);
      });
      oReq.send();
    }
  },
  showWait: function() {
    menu.main = new UI.Card({
      title: 'Universal Controller',
      //icon: 'images/menu_icon.png',
      body: 'Loading actions...',
      status: {color: settings.get('fgColor'),backgroundColor: settings.get('bgColor')},
      backgroundColor: settings.get('bgColor'),
      titleColor: settings.get('fgColor'),
      bodyColor: settings.get('fgColor')
    }).show();
  },
  loaded: function(oReq) {
    try {
      var menuCandidate = JSON.parse(oReq.responseText);
      if (!menuCandidate.secret || menuCandidate.secret != settings.get('secret') || !menuCandidate.name || !menuCandidate.items || oReq.status !== 200) {
        console.log("Couldn't load "+oReq._url+": Invalid secret or data");
        return menu.error();
      } else {
        // LOADED SUCCESSFULLY - Try to render
        menu.initMainMenu();
        menu.add(menuCandidate);
        
      }
    } catch (e) {
      console.log("Couldn't load "+oReq._url+": Invalid content");
      return menu.error();
    }
  },
  initMainMenu: function() {
    if (menu.isLoaded) return true;
    menu.isLoaded = true;
    menu.mainMenu = new UI.Menu({
      backgroundColor: settings.get('bgColor'),
      textColor: settings.get('fgColor'),
      highlightBackgroundColor: settings.get('fgColor'),
      highlightTextColor: settings.get('bgColor'),
      status: {color: settings.get('fgColor'),backgroundColor: settings.get('bgColor')},
      sections: []
    });
    menu.main.hide();
    menu.mainMenu.show();
    
    menu.mainMenu.on('select', function(e) {
      menu.selected(e);
    });
  },
  add: function(menuToAdd) {
    menu.sections[menu.nextSectionIndex] = menuToAdd;
    menu.mainMenu.section(menu.nextSectionIndex, {
      title: menuToAdd.name,
      items: menuToAdd.items
    });
    menu.nextSectionIndex++;
  },
  selected: function(e) {
    var oReq = new XMLHttpRequest();
    switch (e.item.actionType) {
      case "submenu":
        menu.openSubmenu(e);
        break;
      case "silent":
        oReq._url = e.item.action;
        oReq.open("GET", oReq._url); 
        oReq.send();
        break;
      case "status":
        progress.begin(function() {
          oReq._url = e.item.action;
          oReq.open("GET", oReq._url); 
          oReq.addEventListener("load", function() {oReq.status === 200 ? progress.success(this) : progress.error(this);});
          oReq.addEventListener("error", progress.error);
          oReq.send();
        });
        break;
      case "content":
        progress.begin(function() {
          oReq._url = e.item.action;
          oReq.open("GET", oReq._url); 
          oReq.addEventListener("load", function() {oReq.status === 200 ? progress.content(this) : progress.error(this);});
          oReq.addEventListener("error", progress.error);
          oReq.send();
        });
        break;
    }
  },
  openSubmenu: function(e) {
    var submenu = new UI.Menu({
      backgroundColor: settings.get('bgColor'),
      textColor: settings.get('fgColor'),
      highlightBackgroundColor: settings.get('fgColor'),
      highlightTextColor: settings.get('bgColor'),
      status: {color: settings.get('fgColor'),backgroundColor: settings.get('bgColor')},
      sections: [{"items": e.item.submenu, "title":e.section.title+" > "+e.item.title}]
    });
    submenu.on('select', function(e) {
      menu.selected(e);
    });
    submenu.show();
  },
  error: function() {
    if (menu.isLoaded) return;
    menu.errors++;
    if (menu.errors >= settings.get('servers').length) {
      menu.timeout();
    }
  },
  timeout: function(name,value) {
    menu.main.hide();
    new UI.Card({
      title: 'Universal Controller',
      //icon: 'images/menu_icon.png',
      body: 'Nobody sent any commands \uD83D\uDE14.',
      bodyColor: '#ff0000',
      status: {color: settings.get('fgColor'),backgroundColor: settings.get('bgColor')},
      backgroundColor: settings.get('bgColor'),
      titleColor: settings.get('fgColor')
    }).show();
  },
  notSetUp: function() {
    new UI.Card({
      title: 'Universal Controller',
      //icon: 'images/menu_icon.png',
      body: 'Please add servers in the config first.',
      bodyColor: '#ff0000',
      status: {color: settings.get('fgColor'),backgroundColor: settings.get('bgColor')},
      backgroundColor: settings.get('bgColor'),
      titleColor: settings.get('fgColor')
    }).show();
    }
};

this.exports = menu;