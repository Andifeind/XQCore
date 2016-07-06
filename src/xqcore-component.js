/**
 * XQCore Component module
 *
 * A view renders a .fire or .hbs template and injects the result into the dom.
 *
 * @module Component
 * @returns {object} Returns a XQCore.Component prototype object
 */
'use strict';

var Logger = require('./xqcore-logger');
var EventEmitter = require('./xqcore-event');
var cmpElements = {
  Core: require('./components/core'),
  Input: require('./components/input'),
  List: require('./components/list'),

  NotFoundElement: require('./components/notFound'),
  PageSection: require('./components/pageSection'),
  PageRoot: require('./components/pageRoot'),
  PageHeader: require('./components/pageHeader'),
  PageFooter: require('./components/pageFooter')
};

var log;

/**
 * XQCore.Component
 *
 * @class Component
 * @constructor
 *
 * @param {object} conf Component configuration
 */
function Component(tag, name) {
  EventEmitter.call(this);

  log = new Logger(tag + 'Component');

  log.debug('Create new view');
  if (!cmpElements[tag]) {
    tag = 'NotFoundElement';
  }

  var el = new cmpElements[tag](name);
  el.create();
  this.el = el;

  this.registerEventListener();
}

Component.prototype = Object.create(EventEmitter.prototype);
Component.prototype.constructor = Component;

/**
 * Sets a view state
 * @param {[type]} state [description]
 */
Component.prototype.setState = function (state) {
  if (this.state) {
    this.removeClass('state-' + this.state);
  }

  this.state = state;
  this.addClass('state-' + this.state);
  return this;
};

Component.prototype.appendTo = function(container) {
  container.appendChild(this.el.domEl);
};

Component.prototype.toHTML = function () {
  return this.el.domEl.outerHTML;
};

Component.prototype.push = function(item) {
  this.el.push(item);
}

Component.prototype.registerEventListener = function() {
  if (this.el.$change) {
    var self = this;
    this.el.$change(function(data, ev) {
      self.emit('value.change', data);
    });
  }
}

/**
 * Sets a name attribute
 * @method setName
 * @version 1.0.0
 *
 * @param {string} name Attribute name
 */
Component.prototype.setName = function(name) {
  this.el.domEl.setAttribute('name', name);
};

/**
 * Gets a name attribute
 * @method getName
 * @version 1.0.0
 *
 * @param {string} name Attribute name
 */
Component.prototype.getName = function(name) {
  return this.el.domEl.getAttribute('name');
};



/**
 * Sets component state
 * @method setState
 * @version 1.0.0
 *
 * @param {string} state State name
 */
Component.prototype.setState = function(state) {
  console.log('State', state);
  this.el.domEl.setAttribute('name', name);
};
/*
class XQComponent {
  constructor(tag) {
    log = new Logger(tag + 'Component');

    log.debug('Create new view');
    if (!HTMLElements[tag]) {
      tag = 'NotFoundElement';
    }

    let el = new HTMLElements[tag]();
    el.create();
    this.el = el;
  }

  injectInto(domSelector) {
    domSelector.appendChild(this.el.el);
  }

  append(el) {
    if (Array.isArray(el)) {
      for (var i = 0; i < el.length; i++) {
        this.el.el.appendChild(el[i].el.el);
      }

      return;
    }

    this.el.el.appendChild(el.el.el);
  }

  static registerHTMLComponent(name, component) {
    HTMLElements[name] = component;
  }
}
*/
//--

module.exports = Component;
