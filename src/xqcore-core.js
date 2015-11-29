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