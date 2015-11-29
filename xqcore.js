/*!
 * XQCore - v0.13.1-1
 * 
 * Model View Presenter Javascript Framework
 *
 * XQCore is licenced under MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2012 - 2015 Noname Media, http://noname-media.com
 * Author Andi Heinkelein <andifeind@noname-media.com>
 *
 * Creation date: 2015-11-29
 * 
 */

(function (root, factory) {
    /*global define:false */
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define('xqcore', [], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.XQCore = factory();
    }
}(this, function () {
    'use strict';
    
    var require = function(file) {

        if (require.alias && require.alias[file]) {
            file = require.alias[file];
        }

        var module = {
            exports: {},
            file: file
        };

        file = require.resolve(file, this ? this.file : null);

        if (require.cache[file]) {
            
            if (require.cache[file].obj) {
                return require.cache[file].obj;
            }

            require.cache[file].fn(module, module.exports, require.bind(module));
            require.cache[file].obj = module.exports;
            return require.cache[file].obj;
        }
        else {
            throw new Error('Module ' + file + ' not found!');
        }
    };

    require.resolve = function(path, parent) {
        var resolved = [];
        if (path.charAt(0) === '.') {
            var newPath = parent || location.pathname;
            newPath = newPath.split('/');
            newPath.pop();
            newPath = newPath.concat(path.split('/'));

            newPath.forEach(function(p) {
                if (p === '..') {
                    resolved.pop();
                    return;
                }
                else if (p === '.' || p === '') {
                    return;
                }

                resolved.push(p);
            });

            if (!parent ||parent.charAt(0) === '.') {
                resolved.unshift('.');
            }
        }
        else {
            return path;
        }

        resolved = resolved.join('/');
        if (!/\.js(on)?$/.test(resolved)) {
            resolved += '.js';
        }

        return resolved;
    };

    require.register = function(alias, path, fn) {
        if (arguments.length === 2) {
            fn = path;
            path = alias;
            alias= null;
        }

        require.cache[path] = {fn: fn, calls: 0};
        if (alias) {
            require.alias[alias] = path;
        }
    };

    require.cache = {};
    require.alias = {};

require.register('./src/xqcore-core.js', function(module, exports, require) {
'use strict';

/**
 * XQCore core module
 * @module XQCore
 */


/**
 * XQCore main object
 *
 * @package XQcore
 * @type {Object}
 */
var XQCore = {
    /**
     * Contains the current XQCore version
     * @property {String} version
     */
    version: '<%= pkg.version %>',
    
    /**
     * Defines a default route
     * @property {String} defaultRoute
     */
    defaultRoute: '/',

    /**
     * Enables html5 routing support
     * @property {Boolean} html5Routes
     * @default false
     */
    html5Routes: false,

    /**
     * Defines a base path of your projewt
     * @type {String}
     */
    basePath: '',

    /**
     * Sets a hashbang for routing. This value is added to each route if html5Routes is set to false
     * @property {String} hashBang
     */
    hashBang: '#!',

    //TODO Check whether we need this property
    callerEvent: 'callerEvent',

    //TODO Do we need this?
    objectIdPattern: /^[a-zA-Z0-9]{24}$/,

    /**
     * Sets the default template engine
     * @property {String} templateEngine
     * @default firetpl
     */
    templateEngine: 'firetpl',

    /**
     * Sets a views directory
     * @property {String} viewsDir
     */
    viewsDir: './views/',

    /**
     * Set the file extension for views
     * @property {String} viewExt
     */
    viewExt: '.fire',

    /**
     * Defines a default socket port
     * @property {Number} socketPort
     * @default 9889
     */
    socketPort: 9889,

    /**
     * Sets max length of event listener
     * @property {Number} eventListenerMaxLength=1328
     */
    eventListenerMaxLength: 1328
};


/**
 * Merges the properties from one or more objects together into a target object
 * Its simply an alias for jQuery.extend.
 * 
 * @method extend
 * @param {Boolean} [deep] If true, a deep merge is using
 * @param {Object} target Target object. This object will be extended with new properties
 * @param {Object} [object1] Object to merge
 * @param {Object} [objectN] Object to merge
 * @return {Object} Returns the merged target object
 * @example {js}
 * var target = {
 *     a: 'A1',
 *     b: 'B1'
 * }
 *
 * var obj1 = {
 *     b: 'B2',
 *     c: 'C2'
 * }
 *
 * extend(target, obj1);
 * //Returns {a: 'A1', b: 'B2', c: 'C2'}
 *  
 */
XQCore.extend = jQuery.extend;


XQCore.isPlainObject = jQuery.isPlainObject;
XQCore.isFunction = jQuery.isFunction;

/**
 * Module storage
 */
XQCore.__moduleCache = {};

/**
 * Checks for a valid ObjectId
 * 
 * The pattern of an objectId can be overwritten by setting the XQCore.objectIdPattern property
 *
 * @return {Boolean} Returns true if value is an valid objectId
 */
XQCore.isObjectId = function(value) {
    return this.objectIdPattern.test(value);
};

/**
 * Defines module names for different module loading mechanisms
 * @type {Object}
 */
XQCore.modules = {
    jquery: {
        cjs: 'jquery',
        amd: 'jquery',
        win: 'jQuery',
    },
    firetpl: {
        cjs: 'firetpl',
        amd: 'firetpl',
        win: 'fireTpl',
    },
    sockjs: {
        cjs: 'xqcore/lib/sockjs.js',
        amd: 'xqcore/lib/sockjs.js',
        win: 'SockJS',
    }
};


/**
 * Import a module name, uses current used module load or load from window
 * @param  {String} moduleName Module name
 * @return {Any}            Returns the module
 */
XQCore.require = function(moduleName) {
    if (XQCore.__moduleCache[moduleName]) {
        return XQCore.__moduleCache[moduleName];
    }

    var loadMechanism = 'win';
    if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
        loadMechanism = 'cjs';
    }
    else if (typeof define === 'function' && define.amd) {
        loadMechanism = 'amd';
    }

    if (XQCore.modules[moduleName][loadMechanism]) {
        moduleName = XQCore.modules[moduleName][loadMechanism];
    }

    try {
        if (loadMechanism === 'cjs' || loadMechanism === 'amd') {
            try {
                return require(moduleName);
            }
            catch (err) {
                console.warn('Module not registered as a ' + (loadMechanism === 'cjs' ? 'CommonJS' : 'AMD') + ' module! Try to load from window object', moduleName);
            }
        }
        
        return window[moduleName];
    }
    catch(err) {
        console.error('Could not load module!', moduleName, err);
    }
};

/**
 * Set a local for the current session
 * 
 * @method setLocale
 * @param  {String}  locale Local string
 */
XQCore.setLocale = function(locale) {
    localStorage.setItem('xqcore.locale', locale);
};

/**
 * Returns a local string
 * @method getLocale
 * @return {[type]}  [description]
 */
XQCore.getLocale = function() {
    var locale = localStorage.getItem('xqcore.locale');
    if (locale) {
        return locale;
    }

    return navigator.language;
};

/**
 * Defines a global log level
 *
 * XQCore has 5 log levels
 *
 * 0 = off
 * 1 = error
 * 2 = warning
 * 3 = info
 * 4 = debug
 * 5 = trace
 * 
 * @property {String} logLevel
 */
XQCore.logLevel = 1;

/**
 * Returns one or all queries
 * Converts all numberic items to a Number
 *
 * @method getQuery
 * @param  {String} name Query name
 * @return {Object|String}      Returns all queries or one value.
 */
XQCore.getQuery = function(name) {
    if (!XQCore.__query) {
        XQCore.__query = {};
        location.search.substr(1).split('&').forEach(function(q) {
            q = q.split('=');
            if (q && q[0]) {
                var val = encodeURI(q[1]);
                XQCore.__query[q[0]] = (isNaN(val) ? val : Number(val));
            }
        });
    }

    if (name) {
        return XQCore.__query[name];
    }
    else {
        return XQCore.__query;
    }
};

/**
 * Checks wether an object is an empty object
 * @param  {Object}  obj Object which should be checked
 * @return {Boolean}     Returns tru if object is empty
 */
XQCore.isEmptyObject = function(obj) {
    var name;
    //jshint forin:false
    for ( name in obj ) {
        return false;
    }
    return true;
};

/**
 * Checks wether an object is an empty object or an empty array
 * @param  {Object|Array}  obj Object which should be checked
 * @return {Boolean}     Returns true if obj is empty
 */
XQCore.isEmpty = function(obj) {
    if (Array.isArray(obj)) {
        return obj.length === 0;
    }

    return XQCore.isEmptyObject(obj);
};

//--
module.exports = XQCore;
module.exports.Event = require('./xqcore-event');
});
require.register('./src/xqcore-event.js', function(module, exports, require) {
/**
 * XQCore EventEmitter
 *
 * A powerfull event emitter
 *
 * @module XQCore.Event
 *
 * @example {js}
 * var ee = new XQCore.Event();
 * ee.on('echo', function(msg) {
 *     console.log('Msg:', msg);
 * });
 *
 * //Emit an event
 * ee.emit('echo', 'Hello World!');
 *
 * @example {js}
 * var MyModule = function() {
 *     //Call Event constructor
 *     XQCore.Event.call(this);
 * };
 *
 * //Extend MyModule with event emitter methods
 * XQCore.extend(MyModule.prototype, XQCore.Event.prototype);
 */

'use strict';

var XQCore = require('./xqcore-core');

var log = new XQCore.Logger('EventEmitter');

/**
 * An EventListener represents a single event.
 *
 * Each event registration is an instance of EventListener
 *
 * @constructor
 * @method  EventListener
 */
var EventListener = function(ee, event, fn) {
    this.fn = fn;
    this.calls = 0;
    this.once = false;

    /**
     * Removes this event listener
     * @method  remove
     * @return {Boolean} Returns true if event was removed
     */
    this.remove = function() {
        ee.off(event, fn);
    };
};



/**
 * Event emitter constructor
 *
 * @constructor
 * @method  EventEmitter
 */
var EventEmitter = function() {
    this.__events = {};
    this.__logger = log;
    
    /**
     * Sets max length of event listeners
     * @property {Number} maxLength
     */
    this.maxLength = XQCore.eventListenerMaxLength;
};

/**
 * Registers an event listener
 * @method on
 * @param  {String}   event Event name
 * @param  {Function} fn    Event function
 * @return {Object}         Returns an EventListener instance
 */
EventEmitter.prototype.on = function(event, fn) {
    var listener = new EventListener(this, event, fn);
    if (!this.__events[event]) {
        this.__events[event] = [];
    }

    this.__events[event].push(listener);
    if (this.__events[event].length > this.maxLength) {
        log.warn('Listener max length was exceeded!', 'List:', event, 'Length:', this.__events[event].length);
    }
    else {
        log.info('Register new `' + event + '` event');
    }

    return listener;
};

/**
 * Registers an once event listener. This listener is called only once a time.
 *
 * @method once
 * @param  {event}  event  Event name
 * @param  {Function} fn    Event function
 * @return {Object}         Returns an EventListener instance
 */
EventEmitter.prototype.once = function(event, fn) {
    var args = Array.prototype.slice.call(arguments);
    var listener = this.on.apply(this, args);
    listener.once = true;
    return listener;
};

/**
 * Emits an event
 * @method emit
 * @param  {String} event Event name
 * @param  {Any} data  Event data, you can use multiple args here
 * @return {Number}    Returns the number of emited events
 */
EventEmitter.prototype.emit = function(event, data) {
    if (!this.__events[event]) {
        log.info('Emit `' + event + '` event failed! No listener of this type are registered');
        return 0;
    }

    var args = Array.prototype.slice.call(arguments, 1),
        len = this.__events[event].length;

    for (var i = len - 1; i >= 0; i--) {
        var listener = this.__events[event][i];
        listener.fn.apply(this, args);
        listener.calls++;
        if (listener.once === true) {
            this.__events[event].splice(i, 1);
        }
    }

    if (len) {
        log.info('Emit `' + event + '` event to', len, 'listener');
        log.debug(' ... data:', data);
    }

    return len;
};

/**
 * Unregisters events
 *
 * @method off
 * @param  {String}  event  Event name
 * @param  {Function}  [fn]  Event function. If this property is set only that function will be removed. Otherwis all events of this name will be removed
 * @return {Number} Returns the number of removed events
 */
EventEmitter.prototype.off = function(event, fn) {
    var removed = 0;

    if (!this.__events[event]) {
        log.info('Unregister events failed! No `' + event + '` events were found!');
        return 0;
    }

    if (fn) {
        var len = this.__events[event].length;
        for (var i = 0; i < len; i++) {
            var listener = this.__events[event][i];
            if (listener && listener.fn === fn) {
                this.__events[event].splice(i, 1);
                removed++;
                //Do not break at this point, to remove duplicated events
                
                if (this.__events[event].length === 0) {
                    delete this.__events[event];
                }
            }
        }
    }
    else {
        removed = this.__events[event].length;
        delete this.__events[event];
    }

    log.info('Unregister `' + event + '` events!', 'Removed ' + removed + ' listener');
    return removed;
};

/**
 * Removes all registered events
 * @method clear
 * @return {Number} Returns the number of removed events
 */
EventEmitter.prototype.clearEvents = function() {
    this.__events = {};
};

module.exports = EventEmitter;

});
require('./src/xqcore-core.js');

}));