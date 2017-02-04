/**
 * XQCore Service
 *
 * This module organizes your data.
 * A model has different states and changes it on a specific action.
 *
 * States:
 * starting | Before initialization
 * ready    | Initial state
 * valid    | Validation was successfull
 * invalid  | Validation failed
 *
 * @package XQCore
 * @module Service
 * @requires Utils
 * @requires EventEmitter
 * @requires Logger
 */

'use strict';

var XQCore = require('./xqcore');
var Logger = require('./logger');
var ReadyState = require('./ready-state');
var EventEmitter = require('./event');

/**
 * Service base class
 *
 * @class Service
 * @constructor
 *
 * @uses Logger
 * @uses EventEmitter
 *
 * @param {Object} conf Service extend object
 */
var Service = function(name, conf) {
  //Call EventEmitter constructor
  EventEmitter.call(this);

  if (typeof arguments[0] === 'object') {
    conf = name;
    name = conf.name;
  }

  /**
   * Enable debug mode
   * @public
   * @type {Boolean}
   */
  this.logLevel = XQCore.logLevel;

  if (conf === undefined) {
    conf = {};
  }

  if (typeof conf === 'function') {
    conf.call(this, this);
  }
  else {
    XQCore.extend(this, conf);
  }

  this.conf = conf;

  this.name = (name ? name.replace(/Service$/, '') : 'Nameless') + 'Service';

  if (!this.model && !this.list) {
    throw new Error('Service is not connected to any model or list!');
  }

  if (this.model && this.list) {
    throw new Error('Service is connected to a model and a list. This is not allowed!');
  }

  this.isListService = false;
  if (this.model) {
    this.schema = this.schema || this.model.schema || null;
  } else {
    this.schema = this.schema || null;
    if (!this.schema && typeof this.list.model === 'function') {
      var model = new this.list.model();
      this.schema = model.schema;
    }
    this.isListService = true;
  }

  this.__state = 'ready';
};


//Extend with ready state
XQCore.extend(Service.prototype, ReadyState.prototype);
XQCore.extend(Service.prototype, EventEmitter.prototype);
XQCore.extend(Service.prototype, new Logger());

/**
 * Inherits a model prototype
 * @method inherit
 * @param  {String} name    model name
 * @param  {Object} options Service properties
 * @return {Object}         Returns a Service prototype
 */
Service.inherit = function(name, options) {
  if (typeof name === 'object') {
    options = name;
    name = undefined;
  }

  var Proto = function(_name, _options) {
    //TODO call this later, ready state will be set before _options had been run
    Service.call(this, name, options);

    if (_name) {
      if (typeof _name === 'string') {
        name = _name;
      }
      else {
        _options = _name;
      }

      if (typeof _options === 'function') {
        _options.call(this, this);
      }
      else if (typeof _options === 'object') {
        XQCore.extend(this, _options);
      }
    }
  };

  Proto.prototype = Object.create(Service.prototype);
  Proto.prototype.constructor = Proto;
  return Proto;
};

/**
 * Change the model state
 *
 * @method state
 * @param {String} state New state
 */
Service.prototype.state = function(state) {
  this.__state = state;
  this.emit('state.' + state);
  this.emit('state.change', state);
};

/**
 * Get the current model state
 *
 * @method getState
 */
Service.prototype.getState = function() {
  return this.__state;
};


// Service.prototype.toJSON = function() {
//     return {};
// };

//--

module.exports = Service;
