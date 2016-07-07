var Core = require('./core');

function Input (name) {
  Core.call(this);

  var self = this;
  this.tag = 'div';
  this.tmpl = function(data) {
    self.errorLabel = document.createElement('span');
    self.errorLabel.className = 'xq-error-label';

    self.inputField = document.createElement('input');
    self.inputField.className = 'xq-input-field';
    self.inputField.setAttribute('type', self.type);
    self.inputField.setAttribute('name', self.name);

    var docFrag = document.createDocumentFragment();
    docFrag.appendChild(self.errorLabel);
    docFrag.appendChild(self.inputField);
    return docFrag;
  }

  this.name = name || 'input';
  this.type = 'text';
  this.cssClass = 'xq-input';
}

Input.prototype = Object.create(Core.prototype);
Input.prototype.constructor = Input;

Input.prototype.$change = function(fn) {
  this.listen('change', function(ev) {
    console.log('CHANGE', ev);
    fn({
      name: ev.target.name,
      value: ev.target.value
    }, ev);
  });
}

Input.prototype.setError = function (err) {
  this.errorLabel.innerHTML = err;
  this.listenOnce('keydown', function() {
    
  }, this.errorLabel);
};

Input.prototype.getValue = function () {
  return this.inputField.value;
};

Input.prototype.setValue = function (value) {
  return this.inputField.value = value;
};

module.exports = Input;
