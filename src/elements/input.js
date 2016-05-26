let Core = require('./core');

function Input () {
  Core.call(this);

  this.tag = 'input';
  this.attrs = {
    type: 'text'
  };
}

Input.prototype.$change = function(ev) {
  this.setValue(ev.currentTarget.value);
}

module.exports = Input;
