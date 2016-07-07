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

/**
 * Creates the element
 * @method create
 * @chainable
 * @return {object} Returns this value
 */
Core.prototype.create = function() {
  var tagName = this.constructor.name;
  this.domEl = document.createElement(this.tag);
  var cssClass = tagName;
  if (this.cssClass) {
    cssClass += ' ' + this.cssClass;
  }

  if (this.attrs) {
    for (var attr in this.attrs) {
      if (this.attrs.hasOwnProperty(attr)) {
        this.domEl.setAttribute(attr, this.attrs[attr]);
      }
    }
  }

  this.domEl.className = cssClass;
  this.render({});
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
  var html;
  if (this.tmpl) {
    html = this.tmpl;
  }

  if (typeof html === 'function') {
    html = html(data);
  }

  if (typeof html === 'object') {
    while (this.domEl.firstChild) {
      this.domEl.removeChild(this.domEl.firstChild);
    }

    this.domEl.appendChild(html);
  } else {
    this.domEl.innerHTML = html;
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
      this.domEl.appendChild(el[i].domEl);
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

    this.domEl.appendChild(docFrac);
  }
  else {
    this.domEl.appendChild(el.domEl);
  }

  return this;
}

module.exports = Core;
