var SyncModel = new XQCore.SyncModel('example', function(self) {
  self.on('data.change', function(data) {
    console.log('CHANGE', data);
    document.getElementsByClassName('counter')[0].innerHTML = data.counter;
  })
});
