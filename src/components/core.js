/**
 * Core element
 * Represents the root element. All elements inherits from this element
 *
 * @package XQCore
 * @module ViewElements
 * @submodule Core
 * @class Core
 */
function Core() {
  this.tag = 'section';
}

var EVENT_LISTENERS = [
  'change',
  'click',
  'keydown',
  'keyup'
];
/**
 * Creates the element
 * @method create
 * @chainable
 * @return {object} Returns this value
 */
Core.prototype.create = function() {
  var tagName = this.constructor.name;
  this.el = document.createElement(this.tag);
  this.el.className = tagName;
  this.render({});

  EVENT_LISTENERS.forEach(function(eventName) {
    var methodName = '$' + eventName;
    if (typeof this[methodName] === 'function') {
      this.el.addEventListener(eventName, methodName);
    }
  });
}

/**
 * Renders the elements content
 * @method render
 *
 * @param {object} data Render data
 *
 * @chainable
 * @return {object} Returns this value
 */
Core.prototype.render = function(data) {
  if (this.tmpl) {
    var html = this.tmpl;
    if (typeof html === 'function') {
      html = html(data);
    }

    this.el.innerHTML = html;
  }

  return this;
}

/**
 * Append one or multiple elements
 *
 * @method append
 * @param  {Object|Array} el Elements to been append
 *
 * @chainable
 * @return {Object}    Returns this value
 */
Core.prototype.append = function(el) {
  var i;
  
  if (Array.isArray(el)) {
    for (i = 0; i < el.length; i++) {
      this.el.appendChild(el[i].el);
    }

    return;
  }
  else if (typeof el === 'string') {
    var docFrac = document.createDocumentFragment();
    var div = document.createElement('div');
    div.innerHTML = el;
    for (i = 0; i < div.children.length; i++) {
      docFrac.appendChild(div.children[i]);
    }

    this.el.appendChild(docFrac);
  }
  else {
    this.el.appendChild(el.el);
  }

  return this;
}

module.exports = Core;
