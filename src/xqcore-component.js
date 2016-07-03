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
function Component(tag) {
  log = new Logger(tag + 'Component');

  log.debug('Create new view');
  if (!cmpElements[tag]) {
    tag = 'NotFoundElement';
  }

  let el = new cmpElements[tag]();
  el.create();
  this.el = el;
}

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
  container.appendChild(this.el.el);
};

Component.prototype.toHTML = function () {
  return this.el.el.outerHTML;
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
