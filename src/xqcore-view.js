/**
 * XQCore View module
 *
 * A view renders a .fire or .hbs template and injects the result into the dom.
 *
 * @module View
 * @returns {object} Returns a XQCore.View prototype object
 */
'use strict';

var Logger = require('./xqcore-logger');
var HTMLElements = {
  RootElement: require('./elements/root'),
  NotFoundElement: require('./elements/notFound'),
  Input: require('./elements/input'),
  List: require('./elements/list'),
  PageSection: require('./elements/pageSection'),
  PageRoot: require('./elements/pageRoot'),
  PageHeader: require('./elements/pageHeader'),
  PageFooter: require('./elements/pageFooter')
};

var log;

/**
 * XQCore.View
 *
 * @class View
 * @constructor
 *
 * @param {object} conf View configuration
 */
function View(tag) {

}

/**
 * Sets a view state
 * @param {[type]} state [description]
 */
View.prototype.setState = function (state) {
  if (this.state) {
    this.removeClass('state-' + this.state);
  }

  this.state = state;
  this.addClass('state-' + this.state);
  return this;
};

/*
class XView {
  constructor(tag) {
    log = new Logger(tag + 'View');

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

module.exports = View;
