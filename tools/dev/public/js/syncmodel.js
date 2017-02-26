var counterModel = new XQCore.SyncModel('hitcounter', function(self) {
  self.defaults = {
    counter: '-'
  };
});

var connectionModel = new XQCore.SyncModel('connectionCounter', function(self) {
  self.on('data.change', function(data) {
    document.getElementsByClassName('connections')[0].innerHTML = data.connections;
  });
});

var counterComponent = new XQCore.Component('Counter');
counterComponent.couple(counterModel, 'counter');

document.addEventListener('DOMContentLoaded', function() {
  counterComponent.appendTo(document.getElementsByClassName('counter')[0]);
  document.getElementsByClassName('countLink')[0].addEventListener('click', function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//localhost:6446/count');
    xhr.send();
  });
});
