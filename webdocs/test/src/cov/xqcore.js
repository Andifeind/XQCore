if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/xqcore.js"] = {};
__$coverObject["webdocs/test/src/lib/xqcore.js"].__code = "var XQCore = {\n\tversion: 0.1\n};\nXQCore.Presenter = (function() {\n\n\tvar presenter = function(conf) {\n\t\tvar self = this;\n\t\t\n\t\tthis.root = '/';\n\t\tthis.debug = false;\n\t\t\n\t\tconf = conf || {};\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Presenter';\n\t\tthis.eventCallbacks = {};\n\n\t\tthis.log('Initialize presenter with conf:', conf);\n\t\tthis.init();\n\n\t\t//Setup popstate listener\n\t\tif (conf.routes) {\n\t\t\twindow.addEventListener('popstate', function(e) {\n\t\t\t\tself.log('popstate event recived', e);\n\t\t\t\tif (!e.state) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tvar tag = e.state.tag,\n\t\t\t\t\turl = e.state.url;\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tconf[tag].call(self, e.state.data);\n\t\t\t\t}\n\t\t\t}, false);\n\n\t\t\twindow.addEventListener('hashchange', function(e) {\n\t\t\t\tself.log('hashchange event recived', e, location.hash);\n\t\t\t\tvar tag = location.hash.substring(1);\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tself.log('Call func', conf[tag]);\n\t\t\t\t\tconf[tag].call(self);\n\t\t\t\t}\n\t\t\t}, false);\n\t\t}\n\t};\n\n\tpresenter.prototype.init = function() {\n\n\t};\n\n\t/**\n\t * Calling on view init\n\t *\n\t * @param {object} view The initializing view\n\t */\n\tpresenter.prototype.viewInit = function(view) {\n\n\t};\n\n\t/**\n\t * Add a history item to the browser history\n\t */\n\tpresenter.prototype.pushState = function(data, title, url) {\n\t\thistory.pushState(data,title,url);\n\t};\n\n\treturn presenter;\n})();\n\nXQCore.Model = (function(window, document, $, undefined) {\n\tvar model;\n\n\tmodel = function(conf) {\n\t\tif (conf === undefined) {\n\t\t\tconf = {};\n\t\t}\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Model';\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.attributes = {};\n\t\tthis._isValid = false;\n\n\t\tif (conf.validate) {\n\t\t\tthis.validate = function(formData) {\n\t\t\t\tvar result;\n\n\t\t\t\tthis._isValid = false;\n\t\t\t\tresult = conf.validate.call(this, formData);\n\t\t\t\tif (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {\n\t\t\t\t\tthis._isValid = true;\n\t\t\t\t}\n\n\t\t\t\treturn result;\n\t\t\t}.bind(this);\n\t\t}\n\n\t\tthis.init();\n\t};\n\n\tmodel.prototype.init = function() {\n\n\t};\n\n\tmodel.prototype.validate = function() {\n\n\t};\n\n\tmodel.prototype.isValid = function() {\n\t\treturn this._isValid;\n\t};\n\n\t/**\n\t * Set model data\n\t *\n\t * @param {Object or String} data/key\n\t * @param {Object} value Data value\n\t */\n\tmodel.prototype.set = function() {\n\t\tvar newData = {},\n\t\t\tvalidateResult;\n\n\t\tif (typeof arguments[0] === 'object') {\n\t\t\t//Add a dataset\n\t\t\t$.extend(newData, arguments[0]);\n\t\t\tthis.log('Set data', arguments[0]);\n\t\t}\n\t\telse if (typeof arguments[0] === 'string') {\n\t\t\tnewData[arguments[0]] = arguments[1];\n\t\t\tthis.log('Set data', arguments[0], arguments[1]);\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Data are incorrect in model.set()', arguments);\n\t\t}\n\n\t\tif (this.validate) {\n\t\t\tvalidateResult = this.validate(newData);\n\t\t\tif (validateResult) {\n\t\t\t\tthis.warn('Validate error in model.set', validateResult);\n\t\t\t\treturn validateResult;\n\t\t\t}\n\t\t}\n\n\t\t$.extend(this.attributes, newData);\n\t};\n\n\t/**\n\t * Get one or all attributes from model\n\t *\n\t * @param  {String} key Data key\n\t *\n\t * @return {Object}     Model dataset\n\t */\n\tmodel.prototype.get = function(key) {\n\t\tif (key === undefined) {\n\t\t\treturn this.attributes;\n\t\t}\n\t\telse {\n\t\t\treturn this.attributes[key];\n\t\t}\n\t};\n\n\t/**\n\t * Check wether model has a dataset\n\t *\n\t * @param {String} key Dataset key\n\t * @return {Boolean} Returns true if model has a dataset with key\n\t */\n\tmodel.prototype.has = function(key) {\n\t\treturn !!this.attributes[key];\n\t};\n\n\t/**\n\t * Remove all data from model\n\t */\n\tmodel.prototype.reset = function() {\n\t\tthis.log('Reset model');\n\t\tthis.attributes = {};\n\t};\n\n\t/**\n\t * Send an ajax request to a webserver. Sends all models attributes\n\t *\n\t * You must set the server URI first with model.server = 'http://example.com/post'\n\t *\n\t * @param {String} Method send method, GET, POST, PUT, DELETE (default POST)\n\t * @param {Function} callback Calls callback(err, data, status, jqXHR) if response was receiving\n\t */\n\tmodel.prototype.send = function(method, callback) {\n\t\tvar data;\n\n\t\tmethod = method || 'POST';\n\n\t\tdata = this.get();\n\n\t\tif (!this.server) {\n\t\t\tthis.error('Can not send an ajax request! You must define a server URL first.');\n\t\t\treturn false;\n\t\t}\n\n\t\tthis.log('Sending an ajax call to ', this.server, 'with data: ', data);\n\n\t\t$.ajax({\n\t\t\turl: this.server,\n\t\t\tmethod: method,\n\t\t\tdata: data,\n\t\t\tsuccess: function(data, status, jqXHR) {\n\t\t\t\tcallback.call(this, null, data, status, jqXHR);\n\t\t\t}.bind(this),\n\t\t\terror: function(jqXHR, status, error) {\n\t\t\t\tcallback.call(this, {\n\t\t\t\t\ttype: status,\n\t\t\t\t\thttp: error\n\t\t\t\t}, null, status, jqXHR);\n\t\t\t}.bind(this)\n\t\t});\n\t};\n\n\treturn model;\n})(window, document, jQuery);\n\nXQCore.View = (function() {\n\n\tvar view = function(presenter, conf) {\n\t\tvar self = this;\n\n\t\tconf = conf || {\n\t\t\tevents: null\n\t\t};\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'View';\n\t\tthis.presenter = presenter;\n\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.container = $(conf.container);\n\t\tif (this.container.length > 0) {\n\t\t\twindow.addEventListener('resize', function(e) {\n\t\t\t\tself.resize(e);\n\t\t\t}, false);\n\n\t\t\tthis.log('Initialize view with conf:', conf);\n\t\t\tthis.log('  ... using Presenter:', this.presenter.name);\n\t\t\tthis.log('  ... using Container:', this.container);\n\n\t\t\t//Send events to presenter\n\t\t\tif (this.events) {\n\t\t\t\tObject.keys(this.events).forEach(function(key) {\n\t\t\t\t\tvar split = key.split(' ', 2),\n\t\t\t\t\t\teventFunc,\n\t\t\t\t\t\teventName = split[0],\n\t\t\t\t\t\tselector = split[1] || null,\n\t\t\t\t\t\tself = this;\n\n\t\t\t\t\tif (split.length === 1 || split.length === 2) {\n\t\t\t\t\t\teventFunc = this.presenter.events[this.events[key]];\n\t\t\t\t\t\tif (typeof eventFunc === 'function') {\n\t\t\t\t\t\t\t//Register event listener\n\t\t\t\t\t\t\tthis.container.on(eventName, function(e) {\n\t\t\t\t\t\t\t\tvar formData = null,\n\t\t\t\t\t\t\t\t\ttagData = null;\n\n\t\t\t\t\t\t\t\tif (e.type === 'submit') {\n\t\t\t\t\t\t\t\t\tformData = XQCore.Util.serializeForm(e.target);\n\t\t\t\t\t\t\t\t\ttagData = $(e.target).data();\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\teventFunc.call(self.presenter, e, tagData, formData);\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\tthis.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);\n\t\t\t\t\t\t}\n\t\t\t\t\t\telse {\n\t\t\t\t\t\t\tthis.warn('Event handler callback not defined in Presenter:', this.events[key]);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\telse {\n\t\t\t\t\t\tthis.warn('Incorect event configuration', key);\n\t\t\t\t\t}\n\t\t\t\t}, this);\n\t\t\t} else {\n\t\t\t\tthis.warn('No view events defined');\n\t\t\t}\n\n\t\t\t//Self init\n\t\t\tthis.init();\n\n\t\t\t//Call presenter.initView()\n\t\t\tthis.presenter.viewInit(this);\n\t\t}\n\t\telse {\n\t\t\tthis.error('Can\\'t initialize View, Container not found!', this.container);\n\t\t}\n\t};\n\n\tview.prototype.init = function() {\n\n\t};\n\n\tview.prototype.show = function() {\n\t\t\n\t};\n\n\tview.prototype.hide = function() {\n\t\t\n\t};\n\n\tview.prototype.render = function(data) {\n\t\tthis.log('Render view template', this.template, 'with data:', data);\n\t\tvar template = Handlebars.compile(this.template);\n\t\tthis.container.html(template(data));\n\t};\n\n\tview.prototype.resize = function() {\n\t\t\n\t};\n\n\n\n\treturn view;\n})();\n\nXQCore.Event = (function() {\n\tvar ee,\n\t\tevent;\n\t\n\tfunction indexOf(eventName, callback) {\n\t\tthis.objectName = 'XQCore.Event';\n\t\t\n\t\tvar len = this.store.length,\n\t\t\ti = 0,\n\t\t\tel;\n\n\t\tfor (; i < len; i++) {\n\t\t\tel = this.store[i];\n\t\t\tif (eventName === null || eventName === el.event && callback === null || callback === el.callback) {\n\t\t\t\treturn el;\n\t\t\t}\n\t\t}\n\n\t\treturn null;\n\t}\n\n\n\tevent = function(conf) {\n\t\tthis.store = [];\n\t};\n\n\t// event.prototype.on = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.once = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.emit = function(eventName, data) {\n\n\t// };\n\n\t// event.prototype.remove = function(eventName, callback) {\n\n\t// };\n\n\tee = new EventEmitter();\n\tevent.prototype.emit = function(eventName, data) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Emit event', eventName, data);\n\t\t}\n\t\treturn ee.emitEvent(eventName, [data]);\n\t};\n\n\tevent.prototype.on = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Add listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, listener);\n\t};\n\n\tevent.prototype.once = function(eventName, listener) {\n\t\tvar onceListener = function() {\n\t\t\tee.removeListener(eventName, listener);\n\t\t\tlistener.call(null, arguments);\n\t\t\treturn true;\n\t\t};\n\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Add once listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, onceListener);\n\t};\n\n\tevent.prototype.off = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Remove listener', eventName, listener);\n\t\t}\n\n\t\tif (listener === undefined) {\n\t\t\treturn ee.removeEvent(eventName);\n\t\t}\n\t\telse {\n\t\t\treturn ee.removeListener(eventName, listener);\n\t\t}\n\t};\n\n\treturn event;\n})();\n\nXQCore.Logger = (function(conf) {\n\n\t//var timerStore = {};\n\n\tfunction getHumanTime(time) {\n\t\tif (time < 1000) {\n\t\t\treturn time + ' ms';\n\t\t}\n\t\telse if (time < 60000) {\n\t\t\treturn (Math.round(time / 100) / 10) + ' sec';\n\t\t}\n\t\telse {\n\t\t\treturn (Math.round(time / 60000)) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';\n\t\t}\n\t}\n\n\tfunction onScreenConsole() {\n\t\tvar conf,\n\t\t\thtml;\n\n\t\tconf = localStorage.get('xqcore-onscreen-console') || {\n\t\t\tpos: 'bottom'\n\t\t};\n\n\t\thtml = '<div id=\"XQCoreLogger-OnScreenConsole\">\\\n\t\t\t</div>';\n\t}\n\n\t/**\n\t * XQCore Logger is a logging tool to log messages, warnings, errors to the browser or onscreen console\n\t *\n\t * @return {[type]} [description]\n\t */\n\tvar logger = function() {\n\t\t\n\t};\n\n\t/**\n\t * Loggs a message to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.log = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.log.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Loggs a warning to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.warn = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.warn.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Loggs a error message to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.error = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.error.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Start a timeTracer\n\t *\n\t * @param {String} timerName Set the name for your (Optional)\n\t * @return {Object} Returns a TimerObject\n\t */\n\tlogger.prototype.timer = function(name) {\n\t\tvar timer = {\n\t\t\tstart: null,\n\t\t\tstop: null,\n\t\t\tname: name,\n\t\t\tlogger: this,\n\t\t\tend: function() {\n\t\t\t\tthis.stop = Date.now();\n\t\t\t\tthis.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));\n\t\t\t}\n\t\t};\n\n\t\t/*if (name) {\n\t\t\tthis.timerStore[name] = timer;\n\t\t}*/\n\n\t\tthis.log('Start Timer', name);\n\n\t\t//Set timer start time\n\t\ttimer.start = Date.now();\n\t\treturn timer;\n\t};\n\n\t/**\n\t * Stops a timer\n\t *\n\t * @param {String or Object} timerName Stops the given timer\n\t */\n\tlogger.prototype.timerEnd = function(timer) {\n\t\t//Set stop timer\n\t\t\n\t};\n\n\tlogger.prototype.__scope = {\n\t\tgetHumanTime: getHumanTime\n\t};\n\t\n\n\treturn logger;\n})();\n/**\n * A bunch of helpfull functions\n *\n * @return {Object} Returns a singelton object instance of XQCore.Util\n */\nXQCore.Util = (function($) {\n\n\tvar util = {\n\t\tname: 'XQCore.Util',\n\t\tdebug: true\n\t};\n\n\t/**\n\t * Serialize a form and return its values as JSON\n\t *\n\t * @param {Object} Form selector\n\t * @return {Object} FormData as JSON\n\t */\n\tutil.serializeForm = function(selector) {\n\t\tvar formData = {},\n\t\t\tformSelector = $(selector);\n\n\t\tif (formSelector.get(0).tagName === 'INPUT') {\n\n\t\t}\n\t\telse {\n\t\t\tformSelector = formSelector.find(':input');\n\t\t}\n\n\t\tformSelector.serializeArray().forEach(function(item) {\n\t\t\tformData[item.name] = item.value;\n\t\t});\n\n\t\tif (this.debug) {\n\t\t\tconsole.log('XQCore - Serialize form:', formSelector, formData);\n\t\t}\n\n\t\treturn formData;\n\t};\n\n\t/**\n\t * Check length of a string or number\n\t *\n\t * @param {String or Number} input this will be checked\n\t * @param {Number} min String can't be shorter than n, Number can't be lower than n\n\t * @param {Number} max String can't be longer than n, Number can't be greater than n\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkLength = function(input, min, max) {\n\t\tif (typeof input === 'Number') {\n\t\t\tif (input < min) {\n\t\t\t\treturn 'num-to-small';\n\t\t\t}\n\t\t\telse if (input > max) {\n\t\t\t\treturn 'num-to-large';\n\t\t\t}\n\t\t}\n\t\telse {\n\t\t\tconsole.log(input, input.length);\n\t\t\tif (input.length < min) {\n\t\t\t\treturn 'str-to-short';\n\t\t\t}\n\t\t\telse if (input.length > max) {\n\t\t\t\treturn 'str-to-long';\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\t * Checks the equality of two strings\n\t *\n\t * @param {String} str1 First string\n\t * @param {String} str2 Second string\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkEqual = function(str1, str2) {\n\t\tif (str1 !== str2) {\n\t\t\treturn 'str-not-equal';\n\t\t}\n\t};\n\n\t/**\n\t * Checks the validity of an email address\n\t *\n\t * @param {String} email e-Mail address\n\t */\n\tutil.checkEmail = function(email) {\n\t\tif (!/^\\S+\\@\\S+\\.[a-z]{2,10}$/.test(email)) {\n\t\t\treturn 'invalid-email';\n\t\t}\n\t};\n\n\treturn util;\n\n})(jQuery);";
__$coverObject["webdocs/test/src/lib/xqcore.js"]["0:30"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["32:1415"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1418:4738"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4741:7101"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7104:8842"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8845:11339"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11456:13380"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["67:1041"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1045:1088"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1178:1229"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1289:1389"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1393:1409"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["102:117"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["124:139"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["143:161"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["168:185"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["190:251"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["255:306"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["310:334"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["339:388"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["392:403"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["436:1037"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["458:745"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["751:1033"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["512:549"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["555:588"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["595:640"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["647:731"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["576:582"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["691:725"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["807:861"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["867:903"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["910:1019"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["954:986"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["993:1013"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1352:1385"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1478:1487"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1491:2100"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2104:2143"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2147:2190"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2194:2259"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2372:3039"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3175:3318"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3476:3549"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3594:3684"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4035:4692"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4696:4708"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1518:1560"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1565:1626"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1630:1677"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1681:1713"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1717:1737"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1741:1762"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1767:2080"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2085:2096"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1547:1556"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1791:2076"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1832:1842"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1849:1870"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1876:1919"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1925:2039"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2046:2059"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2013:2033"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2235:2255"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2409:2444"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2449:2805"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2810:2996"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3001:3035"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2511:2542"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2547:2581"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2637:2673"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2678:2726"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2744:2801"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2834:2873"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2878:2992"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2904:2960"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2966:2987"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3215:3314"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3243:3265"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3283:3310"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3516:3545"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3633:3656"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3660:3680"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4089:4097"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4102:4127"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4132:4149"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4154:4277"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4282:4352"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4357:4688"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4177:4256"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4261:4273"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4469:4515"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4581:4666"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4771:6693"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6697:6735"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6739:6779"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6783:6823"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6827:7032"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7036:7078"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7084:7095"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4812:4827"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4832:4868"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4873:4934"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4938:4984"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4988:5014"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5019:5051"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5055:5089"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5093:6689"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5129:5209"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5215:5259"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5264:5319"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5324:5374"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5410:6495"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6516:6527"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6564:6593"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5181:5195"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5433:6437"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5487:5615"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5623:6423"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5677:5728"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5736:6343"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5815:6126"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6135:6226"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5866:5910"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5921:6052"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6063:6115"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5957:6003"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6014:6042"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6256:6335"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6370:6416"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6455:6490"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6611:6685"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6870:6937"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6941:6989"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6993:7028"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7134:7149"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7154:7475"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7480:7526"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7798:7821"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7824:8001"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8005:8194"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8198:8532"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8536:8820"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8824:8836"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7196:7228"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7235:7279"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7284:7456"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7461:7472"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7310:7328"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7333:7452"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7438:7447"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7507:7522"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7877:7955"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7959:7997"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7898:7951"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8060:8144"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8148:8190"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8081:8140"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8255:8384"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8389:8478"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8482:8528"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8290:8328"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8333:8363"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8368:8379"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8410:8474"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8592:8679"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8684:8816"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8613:8675"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8717:8749"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8767:8812"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8906:9171"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9175:9371"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9529:9560"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9668:9869"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9977:10180"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10294:10499"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10646:11082"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11180:11250"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11254:11314"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11320:11333"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8938:9168"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8960:8979"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9015:9060"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9078:9164"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9206:9223"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9228:9304"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9309:9368"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9706:9714"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9719:9865"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9740:9784"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9789:9824"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9829:9861"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10016:10024"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10029:10176"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10050:10094"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10099:10134"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10139:10172"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10334:10342"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10347:10495"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10368:10412"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10417:10452"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10457:10491"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10690:10917"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10979:11008"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11038:11062"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11066:11078"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10792:10814"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10820:10907"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11487:11539"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11680:12105"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12457:12834"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13035:13132"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13235:13352"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13356:13367"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11724:11772"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11777:11887"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11892:11988"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11993:12081"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12086:12101"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11841:11883"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11950:11982"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12014:12077"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12506:12830"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12542:12650"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12565:12586"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12624:12645"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12668:12700"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12705:12826"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12735:12756"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12801:12821"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13078:13128"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13102:13124"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13273:13348"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13322:13344"] = 0;
__$coverObject['webdocs/test/src/lib/xqcore.js']['0:30']++;
var XQCore = {version: 0.1};
__$coverObject['webdocs/test/src/lib/xqcore.js']['32:1415']++;
XQCore.Presenter = function () {
    __$coverObject['webdocs/test/src/lib/xqcore.js']['67:1041']++;
    var presenter = function (conf) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['102:117']++;
        var self = this;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['124:139']++;
        this.root = '/';
        __$coverObject['webdocs/test/src/lib/xqcore.js']['143:161']++;
        this.debug = false;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['168:185']++;
        conf = conf || {};
        __$coverObject['webdocs/test/src/lib/xqcore.js']['190:251']++;
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverObject['webdocs/test/src/lib/xqcore.js']['255:306']++;
        this.name = (conf.name || 'Nameless') + 'Presenter';
        __$coverObject['webdocs/test/src/lib/xqcore.js']['310:334']++;
        this.eventCallbacks = {};
        __$coverObject['webdocs/test/src/lib/xqcore.js']['339:388']++;
        this.log('Initialize presenter with conf:', conf);
        __$coverObject['webdocs/test/src/lib/xqcore.js']['392:403']++;
        this.init();
        __$coverObject['webdocs/test/src/lib/xqcore.js']['436:1037']++;
        if (conf.routes) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['458:745']++;
            window.addEventListener('popstate', function (e) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['512:549']++;
                self.log('popstate event recived', e);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['555:588']++;
                if (!e.state) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['576:582']++;
                    return;
                }
                __$coverObject['webdocs/test/src/lib/xqcore.js']['595:640']++;
                var tag = e.state.tag, url = e.state.url;
                __$coverObject['webdocs/test/src/lib/xqcore.js']['647:731']++;
                if (typeof conf[tag] === 'function') {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['691:725']++;
                    conf[tag].call(self, e.state.data);
                }
            }, false);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['751:1033']++;
            window.addEventListener('hashchange', function (e) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['807:861']++;
                self.log('hashchange event recived', e, location.hash);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['867:903']++;
                var tag = location.hash.substring(1);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['910:1019']++;
                if (typeof conf[tag] === 'function') {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['954:986']++;
                    self.log('Call func', conf[tag]);
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['993:1013']++;
                    conf[tag].call(self);
                }
            }, false);
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['1045:1088']++;
    presenter.prototype.init = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['1178:1229']++;
    presenter.prototype.viewInit = function (view) {
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['1289:1389']++;
    presenter.prototype.pushState = function (data, title, url) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1352:1385']++;
        history.pushState(data, title, url);
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['1393:1409']++;
    return presenter;
}();
__$coverObject['webdocs/test/src/lib/xqcore.js']['1418:4738']++;
XQCore.Model = function (window, document, $, undefined) {
    __$coverObject['webdocs/test/src/lib/xqcore.js']['1478:1487']++;
    var model;
    __$coverObject['webdocs/test/src/lib/xqcore.js']['1491:2100']++;
    model = function (conf) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1518:1560']++;
        if (conf === undefined) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['1547:1556']++;
            conf = {};
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1565:1626']++;
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1630:1677']++;
        this.name = (conf.name || 'Nameless') + 'Model';
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1681:1713']++;
        this.debug = Boolean(conf.debug);
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1717:1737']++;
        this.attributes = {};
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1741:1762']++;
        this._isValid = false;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1767:2080']++;
        if (conf.validate) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['1791:2076']++;
            this.validate = function (formData) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['1832:1842']++;
                var result;
                __$coverObject['webdocs/test/src/lib/xqcore.js']['1849:1870']++;
                this._isValid = false;
                __$coverObject['webdocs/test/src/lib/xqcore.js']['1876:1919']++;
                result = conf.validate.call(this, formData);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['1925:2039']++;
                if (!result || typeof result === 'object' && Object.keys(result).length === 0) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['2013:2033']++;
                    this._isValid = true;
                }
                __$coverObject['webdocs/test/src/lib/xqcore.js']['2046:2059']++;
                return result;
            }.bind(this);
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['2085:2096']++;
        this.init();
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['2104:2143']++;
    model.prototype.init = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['2147:2190']++;
    model.prototype.validate = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['2194:2259']++;
    model.prototype.isValid = function () {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['2235:2255']++;
        return this._isValid;
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['2372:3039']++;
    model.prototype.set = function () {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['2409:2444']++;
        var newData = {}, validateResult;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['2449:2805']++;
        if (typeof arguments[0] === 'object') {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['2511:2542']++;
            $.extend(newData, arguments[0]);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['2547:2581']++;
            this.log('Set data', arguments[0]);
        } else if (typeof arguments[0] === 'string') {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['2637:2673']++;
            newData[arguments[0]] = arguments[1];
            __$coverObject['webdocs/test/src/lib/xqcore.js']['2678:2726']++;
            this.log('Set data', arguments[0], arguments[1]);
        } else {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['2744:2801']++;
            this.warn('Data are incorrect in model.set()', arguments);
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['2810:2996']++;
        if (this.validate) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['2834:2873']++;
            validateResult = this.validate(newData);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['2878:2992']++;
            if (validateResult) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['2904:2960']++;
                this.warn('Validate error in model.set', validateResult);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['2966:2987']++;
                return validateResult;
            }
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['3001:3035']++;
        $.extend(this.attributes, newData);
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['3175:3318']++;
    model.prototype.get = function (key) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['3215:3314']++;
        if (key === undefined) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['3243:3265']++;
            return this.attributes;
        } else {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['3283:3310']++;
            return this.attributes[key];
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['3476:3549']++;
    model.prototype.has = function (key) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['3516:3545']++;
        return !!this.attributes[key];
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['3594:3684']++;
    model.prototype.reset = function () {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['3633:3656']++;
        this.log('Reset model');
        __$coverObject['webdocs/test/src/lib/xqcore.js']['3660:3680']++;
        this.attributes = {};
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['4035:4692']++;
    model.prototype.send = function (method, callback) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4089:4097']++;
        var data;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4102:4127']++;
        method = method || 'POST';
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4132:4149']++;
        data = this.get();
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4154:4277']++;
        if (!this.server) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['4177:4256']++;
            this.error('Can not send an ajax request! You must define a server URL first.');
            __$coverObject['webdocs/test/src/lib/xqcore.js']['4261:4273']++;
            return false;
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4282:4352']++;
        this.log('Sending an ajax call to ', this.server, 'with data: ', data);
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4357:4688']++;
        $.ajax({
            url: this.server,
            method: method,
            data: data,
            success: function (data, status, jqXHR) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['4469:4515']++;
                callback.call(this, null, data, status, jqXHR);
            }.bind(this),
            error: function (jqXHR, status, error) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['4581:4666']++;
                callback.call(this, {
                    type: status,
                    http: error
                }, null, status, jqXHR);
            }.bind(this)
        });
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['4696:4708']++;
    return model;
}(window, document, jQuery);
__$coverObject['webdocs/test/src/lib/xqcore.js']['4741:7101']++;
XQCore.View = function () {
    __$coverObject['webdocs/test/src/lib/xqcore.js']['4771:6693']++;
    var view = function (presenter, conf) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4812:4827']++;
        var self = this;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4832:4868']++;
        conf = conf || {events: null};
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4873:4934']++;
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4938:4984']++;
        this.name = (conf.name || 'Nameless') + 'View';
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4988:5014']++;
        this.presenter = presenter;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['5019:5051']++;
        this.debug = Boolean(conf.debug);
        __$coverObject['webdocs/test/src/lib/xqcore.js']['5055:5089']++;
        this.container = $(conf.container);
        __$coverObject['webdocs/test/src/lib/xqcore.js']['5093:6689']++;
        if (this.container.length > 0) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['5129:5209']++;
            window.addEventListener('resize', function (e) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['5181:5195']++;
                self.resize(e);
            }, false);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['5215:5259']++;
            this.log('Initialize view with conf:', conf);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['5264:5319']++;
            this.log('  ... using Presenter:', this.presenter.name);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['5324:5374']++;
            this.log('  ... using Container:', this.container);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['5410:6495']++;
            if (this.events) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['5433:6437']++;
                Object.keys(this.events).forEach(function (key) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['5487:5615']++;
                    var split = key.split(' ', 2), eventFunc, eventName = split[0], selector = split[1] || null, self = this;
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['5623:6423']++;
                    if (split.length === 1 || split.length === 2) {
                        __$coverObject['webdocs/test/src/lib/xqcore.js']['5677:5728']++;
                        eventFunc = this.presenter.events[this.events[key]];
                        __$coverObject['webdocs/test/src/lib/xqcore.js']['5736:6343']++;
                        if (typeof eventFunc === 'function') {
                            __$coverObject['webdocs/test/src/lib/xqcore.js']['5815:6126']++;
                            this.container.on(eventName, function (e) {
                                __$coverObject['webdocs/test/src/lib/xqcore.js']['5866:5910']++;
                                var formData = null, tagData = null;
                                __$coverObject['webdocs/test/src/lib/xqcore.js']['5921:6052']++;
                                if (e.type === 'submit') {
                                    __$coverObject['webdocs/test/src/lib/xqcore.js']['5957:6003']++;
                                    formData = XQCore.Util.serializeForm(e.target);
                                    __$coverObject['webdocs/test/src/lib/xqcore.js']['6014:6042']++;
                                    tagData = $(e.target).data();
                                }
                                __$coverObject['webdocs/test/src/lib/xqcore.js']['6063:6115']++;
                                eventFunc.call(self.presenter, e, tagData, formData);
                            });
                            __$coverObject['webdocs/test/src/lib/xqcore.js']['6135:6226']++;
                            this.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);
                        } else {
                            __$coverObject['webdocs/test/src/lib/xqcore.js']['6256:6335']++;
                            this.warn('Event handler callback not defined in Presenter:', this.events[key]);
                        }
                    } else {
                        __$coverObject['webdocs/test/src/lib/xqcore.js']['6370:6416']++;
                        this.warn('Incorect event configuration', key);
                    }
                }, this);
            } else {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['6455:6490']++;
                this.warn('No view events defined');
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['6516:6527']++;
            this.init();
            __$coverObject['webdocs/test/src/lib/xqcore.js']['6564:6593']++;
            this.presenter.viewInit(this);
        } else {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['6611:6685']++;
            this.error('Can\'t initialize View, Container not found!', this.container);
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['6697:6735']++;
    view.prototype.init = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['6739:6779']++;
    view.prototype.show = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['6783:6823']++;
    view.prototype.hide = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['6827:7032']++;
    view.prototype.render = function (data) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['6870:6937']++;
        this.log('Render view template', this.template, 'with data:', data);
        __$coverObject['webdocs/test/src/lib/xqcore.js']['6941:6989']++;
        var template = Handlebars.compile(this.template);
        __$coverObject['webdocs/test/src/lib/xqcore.js']['6993:7028']++;
        this.container.html(template(data));
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['7036:7078']++;
    view.prototype.resize = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['7084:7095']++;
    return view;
}();
__$coverObject['webdocs/test/src/lib/xqcore.js']['7104:8842']++;
XQCore.Event = function () {
    __$coverObject['webdocs/test/src/lib/xqcore.js']['7134:7149']++;
    var ee, event;
    __$coverObject['webdocs/test/src/lib/xqcore.js']['7154:7475']++;
    function indexOf(eventName, callback) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7196:7228']++;
        this.objectName = 'XQCore.Event';
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7235:7279']++;
        var len = this.store.length, i = 0, el;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7284:7456']++;
        for (; i < len; i++) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['7310:7328']++;
            el = this.store[i];
            __$coverObject['webdocs/test/src/lib/xqcore.js']['7333:7452']++;
            if (eventName === null || eventName === el.event && callback === null || callback === el.callback) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['7438:7447']++;
                return el;
            }
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7461:7472']++;
        return null;
    }
    __$coverObject['webdocs/test/src/lib/xqcore.js']['7480:7526']++;
    event = function (conf) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7507:7522']++;
        this.store = [];
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['7798:7821']++;
    ee = new EventEmitter();
    __$coverObject['webdocs/test/src/lib/xqcore.js']['7824:8001']++;
    event.prototype.emit = function (eventName, data) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7877:7955']++;
        if (this.debug) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['7898:7951']++;
            console.debug('XQCore - Emit event', eventName, data);
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7959:7997']++;
        return ee.emitEvent(eventName, [data]);
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['8005:8194']++;
    event.prototype.on = function (eventName, listener) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['8060:8144']++;
        if (this.debug) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8081:8140']++;
            console.debug('XQCore - Add listener', eventName, listener);
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['8148:8190']++;
        return ee.addListener(eventName, listener);
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['8198:8532']++;
    event.prototype.once = function (eventName, listener) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['8255:8384']++;
        var onceListener = function () {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8290:8328']++;
            ee.removeListener(eventName, listener);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8333:8363']++;
            listener.call(null, arguments);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8368:8379']++;
            return true;
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['8389:8478']++;
        if (this.debug) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8410:8474']++;
            console.debug('XQCore - Add once listener', eventName, listener);
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['8482:8528']++;
        return ee.addListener(eventName, onceListener);
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['8536:8820']++;
    event.prototype.off = function (eventName, listener) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['8592:8679']++;
        if (this.debug) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8613:8675']++;
            console.debug('XQCore - Remove listener', eventName, listener);
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['8684:8816']++;
        if (listener === undefined) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8717:8749']++;
            return ee.removeEvent(eventName);
        } else {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8767:8812']++;
            return ee.removeListener(eventName, listener);
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['8824:8836']++;
    return event;
}();
__$coverObject['webdocs/test/src/lib/xqcore.js']['8845:11339']++;
XQCore.Logger = function (conf) {
    __$coverObject['webdocs/test/src/lib/xqcore.js']['8906:9171']++;
    function getHumanTime(time) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['8938:9168']++;
        if (time < 1000) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8960:8979']++;
            return time + ' ms';
        } else if (time < 60000) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['9015:9060']++;
            return Math.round(time / 100) / 10 + ' sec';
        } else {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['9078:9164']++;
            return Math.round(time / 60000) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';
        }
    }
    __$coverObject['webdocs/test/src/lib/xqcore.js']['9175:9371']++;
    function onScreenConsole() {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['9206:9223']++;
        var conf, html;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['9228:9304']++;
        conf = localStorage.get('xqcore-onscreen-console') || {pos: 'bottom'};
        __$coverObject['webdocs/test/src/lib/xqcore.js']['9309:9368']++;
        html = '<div id="XQCoreLogger-OnScreenConsole">\t\t\t</div>';
    }
    __$coverObject['webdocs/test/src/lib/xqcore.js']['9529:9560']++;
    var logger = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['9668:9869']++;
    logger.prototype.log = function () {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['9706:9714']++;
        var args;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['9719:9865']++;
        if (this.debug) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['9740:9784']++;
            args = Array.prototype.slice.call(arguments);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['9789:9824']++;
            args.unshift('[' + this.name + ']');
            __$coverObject['webdocs/test/src/lib/xqcore.js']['9829:9861']++;
            console.log.apply(console, args);
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['9977:10180']++;
    logger.prototype.warn = function () {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['10016:10024']++;
        var args;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['10029:10176']++;
        if (this.debug) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['10050:10094']++;
            args = Array.prototype.slice.call(arguments);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['10099:10134']++;
            args.unshift('[' + this.name + ']');
            __$coverObject['webdocs/test/src/lib/xqcore.js']['10139:10172']++;
            console.warn.apply(console, args);
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['10294:10499']++;
    logger.prototype.error = function () {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['10334:10342']++;
        var args;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['10347:10495']++;
        if (this.debug) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['10368:10412']++;
            args = Array.prototype.slice.call(arguments);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['10417:10452']++;
            args.unshift('[' + this.name + ']');
            __$coverObject['webdocs/test/src/lib/xqcore.js']['10457:10491']++;
            console.error.apply(console, args);
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['10646:11082']++;
    logger.prototype.timer = function (name) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['10690:10917']++;
        var timer = {
                start: null,
                stop: null,
                name: name,
                logger: this,
                end: function () {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['10792:10814']++;
                    this.stop = Date.now();
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['10820:10907']++;
                    this.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));
                }
            };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['10979:11008']++;
        this.log('Start Timer', name);
        __$coverObject['webdocs/test/src/lib/xqcore.js']['11038:11062']++;
        timer.start = Date.now();
        __$coverObject['webdocs/test/src/lib/xqcore.js']['11066:11078']++;
        return timer;
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['11180:11250']++;
    logger.prototype.timerEnd = function (timer) {
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['11254:11314']++;
    logger.prototype.__scope = {getHumanTime: getHumanTime};
    __$coverObject['webdocs/test/src/lib/xqcore.js']['11320:11333']++;
    return logger;
}();
__$coverObject['webdocs/test/src/lib/xqcore.js']['11456:13380']++;
XQCore.Util = function ($) {
    __$coverObject['webdocs/test/src/lib/xqcore.js']['11487:11539']++;
    var util = {
            name: 'XQCore.Util',
            debug: true
        };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['11680:12105']++;
    util.serializeForm = function (selector) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['11724:11772']++;
        var formData = {}, formSelector = $(selector);
        __$coverObject['webdocs/test/src/lib/xqcore.js']['11777:11887']++;
        if (formSelector.get(0).tagName === 'INPUT') {
        } else {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['11841:11883']++;
            formSelector = formSelector.find(':input');
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['11892:11988']++;
        formSelector.serializeArray().forEach(function (item) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['11950:11982']++;
            formData[item.name] = item.value;
        });
        __$coverObject['webdocs/test/src/lib/xqcore.js']['11993:12081']++;
        if (this.debug) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['12014:12077']++;
            console.log('XQCore - Serialize form:', formSelector, formData);
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['12086:12101']++;
        return formData;
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['12457:12834']++;
    util.checkLength = function (input, min, max) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['12506:12830']++;
        if (typeof input === 'Number') {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['12542:12650']++;
            if (input < min) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['12565:12586']++;
                return 'num-to-small';
            } else if (input > max) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['12624:12645']++;
                return 'num-to-large';
            }
        } else {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['12668:12700']++;
            console.log(input, input.length);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['12705:12826']++;
            if (input.length < min) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['12735:12756']++;
                return 'str-to-short';
            } else if (input.length > max) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['12801:12821']++;
                return 'str-to-long';
            }
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['13035:13132']++;
    util.checkEqual = function (str1, str2) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['13078:13128']++;
        if (str1 !== str2) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['13102:13124']++;
            return 'str-not-equal';
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['13235:13352']++;
    util.checkEmail = function (email) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['13273:13348']++;
        if (!/^\S+\@\S+\.[a-z]{2,10}$/.test(email)) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['13322:13344']++;
            return 'invalid-email';
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore.js']['13356:13367']++;
    return util;
}(jQuery);