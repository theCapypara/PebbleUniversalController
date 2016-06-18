var settings = {
  debug: false,
  confURL: 'http://parakoopa.de/pebble/uc.html',
  defaults: {
    timeout: 2000,
    servers: [],
    secret: "CHANGE_ME",
    fgColor: '#ffffff',
    bgColor: '#000000'
  },
  
  initDefaults: function() {
    for (var setting in settings.defaults) {
      console.log("Set settings? "+setting+":"+settings.get(setting));
      if (settings.get(setting) === null || settings.debug) {
        settings.set(setting, settings.defaults[setting]);
      }
    }
  },
  addListeners: function() {
    Pebble.addEventListener('showConfiguration', settings.showConfiguration);
    Pebble.addEventListener('webviewclosed', settings.saveConfiguration);
  },
  showConfiguration: function() {
    Pebble.openURL(settings._buildUrl(settings.confURL, {
      timeout: settings.get("timeout"),
      servers: settings.get("servers").join("::"),
      secret: settings.get("secret"),
      fgColor: settings.get("fgColor"),
      bgColor: settings.get("bgColor")
    }));
  },
  saveConfiguration: function(e) {
    // TODO
  },
  get: function(name) {
    return JSON.parse(localStorage.getItem(name));
  },
  set: function(name,value) {
    return localStorage.setItem(name, JSON.stringify(value));
  },
  _buildUrl: function(url, parameters) {
    var qs = "";
    for(var key in parameters) {
      var value = parameters[key];
      qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
    }
    if (qs.length > 0){
      qs = qs.substring(0, qs.length-1); //chop off last "&"
      url = url + "?" + qs;
    }
    return url;
  }
};

this.exports = settings;