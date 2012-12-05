if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	__$coverObject[name] = {__code: code}
}
var __$coverInitRange = function(name, range){
	__$coverObject[name][range] = 0;
}
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
}
__$coverInit("webdocs/test/src/lib/xqcore-router.js", "/**\n * XQCore Router API\n *\n * @author Andi Heinkelein - noname-media.com\n * @copyright Andi Heinkelein - noname-media.com\n * @package XQCore\n *\n * Based on router.js\n * Copyright Aaron Blohowiak and TJ Holowaychuk 2011.\n * https://github.com/aaronblohowiak/routes.js\n */\n XQCore.Router = (function() {\n\n\t/**\n\t * Convert path to route object\n\t *\n\t * A string or RegExp should be passed,\n\t * will return { re, src, keys} obj\n\t *\n\t * @param  {String / RegExp} path\n\t * @return {Object}\n\t */\n\tvar Route = function(path){\n\t\t//using 'new' is optional\n\t\t\n\t\tvar src, re, keys = [];\n\t\t\n\t\tif(path instanceof RegExp){\n\t\t\tre = path;\n\t\t\tsrc = path.toString();\n\t\t}else{\n\t\t\tre = pathToRegExp(path, keys);\n\t\t\tsrc = path;\n\t\t}\n\n\t\treturn {\n\t\t\tre: re,\n\t\t\tsrc: path.toString(),\n\t\t\tkeys: keys\n\t\t};\n\t};\n\n\t/**\n\t * Normalize the given path string,\n\t * returning a regular expression.\n\t *\n\t * An empty array should be passed,\n\t * which will contain the placeholder\n\t * key names. For example \"/user/:id\" will\n\t * then contain [\"id\"].\n\t *\n\t * @param  {String} path\n\t * @param  {Array} keys\n\t * @return {RegExp}\n\t */\n\tvar pathToRegExp = function (path, keys) {\n\t\tpath = path\n\t\t\t.concat('/?')\n\t\t\t.replace(/\\/\\(/g, '(?:/')\n\t\t\t.replace(/(\\/)?(\\.)?:(\\w+)(?:(\\(.*?\\)))?(\\?)?/g, function(_, slash, format, key, capture, optional){\n\t\t\t\tkeys.push(key);\n\t\t\t\tslash = slash || '';\n\t\t\t\treturn ''\n\t\t\t\t\t+ (optional ? '' : slash)\n\t\t\t\t\t+ '(?:'\n\t\t\t\t\t+ (optional ? slash : '')\n\t\t\t\t\t+ (format || '') + (capture || '([^/]+?)') + ')'\n\t\t\t\t\t+ (optional || '');\n\t\t\t})\n\t\t\t.replace(/([\\/.])/g, '\\\\$1')\n\t\t\t.replace(/\\*/g, '(.+)');\n\t\treturn new RegExp('^' + path + '$', 'i');\n\t};\n\n\t/**\n\t * Attempt to match the given request to\n\t * one of the routes. When successful\n\t * a  {fn, params, splats} obj is returned\n\t *\n\t * @param  {Array} routes\n\t * @param  {String} uri\n\t * @return {Object}\n\t */\n\tvar match = function (routes, uri) {\n\t\tvar captures, i = 0;\n\n\t\tfor (var len = routes.length; i < len; ++i) {\n\t\t\tvar route = routes[i],\n\t\t\t    re = route.re,\n\t\t\t    keys = route.keys,\n\t\t\t    splats = [],\n\t\t\t    params = {},\n\t\t\t    j;\n\n\t\t\tcaptures = re.exec(uri);\n\t\t\tif (captures) {\n\t\t\t\tfor (j = 1, len = captures.length; j < len; ++j) {\n\t\t\t\t\tvar key = keys[j-1],\n\t\t\t\t\t\tval = typeof captures[j] === 'string'\n\t\t\t\t\t\t\t? decodeURIComponent(captures[j])\n\t\t\t\t\t\t\t: captures[j];\n\t\t\t\t\tif (key) {\n\t\t\t\t\t\tparams[key] = val;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tsplats.push(val);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\treturn {\n\t\t\t\t\tparams: params,\n\t\t\t\t\tsplats: splats,\n\t\t\t\t\troute: route.src\n\t\t\t\t};\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\t * Default \"normal\" router constructor.\n\t * accepts path, fn tuples via addRoute\n\t * returns {fn, params, splats, route}\n\t *  via match\n\t *\n\t * @return {Object}\n\t */\n\tvar getRouter = function() {\n\t  //using 'new' is optional\n\t  return {\n\t    routes: [],\n\t    routeMap : {},\n\t    addRoute: function(path, fn) {\n\t      if (!path) {\n\t\t\tthrow new Error(' route requires a path');\n\t      }\n\n\t      if (!fn) {\n\t       throw new Error(' route ' + path.toString() + ' requires a callback');\n\t      }\n\n\t      var route = new Route(path);\n\t      route.fn = fn;\n\n\t      this.routes.push(route);\n\t      this.routeMap[path] = fn;\n\t    },\n\n\t    match: function(pathname) {\n\t      var route = match(this.routes, pathname);\n\t      if(route){\n\t        route.fn = this.routeMap[route.route];\n\t      }\n\t      return route;\n\t    }\n\t  };\n\t};\n\n\t// module.exports = {\n\t//   Route: Route,\n\t//   pathToRegExp: pathToRegExp,\n\t//   match: match,\n\t//   Router: Router\n\t// }\n\n\treturn getRouter();\n\n});");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "273:3475");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "490:779");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1091:1623");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1839:2495");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2671:3323");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3452:3470");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "551:573");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "580:708");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "713:775");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "611:620");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "625:646");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "660:689");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "694:704");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1136:1575");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1579:1619");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1302:1316");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1322:1341");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1347:1509");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1878:1897");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1902:2491");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1951:2070");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2076:2099");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2104:2487");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2124:2398");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2404:2482");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2180:2306");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2313:2392");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2330:2347");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2369:2385");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2732:3319");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2821:2887");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2897:2994");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3004:3031");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3040:3053");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3063:3086");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3095:3119");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2837:2878");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2916:2985");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3170:3210");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3219:3285");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3294:3306");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3239:3276");
__$coverCall('webdocs/test/src/lib/xqcore-router.js', '273:3475');
XQCore.Router = function () {
    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '490:779');
    var Route = function (path) {
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '551:573');
        var src, re, keys = [];
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '580:708');
        if (path instanceof RegExp) {
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '611:620');
            re = path;
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '625:646');
            src = path.toString();
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '660:689');
            re = pathToRegExp(path, keys);
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '694:704');
            src = path;
        }
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '713:775');
        return {
            re: re,
            src: path.toString(),
            keys: keys
        };
    };
    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1091:1623');
    var pathToRegExp = function (path, keys) {
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1136:1575');
        path = path.concat('/?').replace(/\/\(/g, '(?:/').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1302:1316');
            keys.push(key);
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1322:1341');
            slash = slash || '';
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1347:1509');
            return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || '([^/]+?)') + ')' + (optional || '');
        }).replace(/([\/.])/g, '\\$1').replace(/\*/g, '(.+)');
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1579:1619');
        return new RegExp('^' + path + '$', 'i');
    };
    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1839:2495');
    var match = function (routes, uri) {
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1878:1897');
        var captures, i = 0;
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1902:2491');
        for (var len = routes.length; i < len; ++i) {
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1951:2070');
            var route = routes[i], re = route.re, keys = route.keys, splats = [], params = {}, j;
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2076:2099');
            captures = re.exec(uri);
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2104:2487');
            if (captures) {
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2124:2398');
                for (j = 1, len = captures.length; j < len; ++j) {
                    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2180:2306');
                    var key = keys[j - 1], val = typeof captures[j] === 'string' ? decodeURIComponent(captures[j]) : captures[j];
                    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2313:2392');
                    if (key) {
                        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2330:2347');
                        params[key] = val;
                    } else {
                        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2369:2385');
                        splats.push(val);
                    }
                }
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2404:2482');
                return {
                    params: params,
                    splats: splats,
                    route: route.src
                };
            }
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2671:3323');
    var getRouter = function () {
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2732:3319');
        return {
            routes: [],
            routeMap: {},
            addRoute: function (path, fn) {
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2821:2887');
                if (!path) {
                    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2837:2878');
                    throw new Error(' route requires a path');
                }
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2897:2994');
                if (!fn) {
                    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2916:2985');
                    throw new Error(' route ' + path.toString() + ' requires a callback');
                }
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3004:3031');
                var route = new Route(path);
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3040:3053');
                route.fn = fn;
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3063:3086');
                this.routes.push(route);
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3095:3119');
                this.routeMap[path] = fn;
            },
            match: function (pathname) {
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3170:3210');
                var route = match(this.routes, pathname);
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3219:3285');
                if (route) {
                    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3239:3276');
                    route.fn = this.routeMap[route.route];
                }
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3294:3306');
                return route;
            }
        };
    };
    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3452:3470');
    return getRouter();
};