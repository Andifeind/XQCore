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
__$coverInit("webdocs/test/src/lib/core-model.js", "var CoreModel = (function() {\n\tvar model;\n\n\tmodel = function(conf) {\n\t\tif (conf === undefined) {\n\t\t\tconf = {};\n\t\t}\n\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Model';\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.attributes = {};\n\t\tthis._isValid = false;\n\n\t\tif (conf.validate) {\n\t\t\tthis.validate = function(formData) {\n\t\t\t\tvar result;\n\n\t\t\t\tthis._isValid = false;\n\t\t\t\tresult = conf.validate.call(this, formData);\n\t\t\t\tif (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {\n\t\t\t\t\tthis._isValid = true;\n\t\t\t\t}\n\n\t\t\t\treturn result;\n\t\t\t}.bind(this);\n\t\t}\n\n\t\tthis.init();\n\t};\n\n\tmodel.prototype.init = function() {\n\n\t};\n\n\tmodel.prototype.validate = function() {\n\n\t};\n\n\tmodel.prototype.isValid = function() {\n\t\treturn this._isValid;\n\t};\n\n\t/**\n\t * Set model data\n\t *\n\t * @param {Object or String} data/key\n\t * @param {Object} value Data value\n\t */\n\tmodel.prototype.set = function() {\n\t\tvar newData = {},\n\t\t\tvalidateResult;\n\n\t\tif (typeof arguments[0] === 'object') {\n\t\t\t//Add a dataset\n\t\t\t$.extend(newData, arguments[0]);\n\t\t\tthis.log('Set data', arguments[0]);\n\t\t}\n\t\telse if (typeof arguments[0] === 'string') {\n\t\t\tnewData[arguments[0]] = arguments[1];\n\t\t\tthis.log('Set data', arguments[0], arguments[1]);\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Data are incorrect in model.set()', arguments);\n\t\t}\n\n\t\tif (this.validate) {\n\t\t\tvalidateResult = this.validate(newData);\n\t\t\tif (validateResult) {\n\t\t\t\tthis.warn('Validate error in model.set', validateResult);\n\t\t\t\treturn validateResult;\n\t\t\t}\n\t\t}\n\n\t\t$.extend(this.attributes, newData);\n\t};\n\n\t/**\n\t * Get one or all attributes from model\n\t *\n\t * @param  {String} key Data key\n\t *\n\t * @return {Object}     Model dataset\n\t */\n\tmodel.prototype.get = function(key) {\n\t\tif (key === undefined) {\n\t\t\treturn this.attributes;\n\t\t}\n\t\telse {\n\t\t\treturn this.attributes[key];\n\t\t}\n\t};\n\n\t/**\n\t * Check wether model has a dataset\n\t *\n\t * @param {String} key Dataset key\n\t * @return {Boolean} Returns true if model has a dataset with key\n\t */\n\tmodel.prototype.has = function(key) {\n\t\treturn !!this.attributes[key];\n\t};\n\n\t/**\n\t * Remove all data from model\n\t */\n\tmodel.prototype.reset = function() {\n\t\tthis.log('Reset model');\n\t\tthis.attributes = {};\n\t};\n\n\t/**\n\t * Send an ajax request to a webserver. Sends all models attributes\n\t *\n\t * You must set the server URI first with model.server = 'http://example.com/post'\n\t *\n\t * @param {String} Method send method, GET, POST, PUT, DELETE (default POST)\n\t * @param {Function} callback Calls callback(err, data, status, jqXHR) if response was receiving\n\t */\n\tmodel.prototype.send = function(method, callback) {\n\t\tvar data;\n\n\t\tmethod = method || 'POST';\n\n\t\tdata = this.get();\n\n\t\tif (!this.server) {\n\t\t\tthis.error('Can not send an ajax request! You must define a server URL first.');\n\t\t\treturn false;\n\t\t}\n\n\t\tthis.log('Sending an ajax call to ', this.server, 'with data: ', data);\n\n\t\t$.ajax({\n\t\t\turl: this.server,\n\t\t\tmethod: method,\n\t\t\tdata: data,\n\t\t\tsuccess: function(data, status, jqXHR) {\n\t\t\t\tcallback.call(this, null, data, status, jqXHR);\n\t\t\t}.bind(this),\n\t\t\terror: function(jqXHR, status, error) {\n\t\t\t\tcallback.call(this, {\n\t\t\t\t\ttype: status,\n\t\t\t\t\thttp: error\n\t\t\t\t}, null, status, jqXHR);\n\t\t\t}.bind(this)\n\t\t});\n\t}\n\n\treturn model;\n})();");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "0:3260");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "31:40");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "44:647");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "651:690");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "694:737");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "741:806");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "919:1586");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1722:1865");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2023:2096");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2141:2231");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2582:3241");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "3242:3254");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "71:113");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "118:173");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "177:224");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "228:260");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "264:284");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "288:309");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "314:627");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "632:643");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "100:109");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "338:623");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "379:389");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "396:417");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "423:466");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "472:586");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "593:606");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "560:580");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "782:802");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "956:991");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "996:1352");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1357:1543");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1548:1582");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1058:1089");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1094:1128");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1184:1220");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1225:1273");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1291:1348");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1381:1420");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1425:1539");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1451:1507");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1513:1534");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1762:1861");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1790:1812");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "1830:1857");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2063:2092");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2180:2203");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2207:2227");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2636:2644");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2649:2674");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2679:2696");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2701:2824");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2829:2899");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2904:3235");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2724:2803");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "2808:2820");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "3016:3062");
__$coverInitRange("webdocs/test/src/lib/core-model.js", "3128:3213");
__$coverCall('webdocs/test/src/lib/core-model.js', '0:3260');
var CoreModel = function () {
        __$coverCall('webdocs/test/src/lib/core-model.js', '31:40');
        var model;
        __$coverCall('webdocs/test/src/lib/core-model.js', '44:647');
        model = function (conf) {
            __$coverCall('webdocs/test/src/lib/core-model.js', '71:113');
            if (conf === undefined) {
                __$coverCall('webdocs/test/src/lib/core-model.js', '100:109');
                conf = {};
            }
            __$coverCall('webdocs/test/src/lib/core-model.js', '118:173');
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverCall('webdocs/test/src/lib/core-model.js', '177:224');
            this.name = (conf.name || 'Nameless') + 'Model';
            __$coverCall('webdocs/test/src/lib/core-model.js', '228:260');
            this.debug = Boolean(conf.debug);
            __$coverCall('webdocs/test/src/lib/core-model.js', '264:284');
            this.attributes = {};
            __$coverCall('webdocs/test/src/lib/core-model.js', '288:309');
            this._isValid = false;
            __$coverCall('webdocs/test/src/lib/core-model.js', '314:627');
            if (conf.validate) {
                __$coverCall('webdocs/test/src/lib/core-model.js', '338:623');
                this.validate = function (formData) {
                    __$coverCall('webdocs/test/src/lib/core-model.js', '379:389');
                    var result;
                    __$coverCall('webdocs/test/src/lib/core-model.js', '396:417');
                    this._isValid = false;
                    __$coverCall('webdocs/test/src/lib/core-model.js', '423:466');
                    result = conf.validate.call(this, formData);
                    __$coverCall('webdocs/test/src/lib/core-model.js', '472:586');
                    if (!result || typeof result === 'object' && Object.keys(result).length === 0) {
                        __$coverCall('webdocs/test/src/lib/core-model.js', '560:580');
                        this._isValid = true;
                    }
                    __$coverCall('webdocs/test/src/lib/core-model.js', '593:606');
                    return result;
                }.bind(this);
            }
            __$coverCall('webdocs/test/src/lib/core-model.js', '632:643');
            this.init();
        };
        __$coverCall('webdocs/test/src/lib/core-model.js', '651:690');
        model.prototype.init = function () {
        };
        __$coverCall('webdocs/test/src/lib/core-model.js', '694:737');
        model.prototype.validate = function () {
        };
        __$coverCall('webdocs/test/src/lib/core-model.js', '741:806');
        model.prototype.isValid = function () {
            __$coverCall('webdocs/test/src/lib/core-model.js', '782:802');
            return this._isValid;
        };
        __$coverCall('webdocs/test/src/lib/core-model.js', '919:1586');
        model.prototype.set = function () {
            __$coverCall('webdocs/test/src/lib/core-model.js', '956:991');
            var newData = {}, validateResult;
            __$coverCall('webdocs/test/src/lib/core-model.js', '996:1352');
            if (typeof arguments[0] === 'object') {
                __$coverCall('webdocs/test/src/lib/core-model.js', '1058:1089');
                $.extend(newData, arguments[0]);
                __$coverCall('webdocs/test/src/lib/core-model.js', '1094:1128');
                this.log('Set data', arguments[0]);
            } else if (typeof arguments[0] === 'string') {
                __$coverCall('webdocs/test/src/lib/core-model.js', '1184:1220');
                newData[arguments[0]] = arguments[1];
                __$coverCall('webdocs/test/src/lib/core-model.js', '1225:1273');
                this.log('Set data', arguments[0], arguments[1]);
            } else {
                __$coverCall('webdocs/test/src/lib/core-model.js', '1291:1348');
                this.warn('Data are incorrect in model.set()', arguments);
            }
            __$coverCall('webdocs/test/src/lib/core-model.js', '1357:1543');
            if (this.validate) {
                __$coverCall('webdocs/test/src/lib/core-model.js', '1381:1420');
                validateResult = this.validate(newData);
                __$coverCall('webdocs/test/src/lib/core-model.js', '1425:1539');
                if (validateResult) {
                    __$coverCall('webdocs/test/src/lib/core-model.js', '1451:1507');
                    this.warn('Validate error in model.set', validateResult);
                    __$coverCall('webdocs/test/src/lib/core-model.js', '1513:1534');
                    return validateResult;
                }
            }
            __$coverCall('webdocs/test/src/lib/core-model.js', '1548:1582');
            $.extend(this.attributes, newData);
        };
        __$coverCall('webdocs/test/src/lib/core-model.js', '1722:1865');
        model.prototype.get = function (key) {
            __$coverCall('webdocs/test/src/lib/core-model.js', '1762:1861');
            if (key === undefined) {
                __$coverCall('webdocs/test/src/lib/core-model.js', '1790:1812');
                return this.attributes;
            } else {
                __$coverCall('webdocs/test/src/lib/core-model.js', '1830:1857');
                return this.attributes[key];
            }
        };
        __$coverCall('webdocs/test/src/lib/core-model.js', '2023:2096');
        model.prototype.has = function (key) {
            __$coverCall('webdocs/test/src/lib/core-model.js', '2063:2092');
            return !!this.attributes[key];
        };
        __$coverCall('webdocs/test/src/lib/core-model.js', '2141:2231');
        model.prototype.reset = function () {
            __$coverCall('webdocs/test/src/lib/core-model.js', '2180:2203');
            this.log('Reset model');
            __$coverCall('webdocs/test/src/lib/core-model.js', '2207:2227');
            this.attributes = {};
        };
        __$coverCall('webdocs/test/src/lib/core-model.js', '2582:3241');
        model.prototype.send = function (method, callback) {
            __$coverCall('webdocs/test/src/lib/core-model.js', '2636:2644');
            var data;
            __$coverCall('webdocs/test/src/lib/core-model.js', '2649:2674');
            method = method || 'POST';
            __$coverCall('webdocs/test/src/lib/core-model.js', '2679:2696');
            data = this.get();
            __$coverCall('webdocs/test/src/lib/core-model.js', '2701:2824');
            if (!this.server) {
                __$coverCall('webdocs/test/src/lib/core-model.js', '2724:2803');
                this.error('Can not send an ajax request! You must define a server URL first.');
                __$coverCall('webdocs/test/src/lib/core-model.js', '2808:2820');
                return false;
            }
            __$coverCall('webdocs/test/src/lib/core-model.js', '2829:2899');
            this.log('Sending an ajax call to ', this.server, 'with data: ', data);
            __$coverCall('webdocs/test/src/lib/core-model.js', '2904:3235');
            $.ajax({
                url: this.server,
                method: method,
                data: data,
                success: function (data, status, jqXHR) {
                    __$coverCall('webdocs/test/src/lib/core-model.js', '3016:3062');
                    callback.call(this, null, data, status, jqXHR);
                }.bind(this),
                error: function (jqXHR, status, error) {
                    __$coverCall('webdocs/test/src/lib/core-model.js', '3128:3213');
                    callback.call(this, {
                        type: status,
                        http: error
                    }, null, status, jqXHR);
                }.bind(this)
            });
        };
        __$coverCall('webdocs/test/src/lib/core-model.js', '3242:3254');
        return model;
    }();