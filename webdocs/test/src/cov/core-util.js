if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/core-util.js"] = {};
__$coverObject["webdocs/test/src/lib/core-util.js"].__code = "/**\n * A bunch of helpfull functions\n *\n * @return {Object} Returns a singelton object instance of CoreUtil\n */\nvar CoreUtil = (function($) {\n\n\tvar util = {\n\t\tname: 'CoreUtil',\n\t\tdebug: true\n\t};\n\n\t/**\n\t * Serialize a form and return its values as JSON\n\t *\n\t * @param {Object} Form selector\n\t * @return {Object} FormData as JSON\n\t */\n\tutil.serializeForm = function(selector) {\n\t\tvar formData = {},\n\t\t\tformSelector = $(selector);\n\n\t\tif (formSelector.get(0).tagName === 'INPUT') {\n\n\t\t}\n\t\telse {\n\t\t\tformSelector = formSelector.find(':input');\n\t\t}\n\n\t\tformSelector.serializeArray().forEach(function(item) {\n\t\t\tformData[item.name] = item.value;\n\t\t});\n\n\t\tif (this.debug) {\n\t\t\tconsole.log('Akonda Core - Serialize form:', formSelector, formData);\n\t\t}\n\n\t\treturn formData;\n\t};\n\n\t/**\n\t * Check length of a string or number\n\t *\n\t * @param {String or Number} input this will be checked\n\t * @param {Number} min String can't be shorter than n, Number can't be lower than n\n\t * @param {Number} max String can't be longer than n, Number can't be greater than n\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkLength = function(input, min, max) {\n\t\tif (typeof input === 'Number') {\n\t\t\tif (input < min) {\n\t\t\t\treturn 'num-to-small';\n\t\t\t}\n\t\t\telse if (input > max) {\n\t\t\t\treturn 'num-to-large';\n\t\t\t}\n\t\t}\n\t\telse {\n\t\t\tconsole.log(input, input.length);\n\t\t\tif (input.length < min) {\n\t\t\t\treturn 'str-to-short';\n\t\t\t}\n\t\t\telse if (input.length > max) {\n\t\t\t\treturn 'str-to-long';\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\t * Checks the equality of two strings\n\t *\n\t * @param {String} str1 First string\n\t * @param {String} str2 Second string\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkEqual = function(str1, str2) {\n\t\tif (str1 !== str2) {\n\t\t\treturn 'str-not-equal';\n\t\t}\n\t};\n\n\t/**\n\t * Checks the validity of an email address\n\t *\n\t * @param {String} email e-Mail address\n\t */\n\tutil.checkEmail = function(email) {\n\t\tif (!/^\\S+\\@\\S+\\.[a-z]{2,10}$/.test(email)) {\n\t\t\treturn 'invalid-email';\n\t\t}\n\t};\n\n\treturn util;\n\n})(jQuery);";
__$coverObject["webdocs/test/src/lib/core-util.js"]["112:2039"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["144:193"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["334:764"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1116:1493"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1694:1791"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1894:2011"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["2015:2026"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["378:426"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["431:541"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["546:642"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["647:740"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["745:760"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["495:537"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["604:636"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["668:736"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1165:1489"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1201:1309"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1224:1245"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1283:1304"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1327:1359"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1364:1485"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1394:1415"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1460:1480"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1737:1787"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1761:1783"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1932:2007"] = 0;
__$coverObject["webdocs/test/src/lib/core-util.js"]["1981:2003"] = 0;
__$coverObject['webdocs/test/src/lib/core-util.js']['112:2039']++;
var CoreUtil = function ($) {
        __$coverObject['webdocs/test/src/lib/core-util.js']['144:193']++;
        var util = {
                name: 'CoreUtil',
                debug: true
            };
        __$coverObject['webdocs/test/src/lib/core-util.js']['334:764']++;
        util.serializeForm = function (selector) {
            __$coverObject['webdocs/test/src/lib/core-util.js']['378:426']++;
            var formData = {}, formSelector = $(selector);
            __$coverObject['webdocs/test/src/lib/core-util.js']['431:541']++;
            if (formSelector.get(0).tagName === 'INPUT') {
            } else {
                __$coverObject['webdocs/test/src/lib/core-util.js']['495:537']++;
                formSelector = formSelector.find(':input');
            }
            __$coverObject['webdocs/test/src/lib/core-util.js']['546:642']++;
            formSelector.serializeArray().forEach(function (item) {
                __$coverObject['webdocs/test/src/lib/core-util.js']['604:636']++;
                formData[item.name] = item.value;
            });
            __$coverObject['webdocs/test/src/lib/core-util.js']['647:740']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/core-util.js']['668:736']++;
                console.log('Akonda Core - Serialize form:', formSelector, formData);
            }
            __$coverObject['webdocs/test/src/lib/core-util.js']['745:760']++;
            return formData;
        };
        __$coverObject['webdocs/test/src/lib/core-util.js']['1116:1493']++;
        util.checkLength = function (input, min, max) {
            __$coverObject['webdocs/test/src/lib/core-util.js']['1165:1489']++;
            if (typeof input === 'Number') {
                __$coverObject['webdocs/test/src/lib/core-util.js']['1201:1309']++;
                if (input < min) {
                    __$coverObject['webdocs/test/src/lib/core-util.js']['1224:1245']++;
                    return 'num-to-small';
                } else if (input > max) {
                    __$coverObject['webdocs/test/src/lib/core-util.js']['1283:1304']++;
                    return 'num-to-large';
                }
            } else {
                __$coverObject['webdocs/test/src/lib/core-util.js']['1327:1359']++;
                console.log(input, input.length);
                __$coverObject['webdocs/test/src/lib/core-util.js']['1364:1485']++;
                if (input.length < min) {
                    __$coverObject['webdocs/test/src/lib/core-util.js']['1394:1415']++;
                    return 'str-to-short';
                } else if (input.length > max) {
                    __$coverObject['webdocs/test/src/lib/core-util.js']['1460:1480']++;
                    return 'str-to-long';
                }
            }
        };
        __$coverObject['webdocs/test/src/lib/core-util.js']['1694:1791']++;
        util.checkEqual = function (str1, str2) {
            __$coverObject['webdocs/test/src/lib/core-util.js']['1737:1787']++;
            if (str1 !== str2) {
                __$coverObject['webdocs/test/src/lib/core-util.js']['1761:1783']++;
                return 'str-not-equal';
            }
        };
        __$coverObject['webdocs/test/src/lib/core-util.js']['1894:2011']++;
        util.checkEmail = function (email) {
            __$coverObject['webdocs/test/src/lib/core-util.js']['1932:2007']++;
            if (!/^\S+\@\S+\.[a-z]{2,10}$/.test(email)) {
                __$coverObject['webdocs/test/src/lib/core-util.js']['1981:2003']++;
                return 'invalid-email';
            }
        };
        __$coverObject['webdocs/test/src/lib/core-util.js']['2015:2026']++;
        return util;
    }(jQuery);