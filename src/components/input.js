var Core = require('./core');

function Input (name) {
  Core.call(this);

  this.tag = 'input';
  this.name = name || 'input';
  this.attrs = {
    type: 'text',
    name: this.name
  };
}

Input.prototype = Object.create(Core.prototype);
Input.prototype.constructor = Input;

Input.prototype.$change = function(fn) {
  this.domEl.addEventListener('change', function(ev) {
    fn({
      name: ev.target.name,
      value: ev.target.value
    }, ev);
  });
}

module.exports = Input;
