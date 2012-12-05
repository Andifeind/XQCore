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
__$coverInit("webdocs/test/src/lib/xqcore-util.js", "/**\n * A bunch of helpfull functions\n *\n * @return {Object} Returns a singelton object instance of XQCore.Util\n */\nXQCore.Util = (function($) {\n\n\tvar util = {\n\t\tname: 'XQCore.Util',\n\t\tdebug: true\n\t};\n\n\t/**\n\t * Serialize a form and return its values as JSON\n\t *\n\t * @param {Object} Form selector\n\t * @return {Object} FormData as JSON\n\t */\n\tutil.serializeForm = function(selector) {\n\t\tvar formData = {},\n\t\t\tformSelector = $(selector);\n\n\t\tif (formSelector.get(0).tagName === 'INPUT') {\n\n\t\t}\n\t\telse {\n\t\t\tformSelector = formSelector.find(':input');\n\t\t}\n\n\t\tformSelector.serializeArray().forEach(function(item) {\n\t\t\tformData[item.name] = item.value;\n\t\t});\n\n\t\tif (this.debug) {\n\t\t\tconsole.log('XQCore - Serialize form:', formSelector, formData);\n\t\t}\n\n\t\treturn formData;\n\t};\n\n\t/**\n\t * Check length of a string or number\n\t *\n\t * @param {String or Number} input this will be checked\n\t * @param {Number} min String can't be shorter than n, Number can't be lower than n\n\t * @param {Number} max String can't be longer than n, Number can't be greater than n\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkLength = function(input, min, max) {\n\t\tif (typeof input === 'Number') {\n\t\t\tif (input < min) {\n\t\t\t\treturn 'num-to-small';\n\t\t\t}\n\t\t\telse if (input > max) {\n\t\t\t\treturn 'num-to-large';\n\t\t\t}\n\t\t}\n\t\telse {\n\t\t\tconsole.log(input, input.length);\n\t\t\tif (input.length < min) {\n\t\t\t\treturn 'str-to-short';\n\t\t\t}\n\t\t\telse if (input.length > max) {\n\t\t\t\treturn 'str-to-long';\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\t * Checks the equality of two strings\n\t *\n\t * @param {String} str1 First string\n\t * @param {String} str2 Second string\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkEqual = function(str1, str2) {\n\t\tif (str1 !== str2) {\n\t\t\treturn 'str-not-equal';\n\t\t}\n\t};\n\n\t/**\n\t * Checks the validity of an email address\n\t *\n\t * @param {String} email e-Mail address\n\t */\n\tutil.checkEmail = function(email) {\n\t\tif (!/^\\S+\\@\\S+\\.[a-z]{2,10}$/.test(email)) {\n\t\t\treturn 'invalid-email';\n\t\t}\n\t};\n\n\treturn util;\n\n})(jQuery);");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "115:2039");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "146:198");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "339:764");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1116:1493");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1694:1791");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1894:2011");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "2015:2026");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "383:431");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "436:546");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "551:647");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "652:740");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "745:760");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "500:542");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "609:641");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "673:736");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1165:1489");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1201:1309");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1224:1245");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1283:1304");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1327:1359");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1364:1485");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1394:1415");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1460:1480");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1737:1787");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1761:1783");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1932:2007");
__$coverInitRange("webdocs/test/src/lib/xqcore-util.js", "1981:2003");
__$coverCall('webdocs/test/src/lib/xqcore-util.js', '115:2039');
XQCore.Util = function ($) {
    __$coverCall('webdocs/test/src/lib/xqcore-util.js', '146:198');
    var util = {
            name: 'XQCore.Util',
            debug: true
        };
    __$coverCall('webdocs/test/src/lib/xqcore-util.js', '339:764');
    util.serializeForm = function (selector) {
        __$coverCall('webdocs/test/src/lib/xqcore-util.js', '383:431');
        var formData = {}, formSelector = $(selector);
        __$coverCall('webdocs/test/src/lib/xqcore-util.js', '436:546');
        if (formSelector.get(0).tagName === 'INPUT') {
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore-util.js', '500:542');
            formSelector = formSelector.find(':input');
        }
        __$coverCall('webdocs/test/src/lib/xqcore-util.js', '551:647');
        formSelector.serializeArray().forEach(function (item) {
            __$coverCall('webdocs/test/src/lib/xqcore-util.js', '609:641');
            formData[item.name] = item.value;
        });
        __$coverCall('webdocs/test/src/lib/xqcore-util.js', '652:740');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore-util.js', '673:736');
            console.log('XQCore - Serialize form:', formSelector, formData);
        }
        __$coverCall('webdocs/test/src/lib/xqcore-util.js', '745:760');
        return formData;
    };
    __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1116:1493');
    util.checkLength = function (input, min, max) {
        __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1165:1489');
        if (typeof input === 'Number') {
            __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1201:1309');
            if (input < min) {
                __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1224:1245');
                return 'num-to-small';
            } else if (input > max) {
                __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1283:1304');
                return 'num-to-large';
            }
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1327:1359');
            console.log(input, input.length);
            __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1364:1485');
            if (input.length < min) {
                __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1394:1415');
                return 'str-to-short';
            } else if (input.length > max) {
                __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1460:1480');
                return 'str-to-long';
            }
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1694:1791');
    util.checkEqual = function (str1, str2) {
        __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1737:1787');
        if (str1 !== str2) {
            __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1761:1783');
            return 'str-not-equal';
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1894:2011');
    util.checkEmail = function (email) {
        __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1932:2007');
        if (!/^\S+\@\S+\.[a-z]{2,10}$/.test(email)) {
            __$coverCall('webdocs/test/src/lib/xqcore-util.js', '1981:2003');
            return 'invalid-email';
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore-util.js', '2015:2026');
    return util;
}(jQuery);