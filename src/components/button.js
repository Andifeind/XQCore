var Core = require('./core');

/**
 * Renders a Button element
 *
 * @method Button
 *
 * @param  {[type]} name [description]
 */
function Button (name) {
  Core.call(this);

  this.tag = 'button';
  this.name = name || 'button';
  this.cssClass = 'xq-button';
  this.attrs = {
    type: 'button'
  };

  this.action = 'none';
}

Button.prototype = Object.create(Core.prototype);
Button.prototype.constructor = Button;

Button.prototype.$click = function(fn) {
  var self = this;
  this.listen('click', function(ev) {
    console.log('CLICK', ev);
    fn({
      name: ev.target.name,
      form: ev.target.form
    }, ev, self);
  });
}

Button.prototype.onElementReady = function() {
  var self = this;
  if (self.action === 'submit') {
    self.addAttribute('type', 'submit');

    return;
  }
}

Button.prototype.setError = function (err) {
  this.errorLabel.content = err;
};

Button.prototype.getValue = function () {
  return this.inputField.value;
};

Button.prototype.setValue = function (value) {
  return this.inputField.value = value;
};

Object.defineProperty(Button.prototype, 'content', {
  get: function() {
    return this.__content;
  },
  set: function(content) {
    this.domEl.textContent = content;
    this.__content = content;
  }
});

module.exports = Button;
