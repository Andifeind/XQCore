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
__$coverInit("webdocs/test/src/lib/core.js", "var CoreRouter = function(conf) {\n\tvar CoreRouter,\n\t\trouter ;\n\n\tCoreRouter = Backbone.Router.extend(conf);\n\trouter = new CoreRouter();\n\tBackbone.history.start();\n\treturn router;\n};\nvar CorePresenter = (function() {\n\n\tvar presenter = function(conf) {\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Presenter';\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.eventCallbacks = {};\n\n\t\tthis.log('Initialize presenter with conf:', conf);\n\t\tthis.init();\n\t};\n\n\tpresenter.prototype.init = function() {\n\n\t};\n\n\treturn presenter;\n})();\nvar CoreModel = (function() {\n\tvar model;\n\n\tmodel = function(conf) {\n\t\tif (conf === undefined) {\n\t\t\tconf = {};\n\t\t}\n\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Model';\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.attributes = {};\n\t\tthis._isValid = false;\n\n\t\tif (conf.validate) {\n\t\t\tthis.validate = function(formData) {\n\t\t\t\tvar result;\n\n\t\t\t\tthis._isValid = false;\n\t\t\t\tresult = conf.validate.call(this, formData);\n\t\t\t\tif (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {\n\t\t\t\t\tthis._isValid = true;\n\t\t\t\t}\n\n\t\t\t\treturn result;\n\t\t\t}.bind(this);\n\t\t}\n\n\t\tthis.init();\n\t};\n\n\tmodel.prototype.init = function() {\n\n\t};\n\n\tmodel.prototype.validate = function() {\n\n\t};\n\n\tmodel.prototype.isValid = function() {\n\t\treturn this._isValid;\n\t};\n\n\t/**\n\t * Set model data\n\t *\n\t * @param {Object or String} data/key\n\t * @param {Object} value Data value\n\t */\n\tmodel.prototype.set = function() {\n\t\tvar newData = {},\n\t\t\tvalidateResult;\n\n\t\tif (typeof arguments[0] === 'object') {\n\t\t\t//Add a dataset\n\t\t\t$.extend(newData, arguments[0]);\n\t\t\tthis.log('Set data', arguments[0]);\n\t\t}\n\t\telse if (typeof arguments[0] === 'string') {\n\t\t\tnewData[arguments[0]] = arguments[1];\n\t\t\tthis.log('Set data', arguments[0], arguments[1]);\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Data are incorrect in model.set()', arguments);\n\t\t}\n\n\t\tif (this.validate) {\n\t\t\tvalidateResult = this.validate(newData);\n\t\t\tif (validateResult) {\n\t\t\t\tthis.warn('Validate error in model.set', validateResult);\n\t\t\t\treturn validateResult;\n\t\t\t}\n\t\t}\n\n\t\t$.extend(this.attributes, newData);\n\t};\n\n\t/**\n\t * Get one or all attributes from model\n\t *\n\t * @param  {String} key Data key\n\t *\n\t * @return {Object}     Model dataset\n\t */\n\tmodel.prototype.get = function(key) {\n\t\tif (key === undefined) {\n\t\t\treturn this.attributes;\n\t\t}\n\t\telse {\n\t\t\treturn this.attributes[key];\n\t\t}\n\t};\n\n\t/**\n\t * Check wether model has a dataset\n\t *\n\t * @param {String} key Dataset key\n\t * @return {Boolean} Returns true if model has a dataset with key\n\t */\n\tmodel.prototype.has = function(key) {\n\t\treturn !!this.attributes[key];\n\t};\n\n\t/**\n\t * Remove all data from model\n\t */\n\tmodel.prototype.reset = function() {\n\t\tthis.log('Reset model');\n\t\tthis.attributes = {};\n\t};\n\n\treturn model;\n})();\nvar CoreView = (function() {\n\n\tvar view = function(presenter, conf) {\n\t\tvar self = this;\n\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'View';\n\t\tthis.presenter = presenter;\n\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.container = $(conf.container);\n\t\tif (this.container.length > 0) {\n\t\t\twindow.addEventListener('resize', function(e) {\n\t\t\t\tself.resize(e);\n\t\t\t}, false);\n\n\t\t\tthis.log('Initialize view with conf:', conf);\n\t\t\tthis.log('  ... using Presenter:', this.presenter.name);\n\t\t\tthis.log('  ... using Container:', this.container);\n\n\t\t\t//Send events to presenter\n\t\t\tObject.keys(this.events).forEach(function(key) {\n\t\t\t\tvar split = key.split(' ', 2),\n\t\t\t\t\teventFunc,\n\t\t\t\t\teventName = split[0],\n\t\t\t\t\tselector = split[1] || null;\n\n\t\t\t\tif (split.length === 1 || split.length === 2) {\n\t\t\t\t\teventFunc = this.presenter.events[this.events[key]];\n\t\t\t\t\tif (typeof eventFunc === 'function') {\n\t\t\t\t\t\t//Register event listener\n\t\t\t\t\t\tthis.container.on(eventName, eventFunc);\n\t\t\t\t\t\tthis.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);\n\t\t\t\t\t}\n\t\t\t\t\telse {\n\t\t\t\t\t\tthis.warn('Event handler callback not defined in Presenter:', this.events[key]);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\tthis.warn('Incorect event configuration', key);\n\t\t\t\t}\n\t\t\t}, this);\n\n\t\t\t//Self init\n\t\t\tthis.init();\n\t\t}\n\t\telse {\n\t\t\tthis.error('Can\\'t initialize View, Container not found!', this.container);\n\t\t}\n\t};\n\n\tview.prototype.init = function() {\n\n\t};\n\n\tview.prototype.show = function() {\n\t\t\n\t};\n\n\tview.prototype.hide = function() {\n\t\t\n\t};\n\n\tview.prototype.render = function() {\n\t\t\n\t};\n\n\tview.prototype.resize = function() {\n\t\t\n\t};\n\n\n\n\treturn view;\n})();\nvar CoreEvent = (function() {\n\tvar ee,\n\t\tevent;\n\t\n\tfunction indexOf(eventName, callback) {\n\t\tthis.objectName = 'CoreEvent';\n\t\t\n\t\tvar len = this.store.length,\n\t\t\ti = 0,\n\t\t\tel;\n\n\t\tfor (; i < len; i++) {\n\t\t\tel = this.store[i];\n\t\t\tif (eventName === null || eventName === el.event && callback === null || callback === el.callback) {\n\t\t\t\treturn el;\n\t\t\t}\n\t\t}\n\n\t\treturn null;\n\t}\n\n\n\tevent = function(conf) {\n\t\tthis.store = [];\n\t};\n\n\t// event.prototype.on = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.once = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.emit = function(eventName, data) {\n\n\t// };\n\n\t// event.prototype.remove = function(eventName, callback) {\n\n\t// };\n\n\tee = new EventEmitter();\n\tevent.prototype.emit = function(eventName, data) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Emit event', eventName, data);\n\t\t}\n\t\treturn ee.emitEvent(eventName, [data]);\n\t};\n\n\tevent.prototype.on = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Add listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, listener);\n\t};\n\n\tevent.prototype.once = function(eventName, listener) {\n\t\tvar onceListener = function() {\n\t\t\tee.removeListener(eventName, listener);\n\t\t\tlistener.call(null, arguments);\n\t\t\treturn true;\n\t\t};\n\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Add once listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, onceListener);\n\t};\n\n\tevent.prototype.off = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Remove listener', eventName, listener);\n\t\t}\n\n\t\tif (listener === undefined) {\n\t\t\treturn ee.removeEvent(eventName);\n\t\t}\n\t\telse {\n\t\t\treturn ee.removeListener(eventName, listener);\n\t\t}\n\t};\n\n\treturn event;\n})();\n\nvar CoreLogger = (function(conf) {\n\n\t//var timerStore = {};\n\n\tfunction getHumanTime(time) {\n\t\tif (time < 1000) {\n\t\t\treturn time + ' ms';\n\t\t}\n\t\telse if (time < 60000) {\n\t\t\treturn (time / 1000) + ' sec';\n\t\t}\n\t\telse {\n\t\t\treturn (time / 60000) + ' min';\n\t\t}\n\t}\n\n\tvar logger = function() {\n\t\t\n\t};\n\n\tlogger.prototype.log = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.log.apply(console, args);\n\t\t}\n\t};\n\n\tlogger.prototype.warn = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.warn.apply(console, args);\n\t\t}\n\t};\n\n\tlogger.prototype.error = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.error.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Start a timeTracer\n\t *\n\t * @param {String} timerName Set the name for your (Optional)\n\t * @return {Object} Returns a TimerObject\n\t */\n\tlogger.prototype.timer = function(name) {\n\t\tvar timer = {\n\t\t\tstart: null,\n\t\t\tstop: null,\n\t\t\tname: name,\n\t\t\tend: function() {\n\t\t\t\treturn this;\n\t\t\t}\n\t\t};\n\n\t\t/*if (name) {\n\t\t\tthis.timerStore[name] = timer;\n\t\t}*/\n\n\t\tthis.log('Start Timer', name);\n\n\t\t//Set timer start time\n\t\ttimer.start = Date.now();\n\t\treturn timer;\n\t};\n\n\t/**\n\t * Stops a timer\n\t *\n\t * @param {String or Object} timerName Stops the given timer\n\t */\n\tlogger.prototype.timerEnd = function(timer) {\n\t\t//Set stop timer\n\t\tif (typeof timer === 'object') {\n\t\t\ttimer.stop = Date.now();\n\t\t\tthis.log('Timer ' + timer.name + ' runs: ', getHumanTime(Date.now() - timer.start));\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Not a timer object in logger.timerEnd()', timer);\n\t\t}\n\t};\n\t\n\n\treturn logger;\n})();\n/**\n * A bunch of helpfull functions\n *\n * @return {Object} Returns a singelton object instance of CoreUtil\n */\nvar CoreUtil = (function($) {\n\n\tvar util = {\n\t\tname: 'CoreUtil',\n\t\tdebug: true\n\t};\n\n\t/**\n\t * Serialize a form and return its values as JSON\n\t *\n\t * @param {Object} Form selector\n\t * @return {Object} FormData as JSON\n\t */\n\tutil.serializeForm = function(selector) {\n\t\tvar formData = {},\n\t\t\tformSelector = $(selector);\n\n\t\tif (formSelector.get(0).tagName === 'INPUT') {\n\n\t\t}\n\t\telse {\n\t\t\tformSelector = formSelector.find(':input');\n\t\t}\n\n\t\tformSelector.serializeArray().forEach(function(item) {\n\t\t\tformData[item.name] = item.value;\n\t\t});\n\n\t\tif (this.debug) {\n\t\t\tconsole.log('Akonda Core - Serialize form:', formSelector, formData);\n\t\t}\n\n\t\treturn formData;\n\t};\n\n\t/**\n\t * Check length of a string or number\n\t *\n\t * @param {String or Number} input this will be checked\n\t * @param {Number} min String can't be shorter than n, Number can't be lower than n\n\t * @param {Number} max String can't be longer than n, Number can't be greater than n\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkLength = function(input, min, max) {\n\t\tif (typeof input === 'Number') {\n\t\t\tif (input < min) {\n\t\t\t\treturn 'num-to-small';\n\t\t\t}\n\t\t\telse if (input > max) {\n\t\t\t\treturn 'num-to-large';\n\t\t\t}\n\t\t}\n\t\telse {\n\t\t\tconsole.log(input, input.length);\n\t\t\tif (input.length < min) {\n\t\t\t\treturn 'str-to-short';\n\t\t\t}\n\t\t\telse if (input.length > max) {\n\t\t\t\treturn 'str-to-long';\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\t * Checks the equality of two strings\n\t *\n\t * @param {String} str1 First string\n\t * @param {String} str2 Second string\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkEqual = function(str1, str2) {\n\t\tif (str1 !== str2) {\n\t\t\treturn 'str-not-equal';\n\t\t}\n\t};\n\n\t/**\n\t * Checks the validity of an email address\n\t *\n\t * @param {String} email e-Mail address\n\t */\n\tutil.checkEmail = function(email) {\n\t\tif (!/^\\S+\\@\\S+\\.[a-z]{2,10}$/.test(email)) {\n\t\t\treturn 'invalid-email';\n\t\t}\n\t};\n\n\treturn util;\n\n})(jQuery);");
__$coverInitRange("webdocs/test/src/lib/core.js", "0:179");
__$coverInitRange("webdocs/test/src/lib/core.js", "181:572");
__$coverInitRange("webdocs/test/src/lib/core.js", "574:2827");
__$coverInitRange("webdocs/test/src/lib/core.js", "2829:4523");
__$coverInitRange("webdocs/test/src/lib/core.js", "4525:6281");
__$coverInitRange("webdocs/test/src/lib/core.js", "6284:8079");
__$coverInitRange("webdocs/test/src/lib/core.js", "8193:10120");
__$coverInitRange("webdocs/test/src/lib/core.js", "35:60");
__$coverInitRange("webdocs/test/src/lib/core.js", "64:105");
__$coverInitRange("webdocs/test/src/lib/core.js", "108:133");
__$coverInitRange("webdocs/test/src/lib/core.js", "136:160");
__$coverInitRange("webdocs/test/src/lib/core.js", "163:176");
__$coverInitRange("webdocs/test/src/lib/core.js", "217:499");
__$coverInitRange("webdocs/test/src/lib/core.js", "503:546");
__$coverInitRange("webdocs/test/src/lib/core.js", "550:566");
__$coverInitRange("webdocs/test/src/lib/core.js", "252:307");
__$coverInitRange("webdocs/test/src/lib/core.js", "311:362");
__$coverInitRange("webdocs/test/src/lib/core.js", "366:398");
__$coverInitRange("webdocs/test/src/lib/core.js", "402:426");
__$coverInitRange("webdocs/test/src/lib/core.js", "431:480");
__$coverInitRange("webdocs/test/src/lib/core.js", "484:495");
__$coverInitRange("webdocs/test/src/lib/core.js", "605:614");
__$coverInitRange("webdocs/test/src/lib/core.js", "618:1221");
__$coverInitRange("webdocs/test/src/lib/core.js", "1225:1264");
__$coverInitRange("webdocs/test/src/lib/core.js", "1268:1311");
__$coverInitRange("webdocs/test/src/lib/core.js", "1315:1380");
__$coverInitRange("webdocs/test/src/lib/core.js", "1493:2160");
__$coverInitRange("webdocs/test/src/lib/core.js", "2296:2439");
__$coverInitRange("webdocs/test/src/lib/core.js", "2597:2670");
__$coverInitRange("webdocs/test/src/lib/core.js", "2715:2805");
__$coverInitRange("webdocs/test/src/lib/core.js", "2809:2821");
__$coverInitRange("webdocs/test/src/lib/core.js", "645:687");
__$coverInitRange("webdocs/test/src/lib/core.js", "692:747");
__$coverInitRange("webdocs/test/src/lib/core.js", "751:798");
__$coverInitRange("webdocs/test/src/lib/core.js", "802:834");
__$coverInitRange("webdocs/test/src/lib/core.js", "838:858");
__$coverInitRange("webdocs/test/src/lib/core.js", "862:883");
__$coverInitRange("webdocs/test/src/lib/core.js", "888:1201");
__$coverInitRange("webdocs/test/src/lib/core.js", "1206:1217");
__$coverInitRange("webdocs/test/src/lib/core.js", "674:683");
__$coverInitRange("webdocs/test/src/lib/core.js", "912:1197");
__$coverInitRange("webdocs/test/src/lib/core.js", "953:963");
__$coverInitRange("webdocs/test/src/lib/core.js", "970:991");
__$coverInitRange("webdocs/test/src/lib/core.js", "997:1040");
__$coverInitRange("webdocs/test/src/lib/core.js", "1046:1160");
__$coverInitRange("webdocs/test/src/lib/core.js", "1167:1180");
__$coverInitRange("webdocs/test/src/lib/core.js", "1134:1154");
__$coverInitRange("webdocs/test/src/lib/core.js", "1356:1376");
__$coverInitRange("webdocs/test/src/lib/core.js", "1530:1565");
__$coverInitRange("webdocs/test/src/lib/core.js", "1570:1926");
__$coverInitRange("webdocs/test/src/lib/core.js", "1931:2117");
__$coverInitRange("webdocs/test/src/lib/core.js", "2122:2156");
__$coverInitRange("webdocs/test/src/lib/core.js", "1632:1663");
__$coverInitRange("webdocs/test/src/lib/core.js", "1668:1702");
__$coverInitRange("webdocs/test/src/lib/core.js", "1758:1794");
__$coverInitRange("webdocs/test/src/lib/core.js", "1799:1847");
__$coverInitRange("webdocs/test/src/lib/core.js", "1865:1922");
__$coverInitRange("webdocs/test/src/lib/core.js", "1955:1994");
__$coverInitRange("webdocs/test/src/lib/core.js", "1999:2113");
__$coverInitRange("webdocs/test/src/lib/core.js", "2025:2081");
__$coverInitRange("webdocs/test/src/lib/core.js", "2087:2108");
__$coverInitRange("webdocs/test/src/lib/core.js", "2336:2435");
__$coverInitRange("webdocs/test/src/lib/core.js", "2364:2386");
__$coverInitRange("webdocs/test/src/lib/core.js", "2404:2431");
__$coverInitRange("webdocs/test/src/lib/core.js", "2637:2666");
__$coverInitRange("webdocs/test/src/lib/core.js", "2754:2777");
__$coverInitRange("webdocs/test/src/lib/core.js", "2781:2801");
__$coverInitRange("webdocs/test/src/lib/core.js", "2860:4278");
__$coverInitRange("webdocs/test/src/lib/core.js", "4282:4320");
__$coverInitRange("webdocs/test/src/lib/core.js", "4324:4364");
__$coverInitRange("webdocs/test/src/lib/core.js", "4368:4408");
__$coverInitRange("webdocs/test/src/lib/core.js", "4412:4454");
__$coverInitRange("webdocs/test/src/lib/core.js", "4458:4500");
__$coverInitRange("webdocs/test/src/lib/core.js", "4506:4517");
__$coverInitRange("webdocs/test/src/lib/core.js", "2901:2916");
__$coverInitRange("webdocs/test/src/lib/core.js", "2921:2976");
__$coverInitRange("webdocs/test/src/lib/core.js", "2980:3026");
__$coverInitRange("webdocs/test/src/lib/core.js", "3030:3056");
__$coverInitRange("webdocs/test/src/lib/core.js", "3061:3093");
__$coverInitRange("webdocs/test/src/lib/core.js", "3097:3131");
__$coverInitRange("webdocs/test/src/lib/core.js", "3135:4274");
__$coverInitRange("webdocs/test/src/lib/core.js", "3171:3251");
__$coverInitRange("webdocs/test/src/lib/core.js", "3257:3301");
__$coverInitRange("webdocs/test/src/lib/core.js", "3306:3361");
__$coverInitRange("webdocs/test/src/lib/core.js", "3366:3416");
__$coverInitRange("webdocs/test/src/lib/core.js", "3452:4146");
__$coverInitRange("webdocs/test/src/lib/core.js", "4167:4178");
__$coverInitRange("webdocs/test/src/lib/core.js", "3223:3237");
__$coverInitRange("webdocs/test/src/lib/core.js", "3505:3611");
__$coverInitRange("webdocs/test/src/lib/core.js", "3618:4133");
__$coverInitRange("webdocs/test/src/lib/core.js", "3671:3722");
__$coverInitRange("webdocs/test/src/lib/core.js", "3729:4057");
__$coverInitRange("webdocs/test/src/lib/core.js", "3806:3845");
__$coverInitRange("webdocs/test/src/lib/core.js", "3853:3944");
__$coverInitRange("webdocs/test/src/lib/core.js", "3971:4050");
__$coverInitRange("webdocs/test/src/lib/core.js", "4081:4127");
__$coverInitRange("webdocs/test/src/lib/core.js", "4196:4270");
__$coverInitRange("webdocs/test/src/lib/core.js", "4556:4571");
__$coverInitRange("webdocs/test/src/lib/core.js", "4576:4894");
__$coverInitRange("webdocs/test/src/lib/core.js", "4899:4945");
__$coverInitRange("webdocs/test/src/lib/core.js", "5217:5240");
__$coverInitRange("webdocs/test/src/lib/core.js", "5243:5425");
__$coverInitRange("webdocs/test/src/lib/core.js", "5429:5623");
__$coverInitRange("webdocs/test/src/lib/core.js", "5627:5966");
__$coverInitRange("webdocs/test/src/lib/core.js", "5970:6259");
__$coverInitRange("webdocs/test/src/lib/core.js", "6263:6275");
__$coverInitRange("webdocs/test/src/lib/core.js", "4618:4647");
__$coverInitRange("webdocs/test/src/lib/core.js", "4654:4698");
__$coverInitRange("webdocs/test/src/lib/core.js", "4703:4875");
__$coverInitRange("webdocs/test/src/lib/core.js", "4880:4891");
__$coverInitRange("webdocs/test/src/lib/core.js", "4729:4747");
__$coverInitRange("webdocs/test/src/lib/core.js", "4752:4871");
__$coverInitRange("webdocs/test/src/lib/core.js", "4857:4866");
__$coverInitRange("webdocs/test/src/lib/core.js", "4926:4941");
__$coverInitRange("webdocs/test/src/lib/core.js", "5296:5379");
__$coverInitRange("webdocs/test/src/lib/core.js", "5383:5421");
__$coverInitRange("webdocs/test/src/lib/core.js", "5317:5375");
__$coverInitRange("webdocs/test/src/lib/core.js", "5484:5573");
__$coverInitRange("webdocs/test/src/lib/core.js", "5577:5619");
__$coverInitRange("webdocs/test/src/lib/core.js", "5505:5569");
__$coverInitRange("webdocs/test/src/lib/core.js", "5684:5813");
__$coverInitRange("webdocs/test/src/lib/core.js", "5818:5912");
__$coverInitRange("webdocs/test/src/lib/core.js", "5916:5962");
__$coverInitRange("webdocs/test/src/lib/core.js", "5719:5757");
__$coverInitRange("webdocs/test/src/lib/core.js", "5762:5792");
__$coverInitRange("webdocs/test/src/lib/core.js", "5797:5808");
__$coverInitRange("webdocs/test/src/lib/core.js", "5839:5908");
__$coverInitRange("webdocs/test/src/lib/core.js", "6026:6118");
__$coverInitRange("webdocs/test/src/lib/core.js", "6123:6255");
__$coverInitRange("webdocs/test/src/lib/core.js", "6047:6114");
__$coverInitRange("webdocs/test/src/lib/core.js", "6156:6188");
__$coverInitRange("webdocs/test/src/lib/core.js", "6206:6251");
__$coverInitRange("webdocs/test/src/lib/core.js", "6346:6539");
__$coverInitRange("webdocs/test/src/lib/core.js", "6543:6574");
__$coverInitRange("webdocs/test/src/lib/core.js", "6578:6779");
__$coverInitRange("webdocs/test/src/lib/core.js", "6783:6986");
__$coverInitRange("webdocs/test/src/lib/core.js", "6990:7195");
__$coverInitRange("webdocs/test/src/lib/core.js", "7342:7657");
__$coverInitRange("webdocs/test/src/lib/core.js", "7755:8054");
__$coverInitRange("webdocs/test/src/lib/core.js", "8060:8073");
__$coverInitRange("webdocs/test/src/lib/core.js", "6378:6536");
__$coverInitRange("webdocs/test/src/lib/core.js", "6400:6419");
__$coverInitRange("webdocs/test/src/lib/core.js", "6455:6484");
__$coverInitRange("webdocs/test/src/lib/core.js", "6502:6532");
__$coverInitRange("webdocs/test/src/lib/core.js", "6616:6624");
__$coverInitRange("webdocs/test/src/lib/core.js", "6629:6775");
__$coverInitRange("webdocs/test/src/lib/core.js", "6650:6694");
__$coverInitRange("webdocs/test/src/lib/core.js", "6699:6734");
__$coverInitRange("webdocs/test/src/lib/core.js", "6739:6771");
__$coverInitRange("webdocs/test/src/lib/core.js", "6822:6830");
__$coverInitRange("webdocs/test/src/lib/core.js", "6835:6982");
__$coverInitRange("webdocs/test/src/lib/core.js", "6856:6900");
__$coverInitRange("webdocs/test/src/lib/core.js", "6905:6940");
__$coverInitRange("webdocs/test/src/lib/core.js", "6945:6978");
__$coverInitRange("webdocs/test/src/lib/core.js", "7030:7038");
__$coverInitRange("webdocs/test/src/lib/core.js", "7043:7191");
__$coverInitRange("webdocs/test/src/lib/core.js", "7064:7108");
__$coverInitRange("webdocs/test/src/lib/core.js", "7113:7148");
__$coverInitRange("webdocs/test/src/lib/core.js", "7153:7187");
__$coverInitRange("webdocs/test/src/lib/core.js", "7386:7492");
__$coverInitRange("webdocs/test/src/lib/core.js", "7554:7583");
__$coverInitRange("webdocs/test/src/lib/core.js", "7613:7637");
__$coverInitRange("webdocs/test/src/lib/core.js", "7641:7653");
__$coverInitRange("webdocs/test/src/lib/core.js", "7471:7482");
__$coverInitRange("webdocs/test/src/lib/core.js", "7822:8050");
__$coverInitRange("webdocs/test/src/lib/core.js", "7858:7881");
__$coverInitRange("webdocs/test/src/lib/core.js", "7886:7969");
__$coverInitRange("webdocs/test/src/lib/core.js", "7987:8046");
__$coverInitRange("webdocs/test/src/lib/core.js", "8225:8274");
__$coverInitRange("webdocs/test/src/lib/core.js", "8415:8845");
__$coverInitRange("webdocs/test/src/lib/core.js", "9197:9574");
__$coverInitRange("webdocs/test/src/lib/core.js", "9775:9872");
__$coverInitRange("webdocs/test/src/lib/core.js", "9975:10092");
__$coverInitRange("webdocs/test/src/lib/core.js", "10096:10107");
__$coverInitRange("webdocs/test/src/lib/core.js", "8459:8507");
__$coverInitRange("webdocs/test/src/lib/core.js", "8512:8622");
__$coverInitRange("webdocs/test/src/lib/core.js", "8627:8723");
__$coverInitRange("webdocs/test/src/lib/core.js", "8728:8821");
__$coverInitRange("webdocs/test/src/lib/core.js", "8826:8841");
__$coverInitRange("webdocs/test/src/lib/core.js", "8576:8618");
__$coverInitRange("webdocs/test/src/lib/core.js", "8685:8717");
__$coverInitRange("webdocs/test/src/lib/core.js", "8749:8817");
__$coverInitRange("webdocs/test/src/lib/core.js", "9246:9570");
__$coverInitRange("webdocs/test/src/lib/core.js", "9282:9390");
__$coverInitRange("webdocs/test/src/lib/core.js", "9305:9326");
__$coverInitRange("webdocs/test/src/lib/core.js", "9364:9385");
__$coverInitRange("webdocs/test/src/lib/core.js", "9408:9440");
__$coverInitRange("webdocs/test/src/lib/core.js", "9445:9566");
__$coverInitRange("webdocs/test/src/lib/core.js", "9475:9496");
__$coverInitRange("webdocs/test/src/lib/core.js", "9541:9561");
__$coverInitRange("webdocs/test/src/lib/core.js", "9818:9868");
__$coverInitRange("webdocs/test/src/lib/core.js", "9842:9864");
__$coverInitRange("webdocs/test/src/lib/core.js", "10013:10088");
__$coverInitRange("webdocs/test/src/lib/core.js", "10062:10084");
__$coverCall('webdocs/test/src/lib/core.js', '0:179');
var CoreRouter = function (conf) {
    __$coverCall('webdocs/test/src/lib/core.js', '35:60');
    var CoreRouter, router;
    __$coverCall('webdocs/test/src/lib/core.js', '64:105');
    CoreRouter = Backbone.Router.extend(conf);
    __$coverCall('webdocs/test/src/lib/core.js', '108:133');
    router = new CoreRouter();
    __$coverCall('webdocs/test/src/lib/core.js', '136:160');
    Backbone.history.start();
    __$coverCall('webdocs/test/src/lib/core.js', '163:176');
    return router;
};
__$coverCall('webdocs/test/src/lib/core.js', '181:572');
var CorePresenter = function () {
        __$coverCall('webdocs/test/src/lib/core.js', '217:499');
        var presenter = function (conf) {
            __$coverCall('webdocs/test/src/lib/core.js', '252:307');
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverCall('webdocs/test/src/lib/core.js', '311:362');
            this.name = (conf.name || 'Nameless') + 'Presenter';
            __$coverCall('webdocs/test/src/lib/core.js', '366:398');
            this.debug = Boolean(conf.debug);
            __$coverCall('webdocs/test/src/lib/core.js', '402:426');
            this.eventCallbacks = {};
            __$coverCall('webdocs/test/src/lib/core.js', '431:480');
            this.log('Initialize presenter with conf:', conf);
            __$coverCall('webdocs/test/src/lib/core.js', '484:495');
            this.init();
        };
        __$coverCall('webdocs/test/src/lib/core.js', '503:546');
        presenter.prototype.init = function () {
        };
        __$coverCall('webdocs/test/src/lib/core.js', '550:566');
        return presenter;
    }();
