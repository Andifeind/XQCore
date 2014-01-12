/*jshint -W014 */
/**
 * XQCore Router API
 *
 * @author Andi Heinkelein - noname-media.com
 * @copyright Andi Heinkelein - noname-media.com
 * @package XQCore
 *
 * Based on router.js v0.2.0
 * Copyright Aaron Blohowiak and TJ Holowaychuk 2011.
 * https://github.com/aaronblohowiak/routes.js
 */
(function(XQCore, undefined) {
	'use strict';

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
		//using 'new' is optional
		
		var src, re, keys = [];
		
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
	var pathToRegExp = function (path, keys) {
		path = path
			.concat('/?')
			.replace(/\/\(/g, '(?:/')
			.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
				keys.push(key);
				slash = slash || '';
				return ''
					+ (optional ? '' : slash)
					+ '(?:'
					+ (optional ? slash : '')
					+ (format || '') + (capture || '([^/]+?)') + ')'
					+ (optional || '');
			})
			.replace(/([\/.])/g, '\\$1')
			.replace(/\*/g, '(.+)');
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
	var match = function (routes, uri) {
		var captures, i = 0;

		for (var len = routes.length; i < len; ++i) {
			var route = routes[i],
				re = route.re,
				keys = route.keys,
				splats = [],
				params = {},
				j;

			captures = re.exec(uri);
			if (captures) {
				for (j = 1, len = captures.length; j < len; ++j) {
					var key = keys[j-1],
						val = typeof captures[j] === 'string'
							? decodeURIComponent(captures[j])
							: captures[j];
					if (key) {
						params[key] = val;
					} else {
						splats.push(val);
					}
				}

				return {
					params: params,
					splats: splats,
					route: route.src
				};
			}
		}
	};

	/**
	 * Default "normal" router constructor.
	 * accepts path, fn tuples via addRoute
	 * returns {fn, params, splats, route}
	 *  via match
	 *
	 * @return {Object}
	 */
	// var getRouter = function() {
	//   //using 'new' is optional
	//   return {
	//     routes: [],
	//     routeMap : {},
	//     addRoute: function(path, fn) {
	//       if (!path) {
	//         throw new Error(' route requires a path');
	//       }

	//       if (!fn) {
	//        throw new Error(' route ' + path.toString() + ' requires a callback');
	//       }

	//       var route = new Route(path);
	//       route.fn = fn;

	//       this.routes.push(route);
	//       this.routeMap[path] = fn;
	//     },

	//     match: function(pathname) {
	//       var route = match(this.routes, pathname);
	//       if(route){
	//         route.fn = this.routeMap[route.route];
	//       }
	//       return route;
	//     }
	//   };
	// };

	var Router = function(conf) {
		conf = XQCore.extend({
			debug: false
		}, conf);

		this.debug = Boolean(conf.debug);

		this.routes = [];
		this.routeMap = {};
	};

	Router.prototype.addRoute = function(path, fn) {
		if (!path) {
			throw new Error(' route requires a path');
		}

		if (!fn) {
			throw new Error(' route ' + path.toString() + ' requires a callback');
		}

		var route = new Route(path);
		route.fn = fn;

		this.routes.push(route);
		this.routeMap[path] = fn;
	};

	Router.prototype.match = function(pathname) {
		var route = match(this.routes, pathname);
		if(route){
			route.fn = this.routeMap[route.route];
		}
		return route;
	};

	/**
	 * Fires a give route
	 *
	 * @param  {String} route	The route to fire
	 * @param  {Object}	data	Callback data
	 *
	 * @return {Boolean}       Returns the matched route
	 */
	Router.prototype.fire = function(route, data) {
		route = this.match(route);
		if (route) {
			route.fn(data);
		}
	};

	XQCore.Router = Router;

})(XQCore);