/**
 * XQCore List
 *  
 * @module  XQCore.List
 * @requires XQCore.Event
 * @requires XQCore.Logger
 * @example
 * 
 * var Model = XQCore.Model.inherit({
 *     schema: {
 *         title: { type: 'string', min: 3, max 100 },
 *         content: { type: 'string', min: 3, max 1000 }
 *     }
 * });
 * 
 * var list new XQCore.List('myList', function(self) { {
 *     self.model = Model
 * }});
 *
 * list.push({
 *     title: 'Item 1',
 *     content: 'This is my first list item'
 * });
 * 
 */
(function(XQCore, undefined) {
    'use strict';

    var List;

    /**
     * XQCore.List base class
     *
     * @class XQCore.List
     * @constructor
     *
     * @uses XQCore.Logger
     * @uses XQCore.Event
     *
     * @param {Object} conf List extend object
     */
    List = function(name, conf) {
        var self = this;

        if (typeof arguments[0] === 'object') {
            conf = name;
            name = conf.name;
        }

        /**
         * Enable debug mode
         * @public
         * @type {Boolean}
         */
        this.debug = XQCore.debug;

        if (conf === undefined) {
            conf = {};
        }

        if (typeof conf === 'function') {
            conf.call(this, self);
        }
        else {
            XQCore.extend(this, conf);
        }

        this.__unfiltered = {};

        this.name = (name ? name.replace(/List$/, '') : 'Nameless') + 'List';

        /**
         * Contains list items
         * @property {Array} items
         */
        this.items = [];

        /**
         * Sets the Model to be used to create new models in push and unshift methods.

         * @property {Object} model
         */
        if (!this.model) {
            this.model = XQCore.Model;
        }
        
        this.state('ready');
    };


    XQCore.extend(List.prototype, new XQCore.Event(), new XQCore.Logger());

    /**
     * Contains the length of the list
     * @property length
     * @type {Number}
     */
    Object.defineProperty(List.prototype, 'length', {
        get: function() {
            return this.items.length;
        }
    });

    /**
     * Change the list state
     *
     * @method state
     * @param {String} state New state
     */
    List.prototype.state = function(state) {
        this.__state = state;
        this.emit('state.' + state);
        this.emit('state.change', state);
    };

    /**
     * Get the current list state
     *
     * @method getState
     */
    List.prototype.getState = function() {
        return this.__state;
    };

    /**
     * Adds one ore more items to the end of a list.
     * You can pass a XQCore.Model or a plain data object.
     * A data object will be converted into a XQCore.Model.
     * The model must be valid to be added to the list.
     * 
     * @param {Object|Array} data Model instance or a plain data object. Add multiple models by using an array of items
     * @param {Object} options Options object
     * {
     *     silent: true,    //Disable event emitting
     *     noSync: true     //Don't call sync method
     * }
     *
     * @returns {Boolean} Returns true if validation was succesfully and all items were added
     */
    List.prototype.push = function(data, options) {
        var models = [],
            model,
            item;

        options = options || {};

        if (!Array.isArray(data)) {
            data = [data];
        }

        for (var i = 0, len = data.length; i < len; i++) {
            item = data[i];
        
            if (item instanceof XQCore.Model) {
                model = item;
            }
            else {
                model = new this.model('ListItem');
                model.set(item);
            }

            if (model.isValid()) {
                models.push(model);
            }
            else {
                return false;
            }
        }

        //No validation error has been ocured.
        var length = this.items.push.apply(this.items, models);

        if (!options.silent) {
            this.emit('item.push', length - models.length, models.length);
        }

        if (!options.noSync) {
            if (typeof this.sync === 'function') {
                this.sync('push', models);
            }
        }

        return true;
    };

    /**
     * Adds one ore more items to the beginning of a list.
     * You can pass a XQCore.Model or a plain data object.
     * A data object will be converted into a XQCore.Model.
     * The model must be valid to be added to the list.
     * 
     * @param {Object|Array} data Model instance or a plain data object. Add multiple models by using an array of items
     * @param {Object} options Options object
     * {
     *     silent: true,    //Disable event emitting
     *     noSync: true     //Don't call sync method
     * }
     * @returns {Boolean} Returns true if validation was succesfully and all items were added
     */
    List.prototype.unshift = function(data, options) {
        var models = [],
            model,
            item;

        options = options || {};

        if (!Array.isArray(data)) {
            data = [data];
        }

        for (var i = 0, len = data.length; i < len; i++) {
            item = data[i];
        
            if (item instanceof XQCore.Model) {
                model = item;
            }
            else {
                model = new this.model('ListItem');
                model.set(item);
            }

            if (model.isValid()) {
                models.unshift(model);
            }
            else {
                return false;
            }
        }

        //No validation error has been ocured.
        var length = this.items.unshift.apply(this.items, models);

        if (!options.silent) {
            this.emit('item.unshift', length - models.length, models.length);
        }

        if (!options.noSync) {
            if (typeof this.sync === 'function') {
                this.sync('unshift', models);
            }
        }

        return true;
    };

    /**
     * Removes the last item from a list and returns it.
     *
     * @event item.remove Emits an item.remove event. The removed item will be passed as the first argument
     * 
     * @param {Object} options Options object
     * {
     *     silent: true,    //Disable event emitting
     *     noSync: true     //Don't call sync method
     * }
     *
     * @returns {Object} Returns the removed item
     */
    List.prototype.pop = function(options) {
        var model;

        options = options || {};

        model = this.items.pop() || null;
        if (model === undefined) {
            return null;
        }

        if (!options.silent) {
            this.emit('item.pop', model);
        }

        if (!options.noSync) {
            if (typeof this.sync === 'function') {
                this.sync('pop', model);
            }
        }

        return model;
    };

    /**
     * Removes the first item from a list and returns it.
     *
     * @event item.shift Emits an item.shift event. The removed item will be passed as the first argument
     * 
     * @param {Object} options Options object
     * {
     *     silent: true,    //Disable event emitting
     *     noSync: true     //Don't call sync method
     * }
     *
     * @returns {Object} Returns the removed item
     */
    List.prototype.shift = function(options) {
        var model;

        options = options || {};

        model = this.items.shift() || null;
        if (model === undefined) {
            return null;
        }

        if (!options.silent) {
            this.emit('item.shift', model);
        }

        if (!options.noSync) {
            if (typeof this.sync === 'function') {
                this.sync('shift', model);
            }
        }

        return model;
    };

    List.prototype.toArray = function() {
        return this.items.map(function(model) {
            return model.properties;
        });
    };

    /**
     * Create module
     */
    XQCore.List = List;
})(XQCore);