__$coverCall('webdocs/test/src/lib/core.js', '574:2827');
var CoreModel = function () {
        __$coverCall('webdocs/test/src/lib/core.js', '605:614');
        var model;
        __$coverCall('webdocs/test/src/lib/core.js', '618:1221');
        model = function (conf) {
            __$coverCall('webdocs/test/src/lib/core.js', '645:687');
            if (conf === undefined) {
                __$coverCall('webdocs/test/src/lib/core.js', '674:683');
                conf = {};
            }
            __$coverCall('webdocs/test/src/lib/core.js', '692:747');
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverCall('webdocs/test/src/lib/core.js', '751:798');
            this.name = (conf.name || 'Nameless') + 'Model';
            __$coverCall('webdocs/test/src/lib/core.js', '802:834');
            this.debug = Boolean(conf.debug);
            __$coverCall('webdocs/test/src/lib/core.js', '838:858');
            this.attributes = {};
            __$coverCall('webdocs/test/src/lib/core.js', '862:883');
            this._isValid = false;
            __$coverCall('webdocs/test/src/lib/core.js', '888:1201');
            if (conf.validate) {
                __$coverCall('webdocs/test/src/lib/core.js', '912:1197');
                this.validate = function (formData) {
                    __$coverCall('webdocs/test/src/lib/core.js', '953:963');
                    var result;
                    __$coverCall('webdocs/test/src/lib/core.js', '970:991');
                    this._isValid = false;
                    __$coverCall('webdocs/test/src/lib/core.js', '997:1040');
                    result = conf.validate.call(this, formData);
                    __$coverCall('webdocs/test/src/lib/core.js', '1046:1160');
                    if (!result || typeof result === 'object' && Object.keys(result).length === 0) {
                        __$coverCall('webdocs/test/src/lib/core.js', '1134:1154');
                        this._isValid = true;
                    }
                    __$coverCall('webdocs/test/src/lib/core.js', '1167:1180');
                    return result;
                }.bind(this);
            }
            __$coverCall('webdocs/test/src/lib/core.js', '1206:1217');
            this.init();
        };
        __$coverCall('webdocs/test/src/lib/core.js', '1225:1264');
        model.prototype.init = function () {
        };
        __$coverCall('webdocs/test/src/lib/core.js', '1268:1311');
        model.prototype.validate = function () {
        };
        __$coverCall('webdocs/test/src/lib/core.js', '1315:1380');
        model.prototype.isValid = function () {
            __$coverCall('webdocs/test/src/lib/core.js', '1356:1376');
            return this._isValid;
        };
        __$coverCall('webdocs/test/src/lib/core.js', '1493:2160');
        model.prototype.set = function () {
            __$coverCall('webdocs/test/src/lib/core.js', '1530:1565');
            var newData = {}, validateResult;
            __$coverCall('webdocs/test/src/lib/core.js', '1570:1926');
            if (typeof arguments[0] === 'object') {
                __$coverCall('webdocs/test/src/lib/core.js', '1632:1663');
                $.extend(newData, arguments[0]);
                __$coverCall('webdocs/test/src/lib/core.js', '1668:1702');
                this.log('Set data', arguments[0]);
            } else if (typeof arguments[0] === 'string') {
                __$coverCall('webdocs/test/src/lib/core.js', '1758:1794');
                newData[arguments[0]] = arguments[1];
                __$coverCall('webdocs/test/src/lib/core.js', '1799:1847');
                this.log('Set data', arguments[0], arguments[1]);
            } else {
                __$coverCall('webdocs/test/src/lib/core.js', '1865:1922');
                this.warn('Data are incorrect in model.set()', arguments);
            }
            __$coverCall('webdocs/test/src/lib/core.js', '1931:2117');
            if (this.validate) {
                __$coverCall('webdocs/test/src/lib/core.js', '1955:1994');
                validateResult = this.validate(newData);
                __$coverCall('webdocs/test/src/lib/core.js', '1999:2113');
                if (validateResult) {
                    __$coverCall('webdocs/test/src/lib/core.js', '2025:2081');
                    this.warn('Validate error in model.set', validateResult);
                    __$coverCall('webdocs/test/src/lib/core.js', '2087:2108');
                    return validateResult;
                }
            }
            __$coverCall('webdocs/test/src/lib/core.js', '2122:2156');
            $.extend(this.attributes, newData);
        };
        __$coverCall('webdocs/test/src/lib/core.js', '2296:2439');
        model.prototype.get = function (key) {
            __$coverCall('webdocs/test/src/lib/core.js', '2336:2435');
            if (key === undefined) {
                __$coverCall('webdocs/test/src/lib/core.js', '2364:2386');
                return this.attributes;
            } else {
                __$coverCall('webdocs/test/src/lib/core.js', '2404:2431');
                return this.attributes[key];
            }
        };
        __$coverCall('webdocs/test/src/lib/core.js', '2597:2670');
        model.prototype.has = function (key) {
            __$coverCall('webdocs/test/src/lib/core.js', '2637:2666');
            return !!this.attributes[key];
        };
        __$coverCall('webdocs/test/src/lib/core.js', '2715:2805');
        model.prototype.reset = function () {
            __$coverCall('webdocs/test/src/lib/core.js', '2754:2777');
            this.log('Reset model');
            __$coverCall('webdocs/test/src/lib/core.js', '2781:2801');
            this.attributes = {};
        };
        __$coverCall('webdocs/test/src/lib/core.js', '2809:2821');
        return model;
    }();
