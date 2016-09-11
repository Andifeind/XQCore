var Core = require('./core');
var Tooltip = require('./tooltip');

/**
 * Renders an Text element
 *
 * @method Text
 *
 * @param  {[type]} name [description]
 */
function Text (name) {
  Core.call(this);

  var self = this;
  this.tag = 'div';
  this.tmpl = function(data) {
    self.errorLabel = new Tooltip();
    self.errorLabel.create();
    self.errorLabel.active = false;
    self.errorLabel.appendix = self.domEl;

    self.inputField = document.createElement('textarea');
    self.inputField.className = 'xq-text-field';
    self.inputField.setAttribute('name', self.name);

    var docFrag = document.createDocumentFragment();
    docFrag.appendChild(self.errorLabel.domEl);
    docFrag.appendChild(self.inputField);
    return docFrag;
  }

  this.name = name || 'text';
  this.cssClass = 'xq-text';
}

Text.prototype = Object.create(Core.prototype);
Text.prototype.constructor = Text;

Text.prototype.$change = function(fn) {
  var self = this;
  this.listen('change', function(ev) {
    fn({
      name: ev.target.name,
      value: ev.target.value
    }, ev, self);
  });
}

Text.prototype.setError = function (err) {
  this.errorLabel.content = err;
};

Text.prototype.getValue = function () {
  return this.inputField.value;
};

Text.prototype.setValue = function (value) {
  return this.inputField.value = value;
};

Object.defineProperty(Text.prototype, 'errMessage', {
  get: function() {
    return this.__errMessage;
  },
  set: function(errMessage) {
    this.errorLabel.active = !!errMessage;
    this.errorLabel.content = errMessage;
    this.__errMessage = errMessage;
  }
});

module.exports = Text;
