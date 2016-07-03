var Core = require('./core');

function Input () {
  Core.call(this);

  this.tag = 'input';
  this.attrs = {
    type: 'text'
  };
}

Input.prototype = Object.create(Core.prototype);
Input.prototype.constructor = Input;

Input.prototype.$change = function(ev) {
  this.setValue(ev.currentTarget.value);
}

module.exports = Input;
