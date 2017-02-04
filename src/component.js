/**
 * XQCore Component module
 *
 * A view renders a .fire or .hbs template and injects the result into the dom.
 *
 * @module Component
 * @returns {object} Returns a XQCore.Component prototype object
 */

'use strict';

var XQCore = require('./xqcore');
var Logger = require('./logger');

var cmpElements = {
  Core: require('./components/core'),
  Button: require('./components/button'),
  Counter: require('./components/counter'),
  Form: require('./components/form'),
  Grid: require('./components/grid'),
  Input: require('./components/input'),
  List: require('./components/list'),
  ProgressBar: require('./components/progressBar'),
  Table: require('./components/table'),
  Text: require('./components/text'),
  Tooltip: require('./components/tooltip')
};

var log = new Logger('Component');

/**
 * XQCore.Component
 *
 * @class Component
 * @constructor
 *
 * @param {object} conf Component configuration
 */
function Component(tag, name) {
  var Cmp = XQCore.getComponent(tag);
  if (!Cmp) {
    throw new Error('Component ' + tag + ' not found!');
  }

  var el = new Cmp(name);
  el.create();
  return el;

  // this.registerEventListener();
}

Component.prototype.registerEventListener = function() {
  var self = this;
  if (self.$change) {
    self.$change(function(data, ev) {
      self.emit('value.change', data);
    });
  }
}

Component.prototype.couple = function(model, prop) {
  if (model instanceof XQCore.List) {
    // var list = model;
    // list.on('item.push', function(item) {
    //   console.log('push item', item);
    //   var val = item[0].get();
    //   console.log('value', val);
    //   this.push(val);
    // });
  }
  else {
    return this.coupleModel(model, prop);
    //
  }
}

Component.prototype.coupleModel = function(model, prop) {
  var self = this;
  model.on('data.change', function() {
    self.value = model.get(prop);
  });

  this.on('value.change', function(data) {
    console.log('CMP CHANGE', data);
    model.set(data.name, data.value).then(function() {
      this.errMessage = null;
    }).catch(function(err) {
      console.log('RES', err);
      this.errMessage = err.err[0].msg;
    });
  });

  model.on('validation.error', function(validationResult, other) {
    console.log('VALIDATION', validationResult, other);
    this.state = 'invalid';
  });

  model.on('state.change', function(state) {
    this.state = state;
  });
}

Component.prototype.appendTo = function(container) {
  container.appendChild(this.domEl);
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
//



Component.registerComponent = function(name, cmp) {
  log.info('Register new component', name);
  cmpElements[name] = cmp;
};

Component.getComponent = function(name) {
  if (!cmpElements.hasOwnProperty(name)) {
    throw new Error('Component ' + name + ' not found!');
  }

  return cmpElements[name];
};

module.exports = Component;
