var Core = require('./core');
var Tooltip = require('./tooltip');

/**
 * Renders an Input element
 *
 * @method Input
 *
 * @param  {[type]} name [description]
 */
function Input (name) {
  Core.call(this);

  var self = this;
  this.tag = 'div';
  this.tmpl = function(data) {
    self.errorLabel = new Tooltip();
    self.errorLabel.create();
    self.errorLabel.active = false;
    self.errorLabel.appendix = self.domEl;

    self.inputField = document.createElement('input');
    self.inputField.className = 'xq-input-field';
    self.inputField.setAttribute('type', self.type);
    self.inputField.setAttribute('name', self.name);

    var docFrag = document.createDocumentFragment();
    docFrag.appendChild(self.errorLabel.domEl);
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
    fn({
      name: ev.target.name,
      value: ev.target.value
    }, ev);
  });
}

Input.prototype.setError = function (err) {
  this.errorLabel.content = err;
};

Input.prototype.getValue = function () {
  return this.inputField.value;
};

Input.prototype.setValue = function (value) {
  return this.inputField.value = value;
};

Object.defineProperty(Input.prototype, 'errMessage', {
  get: function() {
    return this.__errMessage;
  },
  set: function(errMessage) {
    this.errorLabel.active = !!errMessage;
    this.errorLabel.content = errMessage;
    this.__errMessage = errMessage;
  }
});

module.exports = Input;
