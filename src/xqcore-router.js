/**
 * XQCore router
 * 
 * Based on router.js v2.1.0
 * Copyright Aaron Blohowiak and TJ Holowaychuk 2011.
 * https://github.com/aaronblohowiak/routes.js
 *
 * @module  XQCore.Router
 *
 * @example
 *
 * var router = XQCore.Router.getInstance(); //Returns a singelton
 * router.addRoute('/index', function() {
 *     // index route was called
 * });
 *
 * router.addRoute('/foo/:name', function(data) {
 *     // data.name contains the name part
 * });
 *
 * 
 */
(function(XQCore) {
    'use strict';

    var log = new XQCore.Logger('Router');
    var $ = XQCore.require('jquery');

    /**
     * Convert path to route object
     *
     * A string or RegExp should be passed,
     * will return { re, src, keys} obj
     *
     * @param  {String / RegExp} path
     * @return {Object}
     */

    var Route = function(path) {
        var src, re, keys = [];
        log.logLevel = XQCore.logLevel;

        if (path instanceof RegExp) {
            re = path;
            src = path.toString();
        } else {
            re = pathToRegExp(path, keys);
            src = path;
        }

        return {
            re: re,
            src: path.toString(),
            keys: keys
        };
    };

    /**
     * Normalize the given path string,
     * returning a regular expression.
     *
     * An empty array should be passed,
     * which will contain the placeholder
     * key names. For example "/user/:id" will
     * then contain ["id"].
     *
     * @param  {String} path
     * @param  {Array} keys
     * @return {RegExp}
     */
    var pathToRegExp = function(path, keys) {
        path = path
            .concat('/?')
            .replace(/\/\(/g, '(?:/')
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?|\*/g, function(_, slash, format, key, capture, optional) {
                if (_ === '*') {
                    keys.push(undefined);
                    return _;
                }

                keys.push(key);
                slash = slash || '';
                return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || '([^/]+?)') + ')' + (optional || '');
            })
            .replace(/([\/.])/g, '\\$1')
            .replace(/\*/g, '(.*)');
        return new RegExp('^' + path + '$', 'i');
    };

    /**
     * Attempt to match the given request to
     * one of the routes. When successful
     * a  {fn, params, splats} obj is returned
     *
     * @param  {Array} routes
     * @param  {String} uri
     * @return {Object}
     */
    var match = function(routes, uri, startAt) {
        var captures, i = startAt || 0;

        for (var len = routes.length; i < len; ++i) {
            var route = routes[i],
                re = route.re,
                keys = route.keys,
                splats = [],
                params = {};

            captures = uri.match(re);
            if (captures) {
                for (var j = 1, cLen = captures.length; j < cLen; ++j) {
                    var key = keys[j - 1],
                        val = typeof captures[j] === 'string' ? unescape(captures[j]) : captures[j];
                    if (key) {
                        params[key] = val;
                    } else {
                        splats.push(val);
                    }
                }
                return {
                    params: params,
                    splats: splats,
                    route: route.src,
                    next: i + 1
                };
            }
        }
    };

    /**
     * Router constructor
     *
     * @constructor
     */
    var Router = function(options) {
        options = options || {};

        /**
         * Contains all registered routes
         *
         * @property {Array} routes
         * @private
         */
        this.routes = [];

        this.routeMap = {};

        if (!options.noListener) {
            this.registerListener();
        }

        var self = this;
        $(function() {
            //Call current page
            self.callRoute(self.getPath(), {
                initialCall: true
            });
        });
    };

    var instance;

    /**
     * Returns a singelton instance of XQCore.Router
     * @return {[type]} [description]
     */
    Router.getInstance = function() {
        if (!instance) {
            instance = new XQCore.Router();
        }

        return instance;
    };

    Router.prototype.registerListener = function() {
        if (XQCore.html5Routes) {
            window.addEventListener('popstate', this.onPopStateHandler.bind(this));
        }
        else {
            window.addEventListener('hashchange', this.onPopStateHandler.bind(this));
        }
    };

    Router.prototype.onPopStateHandler = function(e) {
        var path = this.getPath();
        this.callRoute(path, {
            noPush: true
        });
    };

    Router.prototype.getPath = function() {
        var path;
        if (XQCore.html5Routes) {
            path = location.pathname;
            return path.replace(new RegExp('^' + XQCore.basePath), '');
        }
        else {
            path = location.hash;
            path = path.replace(new RegExp('^' + XQCore.hashBang), '');
            path = '/' + path;
            return path;
        }
    };

    /**
     * Registers a new route
     *
     * @method addRoute
     * @param {String}   path Route path
     * @param {Function} fn   Function to be called when addRoute will be called
     * @returns {Object} Returns this value
     * @chainable
     */
    Router.prototype.addRoute = function(path, fn) {
        log.info('Register new route:', path, fn);
        
        if (!path) {
            throw new Error(' route requires a path');
        }
        
        if (!fn) {
            throw new Error(' route ' + path.toString() + ' requires a callback');
        }

        if (this.routeMap[path]) {
            throw new Error('path is already defined: ' + path);
        }

        if (typeof path === 'string') {
            path = path.replace(/\/$/, '');
            if (path.charAt(0) !== '/') {
                path = '/' + path;
            }
        }
        
        var route = new Route(path);
        route.fn = fn;

        this.routes.push(route);
        this.routeMap[path] = fn;

        return this;
    };

    /**
     * Removes a route
     *
     * @method removeRoute
     * @param  {String} path Path to be removed
     * @return {Object}      Returns this value
     * @chainable
     */
    Router.prototype.removeRoute = function(path) {
        if (!path) {
            throw new Error(' route requires a path');
        }

        if (!this.routeMap[path]) {
            log.warn('Can not remove route! Route does not exists: ' + path);
            return this;
        }

        for (var i = 0; i < this.routes.length; i++) {
            var route = this.routes[i];
            if (route.src === path) {
                this.routes.splice(i, 1);
            }
        }

        delete this.routeMap[path];
        return this;
    };

    Router.prototype.match = function(pathname, startAt) {
        var route = match(this.routes, pathname, startAt);
        if (route) {
            route.fn = this.routeMap[route.route];
            route.next = this.match.bind(this, pathname, route.next);
        }
        return route;
    };

    /**
     * Calls a route
     *
     * Options:
     * --------
     * **noRoute** Doesn't add a push state item
     * **replace** Add a replace state item
     * 
     *
     * @method callRoute
     * @param  {String} path Route path
     * @param {Object} [options] Set options for route call
     * 
     */
    Router.prototype.callRoute = function(path, options) {
        options = options || {};

        log.info('Call route', path);

        if (path === undefined) {
            throw new Error('XQCore.Router error! Path is undefined in callRoute()!');
        }

        var route = this.match(path);
        route.path = path;

        route.initialCall = !!options.initialCall;

        if (!route) {
            log.warn('Could not call any route! No route were found! Called path: ' + path);
            return;
        }

        if (XQCore.html5Routes && !options.noPush && !options.replace) {
            history.pushState(null, '', path);
        }
        else if (XQCore.html5Routes && options.replace) {
            history.replaceState(null, '', path);
        }

        var next = function() {
            log.info('... trigger route', this.route, this.fn, this.next);
            this.fn.call(this, this.params, this.splats, function() {
                var nextRoute = this.next();
                if (nextRoute) {
                    next.call(nextRoute);
                }
            }.bind(this));
        };

        next.call(route);

    };

    XQCore.Router = Router;
})(XQCore);
