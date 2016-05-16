/**
 * XQCore View module
 *
 * A view renders a .fire or .hbs template and injects the result into the dom.
 *
 * @module XQCore.View
 * @returns {object} Returns a XQCore.View prototype object
 */
'use strict';

let Logger = require('./xqcore-logger');
let HTMLElements = {
  RootElement: require('./elements/root'),
  NotFoundElement: require('./elements/notFound'),
  InputElement: require('./elements/input'),
  PageSection: require('./elements/pageSection'),
  PageRoot: require('./elements/pageRoot'),
  PageHeader: require('./elements/pageHeader'),
  PageFooter: require('./elements/pageFooter')
};

let log;

/**
 * XQCore.View
 *
 * @class XQCore.View
 * @constructor
 *
 * @param {object} conf View configuration
 */
class View {
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
}

//--

module.exports = View;
