var SyncModel = new XQCore.SyncModel('example', function(self) {
  self.on('data.change', function(data) {
    console.log('CHANGE', data);
    document.getElementsByClassName('counter')[0].innerHTML = data.counter;
    document.getElementsByClassName('connections')[0].innerHTML = data.connections;
  });
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementsByClassName('countLink')[0].addEventListener('click', function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//localhost:6446/count');
    xhr.send();
  });
});
