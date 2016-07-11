var Core = require('./core');

function ProgressBar () {
  Core.call(this);

  this.tag = 'span';
  this.cssClass = 'xq-progress-bar';
  this.__value = 0;

  var self = this;
  this.tmpl = function() {
    self.bar = document.createElement('span');
    self.bar.className = 'bar';
    self.drawBar();

    return self.bar;
  }
}

ProgressBar.prototype = Object.create(Core.prototype);
ProgressBar.prototype.constructor = ProgressBar;

ProgressBar.prototype.drawBar = function() {
  if (this.hasClass('vertical')) {
    this.bar.style.height = this.__value + '%';
  }
  else {
    this.bar.style.width = this.__value + '%';
  }
};

Object.defineProperty(ProgressBar.prototype, 'value', {
  get: function() {
    return this.__value;
  },
  set: function(value) {
    this.__value = Math.min(100, Math.max(value, 0));
    this.drawBar();
  }
});

module.exports = ProgressBar;
