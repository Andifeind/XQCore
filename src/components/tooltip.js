/**
 * Tooltip component
 *
 * @package XQCore
 * @subpackage Components
 * @model Tooltip
 */

'use strict';

var Core = require('./core');

function Tooltip () {
  Core.call(this);

  this.tag = 'div';
  this.cssClass = 'xq-tooltip';
}

Tooltip.prototype = Object.create(Core.prototype);
Tooltip.prototype.constructor = Tooltip

Tooltip.prototype.setPosition = function() {
  this.domEl.style.top = -this.domEl.offsetHeight + this.appendix.offsetTop - 10 + 'px';
};

Object.defineProperty(Tooltip.prototype, 'content', {
  get: function() {
    return this.__content;
  },
  set: function(content) {
    this.domEl.textContent = content;
    this.__content = content;
    this.setPosition();
  }
});

module.exports = Tooltip;
