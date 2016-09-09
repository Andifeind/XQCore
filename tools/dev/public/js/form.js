var todoModel = new XQCore.Model('todo', function(self) {
  self.defaults = {
    title: '',
    description: ''
  };
});

var TodoForm = function() {

};

TodoForm.prototype.method = function() {
}

XQCore.registerComponent('Todo', function() {

});

var counterComponent = new XQCore.Component('Form', [
  { name: 'title', label: 'Title', type: 'string', min: 3, max: 200 },
  { name: 'description', label: 'Description', type: 'text', min: 3, max: 2000 }
]);
counterComponent.couple(todoModel);

document.addEventListener('DOMContentLoaded', function() {
  counterComponent.appendTo(document.getElementsByClassName('sandBox')[0]);
});
