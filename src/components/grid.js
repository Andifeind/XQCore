var Core = require('./core');

function Grid () {
  Core.call(this);

  this.tag = 'div';
  this.cssClass = 'xq-grid';
  this.__items = [];
  this.child = function(data) {
    return '<div class="item">' + data.value + '</div>';
  };
}

Grid.prototype = Object.create(Core.prototype);
Grid.prototype.constructor = Grid;

Grid.prototype.push = function(data) {
  this.__items.push(data);
  this.append(this.child(data));
}

Grid.prototype.child = function (el) {
  if (typeof el === 'string') {
    this.item = function(data) {
      return '<div>' + data.value + '</div>';
    };
  }
  else {
    this.item = el.render;
  }
};

Object.defineProperty(Grid.prototype, 'items', {
  get: function() {
    return this.__items;
  }
});

Object.defineProperty(Grid.prototype, 'length', {
  get: function() {
    return this.__items.length;
  }
});

module.exports = Grid;
