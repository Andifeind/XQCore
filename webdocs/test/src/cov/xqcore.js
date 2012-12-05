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
__$coverInit("webdocs/test/src/lib/xqcore.js", "var XQCore = {\n\tversion: 0.1\n};\n\nXQCore.Presenter = (function() {\n\n\tvar presenter = function(conf) {\n\t\tvar self = this;\n\t\t\n\t\tthis.root = '/';\n\t\tthis.debug = false;\n\t\t\n\t\tconf = conf || {};\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Presenter';\n\t\tthis.eventCallbacks = {};\n\n\t\tthis.log('Initialize presenter with conf:', conf);\n\t\tthis.init();\n\n\t\t//Setup popstate listener\n\t\tif (conf.routes) {\n\t\t\twindow.addEventListener('popstate', function(e) {\n\t\t\t\tself.log('popstate event recived', e);\n\t\t\t\tif (!e.state) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tvar tag = e.state.tag,\n\t\t\t\t\turl = e.state.url;\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tconf[tag].call(self, e.state.data);\n\t\t\t\t}\n\t\t\t}, false);\n\n\t\t\twindow.addEventListener('hashchange', function(e) {\n\t\t\t\tself.log('hashchange event recived', e, location.hash);\n\t\t\t\tvar tag = location.hash.substring(1);\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tself.log('Call func', conf[tag]);\n\t\t\t\t\tconf[tag].call(self);\n\t\t\t\t}\n\t\t\t}, false);\n\t\t}\n\t};\n\n\tpresenter.prototype.init = function() {\n\n\t};\n\n\t/**\n\t * Calling on view init\n\t *\n\t * @param {object} view The initializing view\n\t */\n\tpresenter.prototype.viewInit = function(view) {\n\n\t};\n\n\t/**\n\t * Add a history item to the browser history\n\t */\n\tpresenter.prototype.pushState = function(data, title, url) {\n\t\thistory.pushState(data,title,url);\n\t};\n\n\treturn presenter;\n})();\n\nXQCore.Model = (function(window, document, $, undefined) {\n\tvar model;\n\n\tmodel = function(conf) {\n\t\tif (conf === undefined) {\n\t\t\tconf = {};\n\t\t}\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Model';\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.attributes = {};\n\t\tthis._isValid = false;\n\n\t\tif (conf.validate) {\n\t\t\tthis.validate = function(formData) {\n\t\t\t\tvar result;\n\n\t\t\t\tthis._isValid = false;\n\t\t\t\tresult = conf.validate.call(this, formData);\n\t\t\t\tif (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {\n\t\t\t\t\tthis._isValid = true;\n\t\t\t\t}\n\n\t\t\t\treturn result;\n\t\t\t}.bind(this);\n\t\t}\n\n\t\tthis.init();\n\t};\n\n\tmodel.prototype.init = function() {\n\n\t};\n\n\tmodel.prototype.validate = function() {\n\n\t};\n\n\tmodel.prototype.isValid = function() {\n\t\treturn this._isValid;\n\t};\n\n\t/**\n\t * Set model data\n\t *\n\t * @param {Object or String} data/key\n\t * @param {Object} value Data value\n\t */\n\tmodel.prototype.set = function() {\n\t\tvar newData = {},\n\t\t\tvalidateResult;\n\n\t\tif (typeof arguments[0] === 'object') {\n\t\t\t//Add a dataset\n\t\t\t$.extend(newData, arguments[0]);\n\t\t\tthis.log('Set data', arguments[0]);\n\t\t}\n\t\telse if (typeof arguments[0] === 'string') {\n\t\t\tnewData[arguments[0]] = arguments[1];\n\t\t\tthis.log('Set data', arguments[0], arguments[1]);\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Data are incorrect in model.set()', arguments);\n\t\t}\n\n\t\tif (this.validate) {\n\t\t\tvalidateResult = this.validate(newData);\n\t\t\tif (validateResult) {\n\t\t\t\tthis.warn('Validate error in model.set', validateResult);\n\t\t\t\treturn validateResult;\n\t\t\t}\n\t\t}\n\n\t\t$.extend(this.attributes, newData);\n\t};\n\n\t/**\n\t * Get one or all attributes from model\n\t *\n\t * @param  {String} key Data key\n\t *\n\t * @return {Object}     Model dataset\n\t */\n\tmodel.prototype.get = function(key) {\n\t\tif (key === undefined) {\n\t\t\treturn this.attributes;\n\t\t}\n\t\telse {\n\t\t\treturn this.attributes[key];\n\t\t}\n\t};\n\n\t/**\n\t * Check wether model has a dataset\n\t *\n\t * @param {String} key Dataset key\n\t * @return {Boolean} Returns true if model has a dataset with key\n\t */\n\tmodel.prototype.has = function(key) {\n\t\treturn !!this.attributes[key];\n\t};\n\n\t/**\n\t * Remove all data from model\n\t */\n\tmodel.prototype.reset = function() {\n\t\tthis.log('Reset model');\n\t\tthis.attributes = {};\n\t};\n\n\t/**\n\t * Send an ajax request to a webserver. Sends all models attributes\n\t *\n\t * You must set the server URI first with model.server = 'http://example.com/post'\n\t *\n\t * @param {String} Method send method, GET, POST, PUT, DELETE (default POST)\n\t * @param {Function} callback Calls callback(err, data, status, jqXHR) if response was receiving\n\t */\n\tmodel.prototype.send = function(method, callback) {\n\t\tvar data;\n\n\t\tmethod = method || 'POST';\n\n\t\tdata = this.get();\n\n\t\tif (!this.server) {\n\t\t\tthis.error('Can not send an ajax request! You must define a server URL first.');\n\t\t\treturn false;\n\t\t}\n\n\t\tthis.log('Sending an ajax call to ', this.server, 'with data: ', data);\n\n\t\t$.ajax({\n\t\t\turl: this.server,\n\t\t\tmethod: method,\n\t\t\tdata: data,\n\t\t\tsuccess: function(data, status, jqXHR) {\n\t\t\t\tcallback.call(this, null, data, status, jqXHR);\n\t\t\t}.bind(this),\n\t\t\terror: function(jqXHR, status, error) {\n\t\t\t\tcallback.call(this, {\n\t\t\t\t\ttype: status,\n\t\t\t\t\thttp: error\n\t\t\t\t}, null, status, jqXHR);\n\t\t\t}.bind(this)\n\t\t});\n\t};\n\n\treturn model;\n})(window, document, jQuery);\n\nXQCore.View = (function() {\n\n\tvar view = function(presenter, conf) {\n\t\tvar self = this;\n\n\t\tconf = conf || {\n\t\t\tevents: null\n\t\t};\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'View';\n\t\tthis.presenter = presenter;\n\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.container = $(conf.container);\n\t\tif (this.container.length > 0) {\n\t\t\twindow.addEventListener('resize', function(e) {\n\t\t\t\tself.resize(e);\n\t\t\t}, false);\n\n\t\t\tthis.log('Initialize view with conf:', conf);\n\t\t\tthis.log('  ... using Presenter:', this.presenter.name);\n\t\t\tthis.log('  ... using Container:', this.container);\n\n\t\t\t//Send events to presenter\n\t\t\tif (this.events) {\n\t\t\t\tObject.keys(this.events).forEach(function(key) {\n\t\t\t\t\tvar split = key.split(' ', 2),\n\t\t\t\t\t\teventFunc,\n\t\t\t\t\t\teventName = split[0],\n\t\t\t\t\t\tselector = split[1] || null,\n\t\t\t\t\t\tself = this;\n\n\t\t\t\t\tif (split.length === 1 || split.length === 2) {\n\t\t\t\t\t\teventFunc = this.presenter.events[this.events[key]];\n\t\t\t\t\t\tif (typeof eventFunc === 'function') {\n\t\t\t\t\t\t\t//Register event listener\n\t\t\t\t\t\t\tthis.container.on(eventName, function(e) {\n\t\t\t\t\t\t\t\tvar formData = null,\n\t\t\t\t\t\t\t\t\ttagData = null;\n\n\t\t\t\t\t\t\t\tif (e.type === 'submit') {\n\t\t\t\t\t\t\t\t\tformData = XQCore.Util.serializeForm(e.target);\n\t\t\t\t\t\t\t\t\ttagData = $(e.target).data();\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\teventFunc.call(self.presenter, e, tagData, formData);\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\tthis.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);\n\t\t\t\t\t\t}\n\t\t\t\t\t\telse {\n\t\t\t\t\t\t\tthis.warn('Event handler callback not defined in Presenter:', this.events[key]);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\telse {\n\t\t\t\t\t\tthis.warn('Incorect event configuration', key);\n\t\t\t\t\t}\n\t\t\t\t}, this);\n\t\t\t} else {\n\t\t\t\tthis.warn('No view events defined');\n\t\t\t}\n\n\t\t\t//Self init\n\t\t\tthis.init();\n\n\t\t\t//Call presenter.initView()\n\t\t\tthis.presenter.viewInit(this);\n\t\t}\n\t\telse {\n\t\t\tthis.error('Can\\'t initialize View, Container not found!', this.container);\n\t\t}\n\t};\n\n\tview.prototype.init = function() {\n\n\t};\n\n\tview.prototype.show = function() {\n\t\t\n\t};\n\n\tview.prototype.hide = function() {\n\t\t\n\t};\n\n\tview.prototype.render = function(data) {\n\t\tthis.log('Render view template', this.template, 'with data:', data);\n\t\tvar template = Handlebars.compile(this.template);\n\t\tthis.container.html(template(data));\n\t};\n\n\tview.prototype.resize = function() {\n\t\t\n\t};\n\n\n\n\treturn view;\n})();\n\nXQCore.Event = (function() {\n\tvar ee,\n\t\tevent;\n\t\n\tfunction indexOf(eventName, callback) {\n\t\tthis.objectName = 'XQCore.Event';\n\t\t\n\t\tvar len = this.store.length,\n\t\t\ti = 0,\n\t\t\tel;\n\n\t\tfor (; i < len; i++) {\n\t\t\tel = this.store[i];\n\t\t\tif (eventName === null || eventName === el.event && callback === null || callback === el.callback) {\n\t\t\t\treturn el;\n\t\t\t}\n\t\t}\n\n\t\treturn null;\n\t}\n\n\n\tevent = function(conf) {\n\t\tthis.store = [];\n\t};\n\n\t// event.prototype.on = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.once = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.emit = function(eventName, data) {\n\n\t// };\n\n\t// event.prototype.remove = function(eventName, callback) {\n\n\t// };\n\n\tee = new EventEmitter();\n\tevent.prototype.emit = function(eventName, data) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Emit event', eventName, data);\n\t\t}\n\t\treturn ee.emitEvent(eventName, [data]);\n\t};\n\n\tevent.prototype.on = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Add listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, listener);\n\t};\n\n\tevent.prototype.once = function(eventName, listener) {\n\t\tvar onceListener = function() {\n\t\t\tee.removeListener(eventName, listener);\n\t\t\tlistener.call(null, arguments);\n\t\t\treturn true;\n\t\t};\n\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Add once listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, onceListener);\n\t};\n\n\tevent.prototype.off = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Remove listener', eventName, listener);\n\t\t}\n\n\t\tif (listener === undefined) {\n\t\t\treturn ee.removeEvent(eventName);\n\t\t}\n\t\telse {\n\t\t\treturn ee.removeListener(eventName, listener);\n\t\t}\n\t};\n\n\treturn event;\n})();\n\nXQCore.Logger = (function(conf) {\n\n\t//var timerStore = {};\n\n\tfunction getHumanTime(time) {\n\t\tif (time < 1000) {\n\t\t\treturn time + ' ms';\n\t\t}\n\t\telse if (time < 60000) {\n\t\t\treturn (Math.round(time / 100) / 10) + ' sec';\n\t\t}\n\t\telse {\n\t\t\treturn (Math.round(time / 60000)) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';\n\t\t}\n\t}\n\n\tfunction onScreenConsole() {\n\t\tvar conf,\n\t\t\thtml;\n\n\t\tconf = localStorage.get('xqcore-onscreen-console') || {\n\t\t\tpos: 'bottom'\n\t\t};\n\n\t\thtml = '<div id=\"XQCoreLogger-OnScreenConsole\">\\\n\t\t\t</div>';\n\t}\n\n\t/**\n\t * XQCore Logger is a logging tool to log messages, warnings, errors to the browser or onscreen console\n\t *\n\t * @return {[type]} [description]\n\t */\n\tvar logger = function() {\n\t\t\n\t};\n\n\t/**\n\t * Loggs a message to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.log = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.log.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Loggs a warning to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.warn = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.warn.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Loggs a error message to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.error = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.error.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Start a timeTracer\n\t *\n\t * @param {String} timerName Set the name for your (Optional)\n\t * @return {Object} Returns a TimerObject\n\t */\n\tlogger.prototype.timer = function(name) {\n\t\tvar timer = {\n\t\t\tstart: null,\n\t\t\tstop: null,\n\t\t\tname: name,\n\t\t\tlogger: this,\n\t\t\tend: function() {\n\t\t\t\tthis.stop = Date.now();\n\t\t\t\tthis.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));\n\t\t\t}\n\t\t};\n\n\t\t/*if (name) {\n\t\t\tthis.timerStore[name] = timer;\n\t\t}*/\n\n\t\tthis.log('Start Timer', name);\n\n\t\t//Set timer start time\n\t\ttimer.start = Date.now();\n\t\treturn timer;\n\t};\n\n\t/**\n\t * Stops a timer\n\t *\n\t * @param {String or Object} timerName Stops the given timer\n\t */\n\tlogger.prototype.timerEnd = function(timer) {\n\t\t//Set stop timer\n\t\t\n\t};\n\n\tlogger.prototype.__scope = {\n\t\tgetHumanTime: getHumanTime\n\t};\n\t\n\n\treturn logger;\n})();\n/**\n * A bunch of helpfull functions\n *\n * @return {Object} Returns a singelton object instance of XQCore.Util\n */\nXQCore.Util = (function($) {\n\n\tvar util = {\n\t\tname: 'XQCore.Util',\n\t\tdebug: true\n\t};\n\n\t/**\n\t * Serialize a form and return its values as JSON\n\t *\n\t * @param {Object} Form selector\n\t * @return {Object} FormData as JSON\n\t */\n\tutil.serializeForm = function(selector) {\n\t\tvar formData = {},\n\t\t\tformSelector = $(selector);\n\n\t\tif (formSelector.get(0).tagName === 'INPUT') {\n\n\t\t}\n\t\telse {\n\t\t\tformSelector = formSelector.find(':input');\n\t\t}\n\n\t\tformSelector.serializeArray().forEach(function(item) {\n\t\t\tformData[item.name] = item.value;\n\t\t});\n\n\t\tif (this.debug) {\n\t\t\tconsole.log('XQCore - Serialize form:', formSelector, formData);\n\t\t}\n\n\t\treturn formData;\n\t};\n\n\t/**\n\t * Check length of a string or number\n\t *\n\t * @param {String or Number} input this will be checked\n\t * @param {Number} min String can't be shorter than n, Number can't be lower than n\n\t * @param {Number} max String can't be longer than n, Number can't be greater than n\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkLength = function(input, min, max) {\n\t\tif (typeof input === 'Number') {\n\t\t\tif (input < min) {\n\t\t\t\treturn 'num-to-small';\n\t\t\t}\n\t\t\telse if (input > max) {\n\t\t\t\treturn 'num-to-large';\n\t\t\t}\n\t\t}\n\t\telse {\n\t\t\tconsole.log(input, input.length);\n\t\t\tif (input.length < min) {\n\t\t\t\treturn 'str-to-short';\n\t\t\t}\n\t\t\telse if (input.length > max) {\n\t\t\t\treturn 'str-to-long';\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\t * Checks the equality of two strings\n\t *\n\t * @param {String} str1 First string\n\t * @param {String} str2 Second string\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkEqual = function(str1, str2) {\n\t\tif (str1 !== str2) {\n\t\t\treturn 'str-not-equal';\n\t\t}\n\t};\n\n\t/**\n\t * Checks the validity of an email address\n\t *\n\t * @param {String} email e-Mail address\n\t */\n\tutil.checkEmail = function(email) {\n\t\tif (!/^\\S+\\@\\S+\\.[a-z]{2,10}$/.test(email)) {\n\t\t\treturn 'invalid-email';\n\t\t}\n\t};\n\n\treturn util;\n\n})(jQuery);");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "0:30");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "33:1416");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1419:4739");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4742:7102");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7105:8843");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8846:11340");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11457:13381");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "68:1042");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1046:1089");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1179:1230");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1290:1390");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1394:1410");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "103:118");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "125:140");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "144:162");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "169:186");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "191:252");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "256:307");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "311:335");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "340:389");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "393:404");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "437:1038");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "459:746");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "752:1034");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "513:550");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "556:589");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "596:641");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "648:732");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "577:583");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "692:726");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "808:862");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "868:904");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "911:1020");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "955:987");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "994:1014");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1353:1386");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1479:1488");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1492:2101");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2105:2144");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2148:2191");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2195:2260");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2373:3040");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3176:3319");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3477:3550");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3595:3685");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4036:4693");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4697:4709");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1519:1561");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1566:1627");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1631:1678");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1682:1714");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1718:1738");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1742:1763");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1768:2081");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2086:2097");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1548:1557");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1792:2077");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1833:1843");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1850:1871");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1877:1920");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1926:2040");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2047:2060");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2014:2034");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2236:2256");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2410:2445");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2450:2806");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2811:2997");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3002:3036");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2512:2543");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2548:2582");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2638:2674");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2679:2727");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2745:2802");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2835:2874");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2879:2993");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2905:2961");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2967:2988");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3216:3315");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3244:3266");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3284:3311");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3517:3546");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3634:3657");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3661:3681");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4090:4098");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4103:4128");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4133:4150");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4155:4278");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4283:4353");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4358:4689");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4178:4257");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4262:4274");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4470:4516");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4582:4667");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4772:6694");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6698:6736");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6740:6780");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6784:6824");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6828:7033");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7037:7079");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7085:7096");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4813:4828");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4833:4869");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4874:4935");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4939:4985");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4989:5015");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5020:5052");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5056:5090");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5094:6690");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5130:5210");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5216:5260");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5265:5320");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5325:5375");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5411:6496");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6517:6528");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6565:6594");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5182:5196");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5434:6438");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5488:5616");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5624:6424");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5678:5729");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5737:6344");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5816:6127");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6136:6227");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5867:5911");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5922:6053");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6064:6116");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5958:6004");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6015:6043");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6257:6336");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6371:6417");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6456:6491");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6612:6686");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6871:6938");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6942:6990");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6994:7029");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7135:7150");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7155:7476");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7481:7527");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7799:7822");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7825:8002");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8006:8195");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8199:8533");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8537:8821");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8825:8837");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7197:7229");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7236:7280");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7285:7457");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7462:7473");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7311:7329");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7334:7453");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7439:7448");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7508:7523");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7878:7956");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7960:7998");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7899:7952");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8061:8145");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8149:8191");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8082:8141");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8256:8385");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8390:8479");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8483:8529");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8291:8329");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8334:8364");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8369:8380");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8411:8475");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8593:8680");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8685:8817");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8614:8676");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8718:8750");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8768:8813");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8907:9172");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9176:9372");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9530:9561");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9669:9870");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9978:10181");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10295:10500");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10647:11083");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11181:11251");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11255:11315");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11321:11334");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8939:9169");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8961:8980");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9016:9061");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9079:9165");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9207:9224");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9229:9305");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9310:9369");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9707:9715");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9720:9866");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9741:9785");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9790:9825");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9830:9862");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10017:10025");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10030:10177");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10051:10095");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10100:10135");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10140:10173");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10335:10343");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10348:10496");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10369:10413");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10418:10453");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10458:10492");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10691:10918");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10980:11009");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11039:11063");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11067:11079");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10793:10815");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10821:10908");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11488:11540");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11681:12106");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12458:12835");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13036:13133");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13236:13353");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13357:13368");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11725:11773");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11778:11888");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11893:11989");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11994:12082");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12087:12102");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11842:11884");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11951:11983");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12015:12078");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12507:12831");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12543:12651");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12566:12587");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12625:12646");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12669:12701");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12706:12827");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12736:12757");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12802:12822");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13079:13129");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13103:13125");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13274:13349");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13323:13345");
__$coverCall('webdocs/test/src/lib/xqcore.js', '0:30');
var XQCore = { version: 0.1 };
__$coverCall('webdocs/test/src/lib/xqcore.js', '33:1416');
XQCore.Presenter = function () {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '68:1042');
    var presenter = function (conf) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '103:118');
        var self = this;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '125:140');
        this.root = '/';
        __$coverCall('webdocs/test/src/lib/xqcore.js', '144:162');
        this.debug = false;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '169:186');
        conf = conf || {};
        __$coverCall('webdocs/test/src/lib/xqcore.js', '191:252');
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverCall('webdocs/test/src/lib/xqcore.js', '256:307');
        this.name = (conf.name || 'Nameless') + 'Presenter';
        __$coverCall('webdocs/test/src/lib/xqcore.js', '311:335');
        this.eventCallbacks = {};
        __$coverCall('webdocs/test/src/lib/xqcore.js', '340:389');
        this.log('Initialize presenter with conf:', conf);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '393:404');
        this.init();
        __$coverCall('webdocs/test/src/lib/xqcore.js', '437:1038');
        if (conf.routes) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '459:746');
            window.addEventListener('popstate', function (e) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '513:550');
                self.log('popstate event recived', e);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '556:589');
                if (!e.state) {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '577:583');
                    return;
                }
                __$coverCall('webdocs/test/src/lib/xqcore.js', '596:641');
                var tag = e.state.tag, url = e.state.url;
                __$coverCall('webdocs/test/src/lib/xqcore.js', '648:732');
                if (typeof conf[tag] === 'function') {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '692:726');
                    conf[tag].call(self, e.state.data);
                }
            }, false);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '752:1034');
            window.addEventListener('hashchange', function (e) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '808:862');
                self.log('hashchange event recived', e, location.hash);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '868:904');
                var tag = location.hash.substring(1);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '911:1020');
                if (typeof conf[tag] === 'function') {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '955:987');
                    self.log('Call func', conf[tag]);
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '994:1014');
                    conf[tag].call(self);
                }
            }, false);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '1046:1089');
    presenter.prototype.init = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '1179:1230');
    presenter.prototype.viewInit = function (view) {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '1290:1390');
    presenter.prototype.pushState = function (data, title, url) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '1353:1386');
        history.pushState(data, title, url);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '1394:1410');
    return presenter;
}();
__$coverCall('webdocs/test/src/lib/xqcore.js', '1419:4739');
XQCore.Model = function (window, document, $, undefined) {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '1479:1488');
    var model;
    __$coverCall('webdocs/test/src/lib/xqcore.js', '1492:2101');
    model = function (conf) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '1519:1561');
        if (conf === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '1548:1557');
            conf = {};
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '1566:1627');
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverCall('webdocs/test/src/lib/xqcore.js', '1631:1678');
        this.name = (conf.name || 'Nameless') + 'Model';
        __$coverCall('webdocs/test/src/lib/xqcore.js', '1682:1714');
        this.debug = Boolean(conf.debug);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '1718:1738');
        this.attributes = {};
        __$coverCall('webdocs/test/src/lib/xqcore.js', '1742:1763');
        this._isValid = false;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '1768:2081');
        if (conf.validate) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '1792:2077');
            this.validate = function (formData) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '1833:1843');
                var result;
                __$coverCall('webdocs/test/src/lib/xqcore.js', '1850:1871');
                this._isValid = false;
                __$coverCall('webdocs/test/src/lib/xqcore.js', '1877:1920');
                result = conf.validate.call(this, formData);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '1926:2040');
                if (!result || typeof result === 'object' && Object.keys(result).length === 0) {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '2014:2034');
                    this._isValid = true;
                }
                __$coverCall('webdocs/test/src/lib/xqcore.js', '2047:2060');
                return result;
            }.bind(this);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2086:2097');
        this.init();
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '2105:2144');
    model.prototype.init = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '2148:2191');
    model.prototype.validate = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '2195:2260');
    model.prototype.isValid = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2236:2256');
        return this._isValid;
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '2373:3040');
    model.prototype.set = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2410:2445');
        var newData = {}, validateResult;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2450:2806');
        if (typeof arguments[0] === 'object') {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '2512:2543');
            $.extend(newData, arguments[0]);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '2548:2582');
            this.log('Set data', arguments[0]);
        } else if (typeof arguments[0] === 'string') {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '2638:2674');
            newData[arguments[0]] = arguments[1];
            __$coverCall('webdocs/test/src/lib/xqcore.js', '2679:2727');
            this.log('Set data', arguments[0], arguments[1]);
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '2745:2802');
            this.warn('Data are incorrect in model.set()', arguments);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2811:2997');
        if (this.validate) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '2835:2874');
            validateResult = this.validate(newData);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '2879:2993');
            if (validateResult) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '2905:2961');
                this.warn('Validate error in model.set', validateResult);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '2967:2988');
                return validateResult;
            }
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '3002:3036');
        $.extend(this.attributes, newData);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '3176:3319');
    model.prototype.get = function (key) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '3216:3315');
        if (key === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '3244:3266');
            return this.attributes;
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '3284:3311');
            return this.attributes[key];
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '3477:3550');
    model.prototype.has = function (key) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '3517:3546');
        return !!this.attributes[key];
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '3595:3685');
    model.prototype.reset = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '3634:3657');
        this.log('Reset model');
        __$coverCall('webdocs/test/src/lib/xqcore.js', '3661:3681');
        this.attributes = {};
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '4036:4693');
    model.prototype.send = function (method, callback) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4090:4098');
        var data;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4103:4128');
        method = method || 'POST';
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4133:4150');
        data = this.get();
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4155:4278');
        if (!this.server) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '4178:4257');
            this.error('Can not send an ajax request! You must define a server URL first.');
            __$coverCall('webdocs/test/src/lib/xqcore.js', '4262:4274');
            return false;
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4283:4353');
        this.log('Sending an ajax call to ', this.server, 'with data: ', data);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4358:4689');
        $.ajax({
            url: this.server,
            method: method,
            data: data,
            success: function (data, status, jqXHR) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '4470:4516');
                callback.call(this, null, data, status, jqXHR);
            }.bind(this),
            error: function (jqXHR, status, error) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '4582:4667');
                callback.call(this, {
                    type: status,
                    http: error
                }, null, status, jqXHR);
            }.bind(this)
        });
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '4697:4709');
    return model;
}(window, document, jQuery);
__$coverCall('webdocs/test/src/lib/xqcore.js', '4742:7102');
XQCore.View = function () {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '4772:6694');
    var view = function (presenter, conf) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4813:4828');
        var self = this;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4833:4869');
        conf = conf || { events: null };
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4874:4935');
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4939:4985');
        this.name = (conf.name || 'Nameless') + 'View';
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4989:5015');
        this.presenter = presenter;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '5020:5052');
        this.debug = Boolean(conf.debug);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '5056:5090');
        this.container = $(conf.container);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '5094:6690');
        if (this.container.length > 0) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '5130:5210');
            window.addEventListener('resize', function (e) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '5182:5196');
                self.resize(e);
            }, false);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '5216:5260');
            this.log('Initialize view with conf:', conf);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '5265:5320');
            this.log('  ... using Presenter:', this.presenter.name);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '5325:5375');
            this.log('  ... using Container:', this.container);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '5411:6496');
            if (this.events) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '5434:6438');
                Object.keys(this.events).forEach(function (key) {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '5488:5616');
                    var split = key.split(' ', 2), eventFunc, eventName = split[0], selector = split[1] || null, self = this;
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '5624:6424');
                    if (split.length === 1 || split.length === 2) {
                        __$coverCall('webdocs/test/src/lib/xqcore.js', '5678:5729');
                        eventFunc = this.presenter.events[this.events[key]];
                        __$coverCall('webdocs/test/src/lib/xqcore.js', '5737:6344');
                        if (typeof eventFunc === 'function') {
                            __$coverCall('webdocs/test/src/lib/xqcore.js', '5816:6127');
                            this.container.on(eventName, function (e) {
                                __$coverCall('webdocs/test/src/lib/xqcore.js', '5867:5911');
                                var formData = null, tagData = null;
                                __$coverCall('webdocs/test/src/lib/xqcore.js', '5922:6053');
                                if (e.type === 'submit') {
                                    __$coverCall('webdocs/test/src/lib/xqcore.js', '5958:6004');
                                    formData = XQCore.Util.serializeForm(e.target);
                                    __$coverCall('webdocs/test/src/lib/xqcore.js', '6015:6043');
                                    tagData = $(e.target).data();
                                }
                                __$coverCall('webdocs/test/src/lib/xqcore.js', '6064:6116');
                                eventFunc.call(self.presenter, e, tagData, formData);
                            });
                            __$coverCall('webdocs/test/src/lib/xqcore.js', '6136:6227');
                            this.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);
                        } else {
                            __$coverCall('webdocs/test/src/lib/xqcore.js', '6257:6336');
                            this.warn('Event handler callback not defined in Presenter:', this.events[key]);
                        }
                    } else {
                        __$coverCall('webdocs/test/src/lib/xqcore.js', '6371:6417');
                        this.warn('Incorect event configuration', key);
                    }
                }, this);
            } else {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '6456:6491');
                this.warn('No view events defined');
            }
            __$coverCall('webdocs/test/src/lib/xqcore.js', '6517:6528');
            this.init();
            __$coverCall('webdocs/test/src/lib/xqcore.js', '6565:6594');
            this.presenter.viewInit(this);
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '6612:6686');
            this.error('Can\'t initialize View, Container not found!', this.container);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '6698:6736');
    view.prototype.init = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '6740:6780');
    view.prototype.show = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '6784:6824');
    view.prototype.hide = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '6828:7033');
    view.prototype.render = function (data) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '6871:6938');
        this.log('Render view template', this.template, 'with data:', data);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '6942:6990');
        var template = Handlebars.compile(this.template);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '6994:7029');
        this.container.html(template(data));
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '7037:7079');
    view.prototype.resize = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '7085:7096');
    return view;
}();
__$coverCall('webdocs/test/src/lib/xqcore.js', '7105:8843');
XQCore.Event = function () {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '7135:7150');
    var ee, event;
    __$coverCall('webdocs/test/src/lib/xqcore.js', '7155:7476');
    function indexOf(eventName, callback) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7197:7229');
        this.objectName = 'XQCore.Event';
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7236:7280');
        var len = this.store.length, i = 0, el;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7285:7457');
        for (; i < len; i++) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '7311:7329');
            el = this.store[i];
            __$coverCall('webdocs/test/src/lib/xqcore.js', '7334:7453');
            if (eventName === null || eventName === el.event && callback === null || callback === el.callback) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '7439:7448');
                return el;
            }
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7462:7473');
        return null;
    }
    __$coverCall('webdocs/test/src/lib/xqcore.js', '7481:7527');
    event = function (conf) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7508:7523');
        this.store = [];
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '7799:7822');
    ee = new EventEmitter();
    __$coverCall('webdocs/test/src/lib/xqcore.js', '7825:8002');
    event.prototype.emit = function (eventName, data) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7878:7956');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '7899:7952');
            console.debug('XQCore - Emit event', eventName, data);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7960:7998');
        return ee.emitEvent(eventName, [data]);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '8006:8195');
    event.prototype.on = function (eventName, listener) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '8061:8145');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '8082:8141');
            console.debug('XQCore - Add listener', eventName, listener);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '8149:8191');
        return ee.addListener(eventName, listener);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '8199:8533');
    event.prototype.once = function (eventName, listener) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '8256:8385');
        var onceListener = function () {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '8291:8329');
            ee.removeListener(eventName, listener);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '8334:8364');
            listener.call(null, arguments);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '8369:8380');
            return true;
        };
        __$coverCall('webdocs/test/src/lib/xqcore.js', '8390:8479');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '8411:8475');
            console.debug('XQCore - Add once listener', eventName, listener);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '8483:8529');
        return ee.addListener(eventName, onceListener);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '8537:8821');
    event.prototype.off = function (eventName, listener) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '8593:8680');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '8614:8676');
            console.debug('XQCore - Remove listener', eventName, listener);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '8685:8817');
        if (listener === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '8718:8750');
            return ee.removeEvent(eventName);
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '8768:8813');
            return ee.removeListener(eventName, listener);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '8825:8837');
    return event;
}();
__$coverCall('webdocs/test/src/lib/xqcore.js', '8846:11340');
XQCore.Logger = function (conf) {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '8907:9172');
    function getHumanTime(time) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '8939:9169');
        if (time < 1000) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '8961:8980');
            return time + ' ms';
        } else if (time < 60000) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '9016:9061');
            return Math.round(time / 100) / 10 + ' sec';
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '9079:9165');
            return Math.round(time / 60000) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';
        }
    }
    __$coverCall('webdocs/test/src/lib/xqcore.js', '9176:9372');
    function onScreenConsole() {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '9207:9224');
        var conf, html;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '9229:9305');
        conf = localStorage.get('xqcore-onscreen-console') || { pos: 'bottom' };
        __$coverCall('webdocs/test/src/lib/xqcore.js', '9310:9369');
        html = '<div id="XQCoreLogger-OnScreenConsole">\t\t\t</div>';
    }
    __$coverCall('webdocs/test/src/lib/xqcore.js', '9530:9561');
    var logger = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '9669:9870');
    logger.prototype.log = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '9707:9715');
        var args;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '9720:9866');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '9741:9785');
            args = Array.prototype.slice.call(arguments);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '9790:9825');
            args.unshift('[' + this.name + ']');
            __$coverCall('webdocs/test/src/lib/xqcore.js', '9830:9862');
            console.log.apply(console, args);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '9978:10181');
    logger.prototype.warn = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '10017:10025');
        var args;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '10030:10177');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '10051:10095');
            args = Array.prototype.slice.call(arguments);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '10100:10135');
            args.unshift('[' + this.name + ']');
            __$coverCall('webdocs/test/src/lib/xqcore.js', '10140:10173');
            console.warn.apply(console, args);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '10295:10500');
    logger.prototype.error = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '10335:10343');
        var args;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '10348:10496');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '10369:10413');
            args = Array.prototype.slice.call(arguments);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '10418:10453');
            args.unshift('[' + this.name + ']');
            __$coverCall('webdocs/test/src/lib/xqcore.js', '10458:10492');
            console.error.apply(console, args);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '10647:11083');
    logger.prototype.timer = function (name) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '10691:10918');
        var timer = {
                start: null,
                stop: null,
                name: name,
                logger: this,
                end: function () {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '10793:10815');
                    this.stop = Date.now();
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '10821:10908');
                    this.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));
                }
            };
        __$coverCall('webdocs/test/src/lib/xqcore.js', '10980:11009');
        this.log('Start Timer', name);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '11039:11063');
        timer.start = Date.now();
        __$coverCall('webdocs/test/src/lib/xqcore.js', '11067:11079');
        return timer;
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '11181:11251');
    logger.prototype.timerEnd = function (timer) {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '11255:11315');
    logger.prototype.__scope = { getHumanTime: getHumanTime };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '11321:11334');
    return logger;
}();
__$coverCall('webdocs/test/src/lib/xqcore.js', '11457:13381');
XQCore.Util = function ($) {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '11488:11540');
    var util = {
            name: 'XQCore.Util',
            debug: true
        };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '11681:12106');
    util.serializeForm = function (selector) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '11725:11773');
        var formData = {}, formSelector = $(selector);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '11778:11888');
        if (formSelector.get(0).tagName === 'INPUT') {
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '11842:11884');
            formSelector = formSelector.find(':input');
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '11893:11989');
        formSelector.serializeArray().forEach(function (item) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '11951:11983');
            formData[item.name] = item.value;
        });
        __$coverCall('webdocs/test/src/lib/xqcore.js', '11994:12082');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '12015:12078');
            console.log('XQCore - Serialize form:', formSelector, formData);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '12087:12102');
        return formData;
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '12458:12835');
    util.checkLength = function (input, min, max) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '12507:12831');
        if (typeof input === 'Number') {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '12543:12651');
            if (input < min) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '12566:12587');
                return 'num-to-small';
            } else if (input > max) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '12625:12646');
                return 'num-to-large';
            }
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '12669:12701');
            console.log(input, input.length);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '12706:12827');
            if (input.length < min) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '12736:12757');
                return 'str-to-short';
            } else if (input.length > max) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '12802:12822');
                return 'str-to-long';
            }
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '13036:13133');
    util.checkEqual = function (str1, str2) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '13079:13129');
        if (str1 !== str2) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '13103:13125');
            return 'str-not-equal';
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '13236:13353');
    util.checkEmail = function (email) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '13274:13349');
        if (!/^\S+\@\S+\.[a-z]{2,10}$/.test(email)) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '13323:13345');
            return 'invalid-email';
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '13357:13368');
    return util;
}(jQuery);