__$coverCall('webdocs/test/src/lib/core.js', '2829:4523');
var CoreView = function () {
        __$coverCall('webdocs/test/src/lib/core.js', '2860:4278');
        var view = function (presenter, conf) {
            __$coverCall('webdocs/test/src/lib/core.js', '2901:2916');
            var self = this;
            __$coverCall('webdocs/test/src/lib/core.js', '2921:2976');
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverCall('webdocs/test/src/lib/core.js', '2980:3026');
            this.name = (conf.name || 'Nameless') + 'View';
            __$coverCall('webdocs/test/src/lib/core.js', '3030:3056');
            this.presenter = presenter;
            __$coverCall('webdocs/test/src/lib/core.js', '3061:3093');
            this.debug = Boolean(conf.debug);
            __$coverCall('webdocs/test/src/lib/core.js', '3097:3131');
            this.container = $(conf.container);
            __$coverCall('webdocs/test/src/lib/core.js', '3135:4274');
            if (this.container.length > 0) {
                __$coverCall('webdocs/test/src/lib/core.js', '3171:3251');
                window.addEventListener('resize', function (e) {
                    __$coverCall('webdocs/test/src/lib/core.js', '3223:3237');
                    self.resize(e);
                }, false);
                __$coverCall('webdocs/test/src/lib/core.js', '3257:3301');
                this.log('Initialize view with conf:', conf);
                __$coverCall('webdocs/test/src/lib/core.js', '3306:3361');
                this.log('  ... using Presenter:', this.presenter.name);
                __$coverCall('webdocs/test/src/lib/core.js', '3366:3416');
                this.log('  ... using Container:', this.container);
                __$coverCall('webdocs/test/src/lib/core.js', '3452:4146');
                Object.keys(this.events).forEach(function (key) {
                    __$coverCall('webdocs/test/src/lib/core.js', '3505:3611');
                    var split = key.split(' ', 2), eventFunc, eventName = split[0], selector = split[1] || null;
                    __$coverCall('webdocs/test/src/lib/core.js', '3618:4133');
                    if (split.length === 1 || split.length === 2) {
                        __$coverCall('webdocs/test/src/lib/core.js', '3671:3722');
                        eventFunc = this.presenter.events[this.events[key]];
                        __$coverCall('webdocs/test/src/lib/core.js', '3729:4057');
                        if (typeof eventFunc === 'function') {
                            __$coverCall('webdocs/test/src/lib/core.js', '3806:3845');
                            this.container.on(eventName, eventFunc);
                            __$coverCall('webdocs/test/src/lib/core.js', '3853:3944');
                            this.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);
                        } else {
                            __$coverCall('webdocs/test/src/lib/core.js', '3971:4050');
                            this.warn('Event handler callback not defined in Presenter:', this.events[key]);
                        }
                    } else {
                        __$coverCall('webdocs/test/src/lib/core.js', '4081:4127');
                        this.warn('Incorect event configuration', key);
                    }
                }, this);
                __$coverCall('webdocs/test/src/lib/core.js', '4167:4178');
                this.init();
            } else {
                __$coverCall('webdocs/test/src/lib/core.js', '4196:4270');
                this.error('Can\'t initialize View, Container not found!', this.container);
            }
        };
        __$coverCall('webdocs/test/src/lib/core.js', '4282:4320');
        view.prototype.init = function () {
        };
        __$coverCall('webdocs/test/src/lib/core.js', '4324:4364');
        view.prototype.show = function () {
        };
        __$coverCall('webdocs/test/src/lib/core.js', '4368:4408');
        view.prototype.hide = function () {
        };
        __$coverCall('webdocs/test/src/lib/core.js', '4412:4454');
        view.prototype.render = function () {
        };
        __$coverCall('webdocs/test/src/lib/core.js', '4458:4500');
        view.prototype.resize = function () {
        };
        __$coverCall('webdocs/test/src/lib/core.js', '4506:4517');
        return view;
    }();
