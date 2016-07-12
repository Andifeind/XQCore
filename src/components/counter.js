var Core = require('./core');

function Counter () {
  Core.call(this);

  this.tag = 'span';
  this.cssClass = 'xq-counter';
}

Counter.prototype = Object.create(Core.prototype);
Counter.prototype.constructor = Counter

Object.defineProperty(Counter.prototype, 'content', {
  get: function() {
    return this.domEl.textContent;
  },
  set: function(content) {
    this.domEl.textContent = content;
  }
});

module.exports = Counter;
