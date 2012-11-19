if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/core-model.js"] = {};
__$coverObject["webdocs/test/src/lib/core-model.js"].__code = "var CoreModel = (function() {\n\tvar isValid = false,\n\t\tmodel,\n\t\tmodelData = null;\n\n\tmodel = function(conf) {\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Model';\n\t\tthis.debug = Boolean(conf.debug);\n\n\t\tif (conf.validate) {\n\t\t\tthis.validate = function(formData) {\n\t\t\t\tvar result;\n\n\t\t\t\tisValid = false;\n\t\t\t\tresult = conf.validate.call(this, formData);\n\t\t\t\tif (!result || typeof result === 'object' && Object.keys(result).length === 0) {\n\t\t\t\t\tisValid = true;\n\t\t\t\t}\n\n\t\t\t\treturn result;\n\t\t\t}.bind(this);\n\t\t}\n\n\t\tthis.init();\n\t};\n\n\tmodel.prototype.init = function() {\n\n\t};\n\n\tmodel.prototype.validate = function() {\n\n\t};\n\n\tmodel.prototype.isValid = function() {\n\t\treturn isValid;\n\t};\n\n\t/**\n\t * Set model data\n\t *\n\t * @param {Object or String} data/key\n\t * @param {Object} value Data value\n\t */\n\tmodel.prototype.set = function() {\n\t\tvar newData = {},\n\t\t\tvalidateResult;\n\n\t\tif (typeof arguments[0] === 'object') {\n\t\t\t//Add a dataset\n\t\t\t$.extend(newData, arguments[0]);\n\t\t\tthis.log('Set data', arguments[0]);\n\t\t}\n\t\telse if (typeof arguments[0] === 'string') {\n\t\t\tnewData[arguments[0]] = arguments[1];\n\t\t\tthis.log('Set data', arguments[0], arguments[1]);\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Data are incorrect in model.set()', arguments);\n\t\t}\n\n\t\tif (this.validate) {\n\t\t\tvalidateResult = this.validate(newData);\n\t\t\tif (validateResult) {\n\t\t\t\tthis.warn('Validate error in model.set', validateResult);\n\t\t\t\treturn validateResult;\n\t\t\t}\n\t\t}\n\n\t\tmodelData = newData;\n\t};\n\n\t/**\n\t * Gets data from model\n\t *\n\t * @param  {String} key Data key\n\t *\n\t * @return {Object}     Model dataset\n\t */\n\tmodel.prototype.get = function(key) {\n\t\treturn modelData[key];\n\t};\n\n\t/**\n\t * Check wether model has a dataset\n\t *\n\t * @param {String} key Dataset key\n\t * @return {Boolean} Returns true if model has a dataset with key\n\t */\n\tmodel.prototype.has = function(key) {\n\t\treturn !!modelData[key];\n\t};\n\n\t/**\n\t * Remove all data from model\n\t */\n\tmodel.prototype.clean = function() {\n\t\tthis.log('Clean model');\n\t\tmodelData = null;\n\t};\n\n\treturn model;\n})();";
__$coverObject["webdocs/test/src/lib/core-model.js"]["0:2057"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["31:79"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["83:576"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["580:619"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["623:666"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["670:729"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["842:1494"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1614:1679"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1837:1904"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1949:2035"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["2039:2051"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["110:165"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["169:216"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["220:252"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["257:556"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["561:572"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["281:552"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["322:332"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["339:354"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["360:403"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["409:515"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["522:535"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["495:509"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["711:725"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["879:914"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["919:1275"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1280:1466"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1471:1490"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["981:1012"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1017:1051"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1107:1143"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1148:1196"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1214:1271"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1304:1343"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1348:1462"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1374:1430"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1436:1457"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1654:1675"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1877:1900"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["1988:2011"] = 0;
__$coverObject["webdocs/test/src/lib/core-model.js"]["2015:2031"] = 0;
__$coverObject['webdocs/test/src/lib/core-model.js']['0:2057']++;
var CoreModel = function () {
        __$coverObject['webdocs/test/src/lib/core-model.js']['31:79']++;
        var isValid = false, model, modelData = null;
        __$coverObject['webdocs/test/src/lib/core-model.js']['83:576']++;
        model = function (conf) {
            __$coverObject['webdocs/test/src/lib/core-model.js']['110:165']++;
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverObject['webdocs/test/src/lib/core-model.js']['169:216']++;
            this.name = (conf.name || 'Nameless') + 'Model';
            __$coverObject['webdocs/test/src/lib/core-model.js']['220:252']++;
            this.debug = Boolean(conf.debug);
            __$coverObject['webdocs/test/src/lib/core-model.js']['257:556']++;
            if (conf.validate) {
                __$coverObject['webdocs/test/src/lib/core-model.js']['281:552']++;
                this.validate = function (formData) {
                    __$coverObject['webdocs/test/src/lib/core-model.js']['322:332']++;
                    var result;
                    __$coverObject['webdocs/test/src/lib/core-model.js']['339:354']++;
                    isValid = false;
                    __$coverObject['webdocs/test/src/lib/core-model.js']['360:403']++;
                    result = conf.validate.call(this, formData);
                    __$coverObject['webdocs/test/src/lib/core-model.js']['409:515']++;
                    if (!result || typeof result === 'object' && Object.keys(result).length === 0) {
                        __$coverObject['webdocs/test/src/lib/core-model.js']['495:509']++;
                        isValid = true;
                    }
                    __$coverObject['webdocs/test/src/lib/core-model.js']['522:535']++;
                    return result;
                }.bind(this);
            }
            __$coverObject['webdocs/test/src/lib/core-model.js']['561:572']++;
            this.init();
        };
        __$coverObject['webdocs/test/src/lib/core-model.js']['580:619']++;
        model.prototype.init = function () {
        };
        __$coverObject['webdocs/test/src/lib/core-model.js']['623:666']++;
        model.prototype.validate = function () {
        };
        __$coverObject['webdocs/test/src/lib/core-model.js']['670:729']++;
        model.prototype.isValid = function () {
            __$coverObject['webdocs/test/src/lib/core-model.js']['711:725']++;
            return isValid;
        };
        __$coverObject['webdocs/test/src/lib/core-model.js']['842:1494']++;
        model.prototype.set = function () {
            __$coverObject['webdocs/test/src/lib/core-model.js']['879:914']++;
            var newData = {}, validateResult;
            __$coverObject['webdocs/test/src/lib/core-model.js']['919:1275']++;
            if (typeof arguments[0] === 'object') {
                __$coverObject['webdocs/test/src/lib/core-model.js']['981:1012']++;
                $.extend(newData, arguments[0]);
                __$coverObject['webdocs/test/src/lib/core-model.js']['1017:1051']++;
                this.log('Set data', arguments[0]);
            } else if (typeof arguments[0] === 'string') {
                __$coverObject['webdocs/test/src/lib/core-model.js']['1107:1143']++;
                newData[arguments[0]] = arguments[1];
                __$coverObject['webdocs/test/src/lib/core-model.js']['1148:1196']++;
                this.log('Set data', arguments[0], arguments[1]);
            } else {
                __$coverObject['webdocs/test/src/lib/core-model.js']['1214:1271']++;
                this.warn('Data are incorrect in model.set()', arguments);
            }
            __$coverObject['webdocs/test/src/lib/core-model.js']['1280:1466']++;
            if (this.validate) {
                __$coverObject['webdocs/test/src/lib/core-model.js']['1304:1343']++;
                validateResult = this.validate(newData);
                __$coverObject['webdocs/test/src/lib/core-model.js']['1348:1462']++;
                if (validateResult) {
                    __$coverObject['webdocs/test/src/lib/core-model.js']['1374:1430']++;
                    this.warn('Validate error in model.set', validateResult);
                    __$coverObject['webdocs/test/src/lib/core-model.js']['1436:1457']++;
                    return validateResult;
                }
            }
            __$coverObject['webdocs/test/src/lib/core-model.js']['1471:1490']++;
            modelData = newData;
        };
        __$coverObject['webdocs/test/src/lib/core-model.js']['1614:1679']++;
        model.prototype.get = function (key) {
            __$coverObject['webdocs/test/src/lib/core-model.js']['1654:1675']++;
            return modelData[key];
        };
        __$coverObject['webdocs/test/src/lib/core-model.js']['1837:1904']++;
        model.prototype.has = function (key) {
            __$coverObject['webdocs/test/src/lib/core-model.js']['1877:1900']++;
            return !!modelData[key];
        };
        __$coverObject['webdocs/test/src/lib/core-model.js']['1949:2035']++;
        model.prototype.clean = function () {
            __$coverObject['webdocs/test/src/lib/core-model.js']['1988:2011']++;
            this.log('Clean model');
            __$coverObject['webdocs/test/src/lib/core-model.js']['2015:2031']++;
            modelData = null;
        };
        __$coverObject['webdocs/test/src/lib/core-model.js']['2039:2051']++;
        return model;
    }();