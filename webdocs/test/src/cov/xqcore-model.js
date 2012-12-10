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
__$coverInit("webdocs/test/src/lib/xqcore-model.js", "XQCore.Model = (function(window, document, $, undefined) {\n\tvar model;\n\n\tmodel = function(conf) {\n\t\tif (conf === undefined) {\n\t\t\tconf = {};\n\t\t}\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Model';\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.attributes = {};\n\t\tthis._isValid = false;\n\n\t\tif (conf.validate) {\n\t\t\tthis.validate = function(formData) {\n\t\t\t\tvar result;\n\n\t\t\t\tthis._isValid = false;\n\t\t\t\tresult = conf.validate.call(this, formData);\n\t\t\t\tif (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {\n\t\t\t\t\tthis._isValid = true;\n\t\t\t\t}\n\n\t\t\t\treturn result;\n\t\t\t}.bind(this);\n\t\t}\n\n\t\tthis.init();\n\t};\n\n\tmodel.prototype.init = function() {\n\n\t};\n\n\tmodel.prototype.validate = function() {\n\n\t};\n\n\tmodel.prototype.isValid = function() {\n\t\treturn this._isValid;\n\t};\n\n\t/**\n\t * Set model data\n\t *\n\t * @param {Object or String} data/key\n\t * @param {Object} value Data value\n\t */\n\tmodel.prototype.set = function() {\n\t\tvar newData = {},\n\t\t\tvalidateResult;\n\n\t\tif (typeof arguments[0] === 'object') {\n\t\t\t//Add a dataset\n\t\t\t$.extend(newData, arguments[0]);\n\t\t\tthis.log('Set data', arguments[0]);\n\t\t}\n\t\telse if (typeof arguments[0] === 'string') {\n\t\t\tnewData[arguments[0]] = arguments[1];\n\t\t\tthis.log('Set data', arguments[0], arguments[1]);\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Data are incorrect in model.set()', arguments);\n\t\t}\n\n\t\tif (this.validate) {\n\t\t\tvalidateResult = this.validate(newData);\n\t\t\tif (validateResult) {\n\t\t\t\tthis.warn('Validate error in model.set', validateResult);\n\t\t\t\treturn validateResult;\n\t\t\t}\n\t\t}\n\n\t\t$.extend(this.attributes, newData);\n\t};\n\n\t/**\n\t * Get one or all attributes from model\n\t *\n\t * @param  {String} key Data key\n\t *\n\t * @return {Object}     Model dataset\n\t */\n\tmodel.prototype.get = function(key) {\n\t\tif (key === undefined) {\n\t\t\treturn this.attributes;\n\t\t}\n\t\telse {\n\t\t\treturn this.attributes[key];\n\t\t}\n\t};\n\n\t/**\n\t * Check wether model has a dataset\n\t *\n\t * @param {String} key Dataset key\n\t * @return {Boolean} Returns true if model has a dataset with key\n\t */\n\tmodel.prototype.has = function(key) {\n\t\treturn !!this.attributes[key];\n\t};\n\n\t/**\n\t * Remove all data from model\n\t */\n\tmodel.prototype.reset = function() {\n\t\tthis.log('Reset model');\n\t\tthis.attributes = {};\n\t};\n\n\t/**\n\t * Append data to a subset\n\t *\n\t * @param {String} path path to subset\n\t * @param {Object} data data to add\n\t */\n\tmodel.prototype.append = function(path, data) {\n\t\tvar dataset = this.attributes;\n\t\tpath.split('.').forEach(function(key) {\n\t\t\tdataset = dataset[key];\n\t\t});\n\n\t\tif (dataset instanceof Array) {\n\t\t\tdataset.push(data);\n\t\t}\n\t\telse {\n\t\t\tdataset = $.extend(dataset, data);\n\t\t}\n\n\t\treturn data;\n\t};\n\n\t/**\n\t * Prepend data to a subset\n\t *\n\t * @param {String} path path to subset\n\t * @param {Object} data data to add\n\t */\n\tmodel.prototype.prepend = function(path, data) {\n\t\tvar dataset = this.attributes;\n\t\tpath.split('.').forEach(function(key) {\n\t\t\tdataset = dataset[key];\n\t\t});\n\n\t\tif (dataset instanceof Array) {\n\t\t\tdataset.unshift(data);\n\t\t}\n\t\telse {\n\t\t\tdataset = $.extend(data, dataset);\n\t\t}\n\n\t\treturn data;\n\t};\n\n\t/**\n\t * Remove a subset\n\t *\n\t * @param {String} path path to subset\n\t * @param {Number} index Index of the subsut to remove\n\t *\n\t * @return {Object} removed subset\n\t */\n\tmodel.prototype.remove = function(path, index) {\n\t\tvar dataset = this.attributes,\n\t\t\tdata = null;\n\t\tpath.split('.').forEach(function(key) {\n\t\t\tdataset = dataset[key];\n\t\t});\n\n\t\tif (dataset instanceof Array) {\n\t\t\tdata = dataset.splice(index, 1);\n\t\t\tdata = data[0] || null;\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Model.remove() doesn\\'t work with Objects in model', this.name);\n\t\t}\n\n\t\treturn data;\n\t};\n\n\t/**\n\t * Send an ajax request to a webserver. Sends all models attributes\n\t *\n\t * You must set the server URI first with model.server = 'http://example.com/post'\n\t *\n\t * @param {String} Method send method, GET, POST, PUT, DELETE (default POST)\n\t * @param {Function} callback Calls callback(err, data, status, jqXHR) if response was receiving\n\t */\n\tmodel.prototype.send = function(method, callback) {\n\t\tvar data;\n\n\t\tmethod = method || 'POST';\n\n\t\tdata = this.get();\n\n\t\tif (!this.server) {\n\t\t\tthis.error('Can not send an ajax request! You must define a server URL first.');\n\t\t\treturn false;\n\t\t}\n\n\t\tthis.log('Sending an ajax call to ', this.server, 'with data: ', data);\n\n\t\t$.ajax({\n\t\t\turl: this.server,\n\t\t\tmethod: method,\n\t\t\tdata: data,\n\t\t\tsuccess: function(data, status, jqXHR) {\n\t\t\t\tcallback.call(this, null, data, status, jqXHR);\n\t\t\t}.bind(this),\n\t\t\terror: function(jqXHR, status, error) {\n\t\t\t\tcallback.call(this, {\n\t\t\t\t\ttype: status,\n\t\t\t\t\thttp: error\n\t\t\t\t}, null, status, jqXHR);\n\t\t\t}.bind(this)\n\t\t});\n\t};\n\n\treturn model;\n})(window, document, jQuery);\n");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "0:4704");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "60:69");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "73:682");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "686:725");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "729:772");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "776:841");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "954:1621");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1757:1900");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2058:2131");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2176:2266");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2389:2676");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2800:3091");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "3265:3650");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "4001:4658");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "4662:4674");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "100:142");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "147:208");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "212:259");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "263:295");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "299:319");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "323:344");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "349:662");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "667:678");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "129:138");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "373:658");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "414:424");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "431:452");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "458:501");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "507:621");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "628:641");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "595:615");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "817:837");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "991:1026");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1031:1387");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1392:1578");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1583:1617");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1093:1124");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1129:1163");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1219:1255");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1260:1308");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1326:1383");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1416:1455");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1460:1574");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1486:1542");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1548:1569");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1797:1896");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1825:1847");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "1865:1892");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2098:2127");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2215:2238");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2242:2262");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2439:2468");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2472:2543");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2548:2656");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2661:2672");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2515:2537");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2583:2601");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2619:2652");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2851:2880");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2884:2955");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2960:3071");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "3076:3087");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2927:2949");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "2995:3016");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "3034:3067");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "3316:3361");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "3365:3436");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "3441:3630");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "3635:3646");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "3408:3430");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "3476:3507");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "3512:3534");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "3552:3626");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "4055:4063");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "4068:4093");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "4098:4115");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "4120:4243");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "4248:4318");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "4323:4654");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "4143:4222");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "4227:4239");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "4435:4481");
__$coverInitRange("webdocs/test/src/lib/xqcore-model.js", "4547:4632");
__$coverCall('webdocs/test/src/lib/xqcore-model.js', '0:4704');
XQCore.Model = function (window, document, $, undefined) {
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '60:69');
    var model;
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '73:682');
    model = function (conf) {
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '100:142');
        if (conf === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '129:138');
            conf = {};
        }
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '147:208');
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '212:259');
        this.name = (conf.name || 'Nameless') + 'Model';
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '263:295');
        this.debug = Boolean(conf.debug);
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '299:319');
        this.attributes = {};
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '323:344');
        this._isValid = false;
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '349:662');
        if (conf.validate) {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '373:658');
            this.validate = function (formData) {
                __$coverCall('webdocs/test/src/lib/xqcore-model.js', '414:424');
                var result;
                __$coverCall('webdocs/test/src/lib/xqcore-model.js', '431:452');
                this._isValid = false;
                __$coverCall('webdocs/test/src/lib/xqcore-model.js', '458:501');
                result = conf.validate.call(this, formData);
                __$coverCall('webdocs/test/src/lib/xqcore-model.js', '507:621');
                if (!result || typeof result === 'object' && Object.keys(result).length === 0) {
                    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '595:615');
                    this._isValid = true;
                }
                __$coverCall('webdocs/test/src/lib/xqcore-model.js', '628:641');
                return result;
            }.bind(this);
        }
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '667:678');
        this.init();
    };
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '686:725');
    model.prototype.init = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '729:772');
    model.prototype.validate = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '776:841');
    model.prototype.isValid = function () {
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '817:837');
        return this._isValid;
    };
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '954:1621');
    model.prototype.set = function () {
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '991:1026');
        var newData = {}, validateResult;
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1031:1387');
        if (typeof arguments[0] === 'object') {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1093:1124');
            $.extend(newData, arguments[0]);
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1129:1163');
            this.log('Set data', arguments[0]);
        } else if (typeof arguments[0] === 'string') {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1219:1255');
            newData[arguments[0]] = arguments[1];
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1260:1308');
            this.log('Set data', arguments[0], arguments[1]);
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1326:1383');
            this.warn('Data are incorrect in model.set()', arguments);
        }
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1392:1578');
        if (this.validate) {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1416:1455');
            validateResult = this.validate(newData);
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1460:1574');
            if (validateResult) {
                __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1486:1542');
                this.warn('Validate error in model.set', validateResult);
                __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1548:1569');
                return validateResult;
            }
        }
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1583:1617');
        $.extend(this.attributes, newData);
    };
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1757:1900');
    model.prototype.get = function (key) {
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1797:1896');
        if (key === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1825:1847');
            return this.attributes;
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '1865:1892');
            return this.attributes[key];
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2058:2131');
    model.prototype.has = function (key) {
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2098:2127');
        return !!this.attributes[key];
    };
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2176:2266');
    model.prototype.reset = function () {
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2215:2238');
        this.log('Reset model');
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2242:2262');
        this.attributes = {};
    };
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2389:2676');
    model.prototype.append = function (path, data) {
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2439:2468');
        var dataset = this.attributes;
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2472:2543');
        path.split('.').forEach(function (key) {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2515:2537');
            dataset = dataset[key];
        });
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2548:2656');
        if (dataset instanceof Array) {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2583:2601');
            dataset.push(data);
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2619:2652');
            dataset = $.extend(dataset, data);
        }
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2661:2672');
        return data;
    };
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2800:3091');
    model.prototype.prepend = function (path, data) {
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2851:2880');
        var dataset = this.attributes;
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2884:2955');
        path.split('.').forEach(function (key) {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2927:2949');
            dataset = dataset[key];
        });
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2960:3071');
        if (dataset instanceof Array) {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '2995:3016');
            dataset.unshift(data);
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '3034:3067');
            dataset = $.extend(data, dataset);
        }
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '3076:3087');
        return data;
    };
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '3265:3650');
    model.prototype.remove = function (path, index) {
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '3316:3361');
        var dataset = this.attributes, data = null;
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '3365:3436');
        path.split('.').forEach(function (key) {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '3408:3430');
            dataset = dataset[key];
        });
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '3441:3630');
        if (dataset instanceof Array) {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '3476:3507');
            data = dataset.splice(index, 1);
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '3512:3534');
            data = data[0] || null;
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '3552:3626');
            this.warn('Model.remove() doesn\'t work with Objects in model', this.name);
        }
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '3635:3646');
        return data;
    };
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '4001:4658');
    model.prototype.send = function (method, callback) {
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '4055:4063');
        var data;
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '4068:4093');
        method = method || 'POST';
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '4098:4115');
        data = this.get();
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '4120:4243');
        if (!this.server) {
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '4143:4222');
            this.error('Can not send an ajax request! You must define a server URL first.');
            __$coverCall('webdocs/test/src/lib/xqcore-model.js', '4227:4239');
            return false;
        }
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '4248:4318');
        this.log('Sending an ajax call to ', this.server, 'with data: ', data);
        __$coverCall('webdocs/test/src/lib/xqcore-model.js', '4323:4654');
        $.ajax({
            url: this.server,
            method: method,
            data: data,
            success: function (data, status, jqXHR) {
                __$coverCall('webdocs/test/src/lib/xqcore-model.js', '4435:4481');
                callback.call(this, null, data, status, jqXHR);
            }.bind(this),
            error: function (jqXHR, status, error) {
                __$coverCall('webdocs/test/src/lib/xqcore-model.js', '4547:4632');
                callback.call(this, {
                    type: status,
                    http: error
                }, null, status, jqXHR);
            }.bind(this)
        });
    };
    __$coverCall('webdocs/test/src/lib/xqcore-model.js', '4662:4674');
    return model;
}(window, document, jQuery);