__$coverCall('webdocs/test/src/lib/core.js', '4525:6281');
var CoreEvent = function () {
        __$coverCall('webdocs/test/src/lib/core.js', '4556:4571');
        var ee, event;
        __$coverCall('webdocs/test/src/lib/core.js', '4576:4894');
        function indexOf(eventName, callback) {
            __$coverCall('webdocs/test/src/lib/core.js', '4618:4647');
            this.objectName = 'CoreEvent';
            __$coverCall('webdocs/test/src/lib/core.js', '4654:4698');
            var len = this.store.length, i = 0, el;
            __$coverCall('webdocs/test/src/lib/core.js', '4703:4875');
            for (; i < len; i++) {
                __$coverCall('webdocs/test/src/lib/core.js', '4729:4747');
                el = this.store[i];
                __$coverCall('webdocs/test/src/lib/core.js', '4752:4871');
                if (eventName === null || eventName === el.event && callback === null || callback === el.callback) {
                    __$coverCall('webdocs/test/src/lib/core.js', '4857:4866');
                    return el;
                }
            }
            __$coverCall('webdocs/test/src/lib/core.js', '4880:4891');
            return null;
        }
        __$coverCall('webdocs/test/src/lib/core.js', '4899:4945');
        event = function (conf) {
            __$coverCall('webdocs/test/src/lib/core.js', '4926:4941');
            this.store = [];
        };
        __$coverCall('webdocs/test/src/lib/core.js', '5217:5240');
        ee = new EventEmitter();
        __$coverCall('webdocs/test/src/lib/core.js', '5243:5425');
        event.prototype.emit = function (eventName, data) {
            __$coverCall('webdocs/test/src/lib/core.js', '5296:5379');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core.js', '5317:5375');
                console.debug('Akonda Core - Emit event', eventName, data);
            }
            __$coverCall('webdocs/test/src/lib/core.js', '5383:5421');
            return ee.emitEvent(eventName, [data]);
        };
        __$coverCall('webdocs/test/src/lib/core.js', '5429:5623');
        event.prototype.on = function (eventName, listener) {
            __$coverCall('webdocs/test/src/lib/core.js', '5484:5573');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core.js', '5505:5569');
                console.debug('Akonda Core - Add listener', eventName, listener);
            }
            __$coverCall('webdocs/test/src/lib/core.js', '5577:5619');
            return ee.addListener(eventName, listener);
        };
        __$coverCall('webdocs/test/src/lib/core.js', '5627:5966');
        event.prototype.once = function (eventName, listener) {
            __$coverCall('webdocs/test/src/lib/core.js', '5684:5813');
            var onceListener = function () {
                __$coverCall('webdocs/test/src/lib/core.js', '5719:5757');
                ee.removeListener(eventName, listener);
                __$coverCall('webdocs/test/src/lib/core.js', '5762:5792');
                listener.call(null, arguments);
                __$coverCall('webdocs/test/src/lib/core.js', '5797:5808');
                return true;
            };
            __$coverCall('webdocs/test/src/lib/core.js', '5818:5912');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core.js', '5839:5908');
                console.debug('Akonda Core - Add once listener', eventName, listener);
            }
            __$coverCall('webdocs/test/src/lib/core.js', '5916:5962');
            return ee.addListener(eventName, onceListener);
        };
        __$coverCall('webdocs/test/src/lib/core.js', '5970:6259');
        event.prototype.off = function (eventName, listener) {
            __$coverCall('webdocs/test/src/lib/core.js', '6026:6118');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core.js', '6047:6114');
                console.debug('Akonda Core - Remove listener', eventName, listener);
            }
            __$coverCall('webdocs/test/src/lib/core.js', '6123:6255');
            if (listener === undefined) {
                __$coverCall('webdocs/test/src/lib/core.js', '6156:6188');
                return ee.removeEvent(eventName);
            } else {
                __$coverCall('webdocs/test/src/lib/core.js', '6206:6251');
                return ee.removeListener(eventName, listener);
            }
        };
        __$coverCall('webdocs/test/src/lib/core.js', '6263:6275');
        return event;
    }();
