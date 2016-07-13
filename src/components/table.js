var Core = require('./core');

function Table () {
  Core.call(this);

  this.tag = 'table';
  this.cssClass = 'xq-table';
  this.__items = [];
  this.child = function(data) {
    return '<tr><td>' + data.value + '</td></tr>';
  };
}

Table.prototype = Object.create(Core.prototype);
Table.prototype.constructor = Table;

Table.prototype.push = function(data) {
  this.__items.push(data);
  this.append(this.child(data));
}

Object.defineProperty(Table.prototype, 'items', {
  get: function() {
    return this.__items;
  }
});

Object.defineProperty(Table.prototype, 'length', {
  get: function() {
    return this.__items.length;
  }
});

module.exports = Table;
