if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/core.js"] = {};
__$coverObject["webdocs/test/src/lib/core.js"].__code = "var CoreRouter = function(conf) {\n\tvar CoreRouter,\n\t\trouter ;\n\n\tCoreRouter = Backbone.Router.extend(conf);\n\trouter = new CoreRouter();\n\tBackbone.history.start();\n\treturn router;\n};\nvar CorePresenter = (function() {\n\n\tvar presenter = function(conf) {\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Presenter';\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.eventCallbacks = {};\n\n\t\tthis.log('Initialize presenter with conf:', conf);\n\t\tthis.init();\n\t};\n\n\tpresenter.prototype.init = function() {\n\n\t};\n\n\treturn presenter;\n})();\nvar CoreModel = (function() {\n\tvar isValid = false,\n\t\tmodel,\n\t\tmodelData = null;\n\n\tmodel = function(conf) {\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Model';\n\t\tthis.debug = Boolean(conf.debug);\n\n\t\tif (conf.validate) {\n\t\t\tthis.validate = function(formData) {\n\t\t\t\tvar result;\n\n\t\t\t\tisValid = false;\n\t\t\t\tresult = conf.validate.call(this, formData);\n\t\t\t\tif (!result || typeof result === 'object' && Object.keys(result).length === 0) {\n\t\t\t\t\tisValid = true;\n\t\t\t\t}\n\n\t\t\t\treturn result;\n\t\t\t}.bind(this);\n\t\t}\n\n\t\tthis.init();\n\t};\n\n\tmodel.prototype.init = function() {\n\n\t};\n\n\tmodel.prototype.validate = function() {\n\n\t};\n\n\tmodel.prototype.isValid = function() {\n\t\treturn isValid;\n\t};\n\n\t/**\n\t * Set model data\n\t *\n\t * @param {Object or String} data/key\n\t * @param {Object} value Data value\n\t */\n\tmodel.prototype.set = function() {\n\t\tvar newData = {},\n\t\t\tvalidateResult;\n\n\t\tif (typeof arguments[0] === 'object') {\n\t\t\t//Add a dataset\n\t\t\t$.extend(newData, arguments[0]);\n\t\t\tthis.log('Set data', arguments[0]);\n\t\t}\n\t\telse if (typeof arguments[0] === 'string') {\n\t\t\tnewData[arguments[0]] = arguments[1];\n\t\t\tthis.log('Set data', arguments[0], arguments[1]);\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Data are incorrect in model.set()', arguments);\n\t\t}\n\n\t\tif (this.validate) {\n\t\t\tvalidateResult = this.validate(newData);\n\t\t\tif (validateResult) {\n\t\t\t\tthis.warn('Validate error in model.set', validateResult);\n\t\t\t\treturn validateResult;\n\t\t\t}\n\t\t}\n\n\t\tmodelData = newData;\n\t};\n\n\t/**\n\t * Gets data from model\n\t *\n\t * @param  {String} key Data key\n\t *\n\t * @return {Object}     Model dataset\n\t */\n\tmodel.prototype.get = function(key) {\n\t\treturn modelData[key];\n\t};\n\n\t/**\n\t * Check wether model has a dataset\n\t *\n\t * @param {String} key Dataset key\n\t * @return {Boolean} Returns true if model has a dataset with key\n\t */\n\tmodel.prototype.has = function(key) {\n\t\treturn !!modelData[key];\n\t};\n\n\t/**\n\t * Remove all data from model\n\t */\n\tmodel.prototype.clean = function() {\n\t\tthis.log('Clean model');\n\t\tmodelData = null;\n\t};\n\n\treturn model;\n})();\nvar CoreView = (function() {\n\n\tvar view = function(presenter, conf) {\n\t\tvar self = this;\n\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'View';\n\t\tthis.presenter = presenter;\n\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.container = $(conf.container);\n\t\tif (this.container.length > 0) {\n\t\t\twindow.addEventListener('resize', function(e) {\n\t\t\t\tself.resize(e);\n\t\t\t}, false);\n\n\t\t\tthis.log('Initialize view with conf:', conf);\n\t\t\tthis.log('  ... using Presenter:', this.presenter.name);\n\t\t\tthis.log('  ... using Container:', this.container);\n\n\t\t\t//Send events to presenter\n\t\t\tObject.keys(this.events).forEach(function(key) {\n\t\t\t\tvar split = key.split(' ', 2),\n\t\t\t\t\teventFunc,\n\t\t\t\t\teventName = split[0],\n\t\t\t\t\tselector = split[1] || null;\n\n\t\t\t\tif (split.length === 1 || split.length === 2) {\n\t\t\t\t\teventFunc = this.presenter.events[this.events[key]];\n\t\t\t\t\tif (typeof eventFunc === 'function') {\n\t\t\t\t\t\t//Register event listener\n\t\t\t\t\t\tthis.container.on(eventName, eventFunc);\n\t\t\t\t\t\tthis.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);\n\t\t\t\t\t}\n\t\t\t\t\telse {\n\t\t\t\t\t\tthis.warn('Event handler callback not defined in Presenter:', this.events[key]);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\tthis.warn('Incorect event configuration', key);\n\t\t\t\t}\n\t\t\t}, this);\n\n\t\t\t//Self init\n\t\t\tthis.init();\n\t\t}\n\t\telse {\n\t\t\tthis.error('Can\\'t initialize View, Container not found!', this.container);\n\t\t}\n\t};\n\n\tview.prototype.init = function() {\n\n\t};\n\n\tview.prototype.show = function() {\n\t\t\n\t};\n\n\tview.prototype.hide = function() {\n\t\t\n\t};\n\n\tview.prototype.render = function() {\n\t\t\n\t};\n\n\tview.prototype.resize = function() {\n\t\t\n\t};\n\n\n\n\treturn view;\n})();\nvar CoreEvent = (function() {\n\tvar ee,\n\t\tevent;\n\t\n\tfunction indexOf(eventName, callback) {\n\t\tthis.objectName = 'CoreEvent';\n\t\t\n\t\tvar len = this.store.length,\n\t\t\ti = 0,\n\t\t\tel;\n\n\t\tfor (; i < len; i++) {\n\t\t\tel = this.store[i];\n\t\t\tif (eventName === null || eventName === el.event && callback === null || callback === el.callback) {\n\t\t\t\treturn el;\n\t\t\t}\n\t\t}\n\n\t\treturn null;\n\t}\n\n\n\tevent = function(conf) {\n\t\tthis.store = [];\n\t};\n\n\t// event.prototype.on = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.once = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.emit = function(eventName, data) {\n\n\t// };\n\n\t// event.prototype.remove = function(eventName, callback) {\n\n\t// };\n\n\tee = new EventEmitter();\n\tevent.prototype.emit = function(eventName, data) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Emit event', eventName, data);\n\t\t}\n\t\treturn ee.emitEvent(eventName, [data]);\n\t};\n\n\tevent.prototype.on = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Add listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, listener);\n\t};\n\n\tevent.prototype.once = function(eventName, listener) {\n\t\tvar onceListener = function() {\n\t\t\tee.removeListener(eventName, listener);\n\t\t\tlistener.call(null, arguments);\n\t\t\treturn true;\n\t\t};\n\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Add once listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, onceListener);\n\t};\n\n\tevent.prototype.off = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Remove listener', eventName, listener);\n\t\t}\n\n\t\tif (listener === undefined) {\n\t\t\treturn ee.removeEvent(eventName);\n\t\t}\n\t\telse {\n\t\t\treturn ee.removeListener(eventName, listener);\n\t\t}\n\t};\n\n\treturn event;\n})();\n\nvar CoreLogger = (function(conf) {\n\n\tvar logger = function() {\n\t\t\n\t};\n\n\tlogger.prototype.log = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.log.apply(console, args);\n\t\t}\n\t};\n\n\tlogger.prototype.warn = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.warn.apply(console, args);\n\t\t}\n\t};\n\n\tlogger.prototype.error = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.error.apply(console, args);\n\t\t}\n\t};\n\n\treturn logger;\n})();\n/**\n * A bunch of helpfull functions\n *\n * @return {Object} Returns a singelton object instance of CoreUtil\n */\nvar CoreUtil = (function($) {\n\n\tvar util = {\n\t\tname: 'CoreUtil',\n\t\tdebug: true\n\t};\n\n\t/**\n\t * Serialize a form and return its values as JSON\n\t *\n\t * @param {Object} Form selector\n\t * @return {Object} FormData as JSON\n\t */\n\tutil.serializeForm = function(selector) {\n\t\tvar formData = {},\n\t\t\tformSelector = $(selector);\n\n\t\tif (formSelector.get(0).tagName === 'INPUT') {\n\n\t\t}\n\t\telse {\n\t\t\tformSelector = formSelector.find(':input');\n\t\t}\n\n\t\tformSelector.serializeArray().forEach(function(item) {\n\t\t\tformData[item.name] = item.value;\n\t\t});\n\n\t\tif (this.debug) {\n\t\t\tconsole.log('Akonda Core - Serialize form:', formSelector, formData);\n\t\t}\n\n\t\treturn formData;\n\t};\n\n\t/**\n\t * Check length of a string or number\n\t *\n\t * @param {String or Number} input this will be checked\n\t * @param {Number} min String can't be shorter than n, Number can't be lower than n\n\t * @param {Number} max String can't be longer than n, Number can't be greater than n\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkLength = function(input, min, max) {\n\t\tif (typeof input === 'Number') {\n\t\t\tif (input < min) {\n\t\t\t\treturn 'num-to-small';\n\t\t\t}\n\t\t\telse if (input > max) {\n\t\t\t\treturn 'num-to-large';\n\t\t\t}\n\t\t}\n\t\telse {\n\t\t\tconsole.log(input, input.length);\n\t\t\tif (input.length < min) {\n\t\t\t\treturn 'str-to-short';\n\t\t\t}\n\t\t\telse if (input.length > max) {\n\t\t\t\treturn 'str-to-long';\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\t * Checks the equality of two strings\n\t *\n\t * @param {String} str1 First string\n\t * @param {String} str2 Second string\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkEqual = function(str1, str2) {\n\t\tif (str1 !== str2) {\n\t\t\treturn 'str-not-equal';\n\t\t}\n\t};\n\n\t/**\n\t * Checks the validity of an email address\n\t *\n\t * @param {String} email e-Mail address\n\t */\n\tutil.checkEmail = function(email) {\n\t\tif (!/^\\S+\\@\\S+\\.[a-z]{2,10}$/.test(email)) {\n\t\t\treturn 'invalid-email';\n\t\t}\n\t};\n\n\treturn util;\n\n})(jQuery);";
__$coverObject["webdocs/test/src/lib/core.js"]["0:179"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["181:572"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["574:2631"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2633:4327"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4329:6085"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6088:6800"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6914:8841"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["35:60"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["64:105"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["108:133"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["136:160"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["163:176"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["217:499"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["503:546"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["550:566"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["252:307"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["311:362"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["366:398"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["402:426"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["431:480"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["484:495"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["605:653"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["657:1150"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1154:1193"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1197:1240"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1244:1303"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1416:2068"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2188:2253"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2411:2478"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2523:2609"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2613:2625"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["684:739"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["743:790"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["794:826"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["831:1130"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1135:1146"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["855:1126"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["896:906"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["913:928"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["934:977"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["983:1089"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1096:1109"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1069:1083"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1285:1299"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1453:1488"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1493:1849"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1854:2040"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2045:2064"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1555:1586"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1591:1625"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1681:1717"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1722:1770"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1788:1845"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1878:1917"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1922:2036"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["1948:2004"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2010:2031"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2228:2249"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2451:2474"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2562:2585"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2589:2605"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2664:4082"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4086:4124"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4128:4168"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4172:4212"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4216:4258"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4262:4304"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4310:4321"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2705:2720"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2725:2780"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2784:2830"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2834:2860"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2865:2897"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2901:2935"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2939:4078"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["2975:3055"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3061:3105"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3110:3165"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3170:3220"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3256:3950"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3971:3982"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3027:3041"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3309:3415"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3422:3937"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3475:3526"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3533:3861"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3610:3649"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3657:3748"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3775:3854"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["3885:3931"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4000:4074"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4360:4375"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4380:4698"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4703:4749"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5021:5044"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5047:5229"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5233:5427"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5431:5770"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5774:6063"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6067:6079"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4422:4451"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4458:4502"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4507:4679"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4684:4695"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4533:4551"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4556:4675"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4661:4670"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["4730:4745"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5100:5183"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5187:5225"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5121:5179"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5288:5377"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5381:5423"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5309:5373"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5488:5617"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5622:5716"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5720:5766"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5523:5561"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5566:5596"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5601:5612"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5643:5712"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5830:5922"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5927:6059"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5851:5918"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["5960:5992"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6010:6055"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6125:6156"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6160:6361"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6365:6568"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6572:6777"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6781:6794"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6198:6206"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6211:6357"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6232:6276"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6281:6316"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6321:6353"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6404:6412"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6417:6564"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6438:6482"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6487:6522"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6527:6560"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6612:6620"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6625:6773"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6646:6690"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6695:6730"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6735:6769"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["6946:6995"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["7136:7566"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["7918:8295"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8496:8593"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8696:8813"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8817:8828"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["7180:7228"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["7233:7343"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["7348:7444"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["7449:7542"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["7547:7562"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["7297:7339"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["7406:7438"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["7470:7538"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["7967:8291"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8003:8111"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8026:8047"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8085:8106"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8129:8161"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8166:8287"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8196:8217"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8262:8282"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8539:8589"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8563:8585"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8734:8809"] = 0;
__$coverObject["webdocs/test/src/lib/core.js"]["8783:8805"] = 0;
__$coverObject['webdocs/test/src/lib/core.js']['0:179']++;
var CoreRouter = function (conf) {
    __$coverObject['webdocs/test/src/lib/core.js']['35:60']++;
    var CoreRouter, router;
    __$coverObject['webdocs/test/src/lib/core.js']['64:105']++;
    CoreRouter = Backbone.Router.extend(conf);
    __$coverObject['webdocs/test/src/lib/core.js']['108:133']++;
    router = new CoreRouter();
    __$coverObject['webdocs/test/src/lib/core.js']['136:160']++;
    Backbone.history.start();
    __$coverObject['webdocs/test/src/lib/core.js']['163:176']++;
    return router;
};
__$coverObject['webdocs/test/src/lib/core.js']['181:572']++;
var CorePresenter = function () {
        __$coverObject['webdocs/test/src/lib/core.js']['217:499']++;
        var presenter = function (conf) {
            __$coverObject['webdocs/test/src/lib/core.js']['252:307']++;
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverObject['webdocs/test/src/lib/core.js']['311:362']++;
            this.name = (conf.name || 'Nameless') + 'Presenter';
            __$coverObject['webdocs/test/src/lib/core.js']['366:398']++;
            this.debug = Boolean(conf.debug);
            __$coverObject['webdocs/test/src/lib/core.js']['402:426']++;
            this.eventCallbacks = {};
            __$coverObject['webdocs/test/src/lib/core.js']['431:480']++;
            this.log('Initialize presenter with conf:', conf);
            __$coverObject['webdocs/test/src/lib/core.js']['484:495']++;
            this.init();
        };
        __$coverObject['webdocs/test/src/lib/core.js']['503:546']++;
        presenter.prototype.init = function () {
        };
        __$coverObject['webdocs/test/src/lib/core.js']['550:566']++;
        return presenter;
    }();
__$coverObject['webdocs/test/src/lib/core.js']['574:2631']++;
var CoreModel = function () {
        __$coverObject['webdocs/test/src/lib/core.js']['605:653']++;
        var isValid = false, model, modelData = null;
        __$coverObject['webdocs/test/src/lib/core.js']['657:1150']++;
        model = function (conf) {
            __$coverObject['webdocs/test/src/lib/core.js']['684:739']++;
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverObject['webdocs/test/src/lib/core.js']['743:790']++;
            this.name = (conf.name || 'Nameless') + 'Model';
            __$coverObject['webdocs/test/src/lib/core.js']['794:826']++;
            this.debug = Boolean(conf.debug);
            __$coverObject['webdocs/test/src/lib/core.js']['831:1130']++;
            if (conf.validate) {
                __$coverObject['webdocs/test/src/lib/core.js']['855:1126']++;
                this.validate = function (formData) {
                    __$coverObject['webdocs/test/src/lib/core.js']['896:906']++;
                    var result;
                    __$coverObject['webdocs/test/src/lib/core.js']['913:928']++;
                    isValid = false;
                    __$coverObject['webdocs/test/src/lib/core.js']['934:977']++;
                    result = conf.validate.call(this, formData);
                    __$coverObject['webdocs/test/src/lib/core.js']['983:1089']++;
                    if (!result || typeof result === 'object' && Object.keys(result).length === 0) {
                        __$coverObject['webdocs/test/src/lib/core.js']['1069:1083']++;
                        isValid = true;
                    }
                    __$coverObject['webdocs/test/src/lib/core.js']['1096:1109']++;
                    return result;
                }.bind(this);
            }
            __$coverObject['webdocs/test/src/lib/core.js']['1135:1146']++;
            this.init();
        };
        __$coverObject['webdocs/test/src/lib/core.js']['1154:1193']++;
        model.prototype.init = function () {
        };
        __$coverObject['webdocs/test/src/lib/core.js']['1197:1240']++;
        model.prototype.validate = function () {
        };
        __$coverObject['webdocs/test/src/lib/core.js']['1244:1303']++;
        model.prototype.isValid = function () {
            __$coverObject['webdocs/test/src/lib/core.js']['1285:1299']++;
            return isValid;
        };
        __$coverObject['webdocs/test/src/lib/core.js']['1416:2068']++;
        model.prototype.set = function () {
            __$coverObject['webdocs/test/src/lib/core.js']['1453:1488']++;
            var newData = {}, validateResult;
            __$coverObject['webdocs/test/src/lib/core.js']['1493:1849']++;
            if (typeof arguments[0] === 'object') {
                __$coverObject['webdocs/test/src/lib/core.js']['1555:1586']++;
                $.extend(newData, arguments[0]);
                __$coverObject['webdocs/test/src/lib/core.js']['1591:1625']++;
                this.log('Set data', arguments[0]);
            } else if (typeof arguments[0] === 'string') {
                __$coverObject['webdocs/test/src/lib/core.js']['1681:1717']++;
                newData[arguments[0]] = arguments[1];
                __$coverObject['webdocs/test/src/lib/core.js']['1722:1770']++;
                this.log('Set data', arguments[0], arguments[1]);
            } else {
                __$coverObject['webdocs/test/src/lib/core.js']['1788:1845']++;
                this.warn('Data are incorrect in model.set()', arguments);
            }
            __$coverObject['webdocs/test/src/lib/core.js']['1854:2040']++;
            if (this.validate) {
                __$coverObject['webdocs/test/src/lib/core.js']['1878:1917']++;
                validateResult = this.validate(newData);
                __$coverObject['webdocs/test/src/lib/core.js']['1922:2036']++;
                if (validateResult) {
                    __$coverObject['webdocs/test/src/lib/core.js']['1948:2004']++;
                    this.warn('Validate error in model.set', validateResult);
                    __$coverObject['webdocs/test/src/lib/core.js']['2010:2031']++;
                    return validateResult;
                }
            }
            __$coverObject['webdocs/test/src/lib/core.js']['2045:2064']++;
            modelData = newData;
        };
        __$coverObject['webdocs/test/src/lib/core.js']['2188:2253']++;
        model.prototype.get = function (key) {
            __$coverObject['webdocs/test/src/lib/core.js']['2228:2249']++;
            return modelData[key];
        };
        __$coverObject['webdocs/test/src/lib/core.js']['2411:2478']++;
        model.prototype.has = function (key) {
            __$coverObject['webdocs/test/src/lib/core.js']['2451:2474']++;
            return !!modelData[key];
        };
        __$coverObject['webdocs/test/src/lib/core.js']['2523:2609']++;
        model.prototype.clean = function () {
            __$coverObject['webdocs/test/src/lib/core.js']['2562:2585']++;
            this.log('Clean model');
            __$coverObject['webdocs/test/src/lib/core.js']['2589:2605']++;
            modelData = null;
        };
        __$coverObject['webdocs/test/src/lib/core.js']['2613:2625']++;
        return model;
    }();
__$coverObject['webdocs/test/src/lib/core.js']['2633:4327']++;
var CoreView = function () {
        __$coverObject['webdocs/test/src/lib/core.js']['2664:4082']++;
        var view = function (presenter, conf) {
            __$coverObject['webdocs/test/src/lib/core.js']['2705:2720']++;
            var self = this;
            __$coverObject['webdocs/test/src/lib/core.js']['2725:2780']++;
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverObject['webdocs/test/src/lib/core.js']['2784:2830']++;
            this.name = (conf.name || 'Nameless') + 'View';
            __$coverObject['webdocs/test/src/lib/core.js']['2834:2860']++;
            this.presenter = presenter;
            __$coverObject['webdocs/test/src/lib/core.js']['2865:2897']++;
            this.debug = Boolean(conf.debug);
            __$coverObject['webdocs/test/src/lib/core.js']['2901:2935']++;
            this.container = $(conf.container);
            __$coverObject['webdocs/test/src/lib/core.js']['2939:4078']++;
            if (this.container.length > 0) {
                __$coverObject['webdocs/test/src/lib/core.js']['2975:3055']++;
                window.addEventListener('resize', function (e) {
                    __$coverObject['webdocs/test/src/lib/core.js']['3027:3041']++;
                    self.resize(e);
                }, false);
                __$coverObject['webdocs/test/src/lib/core.js']['3061:3105']++;
                this.log('Initialize view with conf:', conf);
                __$coverObject['webdocs/test/src/lib/core.js']['3110:3165']++;
                this.log('  ... using Presenter:', this.presenter.name);
                __$coverObject['webdocs/test/src/lib/core.js']['3170:3220']++;
                this.log('  ... using Container:', this.container);
                __$coverObject['webdocs/test/src/lib/core.js']['3256:3950']++;
                Object.keys(this.events).forEach(function (key) {
                    __$coverObject['webdocs/test/src/lib/core.js']['3309:3415']++;
                    var split = key.split(' ', 2), eventFunc, eventName = split[0], selector = split[1] || null;
                    __$coverObject['webdocs/test/src/lib/core.js']['3422:3937']++;
                    if (split.length === 1 || split.length === 2) {
                        __$coverObject['webdocs/test/src/lib/core.js']['3475:3526']++;
                        eventFunc = this.presenter.events[this.events[key]];
                        __$coverObject['webdocs/test/src/lib/core.js']['3533:3861']++;
                        if (typeof eventFunc === 'function') {
                            __$coverObject['webdocs/test/src/lib/core.js']['3610:3649']++;
                            this.container.on(eventName, eventFunc);
                            __$coverObject['webdocs/test/src/lib/core.js']['3657:3748']++;
                            this.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);
                        } else {
                            __$coverObject['webdocs/test/src/lib/core.js']['3775:3854']++;
                            this.warn('Event handler callback not defined in Presenter:', this.events[key]);
                        }
                    } else {
                        __$coverObject['webdocs/test/src/lib/core.js']['3885:3931']++;
                        this.warn('Incorect event configuration', key);
                    }
                }, this);
                __$coverObject['webdocs/test/src/lib/core.js']['3971:3982']++;
                this.init();
            } else {
                __$coverObject['webdocs/test/src/lib/core.js']['4000:4074']++;
                this.error('Can\'t initialize View, Container not found!', this.container);
            }
        };
        __$coverObject['webdocs/test/src/lib/core.js']['4086:4124']++;
        view.prototype.init = function () {
        };
        __$coverObject['webdocs/test/src/lib/core.js']['4128:4168']++;
        view.prototype.show = function () {
        };
        __$coverObject['webdocs/test/src/lib/core.js']['4172:4212']++;
        view.prototype.hide = function () {
        };
        __$coverObject['webdocs/test/src/lib/core.js']['4216:4258']++;
        view.prototype.render = function () {
        };
        __$coverObject['webdocs/test/src/lib/core.js']['4262:4304']++;
        view.prototype.resize = function () {
        };
        __$coverObject['webdocs/test/src/lib/core.js']['4310:4321']++;
        return view;
    }();
__$coverObject['webdocs/test/src/lib/core.js']['4329:6085']++;
var CoreEvent = function () {
        __$coverObject['webdocs/test/src/lib/core.js']['4360:4375']++;
        var ee, event;
        __$coverObject['webdocs/test/src/lib/core.js']['4380:4698']++;
        function indexOf(eventName, callback) {
            __$coverObject['webdocs/test/src/lib/core.js']['4422:4451']++;
            this.objectName = 'CoreEvent';
            __$coverObject['webdocs/test/src/lib/core.js']['4458:4502']++;
            var len = this.store.length, i = 0, el;
            __$coverObject['webdocs/test/src/lib/core.js']['4507:4679']++;
            for (; i < len; i++) {
                __$coverObject['webdocs/test/src/lib/core.js']['4533:4551']++;
                el = this.store[i];
                __$coverObject['webdocs/test/src/lib/core.js']['4556:4675']++;
                if (eventName === null || eventName === el.event && callback === null || callback === el.callback) {
                    __$coverObject['webdocs/test/src/lib/core.js']['4661:4670']++;
                    return el;
                }
            }
            __$coverObject['webdocs/test/src/lib/core.js']['4684:4695']++;
            return null;
        }
        __$coverObject['webdocs/test/src/lib/core.js']['4703:4749']++;
        event = function (conf) {
            __$coverObject['webdocs/test/src/lib/core.js']['4730:4745']++;
            this.store = [];
        };
        __$coverObject['webdocs/test/src/lib/core.js']['5021:5044']++;
        ee = new EventEmitter();
        __$coverObject['webdocs/test/src/lib/core.js']['5047:5229']++;
        event.prototype.emit = function (eventName, data) {
            __$coverObject['webdocs/test/src/lib/core.js']['5100:5183']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/core.js']['5121:5179']++;
                console.debug('Akonda Core - Emit event', eventName, data);
            }
            __$coverObject['webdocs/test/src/lib/core.js']['5187:5225']++;
            return ee.emitEvent(eventName, [data]);
        };
        __$coverObject['webdocs/test/src/lib/core.js']['5233:5427']++;
        event.prototype.on = function (eventName, listener) {
            __$coverObject['webdocs/test/src/lib/core.js']['5288:5377']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/core.js']['5309:5373']++;
                console.debug('Akonda Core - Add listener', eventName, listener);
            }
            __$coverObject['webdocs/test/src/lib/core.js']['5381:5423']++;
            return ee.addListener(eventName, listener);
        };
        __$coverObject['webdocs/test/src/lib/core.js']['5431:5770']++;
        event.prototype.once = function (eventName, listener) {
            __$coverObject['webdocs/test/src/lib/core.js']['5488:5617']++;
            var onceListener = function () {
                __$coverObject['webdocs/test/src/lib/core.js']['5523:5561']++;
                ee.removeListener(eventName, listener);
                __$coverObject['webdocs/test/src/lib/core.js']['5566:5596']++;
                listener.call(null, arguments);
                __$coverObject['webdocs/test/src/lib/core.js']['5601:5612']++;
                return true;
            };
            __$coverObject['webdocs/test/src/lib/core.js']['5622:5716']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/core.js']['5643:5712']++;
                console.debug('Akonda Core - Add once listener', eventName, listener);
            }
            __$coverObject['webdocs/test/src/lib/core.js']['5720:5766']++;
            return ee.addListener(eventName, onceListener);
        };
        __$coverObject['webdocs/test/src/lib/core.js']['5774:6063']++;
        event.prototype.off = function (eventName, listener) {
            __$coverObject['webdocs/test/src/lib/core.js']['5830:5922']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/core.js']['5851:5918']++;
                console.debug('Akonda Core - Remove listener', eventName, listener);
            }
            __$coverObject['webdocs/test/src/lib/core.js']['5927:6059']++;
            if (listener === undefined) {
                __$coverObject['webdocs/test/src/lib/core.js']['5960:5992']++;
                return ee.removeEvent(eventName);
            } else {
                __$coverObject['webdocs/test/src/lib/core.js']['6010:6055']++;
                return ee.removeListener(eventName, listener);
            }
        };
        __$coverObject['webdocs/test/src/lib/core.js']['6067:6079']++;
        return event;
    }();
__$coverObject['webdocs/test/src/lib/core.js']['6088:6800']++;
var CoreLogger = function (conf) {
        __$coverObject['webdocs/test/src/lib/core.js']['6125:6156']++;
        var logger = function () {
        };
        __$coverObject['webdocs/test/src/lib/core.js']['6160:6361']++;
        logger.prototype.log = function () {
            __$coverObject['webdocs/test/src/lib/core.js']['6198:6206']++;
            var args;
            __$coverObject['webdocs/test/src/lib/core.js']['6211:6357']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/core.js']['6232:6276']++;
                args = Array.prototype.slice.call(arguments);
                __$coverObject['webdocs/test/src/lib/core.js']['6281:6316']++;
                args.unshift('[' + this.name + ']');
                __$coverObject['webdocs/test/src/lib/core.js']['6321:6353']++;
                console.log.apply(console, args);
            }
        };
        __$coverObject['webdocs/test/src/lib/core.js']['6365:6568']++;
        logger.prototype.warn = function () {
            __$coverObject['webdocs/test/src/lib/core.js']['6404:6412']++;
            var args;
            __$coverObject['webdocs/test/src/lib/core.js']['6417:6564']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/core.js']['6438:6482']++;
                args = Array.prototype.slice.call(arguments);
                __$coverObject['webdocs/test/src/lib/core.js']['6487:6522']++;
                args.unshift('[' + this.name + ']');
                __$coverObject['webdocs/test/src/lib/core.js']['6527:6560']++;
                console.warn.apply(console, args);
            }
        };
        __$coverObject['webdocs/test/src/lib/core.js']['6572:6777']++;
        logger.prototype.error = function () {
            __$coverObject['webdocs/test/src/lib/core.js']['6612:6620']++;
            var args;
            __$coverObject['webdocs/test/src/lib/core.js']['6625:6773']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/core.js']['6646:6690']++;
                args = Array.prototype.slice.call(arguments);
                __$coverObject['webdocs/test/src/lib/core.js']['6695:6730']++;
                args.unshift('[' + this.name + ']');
                __$coverObject['webdocs/test/src/lib/core.js']['6735:6769']++;
                console.error.apply(console, args);
            }
        };
        __$coverObject['webdocs/test/src/lib/core.js']['6781:6794']++;
        return logger;
    }();
__$coverObject['webdocs/test/src/lib/core.js']['6914:8841']++;
var CoreUtil = function ($) {
        __$coverObject['webdocs/test/src/lib/core.js']['6946:6995']++;
        var util = {
                name: 'CoreUtil',
                debug: true
            };
        __$coverObject['webdocs/test/src/lib/core.js']['7136:7566']++;
        util.serializeForm = function (selector) {
            __$coverObject['webdocs/test/src/lib/core.js']['7180:7228']++;
            var formData = {}, formSelector = $(selector);
            __$coverObject['webdocs/test/src/lib/core.js']['7233:7343']++;
            if (formSelector.get(0).tagName === 'INPUT') {
            } else {
                __$coverObject['webdocs/test/src/lib/core.js']['7297:7339']++;
                formSelector = formSelector.find(':input');
            }
            __$coverObject['webdocs/test/src/lib/core.js']['7348:7444']++;
            formSelector.serializeArray().forEach(function (item) {
                __$coverObject['webdocs/test/src/lib/core.js']['7406:7438']++;
                formData[item.name] = item.value;
            });
            __$coverObject['webdocs/test/src/lib/core.js']['7449:7542']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/core.js']['7470:7538']++;
                console.log('Akonda Core - Serialize form:', formSelector, formData);
            }
            __$coverObject['webdocs/test/src/lib/core.js']['7547:7562']++;
            return formData;
        };
        __$coverObject['webdocs/test/src/lib/core.js']['7918:8295']++;
        util.checkLength = function (input, min, max) {
            __$coverObject['webdocs/test/src/lib/core.js']['7967:8291']++;
            if (typeof input === 'Number') {
                __$coverObject['webdocs/test/src/lib/core.js']['8003:8111']++;
                if (input < min) {
                    __$coverObject['webdocs/test/src/lib/core.js']['8026:8047']++;
                    return 'num-to-small';
                } else if (input > max) {
                    __$coverObject['webdocs/test/src/lib/core.js']['8085:8106']++;
                    return 'num-to-large';
                }
            } else {
                __$coverObject['webdocs/test/src/lib/core.js']['8129:8161']++;
                console.log(input, input.length);
                __$coverObject['webdocs/test/src/lib/core.js']['8166:8287']++;
                if (input.length < min) {
                    __$coverObject['webdocs/test/src/lib/core.js']['8196:8217']++;
                    return 'str-to-short';
                } else if (input.length > max) {
                    __$coverObject['webdocs/test/src/lib/core.js']['8262:8282']++;
                    return 'str-to-long';
                }
            }
        };
        __$coverObject['webdocs/test/src/lib/core.js']['8496:8593']++;
        util.checkEqual = function (str1, str2) {
            __$coverObject['webdocs/test/src/lib/core.js']['8539:8589']++;
            if (str1 !== str2) {
                __$coverObject['webdocs/test/src/lib/core.js']['8563:8585']++;
                return 'str-not-equal';
            }
        };
        __$coverObject['webdocs/test/src/lib/core.js']['8696:8813']++;
        util.checkEmail = function (email) {
            __$coverObject['webdocs/test/src/lib/core.js']['8734:8809']++;
            if (!/^\S+\@\S+\.[a-z]{2,10}$/.test(email)) {
                __$coverObject['webdocs/test/src/lib/core.js']['8783:8805']++;
                return 'invalid-email';
            }
        };
        __$coverObject['webdocs/test/src/lib/core.js']['8817:8828']++;
        return util;
    }(jQuery);