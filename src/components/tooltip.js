var Core = require('./core');

function Tooltip () {
  Core.call(this);

  var self = this;
  this.tag = 'div';
  this.tmpl = function(data) {
    return docFrag;
  }

  this.cssClass = 'xq-tooltip';
}

Tooltip.prototype = Object.create(Core.prototype);
Tooltip.prototype.constructor = Tooltip;

module.exports = Tooltip;
