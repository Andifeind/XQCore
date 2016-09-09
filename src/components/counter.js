var Core = require('./core');

/**
 * Counter component
 *
 * @package XQCore
 * @subpackage Components
 * @module Counter
 *
 * @example {js}
 * var cmp = new XQCore.Component('myCounter');
 * cmp.value = 3;
 */
function Counter () {
  Core.call(this);

  this.tag = 'span';
  this.cssClass = 'xq-counter';
  this.__value = 0;
}

Counter.prototype = Object.create(Core.prototype);
Counter.prototype.constructor = Counter

Object.defineProperty(Counter.prototype, 'value', {
  get: function() {
    return this.__value;
  },
  set: function(value) {
    this.__value = value;
    this.domEl.textContent = value;
  }
});

module.exports = Counter;
