(function() {
  loadOptions();
  submitHandler();
})();

function submitHandler() {
  var $submitButton = $('#submitButton');

  $submitButton.on('click', function() {
    var conf = getAndStoreConfigData();
    document.location = "pebblejs://close#" + encodeURIComponent(JSON.stringify(conf));
  });
}

function loadOptions() {

  $('.setting').each(function() {
    var field = this.id.substring(2);
    this.value = getQueryVariable(field);
  });

  var servers;
  if ((servers = getQueryVariable("servers").split('::')).length > 0) {
    $serverContainer = $('#i_server');

    for (var entry in servers) {
      if (!servers.hasOwnProperty(entry)) continue;
      var server = servers[entry];

      var serverEntry = $('<div class="item">'+server+'</div>');
      var deletebutton = $('<div class="delete-item"></div>');

      deletebutton.click(function(){
        $(this).parent().remove();
      });

      serverEntry.append(deletebutton);

      $serverContainer.append(serverEntry);
    }
  }
}

function getAndStoreConfigData() {
  var options = {};
  $('.setting').each(function() {
    var field = this.id.substring(2);
    options[field] = this.value;
  });

  var servers;
  $serverContainerChildren = $('#i_server').children();
  options["servers"] = [];
  for (var entry in $serverContainerChildren) {
    if (!$serverContainerChildren.hasOwnProperty(entry)) continue;
    var server = $($serverContainerChildren[entry]);
    if (server.hasClass('add-item')) continue;
    options["servers"].push(server.text())
  }
  options["servers"] = options["servers"].join("::");
  return options;
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return '';
}