var Core = require('./core');

function Tooltip () {
  Core.call(this);

  this.tag = 'div';
  this.cssClass = 'xq-tooltip';
}

Tooltip.prototype = Object.create(Core.prototype);
Tooltip.prototype.constructor = Tooltip;

Object.defineProperty(Tooltip.prototype, 'content', {
  get: function() {
    return this.__content;
  },
  set: function(content) {
    this.domEl.textContent = content;
    this.__content = content;
  }
});

module.exports = Tooltip;
