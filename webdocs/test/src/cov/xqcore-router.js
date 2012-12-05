if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/xqcore-router.js"] = {};
__$coverObject["webdocs/test/src/lib/xqcore-router.js"].__code = "/**\n * XQCore Router API\n *\n * @author Andi Heinkelein - noname-media.com\n * @copyright Andi Heinkelein - noname-media.com\n * @package XQCore\n *\n * Based on router.js\n * Copyright Aaron Blohowiak and TJ Holowaychuk 2011.\n * https://github.com/aaronblohowiak/routes.js\n */\n XQCore.Router = (function() {\n\n\tvar localRoutes = [];\n\n\n\t/**\n\t * Convert path to route object\n\t *\n\t * A string or RegExp should be passed,\n\t * will return { re, src, keys} obj\n\t *\n\t * @param  {String / RegExp} path\n\t * @return {Object}\n\t */\n\tvar Route = function(path){\n\t\t//using 'new' is optional\n\t\t\n\t\tvar src, re, keys = [];\n\t\t\n\t\tif(path instanceof RegExp){\n\t\t\tre = path;\n\t\t\tsrc = path.toString();\n\t\t}else{\n\t\t\tre = pathToRegExp(path, keys);\n\t\t\tsrc = path;\n\t\t}\n\n\t\treturn {\n\t\t\tre: re,\n\t\t\tsrc: path.toString(),\n\t\t\tkeys: keys\n\t\t};\n\t};\n\n\t/**\n\t * Normalize the given path string,\n\t * returning a regular expression.\n\t *\n\t * An empty array should be passed,\n\t * which will contain the placeholder\n\t * key names. For example \"/user/:id\" will\n\t * then contain [\"id\"].\n\t *\n\t * @param  {String} path\n\t * @param  {Array} keys\n\t * @return {RegExp}\n\t */\n\tvar pathToRegExp = function (path, keys) {\n\t\tpath = path\n\t\t\t.concat('/?')\n\t\t\t.replace(/\\/\\(/g, '(?:/')\n\t\t\t.replace(/(\\/)?(\\.)?:(\\w+)(?:(\\(.*?\\)))?(\\?)?/g, function(_, slash, format, key, capture, optional){\n\t\t\t\tkeys.push(key);\n\t\t\t\tslash = slash || '';\n\t\t\t\treturn ''\n\t\t\t\t\t+ (optional ? '' : slash)\n\t\t\t\t\t+ '(?:'\n\t\t\t\t\t+ (optional ? slash : '')\n\t\t\t\t\t+ (format || '') + (capture || '([^/]+?)') + ')'\n\t\t\t\t\t+ (optional || '');\n\t\t\t})\n\t\t\t.replace(/([\\/.])/g, '\\\\$1')\n\t\t\t.replace(/\\*/g, '(.+)');\n\t\treturn new RegExp('^' + path + '$', 'i');\n\t};\n\n\t/**\n\t * Attempt to match the given request to\n\t * one of the routes. When successful\n\t * a  {fn, params, splats} obj is returned\n\t *\n\t * @param  {Array} routes\n\t * @param  {String} uri\n\t * @return {Object}\n\t */\n\tvar match = function (routes, uri) {\n\t\tvar captures, i = 0;\n\n\t\tfor (var len = routes.length; i < len; ++i) {\n\t\t\tvar route = routes[i],\n\t\t\t    re = route.re,\n\t\t\t    keys = route.keys,\n\t\t\t    splats = [],\n\t\t\t    params = {},\n\t\t\t    j;\n\n\t\t\tcaptures = re.exec(uri);\n\t\t\tif (captures) {\n\t\t\t\tfor (j = 1, len = captures.length; j < len; ++j) {\n\t\t\t\t\tvar key = keys[j-1],\n\t\t\t\t\t\tval = typeof captures[j] === 'string'\n\t\t\t\t\t\t\t? decodeURIComponent(captures[j])\n\t\t\t\t\t\t\t: captures[j];\n\t\t\t\t\tif (key) {\n\t\t\t\t\t\tparams[key] = val;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tsplats.push(val);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\treturn {\n\t\t\t\t\tparams: params,\n\t\t\t\t\tsplats: splats,\n\t\t\t\t\troute: route.src\n\t\t\t\t};\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\t * Default \"normal\" router constructor.\n\t * accepts path, fn tuples via addRoute\n\t * returns {fn, params, splats, route}\n\t *  via match\n\t *\n\t * @return {Object}\n\t */\n\tvar Router = function() {\n\t  //using 'new' is optional\n\t  return {\n\t    routes: [],\n\t    routeMap : {},\n\t    addRoute: function(path, fn) {\n\t      if (!path) {\n\t\t\tthrow new Error(' route requires a path');\n\t      }\n\n\t      if (!fn) {\n\t       throw new Error(' route ' + path.toString() + ' requires a callback');\n\t      }\n\n\t      var route = new Route(path);\n\t      route.fn = fn;\n\n\t      this.routes.push(route);\n\t      this.routeMap[path] = fn;\n\t    },\n\n\t    match: function(pathname) {\n\t      var route = match(this.routes, pathname);\n\t      if(route){\n\t        route.fn = this.routeMap[route.route];\n\t      }\n\t      return route;\n\t    }\n\t  };\n\t};\n\n\t// module.exports = {\n\t//   Route: Route,\n\t//   pathToRegExp: pathToRegExp,\n\t//   match: match,\n\t//   Router: Router\n\t// }\n\n\treturn new Router();\n\n});";
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["273:3498"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["305:325"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["515:804"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["1116:1648"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["1864:2520"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2696:3345"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["3474:3493"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["576:598"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["605:733"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["738:800"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["636:645"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["650:671"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["685:714"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["719:729"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["1161:1600"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["1604:1644"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["1327:1341"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["1347:1366"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["1372:1534"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["1903:1922"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["1927:2516"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["1976:2095"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2101:2124"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2129:2512"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2149:2423"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2429:2507"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2205:2331"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2338:2417"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2355:2372"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2394:2410"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2754:3341"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2843:2909"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2919:3016"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["3026:3053"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["3062:3075"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["3085:3108"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["3117:3141"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2859:2900"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["2938:3007"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["3192:3232"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["3241:3307"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["3316:3328"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-router.js"]["3261:3298"] = 0;
__$coverObject['webdocs/test/src/lib/xqcore-router.js']['273:3498']++;
XQCore.Router = function () {
    __$coverObject['webdocs/test/src/lib/xqcore-router.js']['305:325']++;
    var localRoutes = [];
    __$coverObject['webdocs/test/src/lib/xqcore-router.js']['515:804']++;
    var Route = function (path) {
        __$coverObject['webdocs/test/src/lib/xqcore-router.js']['576:598']++;
        var src, re, keys = [];
        __$coverObject['webdocs/test/src/lib/xqcore-router.js']['605:733']++;
        if (path instanceof RegExp) {
            __$coverObject['webdocs/test/src/lib/xqcore-router.js']['636:645']++;
            re = path;
            __$coverObject['webdocs/test/src/lib/xqcore-router.js']['650:671']++;
            src = path.toString();
        } else {
            __$coverObject['webdocs/test/src/lib/xqcore-router.js']['685:714']++;
            re = pathToRegExp(path, keys);
            __$coverObject['webdocs/test/src/lib/xqcore-router.js']['719:729']++;
            src = path;
        }
        __$coverObject['webdocs/test/src/lib/xqcore-router.js']['738:800']++;
        return {
            re: re,
            src: path.toString(),
            keys: keys
        };
    };
    __$coverObject['webdocs/test/src/lib/xqcore-router.js']['1116:1648']++;
    var pathToRegExp = function (path, keys) {
        __$coverObject['webdocs/test/src/lib/xqcore-router.js']['1161:1600']++;
        path = path.concat('/?').replace(/\/\(/g, '(?:/').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
            __$coverObject['webdocs/test/src/lib/xqcore-router.js']['1327:1341']++;
            keys.push(key);
            __$coverObject['webdocs/test/src/lib/xqcore-router.js']['1347:1366']++;
            slash = slash || '';
            __$coverObject['webdocs/test/src/lib/xqcore-router.js']['1372:1534']++;
            return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || '([^/]+?)') + ')' + (optional || '');
        }).replace(/([\/.])/g, '\\$1').replace(/\*/g, '(.+)');
        __$coverObject['webdocs/test/src/lib/xqcore-router.js']['1604:1644']++;
        return new RegExp('^' + path + '$', 'i');
    };
    __$coverObject['webdocs/test/src/lib/xqcore-router.js']['1864:2520']++;
    var match = function (routes, uri) {
        __$coverObject['webdocs/test/src/lib/xqcore-router.js']['1903:1922']++;
        var captures, i = 0;
        __$coverObject['webdocs/test/src/lib/xqcore-router.js']['1927:2516']++;
        for (var len = routes.length; i < len; ++i) {
            __$coverObject['webdocs/test/src/lib/xqcore-router.js']['1976:2095']++;
            var route = routes[i], re = route.re, keys = route.keys, splats = [], params = {}, j;
            __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2101:2124']++;
            captures = re.exec(uri);
            __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2129:2512']++;
            if (captures) {
                __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2149:2423']++;
                for (j = 1, len = captures.length; j < len; ++j) {
                    __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2205:2331']++;
                    var key = keys[j - 1], val = typeof captures[j] === 'string' ? decodeURIComponent(captures[j]) : captures[j];
                    __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2338:2417']++;
                    if (key) {
                        __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2355:2372']++;
                        params[key] = val;
                    } else {
                        __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2394:2410']++;
                        splats.push(val);
                    }
                }
                __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2429:2507']++;
                return {
                    params: params,
                    splats: splats,
                    route: route.src
                };
            }
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2696:3345']++;
    var Router = function () {
        __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2754:3341']++;
        return {
            routes: [],
            routeMap: {},
            addRoute: function (path, fn) {
                __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2843:2909']++;
                if (!path) {
                    __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2859:2900']++;
                    throw new Error(' route requires a path');
                }
                __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2919:3016']++;
                if (!fn) {
                    __$coverObject['webdocs/test/src/lib/xqcore-router.js']['2938:3007']++;
                    throw new Error(' route ' + path.toString() + ' requires a callback');
                }
                __$coverObject['webdocs/test/src/lib/xqcore-router.js']['3026:3053']++;
                var route = new Route(path);
                __$coverObject['webdocs/test/src/lib/xqcore-router.js']['3062:3075']++;
                route.fn = fn;
                __$coverObject['webdocs/test/src/lib/xqcore-router.js']['3085:3108']++;
                this.routes.push(route);
                __$coverObject['webdocs/test/src/lib/xqcore-router.js']['3117:3141']++;
                this.routeMap[path] = fn;
            },
            match: function (pathname) {
                __$coverObject['webdocs/test/src/lib/xqcore-router.js']['3192:3232']++;
                var route = match(this.routes, pathname);
                __$coverObject['webdocs/test/src/lib/xqcore-router.js']['3241:3307']++;
                if (route) {
                    __$coverObject['webdocs/test/src/lib/xqcore-router.js']['3261:3298']++;
                    route.fn = this.routeMap[route.route];
                }
                __$coverObject['webdocs/test/src/lib/xqcore-router.js']['3316:3328']++;
                return route;
            }
        };
    };
    __$coverObject['webdocs/test/src/lib/xqcore-router.js']['3474:3493']++;
    return new Router();
};