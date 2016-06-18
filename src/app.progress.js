var settings = require('app.settings');
var UI = require('ui');

var progress = {
  currentSplash: undefined,
  begin: function(cb) {
    progress.currentSplash = new UI.Card({ 
      body: 'Sending...',
      bodyColor: settings.get('fgColor'),
      status: {color: settings.get('fgColor'),backgroundColor: settings.get('bgColor')},
      backgroundColor: settings.get('bgColor'),
      titleColor: settings.get('fgColor'),
      //banner: 'images/splash.png' 
    });
    progress.currentSplash.show();
    setTimeout(cb,300);
  },
  success: function() {
    var newsplash = new UI.Card({ 
      body: 'Done \uD83D\uDE0A',
      bodyColor: '#000000',
      status: {color: settings.get('fgColor'),backgroundColor: settings.get('bgColor')},
      backgroundColor: '#71DE8B',
      titleColor: '#000000',
      //banner: 'images/splash.png' 
    });
    newsplash.show();
    progress.currentSplash.hide();
    setTimeout(function(){newsplash.hide();}, 2000);
  },
  error: function() {
    var newsplash = new UI.Card({ 
      body: 'Error! \uD83D\uDE14',
      bodyColor: '#000000',
      status: {color: settings.get('fgColor'),backgroundColor: settings.get('bgColor')},
      backgroundColor: '#DE7171',
      titleColor: '#000000',
      //banner: 'images/splash.png' 
    });
    newsplash.show();
    progress.currentSplash.hide();
    setTimeout(function(){newsplash.hide();}, 2000);
  },
  content: function(oReq) {
    try {
      var answer = JSON.parse(oReq.responseText);
      var newsplash = new UI.Card({ 
        body: answer.body,
        title: answer.title,
        subtitle: answer.subtitle,
        status: {color: settings.get('fgColor'),backgroundColor: settings.get('bgColor')},
        backgroundColor: settings.get('bgColor'),
        subtitleColor: settings.get('fgColor'),
        titleColor: settings.get('fgColor'),
        bodyColor: settings.get('fgColor')
      });
      newsplash.show();
      progress.currentSplash.hide();
    } catch (e) {
      progress.error();
    }
  },
};

this.exports = progress;