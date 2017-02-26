var SyncList = new XQCore.SyncList('example', function(self) {
  self.on('item.push', function(data) {
    console.log('LIST CHANGE', data);
    var logs = self.toArray().map(function(log) {
      return '<li>' + log.value + '</li>';
    });

    document.getElementsByClassName('list')[0].innerHTML = logs.join('');
  });
});

var ConnectionModel = new XQCore.SyncModel('connectionCounter', function(self) {
  self.on('data.change', function(data) {
    document.getElementsByClassName('connections')[0].innerHTML = data.connections;
  });
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementsByClassName('add-value-form')[0].addEventListener('submit', function(e) {
    e.preventDefault();

    var data = {};
    data.value = document.getElementsByName('value')[0].value;
    document.getElementsByName('value')[0].value = '';

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '//localhost:6446/list/');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(data));

    return false;
  });
});
