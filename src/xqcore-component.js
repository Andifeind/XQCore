/**
 * XQCore Component module
 *
 * A view renders a .fire or .hbs template and injects the result into the dom.
 *
 * @module Component
 * @returns {object} Returns a XQCore.Component prototype object
 */
'use strict';

var XQCore = require('./xqcore-core');

var Logger = require('./xqcore-logger');
var EventEmitter = require('./xqcore-event');
var cmpElements = {
  Core: require('./components/core'),
  Input: require('./components/input'),
  List: require('./components/list'),
  Tooltip: require('./components/tooltip')
};

var cmps = {};

/**
 * XQCore.Component
 *
 * @class Component
 * @constructor
 *
 * @param {object} conf Component configuration
 */
function Component(tag, name) {
  if (!cmpElements[tag]) {
    tag = 'NotFoundElement';
  }

  if (!cmps[tag]) {
    var Cmp = function() {
      cmpElements[tag].call(this, name);
      EventEmitter.call(this);
      this.cmpType = tag;
    };

    Cmp.prototype = Object.create(cmpElements[tag].prototype);
    XQCore.assign(Cmp.prototype, EventEmitter.prototype);
    XQCore.assign(Cmp.prototype, new Logger(tag + 'Component'));
  }


  var el = new Cmp(name);
  el.create();

  this.registerEventListener(el);
  return el;
}

Component.prototype.registerEventListener = function(el) {
  if (el.$change) {
    el.$change(function(data, ev) {
      el.emit('value.change', data);
    });
  }
}

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
