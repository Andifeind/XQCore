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
 *  
 * @module  XQCore.Service
 * @requires XQCore.Utils
 * @requires XQCore.Event
 * @requires XQCore.Logger
 */
(function(XQCore, undefined) {
    'use strict';
    var Service;

    /**
     * XQCore.Service base class
     *
     * @class XQCore.Service
     * @constructor
     *
     * @uses XQCore.Logger
     * @uses XQCore.Event
     *
     * @param {Object} conf Service extend object
     */
    Service = function(name, conf) {
        //Call Event constructor
        XQCore.Event.call(this);
        
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

        this.name = (name ? name.replace(/Model$/, '') : 'Nameless') + 'Model';
        
        this.__state = 'ready';
    };


    //Extend with ready state
    // XQCore.extend(Service.prototype, XQCore.ReadyState.prototype);
    // XQCore.extend(Service.prototype, XQCore.Event.prototype);

    XQCore.extend(Service.prototype, XQCore.Event.prototype);
    XQCore.extend(Service.prototype, new XQCore.Logger());
    XQCore.extend(Service.prototype, XQCore.Sync.prototype);


    /**
     * Inherits a model prototype
     * @method inherit
     * @param  {String} name    model name
     * @param  {Object} options Service properties
     * @return {Object}         Returns a XQCore.Service prototype
     */
    Service.inherit = function(name, options) {
        if (typeof name === 'object') {
            options = name;
            name = undefined;
        }

        var Proto = function(_name, _options) {
            //TODO call this later, ready state will be set before _options had been run
            XQCore.Service.call(this, name, options);

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

        Proto.prototype = Object.create(XQCore.Service.prototype);
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

    XQCore.Service = Service;
})(XQCore);
