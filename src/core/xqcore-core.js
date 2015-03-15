/*!
 * XQCore - +<%= pkg.version %>
 * 
 * <%= pkg.description %>
 *
 * XQCore is licenced under MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2012 - <%= grunt.template.today("yyyy") %> Noname Media, http://noname-media.com
 * Author Andi Heinkelein
 *
 * Creation Date: <%= grunt.template.today("yyyy-mm-dd") %>
 */

/*global XQCore:true */
var XQCore;

(function (root, factory) {
    /*global define:false */
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define('xqcore', ['jquery'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        root.XQCore = factory(root.jQuery);
    }
}(this, function (jQuery) {
    'use strict';

    /**
     * XQCore main object
     *
     * @package XQcore
     * @module  XQCore
     * @type {Object}
     */
    XQCore = {
        version: '<%= pkg.version %>',
        defaultRoute: 'index',
        html5Routes: false,
        hashBang: '#!',
        callerEvent: 'callerEvent',
        objectIdPattern: /^[a-zA-Z0-9]{24}$/,
        templateEngine: 'firetpl',
        viewsDir: './views/',
        viewExt: '.fire',
        socketPort: 9889
    };

    //XQCore helper functions
    XQCore.extend = jQuery.extend;
    XQCore.isEmptyObject = jQuery.isEmptyObject;
    XQCore.isPlainObject = jQuery.isPlainObject;
    XQCore.isFunction = jQuery.isFunction;
    
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

    XQCore._dump = {};
    XQCore.dump = function(componentName) {
        if (XQCore._dump[componentName]) {
            console.log('[XQCore dump]', componentName, XQCore._dump[componentName]);
            return XQCore._dump[componentName];
        }

        return false;
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
     * Import a mudule name, uses current used module load or load from window
     * @param  {String} moduleName Module name
     * @return {Any}            Returns the module
     */
    XQCore.require = function(moduleName) {
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

        console.log('Load', loadMechanism, moduleName);

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

    XQCore.setLocale = function(locale) {
        localStorage.setItem('xqcore.locale', 'locale');
    };

    XQCore.getLocale = function() {
        var locale = localStorage.getItem('xqcore.locale');
        if (locale) {
            return locale;
        }

        return navigator.language;
    };

    return XQCore;
}));

