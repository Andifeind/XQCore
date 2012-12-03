if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/xqcore-model.js"] = {};
__$coverObject["webdocs/test/src/lib/xqcore-model.js"].__code = "XQCore.Model = (function(window, document, $, undefined) {\n\tvar model;\n\n\tmodel = function(conf) {\n\t\tif (conf === undefined) {\n\t\t\tconf = {};\n\t\t}\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Model';\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.attributes = {};\n\t\tthis._isValid = false;\n\n\t\tif (conf.validate) {\n\t\t\tthis.validate = function(formData) {\n\t\t\t\tvar result;\n\n\t\t\t\tthis._isValid = false;\n\t\t\t\tresult = conf.validate.call(this, formData);\n\t\t\t\tif (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {\n\t\t\t\t\tthis._isValid = true;\n\t\t\t\t}\n\n\t\t\t\treturn result;\n\t\t\t}.bind(this);\n\t\t}\n\n\t\tthis.init();\n\t};\n\n\tmodel.prototype.init = function() {\n\n\t};\n\n\tmodel.prototype.validate = function() {\n\n\t};\n\n\tmodel.prototype.isValid = function() {\n\t\treturn this._isValid;\n\t};\n\n\t/**\n\t * Set model data\n\t *\n\t * @param {Object or String} data/key\n\t * @param {Object} value Data value\n\t */\n\tmodel.prototype.set = function() {\n\t\tvar newData = {},\n\t\t\tvalidateResult;\n\n\t\tif (typeof arguments[0] === 'object') {\n\t\t\t//Add a dataset\n\t\t\t$.extend(newData, arguments[0]);\n\t\t\tthis.log('Set data', arguments[0]);\n\t\t}\n\t\telse if (typeof arguments[0] === 'string') {\n\t\t\tnewData[arguments[0]] = arguments[1];\n\t\t\tthis.log('Set data', arguments[0], arguments[1]);\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Data are incorrect in model.set()', arguments);\n\t\t}\n\n\t\tif (this.validate) {\n\t\t\tvalidateResult = this.validate(newData);\n\t\t\tif (validateResult) {\n\t\t\t\tthis.warn('Validate error in model.set', validateResult);\n\t\t\t\treturn validateResult;\n\t\t\t}\n\t\t}\n\n\t\t$.extend(this.attributes, newData);\n\t};\n\n\t/**\n\t * Get one or all attributes from model\n\t *\n\t * @param  {String} key Data key\n\t *\n\t * @return {Object}     Model dataset\n\t */\n\tmodel.prototype.get = function(key) {\n\t\tif (key === undefined) {\n\t\t\treturn this.attributes;\n\t\t}\n\t\telse {\n\t\t\treturn this.attributes[key];\n\t\t}\n\t};\n\n\t/**\n\t * Check wether model has a dataset\n\t *\n\t * @param {String} key Dataset key\n\t * @return {Boolean} Returns true if model has a dataset with key\n\t */\n\tmodel.prototype.has = function(key) {\n\t\treturn !!this.attributes[key];\n\t};\n\n\t/**\n\t * Remove all data from model\n\t */\n\tmodel.prototype.reset = function() {\n\t\tthis.log('Reset model');\n\t\tthis.attributes = {};\n\t};\n\n\t/**\n\t * Send an ajax request to a webserver. Sends all models attributes\n\t *\n\t * You must set the server URI first with model.server = 'http://example.com/post'\n\t *\n\t * @param {String} Method send method, GET, POST, PUT, DELETE (default POST)\n\t * @param {Function} callback Calls callback(err, data, status, jqXHR) if response was receiving\n\t */\n\tmodel.prototype.send = function(method, callback) {\n\t\tvar data;\n\n\t\tmethod = method || 'POST';\n\n\t\tdata = this.get();\n\n\t\tif (!this.server) {\n\t\t\tthis.error('Can not send an ajax request! You must define a server URL first.');\n\t\t\treturn false;\n\t\t}\n\n\t\tthis.log('Sending an ajax call to ', this.server, 'with data: ', data);\n\n\t\t$.ajax({\n\t\t\turl: this.server,\n\t\t\tmethod: method,\n\t\t\tdata: data,\n\t\t\tsuccess: function(data, status, jqXHR) {\n\t\t\t\tcallback.call(this, null, data, status, jqXHR);\n\t\t\t}.bind(this),\n\t\t\terror: function(jqXHR, status, error) {\n\t\t\t\tcallback.call(this, {\n\t\t\t\t\ttype: status,\n\t\t\t\t\thttp: error\n\t\t\t\t}, null, status, jqXHR);\n\t\t\t}.bind(this)\n\t\t});\n\t};\n\n\treturn model;\n})(window, document, jQuery);\n";
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["0:3320"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["60:69"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["73:682"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["686:725"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["729:772"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["776:841"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["954:1621"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1757:1900"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2058:2131"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2176:2266"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2617:3274"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["3278:3290"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["100:142"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["147:208"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["212:259"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["263:295"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["299:319"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["323:344"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["349:662"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["667:678"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["129:138"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["373:658"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["414:424"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["431:452"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["458:501"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["507:621"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["628:641"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["595:615"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["817:837"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["991:1026"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1031:1387"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1392:1578"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1583:1617"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1093:1124"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1129:1163"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1219:1255"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1260:1308"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1326:1383"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1416:1455"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1460:1574"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1486:1542"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1548:1569"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1797:1896"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1825:1847"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["1865:1892"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2098:2127"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2215:2238"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2242:2262"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2671:2679"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2684:2709"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2714:2731"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2736:2859"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2864:2934"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2939:3270"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2759:2838"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["2843:2855"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["3051:3097"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-model.js"]["3163:3248"] = 0;
__$coverObject['webdocs/test/src/lib/xqcore-model.js']['0:3320']++;
XQCore.Model = function (window, document, $, undefined) {
    __$coverObject['webdocs/test/src/lib/xqcore-model.js']['60:69']++;
    var model;
    __$coverObject['webdocs/test/src/lib/xqcore-model.js']['73:682']++;
    model = function (conf) {
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['100:142']++;
        if (conf === undefined) {
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['129:138']++;
            conf = {};
        }
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['147:208']++;
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['212:259']++;
        this.name = (conf.name || 'Nameless') + 'Model';
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['263:295']++;
        this.debug = Boolean(conf.debug);
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['299:319']++;
        this.attributes = {};
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['323:344']++;
        this._isValid = false;
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['349:662']++;
        if (conf.validate) {
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['373:658']++;
            this.validate = function (formData) {
                __$coverObject['webdocs/test/src/lib/xqcore-model.js']['414:424']++;
                var result;
                __$coverObject['webdocs/test/src/lib/xqcore-model.js']['431:452']++;
                this._isValid = false;
                __$coverObject['webdocs/test/src/lib/xqcore-model.js']['458:501']++;
                result = conf.validate.call(this, formData);
                __$coverObject['webdocs/test/src/lib/xqcore-model.js']['507:621']++;
                if (!result || typeof result === 'object' && Object.keys(result).length === 0) {
                    __$coverObject['webdocs/test/src/lib/xqcore-model.js']['595:615']++;
                    this._isValid = true;
                }
                __$coverObject['webdocs/test/src/lib/xqcore-model.js']['628:641']++;
                return result;
            }.bind(this);
        }
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['667:678']++;
        this.init();
    };
    __$coverObject['webdocs/test/src/lib/xqcore-model.js']['686:725']++;
    model.prototype.init = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore-model.js']['729:772']++;
    model.prototype.validate = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore-model.js']['776:841']++;
    model.prototype.isValid = function () {
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['817:837']++;
        return this._isValid;
    };
    __$coverObject['webdocs/test/src/lib/xqcore-model.js']['954:1621']++;
    model.prototype.set = function () {
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['991:1026']++;
        var newData = {}, validateResult;
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1031:1387']++;
        if (typeof arguments[0] === 'object') {
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1093:1124']++;
            $.extend(newData, arguments[0]);
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1129:1163']++;
            this.log('Set data', arguments[0]);
        } else if (typeof arguments[0] === 'string') {
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1219:1255']++;
            newData[arguments[0]] = arguments[1];
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1260:1308']++;
            this.log('Set data', arguments[0], arguments[1]);
        } else {
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1326:1383']++;
            this.warn('Data are incorrect in model.set()', arguments);
        }
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1392:1578']++;
        if (this.validate) {
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1416:1455']++;
            validateResult = this.validate(newData);
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1460:1574']++;
            if (validateResult) {
                __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1486:1542']++;
                this.warn('Validate error in model.set', validateResult);
                __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1548:1569']++;
                return validateResult;
            }
        }
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1583:1617']++;
        $.extend(this.attributes, newData);
    };
    __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1757:1900']++;
    model.prototype.get = function (key) {
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1797:1896']++;
        if (key === undefined) {
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1825:1847']++;
            return this.attributes;
        } else {
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['1865:1892']++;
            return this.attributes[key];
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2058:2131']++;
    model.prototype.has = function (key) {
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2098:2127']++;
        return !!this.attributes[key];
    };
    __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2176:2266']++;
    model.prototype.reset = function () {
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2215:2238']++;
        this.log('Reset model');
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2242:2262']++;
        this.attributes = {};
    };
    __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2617:3274']++;
    model.prototype.send = function (method, callback) {
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2671:2679']++;
        var data;
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2684:2709']++;
        method = method || 'POST';
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2714:2731']++;
        data = this.get();
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2736:2859']++;
        if (!this.server) {
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2759:2838']++;
            this.error('Can not send an ajax request! You must define a server URL first.');
            __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2843:2855']++;
            return false;
        }
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2864:2934']++;
        this.log('Sending an ajax call to ', this.server, 'with data: ', data);
        __$coverObject['webdocs/test/src/lib/xqcore-model.js']['2939:3270']++;
        $.ajax({
            url: this.server,
            method: method,
            data: data,
            success: function (data, status, jqXHR) {
                __$coverObject['webdocs/test/src/lib/xqcore-model.js']['3051:3097']++;
                callback.call(this, null, data, status, jqXHR);
            }.bind(this),
            error: function (jqXHR, status, error) {
                __$coverObject['webdocs/test/src/lib/xqcore-model.js']['3163:3248']++;
                callback.call(this, {
                    type: status,
                    http: error
                }, null, status, jqXHR);
            }.bind(this)
        });
    };
    __$coverObject['webdocs/test/src/lib/xqcore-model.js']['3278:3290']++;
    return model;
}(window, document, jQuery);