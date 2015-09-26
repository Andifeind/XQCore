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
        //Call XQCore.ReadyState constructor
        XQCore.ReadyState.call(this);

        //Call Event constructor
        XQCore.Event.call(this);

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

        this.__unfiltered = {};

        this.name = (name ? name.replace(/List$/, '') : 'Nameless') + 'List';

        /**
         * Contains list items
         * @property {Array} items
         */
        this.items = [];

        /**
         * Sets a maxlength of items
         * @property {Number} maxlength
         * @default null
         */
        this.maxLength = null;

        /**
         * Sets the Model to be used to create new models in push and unshift methods.

         * @property {Object} model
         */
        if (!this.model) {
            this.model = XQCore.Model;
        }

        if (typeof conf === 'function') {
            conf.call(this, self);
        }
        else {
            XQCore.extend(this, conf);
        }
        
        this.state('ready');
    };

    //Extend with ready state
    XQCore.extend(List.prototype, XQCore.ReadyState.prototype);
    XQCore.extend(List.prototype, XQCore.Event.prototype);

    XQCore.extend(List.prototype, new XQCore.Logger());

    /**
     * Inherits a list prototype
     * @method inherit
     * @param  {String} name    list name
     * @param  {Object} options Model properties
     * @return {Object}         Returns a XQCore.Model prototype
     */
    List.inherit = function(name, options) {
        if (typeof name === 'object') {
            options = name;
            name = undefined;
        }

        var Proto = function() {
            XQCore.List.call(this, name, options);
        };

        Proto.prototype = Object.create(XQCore.List.prototype);
        Proto.prototype.constructor = Proto;
        return Proto;
    };

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

        if (this.maxLength && this.items.length > this.maxLength) {
            this.items.splice(0, this.items.length - this.maxLength);
        }

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

    /**
     * Updates a list item or pushs it to the end
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
     * @fires item.update
     * Fires an item.update event if item was succesfully updated. Othwewise fires an item.push event
     *
     * @returns {Boolean} Returns true if validation was succesfully and all items were added
     */
    List.prototype.update = function(select, data, options) {
        var item;

        options = options || {};

        if (!Array.isArray(data)) {
            data = [data];
        }

        for (var i = 0, len = data.length; i < len; i++) {
            item = data[i];
        
            var updateItem = this.findOne(select);

            if (updateItem) {
                updateItem.set(item, { noSync: true });
            }
        }

        if (!options.silent) {
            this.emit('item.update');
        }

        if (!options.noSync) {
            if (typeof this.sync === 'function') {
                this.sync('update', select, data);
            }
        }

        return true;
    };

    /**
     * Clears the whole list
     * @param  {Object} options Options object
     * {
     *     silent: true,    //Disable event emitting
     *     noSync: true     //Don't call sync method
     * }
     *
     * @fires item.clear
     * Fires an item.clear event if item was succesfully cleared. It will not fire any events on an empty list
     *
     * @returns {Number} Returns the amount of removed items
     */
    List.prototype.clear = function(options) {
        options = options || {};

        if (this.items.length === 0) {
            return 0;
        }
        
        var oldValue = this.toArray();

        this.items = [];

        if (!options.silent) {
            this.emit('item.clear', oldValue);
        }

        if (!options.noSync) {
            if (typeof this.sync === 'function') {
                this.sync('clear', oldValue);
            }
        }

        return oldValue.length;
    };

    List.prototype.toArray = function() {
        return this.items.map(function(model) {
            return model.properties;
        });
    };

    /**
     * Search through list items and returns the first matching item
     *
     * @method findOne
     * @param {Object} searchfor Searching for object
     * @return {Object} Returns the first matched item or null. The returning item is a XQCore.Model object
     */
    List.prototype.findOne = function(query) {
        var parent;

        parent = this.items;

        if (parent) {
            for (var i = 0; i < parent.length; i++) {
                var prop = parent[i],
                    matching;

                for (var p in query) {
                    if (query.hasOwnProperty(p)) {
                        if (prop.properties[p] && prop.properties[p] === query[p]) {
                            matching = true;
                            break;
                        }
                        else {
                            matching = false;
                        }
                    }
                }

                if (matching === true) {
                    return prop;
                }
            }
        }

        return null;
    };

    /**
     * Search through list items and returns all matching items
     *
     * @method find
     * @param {Object} searchfor Searching for object
     * @return {Object} Returns all matched item or an empty array.
     * The returning value is an array of XQCore.Model objects
     */
    List.prototype.find = function(query) {
        var parent,
            res = [];

        parent = this.items;
        
        if (parent) {
            for (var i = 0; i < parent.length; i++) {
                var prop = parent[i],
                    matching;

                for (var p in query) {
                    if (query.hasOwnProperty(p)) {
                        if (prop.properties[p] && prop.properties[p] === query[p]) {
                            matching = true;
                            break;
                        }
                        else {
                            matching = false;
                        }
                    }
                }

                if (matching === true) {
                    res.push(prop);
                }

            }
        }

        return res;
    };

    List.prototype.each = function(initial, fn) {
        if (typeof initial === 'function') {
            fn = initial;
            initial = null;
        }

        var data = initial;
        for (var i = 0, len = this.items.length; i < len; i++) {
            data = fn(data, this.items[i].properties);
        }

        return data;
    };

    /**
     * Create module
     */
    XQCore.List = List;
})(XQCore);
