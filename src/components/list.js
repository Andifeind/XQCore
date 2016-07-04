var Core = require('./core');

function List() {
  Core.call(this);

  this.tag = 'ul';
  this.attrs = {
    type: 'text'
  };

  this.item = function(data) {
    return '<li>' + data + '</li>';
  };
}

List.prototype = Object.create(Core.prototype);
List.prototype.constructor = List;

List.prototype.render = function(data) {
  if (Array.isArray(data)) {
    data.forEach(function(item) {
      this.push(item);
    }, this);
  }
}

List.prototype.push = function(data) {
  var item = this.item;
  this.append(item(data));
}

List.prototype.child = function (el) {
  if (typeof el === 'string') {
    this.item = function(data) {
      return '<li>' + data + '</li>';
    };
  }
  else {
    this.item = el.render;
  }
};

module.exports = List;
