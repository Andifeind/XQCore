var SyncList = new XQCore.SyncList('example', function(self) {
  self.on('item.push', function(data) {
    console.log('LIST CHANGE', data);
    var logs = data.toArray().map(function(log) {
      return '<span>' + log.browser + ' at ' + log.time + '</span>'
    });

    document.getElementsByClassName('statuslog')[0].innerHTML = logs.join('<br>');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementsByClassName('addValue')[0].addEventListener('submit', function() {
    var data = new FormData();
    data.append('value', document.getElementsByName('value')[0].value);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '//localhost:6446/list/add');
    xhr.send(data);
  });
});