__$coverCall('webdocs/test/src/lib/core.js', '6284:8079');
var CoreLogger = function (conf) {
        __$coverCall('webdocs/test/src/lib/core.js', '6346:6539');
        function getHumanTime(time) {
            __$coverCall('webdocs/test/src/lib/core.js', '6378:6536');
            if (time < 1000) {
                __$coverCall('webdocs/test/src/lib/core.js', '6400:6419');
                return time + ' ms';
            } else if (time < 60000) {
                __$coverCall('webdocs/test/src/lib/core.js', '6455:6484');
                return time / 1000 + ' sec';
            } else {
                __$coverCall('webdocs/test/src/lib/core.js', '6502:6532');
                return time / 60000 + ' min';
            }
        }
        __$coverCall('webdocs/test/src/lib/core.js', '6543:6574');
        var logger = function () {
        };
        __$coverCall('webdocs/test/src/lib/core.js', '6578:6779');
        logger.prototype.log = function () {
            __$coverCall('webdocs/test/src/lib/core.js', '6616:6624');
            var args;
            __$coverCall('webdocs/test/src/lib/core.js', '6629:6775');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core.js', '6650:6694');
                args = Array.prototype.slice.call(arguments);
                __$coverCall('webdocs/test/src/lib/core.js', '6699:6734');
                args.unshift('[' + this.name + ']');
                __$coverCall('webdocs/test/src/lib/core.js', '6739:6771');
                console.log.apply(console, args);
            }
        };
        __$coverCall('webdocs/test/src/lib/core.js', '6783:6986');
        logger.prototype.warn = function () {
            __$coverCall('webdocs/test/src/lib/core.js', '6822:6830');
            var args;
            __$coverCall('webdocs/test/src/lib/core.js', '6835:6982');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core.js', '6856:6900');
                args = Array.prototype.slice.call(arguments);
                __$coverCall('webdocs/test/src/lib/core.js', '6905:6940');
                args.unshift('[' + this.name + ']');
                __$coverCall('webdocs/test/src/lib/core.js', '6945:6978');
                console.warn.apply(console, args);
            }
        };
        __$coverCall('webdocs/test/src/lib/core.js', '6990:7195');
        logger.prototype.error = function () {
            __$coverCall('webdocs/test/src/lib/core.js', '7030:7038');
            var args;
            __$coverCall('webdocs/test/src/lib/core.js', '7043:7191');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core.js', '7064:7108');
                args = Array.prototype.slice.call(arguments);
                __$coverCall('webdocs/test/src/lib/core.js', '7113:7148');
                args.unshift('[' + this.name + ']');
                __$coverCall('webdocs/test/src/lib/core.js', '7153:7187');
                console.error.apply(console, args);
            }
        };
        __$coverCall('webdocs/test/src/lib/core.js', '7342:7657');
        logger.prototype.timer = function (name) {
            __$coverCall('webdocs/test/src/lib/core.js', '7386:7492');
            var timer = {
                    start: null,
                    stop: null,
                    name: name,
                    end: function () {
                        __$coverCall('webdocs/test/src/lib/core.js', '7471:7482');
                        return this;
                    }
                };
            __$coverCall('webdocs/test/src/lib/core.js', '7554:7583');
            this.log('Start Timer', name);
            __$coverCall('webdocs/test/src/lib/core.js', '7613:7637');
            timer.start = Date.now();
            __$coverCall('webdocs/test/src/lib/core.js', '7641:7653');
            return timer;
        };
        __$coverCall('webdocs/test/src/lib/core.js', '7755:8054');
        logger.prototype.timerEnd = function (timer) {
            __$coverCall('webdocs/test/src/lib/core.js', '7822:8050');
            if (typeof timer === 'object') {
                __$coverCall('webdocs/test/src/lib/core.js', '7858:7881');
                timer.stop = Date.now();
                __$coverCall('webdocs/test/src/lib/core.js', '7886:7969');
                this.log('Timer ' + timer.name + ' runs: ', getHumanTime(Date.now() - timer.start));
            } else {
                __$coverCall('webdocs/test/src/lib/core.js', '7987:8046');
                this.warn('Not a timer object in logger.timerEnd()', timer);
            }
        };
        __$coverCall('webdocs/test/src/lib/core.js', '8060:8073');
        return logger;
    }();
