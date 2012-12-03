if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/xqcore.js"] = {};
__$coverObject["webdocs/test/src/lib/xqcore.js"].__code = "var CoreRouter = function(conf) {\n\tvar CoreRouter,\n\t\trouter ;\n\n\tCoreRouter = Backbone.Router.extend(conf);\n\trouter = new CoreRouter();\n\tBackbone.history.start();\n\treturn router;\n};\nvar CorePresenter = (function() {\n\n\tvar presenter = function(conf) {\n\t\tvar self = this;\n\t\t\n\t\tthis.root = '/';\n\t\tthis.debug = false;\n\t\t\n\t\tconf = conf || {};\n\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Presenter';\n\t\tthis.eventCallbacks = {};\n\n\t\tthis.log('Initialize presenter with conf:', conf);\n\t\tthis.init();\n\n\t\t//Setup popstate listener\n\t\tif (conf.routes) {\n\t\t\twindow.addEventListener('popstate', function(e) {\n\t\t\t\tself.log('popstate event recived', e);\n\t\t\t\tif (!e.state) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tvar tag = e.state.tag,\n\t\t\t\t\turl = e.state.url;\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tconf[tag].call(self, e.state.data);\n\t\t\t\t}\n\t\t\t}, false);\n\n\t\t\twindow.addEventListener('hashchange', function(e) {\n\t\t\t\tself.log('hashchange event recived', e, location.hash);\n\t\t\t\tvar tag = location.hash.substring(1);\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tself.log('Call func', conf[tag]);\n\t\t\t\t\tconf[tag].call(self);\n\t\t\t\t}\n\t\t\t}, false);\n\t\t}\n\t};\n\n\tpresenter.prototype.init = function() {\n\n\t};\n\n\t/**\n\t * Calling on view init\n\t *\n\t * @param {object} view The initializing view\n\t */\n\tpresenter.prototype.viewInit = function(view) {\n\n\t\t\tconsole.log('I',view.name, view);\n\t};\n\n\t/**\n\t * Add a history item to the browser history\n\t */\n\tpresenter.prototype.pushState = function(data, title, url) {\n\t\thistory.pushState(data,title,url);\n\t};\n\n\treturn presenter;\n})();\n\nvar CoreModel = (function(window, document, $, undefined) {\n\tvar model;\n\n\tmodel = function(conf) {\n\t\tif (conf === undefined) {\n\t\t\tconf = {};\n\t\t}\n\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Model';\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.attributes = {};\n\t\tthis._isValid = false;\n\n\t\tif (conf.validate) {\n\t\t\tthis.validate = function(formData) {\n\t\t\t\tvar result;\n\n\t\t\t\tthis._isValid = false;\n\t\t\t\tresult = conf.validate.call(this, formData);\n\t\t\t\tif (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {\n\t\t\t\t\tthis._isValid = true;\n\t\t\t\t}\n\n\t\t\t\treturn result;\n\t\t\t}.bind(this);\n\t\t}\n\n\t\tthis.init();\n\t};\n\n\tmodel.prototype.init = function() {\n\n\t};\n\n\tmodel.prototype.validate = function() {\n\n\t};\n\n\tmodel.prototype.isValid = function() {\n\t\treturn this._isValid;\n\t};\n\n\t/**\n\t * Set model data\n\t *\n\t * @param {Object or String} data/key\n\t * @param {Object} value Data value\n\t */\n\tmodel.prototype.set = function() {\n\t\tvar newData = {},\n\t\t\tvalidateResult;\n\n\t\tif (typeof arguments[0] === 'object') {\n\t\t\t//Add a dataset\n\t\t\t$.extend(newData, arguments[0]);\n\t\t\tthis.log('Set data', arguments[0]);\n\t\t}\n\t\telse if (typeof arguments[0] === 'string') {\n\t\t\tnewData[arguments[0]] = arguments[1];\n\t\t\tthis.log('Set data', arguments[0], arguments[1]);\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Data are incorrect in model.set()', arguments);\n\t\t}\n\n\t\tif (this.validate) {\n\t\t\tvalidateResult = this.validate(newData);\n\t\t\tif (validateResult) {\n\t\t\t\tthis.warn('Validate error in model.set', validateResult);\n\t\t\t\treturn validateResult;\n\t\t\t}\n\t\t}\n\n\t\t$.extend(this.attributes, newData);\n\t};\n\n\t/**\n\t * Get one or all attributes from model\n\t *\n\t * @param  {String} key Data key\n\t *\n\t * @return {Object}     Model dataset\n\t */\n\tmodel.prototype.get = function(key) {\n\t\tif (key === undefined) {\n\t\t\treturn this.attributes;\n\t\t}\n\t\telse {\n\t\t\treturn this.attributes[key];\n\t\t}\n\t};\n\n\t/**\n\t * Check wether model has a dataset\n\t *\n\t * @param {String} key Dataset key\n\t * @return {Boolean} Returns true if model has a dataset with key\n\t */\n\tmodel.prototype.has = function(key) {\n\t\treturn !!this.attributes[key];\n\t};\n\n\t/**\n\t * Remove all data from model\n\t */\n\tmodel.prototype.reset = function() {\n\t\tthis.log('Reset model');\n\t\tthis.attributes = {};\n\t};\n\n\t/**\n\t * Send an ajax request to a webserver. Sends all models attributes\n\t *\n\t * You must set the server URI first with model.server = 'http://example.com/post'\n\t *\n\t * @param {String} Method send method, GET, POST, PUT, DELETE (default POST)\n\t * @param {Function} callback Calls callback(err, data, status, jqXHR) if response was receiving\n\t */\n\tmodel.prototype.send = function(method, callback) {\n\t\tvar data;\n\n\t\tmethod = method || 'POST';\n\n\t\tdata = this.get();\n\n\t\tif (!this.server) {\n\t\t\tthis.error('Can not send an ajax request! You must define a server URL first.');\n\t\t\treturn false;\n\t\t}\n\n\t\tthis.log('Sending an ajax call to ', this.server, 'with data: ', data);\n\n\t\t$.ajax({\n\t\t\turl: this.server,\n\t\t\tmethod: method,\n\t\t\tdata: data,\n\t\t\tsuccess: function(data, status, jqXHR) {\n\t\t\t\tcallback.call(this, null, data, status, jqXHR);\n\t\t\t}.bind(this),\n\t\t\terror: function(jqXHR, status, error) {\n\t\t\t\tcallback.call(this, {\n\t\t\t\t\ttype: status,\n\t\t\t\t\thttp: error\n\t\t\t\t}, null, status, jqXHR);\n\t\t\t}.bind(this)\n\t\t});\n\t};\n\n\treturn model;\n})(window, document, jQuery);\n\nvar CoreView = (function() {\n\n\tvar view = function(presenter, conf) {\n\t\tvar self = this;\n\n\t\tconf = conf || {\n\t\t\tevents: null\n\t\t};\n\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'View';\n\t\tthis.presenter = presenter;\n\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.container = $(conf.container);\n\t\tif (this.container.length > 0) {\n\t\t\twindow.addEventListener('resize', function(e) {\n\t\t\t\tself.resize(e);\n\t\t\t}, false);\n\n\t\t\tthis.log('Initialize view with conf:', conf);\n\t\t\tthis.log('  ... using Presenter:', this.presenter.name);\n\t\t\tthis.log('  ... using Container:', this.container);\n\n\t\t\t//Send events to presenter\n\t\t\tif (this.events) {\n\t\t\t\tObject.keys(this.events).forEach(function(key) {\n\t\t\t\t\tvar split = key.split(' ', 2),\n\t\t\t\t\t\teventFunc,\n\t\t\t\t\t\teventName = split[0],\n\t\t\t\t\t\tselector = split[1] || null,\n\t\t\t\t\t\tself = this;\n\n\t\t\t\t\tif (split.length === 1 || split.length === 2) {\n\t\t\t\t\t\teventFunc = this.presenter.events[this.events[key]];\n\t\t\t\t\t\tif (typeof eventFunc === 'function') {\n\t\t\t\t\t\t\t//Register event listener\n\t\t\t\t\t\t\tthis.container.on(eventName, function(e) {\n\t\t\t\t\t\t\t\tvar formData = null,\n\t\t\t\t\t\t\t\t\ttagData = null;\n\n\t\t\t\t\t\t\t\tif (e.type === 'submit') {\n\t\t\t\t\t\t\t\t\tformData = CoreUtil.serializeForm(e.target);\n\t\t\t\t\t\t\t\t\ttagData = $(e.target).data();\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\teventFunc.call(self.presenter, e, tagData, formData);\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\tthis.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);\n\t\t\t\t\t\t}\n\t\t\t\t\t\telse {\n\t\t\t\t\t\t\tthis.warn('Event handler callback not defined in Presenter:', this.events[key]);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\telse {\n\t\t\t\t\t\tthis.warn('Incorect event configuration', key);\n\t\t\t\t\t}\n\t\t\t\t}, this);\n\t\t\t} else {\n\t\t\t\tthis.warn('No view events defined');\n\t\t\t}\n\n\t\t\t//Self init\n\t\t\tthis.init();\n\n\t\t\t//Call presenter.initView()\n\t\t\tthis.presenter.viewInit(this);\n\t\t}\n\t\telse {\n\t\t\tthis.error('Can\\'t initialize View, Container not found!', this.container);\n\t\t}\n\t};\n\n\tview.prototype.init = function() {\n\n\t};\n\n\tview.prototype.show = function() {\n\t\t\n\t};\n\n\tview.prototype.hide = function() {\n\t\t\n\t};\n\n\tview.prototype.render = function(data) {\n\t\tthis.log('Render view template', this.template, 'with data:', data);\n\t\tvar template = Handlebars.compile(this.template);\n\t\tthis.container.html(template(data));\n\t};\n\n\tview.prototype.resize = function() {\n\t\t\n\t};\n\n\n\n\treturn view;\n})();\n\nvar CoreEvent = (function() {\n\tvar ee,\n\t\tevent;\n\t\n\tfunction indexOf(eventName, callback) {\n\t\tthis.objectName = 'CoreEvent';\n\t\t\n\t\tvar len = this.store.length,\n\t\t\ti = 0,\n\t\t\tel;\n\n\t\tfor (; i < len; i++) {\n\t\t\tel = this.store[i];\n\t\t\tif (eventName === null || eventName === el.event && callback === null || callback === el.callback) {\n\t\t\t\treturn el;\n\t\t\t}\n\t\t}\n\n\t\treturn null;\n\t}\n\n\n\tevent = function(conf) {\n\t\tthis.store = [];\n\t};\n\n\t// event.prototype.on = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.once = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.emit = function(eventName, data) {\n\n\t// };\n\n\t// event.prototype.remove = function(eventName, callback) {\n\n\t// };\n\n\tee = new EventEmitter();\n\tevent.prototype.emit = function(eventName, data) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Emit event', eventName, data);\n\t\t}\n\t\treturn ee.emitEvent(eventName, [data]);\n\t};\n\n\tevent.prototype.on = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Add listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, listener);\n\t};\n\n\tevent.prototype.once = function(eventName, listener) {\n\t\tvar onceListener = function() {\n\t\t\tee.removeListener(eventName, listener);\n\t\t\tlistener.call(null, arguments);\n\t\t\treturn true;\n\t\t};\n\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Add once listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, onceListener);\n\t};\n\n\tevent.prototype.off = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Remove listener', eventName, listener);\n\t\t}\n\n\t\tif (listener === undefined) {\n\t\t\treturn ee.removeEvent(eventName);\n\t\t}\n\t\telse {\n\t\t\treturn ee.removeListener(eventName, listener);\n\t\t}\n\t};\n\n\treturn event;\n})();\n\nvar CoreLogger = (function(conf) {\n\n\t//var timerStore = {};\n\n\tfunction getHumanTime(time) {\n\t\tif (time < 1000) {\n\t\t\treturn time + ' ms';\n\t\t}\n\t\telse if (time < 60000) {\n\t\t\treturn (Math.round(time / 100) / 10) + ' sec';\n\t\t}\n\t\telse {\n\t\t\treturn (Math.round(time / 60000)) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';\n\t\t}\n\t}\n\n\tfunction onScreenConsole() {\n\t\tvar conf,\n\t\t\thtml;\n\n\t\tconf = localStorage.get('core-onscreen-console') || {\n\t\t\tpos: 'bottom'\n\t\t};\n\n\t\thtml = '<div id=\"CoreLogger-OnScreenConsole\">\\\n\t\t\t</div>';\n\t}\n\n\t/**\n\t * CoreLogger is a logging tool to log messages, warnings, errors to the browser or onscreen console\n\t *\n\t * @return {[type]} [description]\n\t */\n\tvar logger = function() {\n\t\t\n\t};\n\n\t/**\n\t * Loggs a message to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.log = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.log.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Loggs a warning to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.warn = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.warn.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Loggs a error message to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.error = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.error.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Start a timeTracer\n\t *\n\t * @param {String} timerName Set the name for your (Optional)\n\t * @return {Object} Returns a TimerObject\n\t */\n\tlogger.prototype.timer = function(name) {\n\t\tvar timer = {\n\t\t\tstart: null,\n\t\t\tstop: null,\n\t\t\tname: name,\n\t\t\tlogger: this,\n\t\t\tend: function() {\n\t\t\t\tthis.stop = Date.now();\n\t\t\t\tthis.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));\n\t\t\t}\n\t\t};\n\n\t\t/*if (name) {\n\t\t\tthis.timerStore[name] = timer;\n\t\t}*/\n\n\t\tthis.log('Start Timer', name);\n\n\t\t//Set timer start time\n\t\ttimer.start = Date.now();\n\t\treturn timer;\n\t};\n\n\t/**\n\t * Stops a timer\n\t *\n\t * @param {String or Object} timerName Stops the given timer\n\t */\n\tlogger.prototype.timerEnd = function(timer) {\n\t\t//Set stop timer\n\t\t\n\t};\n\n\tlogger.prototype.__scope = {\n\t\tgetHumanTime: getHumanTime\n\t};\n\t\n\n\treturn logger;\n})();\n/**\n * A bunch of helpfull functions\n *\n * @return {Object} Returns a singelton object instance of CoreUtil\n */\nvar CoreUtil = (function($) {\n\n\tvar util = {\n\t\tname: 'CoreUtil',\n\t\tdebug: true\n\t};\n\n\t/**\n\t * Serialize a form and return its values as JSON\n\t *\n\t * @param {Object} Form selector\n\t * @return {Object} FormData as JSON\n\t */\n\tutil.serializeForm = function(selector) {\n\t\tvar formData = {},\n\t\t\tformSelector = $(selector);\n\n\t\tif (formSelector.get(0).tagName === 'INPUT') {\n\n\t\t}\n\t\telse {\n\t\t\tformSelector = formSelector.find(':input');\n\t\t}\n\n\t\tformSelector.serializeArray().forEach(function(item) {\n\t\t\tformData[item.name] = item.value;\n\t\t});\n\n\t\tif (this.debug) {\n\t\t\tconsole.log('Akonda Core - Serialize form:', formSelector, formData);\n\t\t}\n\n\t\treturn formData;\n\t};\n\n\t/**\n\t * Check length of a string or number\n\t *\n\t * @param {String or Number} input this will be checked\n\t * @param {Number} min String can't be shorter than n, Number can't be lower than n\n\t * @param {Number} max String can't be longer than n, Number can't be greater than n\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkLength = function(input, min, max) {\n\t\tif (typeof input === 'Number') {\n\t\t\tif (input < min) {\n\t\t\t\treturn 'num-to-small';\n\t\t\t}\n\t\t\telse if (input > max) {\n\t\t\t\treturn 'num-to-large';\n\t\t\t}\n\t\t}\n\t\telse {\n\t\t\tconsole.log(input, input.length);\n\t\t\tif (input.length < min) {\n\t\t\t\treturn 'str-to-short';\n\t\t\t}\n\t\t\telse if (input.length > max) {\n\t\t\t\treturn 'str-to-long';\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\t * Checks the equality of two strings\n\t *\n\t * @param {String} str1 First string\n\t * @param {String} str2 Second string\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkEqual = function(str1, str2) {\n\t\tif (str1 !== str2) {\n\t\t\treturn 'str-not-equal';\n\t\t}\n\t};\n\n\t/**\n\t * Checks the validity of an email address\n\t *\n\t * @param {String} email e-Mail address\n\t */\n\tutil.checkEmail = function(email) {\n\t\tif (!/^\\S+\\@\\S+\\.[a-z]{2,10}$/.test(email)) {\n\t\t\treturn 'invalid-email';\n\t\t}\n\t};\n\n\treturn util;\n\n})(jQuery);";
__$coverObject["webdocs/test/src/lib/xqcore.js"]["0:179"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["181:1596"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1599:4914"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4917:7269"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7272:9028"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9031:11519"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11633:13560"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["35:60"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["64:105"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["108:133"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["136:160"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["163:176"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["217:1185"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1189:1232"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1322:1410"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1470:1570"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1574:1590"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["252:267"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["274:289"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["293:311"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["318:335"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["340:395"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["399:450"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["454:478"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["483:532"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["536:547"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["580:1181"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["602:889"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["895:1177"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["656:693"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["699:732"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["739:784"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["791:875"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["720:726"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["835:869"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["951:1005"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1011:1047"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1054:1163"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1098:1130"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1137:1157"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1374:1406"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1533:1566"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1660:1669"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1673:2276"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2280:2319"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2323:2366"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2370:2435"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2548:3215"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3351:3494"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3652:3725"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3770:3860"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4211:4868"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4872:4884"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1700:1742"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1747:1802"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1806:1853"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1857:1889"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1893:1913"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1917:1938"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1943:2256"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2261:2272"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1729:1738"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["1967:2252"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2008:2018"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2025:2046"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2052:2095"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2101:2215"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2222:2235"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2189:2209"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2411:2431"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2585:2620"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2625:2981"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2986:3172"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3177:3211"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2687:2718"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2723:2757"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2813:2849"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2854:2902"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["2920:2977"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3010:3049"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3054:3168"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3080:3136"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3142:3163"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3391:3490"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3419:3441"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3459:3486"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3692:3721"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3809:3832"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["3836:3856"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4265:4273"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4278:4303"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4308:4325"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4330:4453"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4458:4528"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4533:4864"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4353:4432"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4437:4449"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4645:4691"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4757:4842"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4948:6861"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6865:6903"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6907:6947"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6951:6991"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6995:7200"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7204:7246"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7252:7263"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["4989:5004"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5009:5045"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5050:5105"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5109:5155"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5159:5185"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5190:5222"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5226:5260"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5264:6857"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5300:5380"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5386:5430"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5435:5490"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5495:5545"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5581:6663"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6684:6695"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6732:6761"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5352:5366"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5604:6605"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5658:5786"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5794:6591"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5848:5899"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5907:6511"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["5986:6294"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6303:6394"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6037:6081"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6092:6220"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6231:6283"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6128:6171"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6182:6210"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6424:6503"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6538:6584"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6623:6658"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["6779:6853"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7038:7105"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7109:7157"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7161:7196"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7303:7318"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7323:7641"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7646:7692"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7964:7987"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7990:8172"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8176:8370"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8374:8713"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8717:9006"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9010:9022"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7365:7394"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7401:7445"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7450:7622"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7627:7638"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7476:7494"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7499:7618"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7604:7613"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["7673:7688"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8043:8126"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8130:8168"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8064:8122"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8231:8320"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8324:8366"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8252:8316"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8431:8560"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8565:8659"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8663:8709"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8466:8504"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8509:8539"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8544:8555"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8586:8655"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8773:8865"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8870:9002"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8794:8861"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8903:8935"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["8953:8998"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9093:9358"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9362:9554"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9709:9740"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9848:10049"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10157:10360"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10474:10679"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10826:11262"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11360:11430"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11434:11494"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11500:11513"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9125:9355"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9147:9166"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9202:9247"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9265:9351"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9393:9410"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9415:9489"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9494:9551"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9886:9894"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9899:10045"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9920:9964"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["9969:10004"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10009:10041"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10196:10204"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10209:10356"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10230:10274"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10279:10314"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10319:10352"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10514:10522"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10527:10675"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10548:10592"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10597:10632"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10637:10671"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10870:11097"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11159:11188"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11218:11242"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11246:11258"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["10972:10994"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11000:11087"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11665:11714"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11855:12285"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12637:13014"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13215:13312"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13415:13532"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13536:13547"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11899:11947"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["11952:12062"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12067:12163"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12168:12261"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12266:12281"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12016:12058"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12125:12157"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12189:12257"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12686:13010"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12722:12830"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12745:12766"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12804:12825"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12848:12880"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12885:13006"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12915:12936"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["12981:13001"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13258:13308"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13282:13304"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13453:13528"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore.js"]["13502:13524"] = 0;
__$coverObject['webdocs/test/src/lib/xqcore.js']['0:179']++;
var CoreRouter = function (conf) {
    __$coverObject['webdocs/test/src/lib/xqcore.js']['35:60']++;
    var CoreRouter, router;
    __$coverObject['webdocs/test/src/lib/xqcore.js']['64:105']++;
    CoreRouter = Backbone.Router.extend(conf);
    __$coverObject['webdocs/test/src/lib/xqcore.js']['108:133']++;
    router = new CoreRouter();
    __$coverObject['webdocs/test/src/lib/xqcore.js']['136:160']++;
    Backbone.history.start();
    __$coverObject['webdocs/test/src/lib/xqcore.js']['163:176']++;
    return router;
};
__$coverObject['webdocs/test/src/lib/xqcore.js']['181:1596']++;
var CorePresenter = function () {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['217:1185']++;
        var presenter = function (conf) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['252:267']++;
            var self = this;
            __$coverObject['webdocs/test/src/lib/xqcore.js']['274:289']++;
            this.root = '/';
            __$coverObject['webdocs/test/src/lib/xqcore.js']['293:311']++;
            this.debug = false;
            __$coverObject['webdocs/test/src/lib/xqcore.js']['318:335']++;
            conf = conf || {};
            __$coverObject['webdocs/test/src/lib/xqcore.js']['340:395']++;
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverObject['webdocs/test/src/lib/xqcore.js']['399:450']++;
            this.name = (conf.name || 'Nameless') + 'Presenter';
            __$coverObject['webdocs/test/src/lib/xqcore.js']['454:478']++;
            this.eventCallbacks = {};
            __$coverObject['webdocs/test/src/lib/xqcore.js']['483:532']++;
            this.log('Initialize presenter with conf:', conf);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['536:547']++;
            this.init();
            __$coverObject['webdocs/test/src/lib/xqcore.js']['580:1181']++;
            if (conf.routes) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['602:889']++;
                window.addEventListener('popstate', function (e) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['656:693']++;
                    self.log('popstate event recived', e);
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['699:732']++;
                    if (!e.state) {
                        __$coverObject['webdocs/test/src/lib/xqcore.js']['720:726']++;
                        return;
                    }
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['739:784']++;
                    var tag = e.state.tag, url = e.state.url;
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['791:875']++;
                    if (typeof conf[tag] === 'function') {
                        __$coverObject['webdocs/test/src/lib/xqcore.js']['835:869']++;
                        conf[tag].call(self, e.state.data);
                    }
                }, false);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['895:1177']++;
                window.addEventListener('hashchange', function (e) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['951:1005']++;
                    self.log('hashchange event recived', e, location.hash);
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['1011:1047']++;
                    var tag = location.hash.substring(1);
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['1054:1163']++;
                    if (typeof conf[tag] === 'function') {
                        __$coverObject['webdocs/test/src/lib/xqcore.js']['1098:1130']++;
                        self.log('Call func', conf[tag]);
                        __$coverObject['webdocs/test/src/lib/xqcore.js']['1137:1157']++;
                        conf[tag].call(self);
                    }
                }, false);
            }
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1189:1232']++;
        presenter.prototype.init = function () {
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1322:1410']++;
        presenter.prototype.viewInit = function (view) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['1374:1406']++;
            console.log('I', view.name, view);
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1470:1570']++;
        presenter.prototype.pushState = function (data, title, url) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['1533:1566']++;
            history.pushState(data, title, url);
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1574:1590']++;
        return presenter;
    }();
__$coverObject['webdocs/test/src/lib/xqcore.js']['1599:4914']++;
var CoreModel = function (window, document, $, undefined) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1660:1669']++;
        var model;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['1673:2276']++;
        model = function (conf) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['1700:1742']++;
            if (conf === undefined) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['1729:1738']++;
                conf = {};
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['1747:1802']++;
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverObject['webdocs/test/src/lib/xqcore.js']['1806:1853']++;
            this.name = (conf.name || 'Nameless') + 'Model';
            __$coverObject['webdocs/test/src/lib/xqcore.js']['1857:1889']++;
            this.debug = Boolean(conf.debug);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['1893:1913']++;
            this.attributes = {};
            __$coverObject['webdocs/test/src/lib/xqcore.js']['1917:1938']++;
            this._isValid = false;
            __$coverObject['webdocs/test/src/lib/xqcore.js']['1943:2256']++;
            if (conf.validate) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['1967:2252']++;
                this.validate = function (formData) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['2008:2018']++;
                    var result;
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['2025:2046']++;
                    this._isValid = false;
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['2052:2095']++;
                    result = conf.validate.call(this, formData);
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['2101:2215']++;
                    if (!result || typeof result === 'object' && Object.keys(result).length === 0) {
                        __$coverObject['webdocs/test/src/lib/xqcore.js']['2189:2209']++;
                        this._isValid = true;
                    }
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['2222:2235']++;
                    return result;
                }.bind(this);
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['2261:2272']++;
            this.init();
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['2280:2319']++;
        model.prototype.init = function () {
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['2323:2366']++;
        model.prototype.validate = function () {
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['2370:2435']++;
        model.prototype.isValid = function () {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['2411:2431']++;
            return this._isValid;
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['2548:3215']++;
        model.prototype.set = function () {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['2585:2620']++;
            var newData = {}, validateResult;
            __$coverObject['webdocs/test/src/lib/xqcore.js']['2625:2981']++;
            if (typeof arguments[0] === 'object') {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['2687:2718']++;
                $.extend(newData, arguments[0]);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['2723:2757']++;
                this.log('Set data', arguments[0]);
            } else if (typeof arguments[0] === 'string') {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['2813:2849']++;
                newData[arguments[0]] = arguments[1];
                __$coverObject['webdocs/test/src/lib/xqcore.js']['2854:2902']++;
                this.log('Set data', arguments[0], arguments[1]);
            } else {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['2920:2977']++;
                this.warn('Data are incorrect in model.set()', arguments);
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['2986:3172']++;
            if (this.validate) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['3010:3049']++;
                validateResult = this.validate(newData);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['3054:3168']++;
                if (validateResult) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['3080:3136']++;
                    this.warn('Validate error in model.set', validateResult);
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['3142:3163']++;
                    return validateResult;
                }
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['3177:3211']++;
            $.extend(this.attributes, newData);
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['3351:3494']++;
        model.prototype.get = function (key) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['3391:3490']++;
            if (key === undefined) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['3419:3441']++;
                return this.attributes;
            } else {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['3459:3486']++;
                return this.attributes[key];
            }
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['3652:3725']++;
        model.prototype.has = function (key) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['3692:3721']++;
            return !!this.attributes[key];
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['3770:3860']++;
        model.prototype.reset = function () {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['3809:3832']++;
            this.log('Reset model');
            __$coverObject['webdocs/test/src/lib/xqcore.js']['3836:3856']++;
            this.attributes = {};
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4211:4868']++;
        model.prototype.send = function (method, callback) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['4265:4273']++;
            var data;
            __$coverObject['webdocs/test/src/lib/xqcore.js']['4278:4303']++;
            method = method || 'POST';
            __$coverObject['webdocs/test/src/lib/xqcore.js']['4308:4325']++;
            data = this.get();
            __$coverObject['webdocs/test/src/lib/xqcore.js']['4330:4453']++;
            if (!this.server) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['4353:4432']++;
                this.error('Can not send an ajax request! You must define a server URL first.');
                __$coverObject['webdocs/test/src/lib/xqcore.js']['4437:4449']++;
                return false;
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['4458:4528']++;
            this.log('Sending an ajax call to ', this.server, 'with data: ', data);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['4533:4864']++;
            $.ajax({
                url: this.server,
                method: method,
                data: data,
                success: function (data, status, jqXHR) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['4645:4691']++;
                    callback.call(this, null, data, status, jqXHR);
                }.bind(this),
                error: function (jqXHR, status, error) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['4757:4842']++;
                    callback.call(this, {
                        type: status,
                        http: error
                    }, null, status, jqXHR);
                }.bind(this)
            });
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4872:4884']++;
        return model;
    }(window, document, jQuery);
__$coverObject['webdocs/test/src/lib/xqcore.js']['4917:7269']++;
var CoreView = function () {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['4948:6861']++;
        var view = function (presenter, conf) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['4989:5004']++;
            var self = this;
            __$coverObject['webdocs/test/src/lib/xqcore.js']['5009:5045']++;
            conf = conf || {events: null};
            __$coverObject['webdocs/test/src/lib/xqcore.js']['5050:5105']++;
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverObject['webdocs/test/src/lib/xqcore.js']['5109:5155']++;
            this.name = (conf.name || 'Nameless') + 'View';
            __$coverObject['webdocs/test/src/lib/xqcore.js']['5159:5185']++;
            this.presenter = presenter;
            __$coverObject['webdocs/test/src/lib/xqcore.js']['5190:5222']++;
            this.debug = Boolean(conf.debug);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['5226:5260']++;
            this.container = $(conf.container);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['5264:6857']++;
            if (this.container.length > 0) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['5300:5380']++;
                window.addEventListener('resize', function (e) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['5352:5366']++;
                    self.resize(e);
                }, false);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['5386:5430']++;
                this.log('Initialize view with conf:', conf);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['5435:5490']++;
                this.log('  ... using Presenter:', this.presenter.name);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['5495:5545']++;
                this.log('  ... using Container:', this.container);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['5581:6663']++;
                if (this.events) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['5604:6605']++;
                    Object.keys(this.events).forEach(function (key) {
                        __$coverObject['webdocs/test/src/lib/xqcore.js']['5658:5786']++;
                        var split = key.split(' ', 2), eventFunc, eventName = split[0], selector = split[1] || null, self = this;
                        __$coverObject['webdocs/test/src/lib/xqcore.js']['5794:6591']++;
                        if (split.length === 1 || split.length === 2) {
                            __$coverObject['webdocs/test/src/lib/xqcore.js']['5848:5899']++;
                            eventFunc = this.presenter.events[this.events[key]];
                            __$coverObject['webdocs/test/src/lib/xqcore.js']['5907:6511']++;
                            if (typeof eventFunc === 'function') {
                                __$coverObject['webdocs/test/src/lib/xqcore.js']['5986:6294']++;
                                this.container.on(eventName, function (e) {
                                    __$coverObject['webdocs/test/src/lib/xqcore.js']['6037:6081']++;
                                    var formData = null, tagData = null;
                                    __$coverObject['webdocs/test/src/lib/xqcore.js']['6092:6220']++;
                                    if (e.type === 'submit') {
                                        __$coverObject['webdocs/test/src/lib/xqcore.js']['6128:6171']++;
                                        formData = CoreUtil.serializeForm(e.target);
                                        __$coverObject['webdocs/test/src/lib/xqcore.js']['6182:6210']++;
                                        tagData = $(e.target).data();
                                    }
                                    __$coverObject['webdocs/test/src/lib/xqcore.js']['6231:6283']++;
                                    eventFunc.call(self.presenter, e, tagData, formData);
                                });
                                __$coverObject['webdocs/test/src/lib/xqcore.js']['6303:6394']++;
                                this.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);
                            } else {
                                __$coverObject['webdocs/test/src/lib/xqcore.js']['6424:6503']++;
                                this.warn('Event handler callback not defined in Presenter:', this.events[key]);
                            }
                        } else {
                            __$coverObject['webdocs/test/src/lib/xqcore.js']['6538:6584']++;
                            this.warn('Incorect event configuration', key);
                        }
                    }, this);
                } else {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['6623:6658']++;
                    this.warn('No view events defined');
                }
                __$coverObject['webdocs/test/src/lib/xqcore.js']['6684:6695']++;
                this.init();
                __$coverObject['webdocs/test/src/lib/xqcore.js']['6732:6761']++;
                this.presenter.viewInit(this);
            } else {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['6779:6853']++;
                this.error('Can\'t initialize View, Container not found!', this.container);
            }
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['6865:6903']++;
        view.prototype.init = function () {
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['6907:6947']++;
        view.prototype.show = function () {
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['6951:6991']++;
        view.prototype.hide = function () {
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['6995:7200']++;
        view.prototype.render = function (data) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['7038:7105']++;
            this.log('Render view template', this.template, 'with data:', data);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['7109:7157']++;
            var template = Handlebars.compile(this.template);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['7161:7196']++;
            this.container.html(template(data));
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7204:7246']++;
        view.prototype.resize = function () {
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7252:7263']++;
        return view;
    }();
__$coverObject['webdocs/test/src/lib/xqcore.js']['7272:9028']++;
var CoreEvent = function () {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7303:7318']++;
        var ee, event;
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7323:7641']++;
        function indexOf(eventName, callback) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['7365:7394']++;
            this.objectName = 'CoreEvent';
            __$coverObject['webdocs/test/src/lib/xqcore.js']['7401:7445']++;
            var len = this.store.length, i = 0, el;
            __$coverObject['webdocs/test/src/lib/xqcore.js']['7450:7622']++;
            for (; i < len; i++) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['7476:7494']++;
                el = this.store[i];
                __$coverObject['webdocs/test/src/lib/xqcore.js']['7499:7618']++;
                if (eventName === null || eventName === el.event && callback === null || callback === el.callback) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['7604:7613']++;
                    return el;
                }
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['7627:7638']++;
            return null;
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7646:7692']++;
        event = function (conf) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['7673:7688']++;
            this.store = [];
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7964:7987']++;
        ee = new EventEmitter();
        __$coverObject['webdocs/test/src/lib/xqcore.js']['7990:8172']++;
        event.prototype.emit = function (eventName, data) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8043:8126']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['8064:8122']++;
                console.debug('Akonda Core - Emit event', eventName, data);
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8130:8168']++;
            return ee.emitEvent(eventName, [data]);
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['8176:8370']++;
        event.prototype.on = function (eventName, listener) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8231:8320']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['8252:8316']++;
                console.debug('Akonda Core - Add listener', eventName, listener);
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8324:8366']++;
            return ee.addListener(eventName, listener);
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['8374:8713']++;
        event.prototype.once = function (eventName, listener) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8431:8560']++;
            var onceListener = function () {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['8466:8504']++;
                ee.removeListener(eventName, listener);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['8509:8539']++;
                listener.call(null, arguments);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['8544:8555']++;
                return true;
            };
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8565:8659']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['8586:8655']++;
                console.debug('Akonda Core - Add once listener', eventName, listener);
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8663:8709']++;
            return ee.addListener(eventName, onceListener);
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['8717:9006']++;
        event.prototype.off = function (eventName, listener) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8773:8865']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['8794:8861']++;
                console.debug('Akonda Core - Remove listener', eventName, listener);
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['8870:9002']++;
            if (listener === undefined) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['8903:8935']++;
                return ee.removeEvent(eventName);
            } else {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['8953:8998']++;
                return ee.removeListener(eventName, listener);
            }
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['9010:9022']++;
        return event;
    }();
__$coverObject['webdocs/test/src/lib/xqcore.js']['9031:11519']++;
var CoreLogger = function (conf) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['9093:9358']++;
        function getHumanTime(time) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['9125:9355']++;
            if (time < 1000) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['9147:9166']++;
                return time + ' ms';
            } else if (time < 60000) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['9202:9247']++;
                return Math.round(time / 100) / 10 + ' sec';
            } else {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['9265:9351']++;
                return Math.round(time / 60000) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';
            }
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['9362:9554']++;
        function onScreenConsole() {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['9393:9410']++;
            var conf, html;
            __$coverObject['webdocs/test/src/lib/xqcore.js']['9415:9489']++;
            conf = localStorage.get('core-onscreen-console') || {pos: 'bottom'};
            __$coverObject['webdocs/test/src/lib/xqcore.js']['9494:9551']++;
            html = '<div id="CoreLogger-OnScreenConsole">\t\t\t</div>';
        }
        __$coverObject['webdocs/test/src/lib/xqcore.js']['9709:9740']++;
        var logger = function () {
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['9848:10049']++;
        logger.prototype.log = function () {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['9886:9894']++;
            var args;
            __$coverObject['webdocs/test/src/lib/xqcore.js']['9899:10045']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['9920:9964']++;
                args = Array.prototype.slice.call(arguments);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['9969:10004']++;
                args.unshift('[' + this.name + ']');
                __$coverObject['webdocs/test/src/lib/xqcore.js']['10009:10041']++;
                console.log.apply(console, args);
            }
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['10157:10360']++;
        logger.prototype.warn = function () {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['10196:10204']++;
            var args;
            __$coverObject['webdocs/test/src/lib/xqcore.js']['10209:10356']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['10230:10274']++;
                args = Array.prototype.slice.call(arguments);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['10279:10314']++;
                args.unshift('[' + this.name + ']');
                __$coverObject['webdocs/test/src/lib/xqcore.js']['10319:10352']++;
                console.warn.apply(console, args);
            }
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['10474:10679']++;
        logger.prototype.error = function () {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['10514:10522']++;
            var args;
            __$coverObject['webdocs/test/src/lib/xqcore.js']['10527:10675']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['10548:10592']++;
                args = Array.prototype.slice.call(arguments);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['10597:10632']++;
                args.unshift('[' + this.name + ']');
                __$coverObject['webdocs/test/src/lib/xqcore.js']['10637:10671']++;
                console.error.apply(console, args);
            }
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['10826:11262']++;
        logger.prototype.timer = function (name) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['10870:11097']++;
            var timer = {
                    start: null,
                    stop: null,
                    name: name,
                    logger: this,
                    end: function () {
                        __$coverObject['webdocs/test/src/lib/xqcore.js']['10972:10994']++;
                        this.stop = Date.now();
                        __$coverObject['webdocs/test/src/lib/xqcore.js']['11000:11087']++;
                        this.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));
                    }
                };
            __$coverObject['webdocs/test/src/lib/xqcore.js']['11159:11188']++;
            this.log('Start Timer', name);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['11218:11242']++;
            timer.start = Date.now();
            __$coverObject['webdocs/test/src/lib/xqcore.js']['11246:11258']++;
            return timer;
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['11360:11430']++;
        logger.prototype.timerEnd = function (timer) {
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['11434:11494']++;
        logger.prototype.__scope = {getHumanTime: getHumanTime};
        __$coverObject['webdocs/test/src/lib/xqcore.js']['11500:11513']++;
        return logger;
    }();
__$coverObject['webdocs/test/src/lib/xqcore.js']['11633:13560']++;
var CoreUtil = function ($) {
        __$coverObject['webdocs/test/src/lib/xqcore.js']['11665:11714']++;
        var util = {
                name: 'CoreUtil',
                debug: true
            };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['11855:12285']++;
        util.serializeForm = function (selector) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['11899:11947']++;
            var formData = {}, formSelector = $(selector);
            __$coverObject['webdocs/test/src/lib/xqcore.js']['11952:12062']++;
            if (formSelector.get(0).tagName === 'INPUT') {
            } else {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['12016:12058']++;
                formSelector = formSelector.find(':input');
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['12067:12163']++;
            formSelector.serializeArray().forEach(function (item) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['12125:12157']++;
                formData[item.name] = item.value;
            });
            __$coverObject['webdocs/test/src/lib/xqcore.js']['12168:12261']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['12189:12257']++;
                console.log('Akonda Core - Serialize form:', formSelector, formData);
            }
            __$coverObject['webdocs/test/src/lib/xqcore.js']['12266:12281']++;
            return formData;
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['12637:13014']++;
        util.checkLength = function (input, min, max) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['12686:13010']++;
            if (typeof input === 'Number') {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['12722:12830']++;
                if (input < min) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['12745:12766']++;
                    return 'num-to-small';
                } else if (input > max) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['12804:12825']++;
                    return 'num-to-large';
                }
            } else {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['12848:12880']++;
                console.log(input, input.length);
                __$coverObject['webdocs/test/src/lib/xqcore.js']['12885:13006']++;
                if (input.length < min) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['12915:12936']++;
                    return 'str-to-short';
                } else if (input.length > max) {
                    __$coverObject['webdocs/test/src/lib/xqcore.js']['12981:13001']++;
                    return 'str-to-long';
                }
            }
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['13215:13312']++;
        util.checkEqual = function (str1, str2) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['13258:13308']++;
            if (str1 !== str2) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['13282:13304']++;
                return 'str-not-equal';
            }
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['13415:13532']++;
        util.checkEmail = function (email) {
            __$coverObject['webdocs/test/src/lib/xqcore.js']['13453:13528']++;
            if (!/^\S+\@\S+\.[a-z]{2,10}$/.test(email)) {
                __$coverObject['webdocs/test/src/lib/xqcore.js']['13502:13524']++;
                return 'invalid-email';
            }
        };
        __$coverObject['webdocs/test/src/lib/xqcore.js']['13536:13547']++;
        return util;
    }(jQuery);