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

  this.__active = true;
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
  var html = '';
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

Core.prototype.appendTo = function(container) {
  container.appendChild(this.domEl);
};

Core.prototype.hasClass = function(className) {
  var classList = this.domEl.className;
  if (!classList) {
    this.domEl.className = className;
    return false;
  }

  var reg = new RegExp('\\b' + className + '\\b');
  return reg.test(classList);
};

Core.prototype.addClass = function(className) {
  var classList = this.domEl.className;
  if (!classList) {
    this.domEl.className = className;
    return;
  }

  var reg = new RegExp('\\b' + className + '\\b');
  if (!reg.test(classList)) {
    this.domEl.className += ' ' + className
  }
};

Core.prototype.removeClass = function(className) {
  var classList = this.domEl.className;
  var reg = new RegExp(' ?\\b' + className + '\\b ?');
  this.domEl.className = classList.replace(reg, '');
};

Core.prototype.toHTML = function() {
  return this.domEl.outerHTML;
};

Core.prototype.listen = function(event, fn) {
  this.domEl.addEventListener(event, fn);
};

Core.prototype.listenOnce = function(event, fn) {
  var self = this;
  var listener = function(ev) {
    self.domEl.removeEventListener(event, listener);
    fn(ev);
  };

  this.domEl.addEventListener(event, listener);
};

Object.defineProperty(Core.prototype, 'state', {
  get: function() {
    return this.__state;
  },
  set: function(state) {
    this.removeClass('xq-' + this.__state);
    this.addClass('xq-' + state);
    this.__state = state;
  }
});

Object.defineProperty(Core.prototype, 'active', {
  get: function() {
    return this.__active;
  },
  set: function(active) {
    if (active) {
      this.domEl.style.display = '';
      this.removeClass('xq-inactive');
      this.__active = true;
    }
    else {
      this.addClass('xq-inactive');
      this.__active = false;
    }
  }
});

module.exports = Core;