__$coverCall('webdocs/test/src/lib/core.js', '8193:10120');
var CoreUtil = function ($) {
        __$coverCall('webdocs/test/src/lib/core.js', '8225:8274');
        var util = {
                name: 'CoreUtil',
                debug: true
            };
        __$coverCall('webdocs/test/src/lib/core.js', '8415:8845');
        util.serializeForm = function (selector) {
            __$coverCall('webdocs/test/src/lib/core.js', '8459:8507');
            var formData = {}, formSelector = $(selector);
            __$coverCall('webdocs/test/src/lib/core.js', '8512:8622');
            if (formSelector.get(0).tagName === 'INPUT') {
            } else {
                __$coverCall('webdocs/test/src/lib/core.js', '8576:8618');
                formSelector = formSelector.find(':input');
            }
            __$coverCall('webdocs/test/src/lib/core.js', '8627:8723');
            formSelector.serializeArray().forEach(function (item) {
                __$coverCall('webdocs/test/src/lib/core.js', '8685:8717');
                formData[item.name] = item.value;
            });
            __$coverCall('webdocs/test/src/lib/core.js', '8728:8821');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core.js', '8749:8817');
                console.log('Akonda Core - Serialize form:', formSelector, formData);
            }
            __$coverCall('webdocs/test/src/lib/core.js', '8826:8841');
            return formData;
        };
        __$coverCall('webdocs/test/src/lib/core.js', '9197:9574');
        util.checkLength = function (input, min, max) {
            __$coverCall('webdocs/test/src/lib/core.js', '9246:9570');
            if (typeof input === 'Number') {
                __$coverCall('webdocs/test/src/lib/core.js', '9282:9390');
                if (input < min) {
                    __$coverCall('webdocs/test/src/lib/core.js', '9305:9326');
                    return 'num-to-small';
                } else if (input > max) {
                    __$coverCall('webdocs/test/src/lib/core.js', '9364:9385');
                    return 'num-to-large';
                }
            } else {
                __$coverCall('webdocs/test/src/lib/core.js', '9408:9440');
                console.log(input, input.length);
                __$coverCall('webdocs/test/src/lib/core.js', '9445:9566');
                if (input.length < min) {
                    __$coverCall('webdocs/test/src/lib/core.js', '9475:9496');
                    return 'str-to-short';
                } else if (input.length > max) {
                    __$coverCall('webdocs/test/src/lib/core.js', '9541:9561');
                    return 'str-to-long';
                }
            }
        };
        __$coverCall('webdocs/test/src/lib/core.js', '9775:9872');
        util.checkEqual = function (str1, str2) {
            __$coverCall('webdocs/test/src/lib/core.js', '9818:9868');
            if (str1 !== str2) {
                __$coverCall('webdocs/test/src/lib/core.js', '9842:9864');
                return 'str-not-equal';
            }
        };
        __$coverCall('webdocs/test/src/lib/core.js', '9975:10092');
        util.checkEmail = function (email) {
            __$coverCall('webdocs/test/src/lib/core.js', '10013:10088');
            if (!/^\S+\@\S+\.[a-z]{2,10}$/.test(email)) {
                __$coverCall('webdocs/test/src/lib/core.js', '10062:10084');
                return 'invalid-email';
            }
        };
        __$coverCall('webdocs/test/src/lib/core.js', '10096:10107');
        return util;
    }(jQuery);