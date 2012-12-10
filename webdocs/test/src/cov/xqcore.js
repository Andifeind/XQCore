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
__$coverInit("webdocs/test/src/lib/xqcore.js", "var XQCore = {\n\tversion: 0.1\n};\n\n/**\n * Implement include support\n *\n * File must be absolute to the document root\n *\n * @param {String} file Filename to be load\n */\nif (!window.include) {\n\twindow.include = function(file, callback) {\n\t\tvar url = location.protocol + '//' + location.host + file;\n\t\t$.ajax({\n\t\t\turl: url,\n\t\t\tdataType: \"script\",\n\t\t\tsuccess: callback,\n\t\t\tasync: false\n\t\t});\n\t};\n}\n\nXQCore.Presenter = (function() {\n\n\tvar presenter = function(conf) {\n\t\tvar self = this;\n\t\t\n\t\tthis.root = '/';\n\t\tthis.debug = false;\n\t\t\n\t\tconf = conf || {};\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Presenter';\n\t\tthis.eventCallbacks = {};\n\n\t\tthis.log('Initialize presenter with conf:', conf);\n\t\tthis.init();\n\n\t\t//Setup popstate listener\n\t\tif (conf.routes) {\n\t\t\tthis.Router = new XQCore.Router();\n\n\t\t\t//Add routes\n\t\t\tObject.keys(conf.routes).forEach(function(route) {\n\t\t\t\tvar callback = this.routes[route];\n\t\t\t\tif (typeof callback === 'string') {\n\t\t\t\t\tcallback = this[callback];\n\t\t\t\t}\n\n\t\t\t\tif (typeof callback === 'function') {\n\t\t\t\t\tthis.Router.addRoute(route, callback);\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\tthis.warn('Router callback isn\\'t a function', callback, 'of route', route);\n\t\t\t\t}\n\t\t\t});\n\n\t\t\twindow.addEventListener('popstate', function(e) {\n\t\t\t\tself.log('popstate event recived', e);\n\t\t\t\tif (!e.state) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tvar tag = e.state.tag,\n\t\t\t\t\turl = e.state.url;\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tconf[tag].call(self, e.state.data);\n\t\t\t\t}\n\t\t\t}, false);\n\n\t\t\twindow.addEventListener('hashchange', function(e) {\n\t\t\t\tself.log('hashchange event recived', e, location.hash);\n\t\t\t\tvar tag = location.hash.substring(1);\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tself.log('Call func', conf[tag]);\n\t\t\t\t\tconf[tag].call(self);\n\t\t\t\t}\n\t\t\t}, false);\n\t\t}\n\t};\n\n\tpresenter.prototype.init = function() {\n\n\t};\n\n\t/**\n\t * Calling on view init\n\t *\n\t * @param {object} view The initializing view\n\t */\n\tpresenter.prototype.viewInit = function(view) {\n\n\t};\n\n\t/**\n\t * Add a history item to the browser history\n\t */\n\tpresenter.prototype.pushState = function(data, title, url) {\n\t\thistory.pushState(data,title,url);\n\t};\n\n\treturn presenter;\n})();\n\nXQCore.Model = (function(window, document, $, undefined) {\n\tvar model;\n\n\tmodel = function(conf) {\n\t\tif (conf === undefined) {\n\t\t\tconf = {};\n\t\t}\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Model';\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.attributes = {};\n\t\tthis._isValid = false;\n\n\t\tif (conf.validate) {\n\t\t\tthis.validate = function(formData) {\n\t\t\t\tvar result;\n\n\t\t\t\tthis._isValid = false;\n\t\t\t\tresult = conf.validate.call(this, formData);\n\t\t\t\tif (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {\n\t\t\t\t\tthis._isValid = true;\n\t\t\t\t}\n\n\t\t\t\treturn result;\n\t\t\t}.bind(this);\n\t\t}\n\n\t\tthis.init();\n\t};\n\n\tmodel.prototype.init = function() {\n\n\t};\n\n\tmodel.prototype.validate = function() {\n\n\t};\n\n\tmodel.prototype.isValid = function() {\n\t\treturn this._isValid;\n\t};\n\n\t/**\n\t * Set model data\n\t *\n\t * @param {Object or String} data/key\n\t * @param {Object} value Data value\n\t */\n\tmodel.prototype.set = function() {\n\t\tvar newData = {},\n\t\t\tvalidateResult;\n\n\t\tif (typeof arguments[0] === 'object') {\n\t\t\t//Add a dataset\n\t\t\t$.extend(newData, arguments[0]);\n\t\t\tthis.log('Set data', arguments[0]);\n\t\t}\n\t\telse if (typeof arguments[0] === 'string') {\n\t\t\tnewData[arguments[0]] = arguments[1];\n\t\t\tthis.log('Set data', arguments[0], arguments[1]);\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Data are incorrect in model.set()', arguments);\n\t\t}\n\n\t\tif (this.validate) {\n\t\t\tvalidateResult = this.validate(newData);\n\t\t\tif (validateResult) {\n\t\t\t\tthis.warn('Validate error in model.set', validateResult);\n\t\t\t\treturn validateResult;\n\t\t\t}\n\t\t}\n\n\t\t$.extend(this.attributes, newData);\n\t};\n\n\t/**\n\t * Get one or all attributes from model\n\t *\n\t * @param  {String} key Data key\n\t *\n\t * @return {Object}     Model dataset\n\t */\n\tmodel.prototype.get = function(key) {\n\t\tif (key === undefined) {\n\t\t\treturn this.attributes;\n\t\t}\n\t\telse {\n\t\t\treturn this.attributes[key];\n\t\t}\n\t};\n\n\t/**\n\t * Check wether model has a dataset\n\t *\n\t * @param {String} key Dataset key\n\t * @return {Boolean} Returns true if model has a dataset with key\n\t */\n\tmodel.prototype.has = function(key) {\n\t\treturn !!this.attributes[key];\n\t};\n\n\t/**\n\t * Remove all data from model\n\t */\n\tmodel.prototype.reset = function() {\n\t\tthis.log('Reset model');\n\t\tthis.attributes = {};\n\t};\n\n\t/**\n\t * Append data to a subset\n\t *\n\t * @param {String} path path to subset\n\t * @param {Object} data data to add\n\t */\n\tmodel.prototype.append = function(path, data) {\n\t\tvar dataset = this.attributes;\n\t\tpath.split('.').forEach(function(key) {\n\t\t\tdataset = dataset[key];\n\t\t});\n\n\t\tif (dataset instanceof Array) {\n\t\t\tdataset.push(data);\n\t\t}\n\t\telse {\n\t\t\tdataset = $.extend(dataset, data);\n\t\t}\n\n\t\treturn data;\n\t};\n\n\t/**\n\t * Prepend data to a subset\n\t *\n\t * @param {String} path path to subset\n\t * @param {Object} data data to add\n\t */\n\tmodel.prototype.prepend = function(path, data) {\n\t\tvar dataset = this.attributes;\n\t\tpath.split('.').forEach(function(key) {\n\t\t\tdataset = dataset[key];\n\t\t});\n\n\t\tif (dataset instanceof Array) {\n\t\t\tdataset.unshift(data);\n\t\t}\n\t\telse {\n\t\t\tdataset = $.extend(data, dataset);\n\t\t}\n\n\t\treturn data;\n\t};\n\n\t/**\n\t * Remove a subset\n\t *\n\t * @param {String} path path to subset\n\t * @param {Number} index Index of the subsut to remove\n\t *\n\t * @return {Object} removed subset\n\t */\n\tmodel.prototype.remove = function(path, index) {\n\t\tvar dataset = this.attributes,\n\t\t\tdata = null;\n\t\tpath.split('.').forEach(function(key) {\n\t\t\tdataset = dataset[key];\n\t\t});\n\n\t\tif (dataset instanceof Array) {\n\t\t\tdata = dataset.splice(index, 1);\n\t\t\tdata = data[0] || null;\n\t\t}\n\t\telse {\n\t\t\tthis.warn('Model.remove() doesn\\'t work with Objects in model', this.name);\n\t\t}\n\n\t\treturn data;\n\t};\n\n\t/**\n\t * Send an ajax request to a webserver. Sends all models attributes\n\t *\n\t * You must set the server URI first with model.server = 'http://example.com/post'\n\t *\n\t * @param {String} Method send method, GET, POST, PUT, DELETE (default POST)\n\t * @param {Function} callback Calls callback(err, data, status, jqXHR) if response was receiving\n\t */\n\tmodel.prototype.send = function(method, callback) {\n\t\tvar data;\n\n\t\tmethod = method || 'POST';\n\n\t\tdata = this.get();\n\n\t\tif (!this.server) {\n\t\t\tthis.error('Can not send an ajax request! You must define a server URL first.');\n\t\t\treturn false;\n\t\t}\n\n\t\tthis.log('Sending an ajax call to ', this.server, 'with data: ', data);\n\n\t\t$.ajax({\n\t\t\turl: this.server,\n\t\t\tmethod: method,\n\t\t\tdata: data,\n\t\t\tsuccess: function(data, status, jqXHR) {\n\t\t\t\tcallback.call(this, null, data, status, jqXHR);\n\t\t\t}.bind(this),\n\t\t\terror: function(jqXHR, status, error) {\n\t\t\t\tcallback.call(this, {\n\t\t\t\t\ttype: status,\n\t\t\t\t\thttp: error\n\t\t\t\t}, null, status, jqXHR);\n\t\t\t}.bind(this)\n\t\t});\n\t};\n\n\treturn model;\n})(window, document, jQuery);\n\nXQCore.View = (function(undefined) {\n\n\tvar view = function(presenter, conf) {\n\t\tvar self = this;\n\n\t\tconf = conf || {\n\t\t\tevents: null\n\t\t};\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'View';\n\t\tthis.presenter = presenter;\n\n\t\tthis.debug = Boolean(conf.debug);\n\n\t\t$(function() {\n\t\t\tthis.container = $(conf.container);\n\t\t\tif (this.container.length > 0) {\n\t\t\t\twindow.addEventListener('resize', function(e) {\n\t\t\t\t\tself.resize(e);\n\t\t\t\t}, false);\n\n\t\t\t\tthis.log('Initialize view with conf:', conf);\n\t\t\t\tthis.log('  ... using Presenter:', this.presenter.name);\n\t\t\t\tthis.log('  ... using Container:', this.container);\n\n\t\t\t\t//Send events to presenter\n\t\t\t\tif (this.events) {\n\t\t\t\t\tObject.keys(this.events).forEach(function(key) {\n\t\t\t\t\t\tvar split = key.split(' ', 2),\n\t\t\t\t\t\t\teventFunc,\n\t\t\t\t\t\t\teventName = split[0],\n\t\t\t\t\t\t\tselector = split[1] || this.container,\n\t\t\t\t\t\t\tself = this;\n\n\t\t\t\t\t\tif (split.length === 1 || split.length === 2) {\n\t\t\t\t\t\t\teventFunc = this.presenter.events[this.events[key]];\n\t\t\t\t\t\t\tif (typeof eventFunc === 'function') {\n\t\t\t\t\t\t\t\t//Register event listener\n\t\t\t\t\t\t\t\tthis.container.delegate(selector, eventName, function(e) {\n\t\t\t\t\t\t\t\t\tvar formData = null,\n\t\t\t\t\t\t\t\t\t\ttagData = null;\n\n\t\t\t\t\t\t\t\t\tif (e.type === 'submit') {\n\t\t\t\t\t\t\t\t\t\tformData = XQCore.Util.serializeForm(e.target);\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\ttagData = $.extend($(e.target).data(), {\n\t\t\t\t\t\t\t\t\t\titemIndex: getItemIndex.call(self, e.target)\n\t\t\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\t\t\teventFunc.call(self.presenter, e, tagData, formData);\n\t\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\t\tthis.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\telse {\n\t\t\t\t\t\t\t\tthis.warn('Event handler callback not defined in Presenter:', this.events[key]);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\telse {\n\t\t\t\t\t\t\tthis.warn('Incorect event configuration', key);\n\t\t\t\t\t\t}\n\t\t\t\t\t}, this);\n\t\t\t\t} else {\n\t\t\t\t\tthis.warn('No view events defined');\n\t\t\t\t}\n\n\t\t\t\t//Self init\n\t\t\t\tthis.init();\n\n\t\t\t\t//Call presenter.initView()\n\t\t\t\tthis.presenter.viewInit(this);\n\t\t\t}\n\t\t\telse {\n\t\t\t\tthis.error('Can\\'t initialize View, Container not found!', this.container);\n\t\t\t}\n\t\t}.bind(this));\n\t};\n\n\tview.prototype.init = function() {\n\n\t\t\t\tconsole.log('View Init2', this);\n\t};\n\n\tview.prototype.show = function() {\n\t\t\n\t};\n\n\tview.prototype.hide = function() {\n\t\t\n\t};\n\n\tview.prototype.render = function(data) {\n\t\tthis.log('Render view template', this.template, 'with data:', data);\n\t\tvar template = Handlebars.compile(this.template);\n\t\tthis.container.html(template(data));\n\t};\n\n\tview.prototype.resize = function() {\n\t\t\n\t};\n\n\t/**\n\t * Appends a html fragment to a html element\n\t * You must set the itemTemplate and subSelector  option first\n\t *\n\t * @param {String} selector parent selector\n\t * @param {Object} data item data\n\t * @param {Object} options Appending options (not implemented yet)\n\t */\n\tview.prototype.append = function(data, options) {\n\t\tthis.manipulate('append', data, options);\n\t};\n\n\t/**\n\t * Prepends a html fragment to a html element\n\t * You must set the itemTemplate and subSelector option first\n\t *\n\t * @param {Object} data item data\n\t * @param {Object} options Prepending options (not implemented yet)\n\t */\n\tview.prototype.prepend = function(data, options) {\n\t\tthis.manipulate('prepend', data, options);\n\t};\n\n\t/**\n\t * Remove a item from a dom node\n\t *\n\t * @param {Number} index Remove item <index> from a node list\n\t */\n\tview.prototype.remove = function(index) {\n\t\tthis.manipulate('remove', index);\n\t};\n\n\t/**\n\t * Manipulates a dom node\n\t *\n\t * @param  {String} action  Manipulation method\n\t * @param  {[type]} data    [description]\n\t * @param  {[type]} options (not implemented yet)\n\t *\n\t * @return {[type]}         [description]\n\t */\n\tview.prototype.manipulate = function(action, data, options) {\n\t\tif (this.subSelector === undefined) {\n\t\t\tthis.warn('You must set the subSelector option');\n\t\t\treturn false;\n\t\t}\n\n\t\tif (this.itemTemplate === undefined) {\n\t\t\tthis.warn('You must set the itemTemplate option');\n\t\t\treturn false;\n\t\t}\n\n\t\tvar selector = $(this.subSelector),\n\t\t\thtml;\n\n\t\tif (options) {\n\t\t\t//TODO handle transition options\n\t\t}\n\n\t\tswitch (action) {\n\t\t\tcase 'append':\n\t\t\t\thtml = Handlebars.compile(this.itemTemplate)(data);\n\t\t\t\t$(html).appendTo(selector);\n\t\t\t\tbreak;\n\t\t\tcase 'prepend':\n\t\t\t\thtml = Handlebars.compile(this.itemTemplate)(data);\n\t\t\t\t$(html).prependTo(selector);\n\t\t\t\tbreak;\n\t\t\tcase 'remove':\n\t\t\t\tselector.children().eq(data).remove();\n\t\t\t\tbreak;\n\t\t\tdefault:\n\t\t\t\tthis.error('undefined action in view.manipulate()', action);\n\t\t}\n\n\t};\n\n\t/**\n\t * Gets the index of a subSelector item\n\t * This function must binded to the view\n\t *\n\t * @param  {Object} el Start element.\n\t *\n\t * @return {Number}    index of the element or null\n\t */\n\tvar getItemIndex = function(el) {\n\t\tvar index = null,\n\t\t\tcontainer = $(this.container).get(0),\n\t\t\tcurEl = $(el),\n\t\t\tnextEl = curEl.parent(),\n\t\t\tsubSelector = $(this.subSelector).get(0),\n\t\t\td = 0;\n\n\t\tif (this.subSelector) {\n\t\t\tdo {\n\t\t\t\tif (nextEl.get(0) === subSelector) {\n\t\t\t\t\treturn $(curEl).index();\n\t\t\t\t}\n\t\t\t\tcurEl = curEl.parent();\n\t\t\t\tnextEl = curEl.parent();\n\n\t\t\t\tif (++d > 100) {\n\t\t\t\t\tconsole.log(curEl, nextEl);\n\t\t\t\t\tconsole.error('Break loop!');\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t} while(curEl.length && curEl.get(0) !== container);\n\t\t}\n\n\t\treturn index;\n\t};\n\n\n\n\treturn view;\n})();\n\nXQCore.Event = (function() {\n\tvar ee,\n\t\tevent;\n\t\n\tfunction indexOf(eventName, callback) {\n\t\tthis.objectName = 'XQCore.Event';\n\t\t\n\t\tvar len = this.store.length,\n\t\t\ti = 0,\n\t\t\tel;\n\n\t\tfor (; i < len; i++) {\n\t\t\tel = this.store[i];\n\t\t\tif (eventName === null || eventName === el.event && callback === null || callback === el.callback) {\n\t\t\t\treturn el;\n\t\t\t}\n\t\t}\n\n\t\treturn null;\n\t}\n\n\n\tevent = function(conf) {\n\t\tthis.store = [];\n\t};\n\n\t// event.prototype.on = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.once = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.emit = function(eventName, data) {\n\n\t// };\n\n\t// event.prototype.remove = function(eventName, callback) {\n\n\t// };\n\n\tee = new EventEmitter();\n\tevent.prototype.emit = function(eventName, data) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Emit event', eventName, data);\n\t\t}\n\t\treturn ee.emitEvent(eventName, [data]);\n\t};\n\n\tevent.prototype.on = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Add listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, listener);\n\t};\n\n\tevent.prototype.once = function(eventName, listener) {\n\t\tvar onceListener = function() {\n\t\t\tee.removeListener(eventName, listener);\n\t\t\tlistener.call(null, arguments);\n\t\t\treturn true;\n\t\t};\n\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Add once listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, onceListener);\n\t};\n\n\tevent.prototype.off = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Remove listener', eventName, listener);\n\t\t}\n\n\t\tif (listener === undefined) {\n\t\t\treturn ee.removeEvent(eventName);\n\t\t}\n\t\telse {\n\t\t\treturn ee.removeListener(eventName, listener);\n\t\t}\n\t};\n\n\treturn event;\n})();\n\nXQCore.Logger = (function(conf) {\n\n\t//var timerStore = {};\n\n\tfunction getHumanTime(time) {\n\t\tif (time < 1000) {\n\t\t\treturn time + ' ms';\n\t\t}\n\t\telse if (time < 60000) {\n\t\t\treturn (Math.round(time / 100) / 10) + ' sec';\n\t\t}\n\t\telse {\n\t\t\treturn (Math.round(time / 60000)) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';\n\t\t}\n\t}\n\n\tfunction onScreenConsole() {\n\t\tvar conf,\n\t\t\thtml;\n\n\t\tconf = localStorage.get('xqcore-onscreen-console') || {\n\t\t\tpos: 'bottom'\n\t\t};\n\n\t\thtml = '<div id=\"XQCoreLogger-OnScreenConsole\">\\\n\t\t\t</div>';\n\t}\n\n\t/**\n\t * XQCore Logger is a logging tool to log messages, warnings, errors to the browser or onscreen console\n\t *\n\t * @return {[type]} [description]\n\t */\n\tvar logger = function() {\n\t\t\n\t};\n\n\t/**\n\t * Loggs a message to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.log = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.log.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Loggs a warning to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.warn = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.warn.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Loggs a error message to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.error = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.error.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Start a timeTracer\n\t *\n\t * @param {String} timerName Set the name for your (Optional)\n\t * @return {Object} Returns a TimerObject\n\t */\n\tlogger.prototype.timer = function(name) {\n\t\tvar timer = {\n\t\t\tstart: null,\n\t\t\tstop: null,\n\t\t\tname: name,\n\t\t\tlogger: this,\n\t\t\tend: function() {\n\t\t\t\tthis.stop = Date.now();\n\t\t\t\tthis.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));\n\t\t\t}\n\t\t};\n\n\t\t/*if (name) {\n\t\t\tthis.timerStore[name] = timer;\n\t\t}*/\n\n\t\tthis.log('Start Timer', name);\n\n\t\t//Set timer start time\n\t\ttimer.start = Date.now();\n\t\treturn timer;\n\t};\n\n\t/**\n\t * Stops a timer\n\t *\n\t * @param {String or Object} timerName Stops the given timer\n\t */\n\tlogger.prototype.timerEnd = function(timer) {\n\t\t//Set stop timer\n\t\t\n\t};\n\n\tlogger.prototype.__scope = {\n\t\tgetHumanTime: getHumanTime\n\t};\n\t\n\n\treturn logger;\n})();\n/**\n * A bunch of helpfull functions\n *\n * @return {Object} Returns a singelton object instance of XQCore.Util\n */\nXQCore.Util = (function($) {\n\n\tvar util = {\n\t\tname: 'XQCore.Util',\n\t\tdebug: true\n\t};\n\n\t/**\n\t * Serialize a form and return its values as JSON\n\t *\n\t * @param {Object} Form selector\n\t * @return {Object} FormData as JSON\n\t */\n\tutil.serializeForm = function(selector) {\n\t\tvar formData = {},\n\t\t\tformSelector = $(selector);\n\n\t\tif (formSelector.get(0).tagName === 'INPUT') {\n\n\t\t}\n\t\telse {\n\t\t\tformSelector = formSelector.find(':input');\n\t\t}\n\n\t\tformSelector.serializeArray().forEach(function(item) {\n\t\t\tformData[item.name] = item.value;\n\t\t});\n\n\t\tif (this.debug) {\n\t\t\tconsole.log('XQCore - Serialize form:', formSelector, formData);\n\t\t}\n\n\t\treturn formData;\n\t};\n\n\t/**\n\t * Check length of a string or number\n\t *\n\t * @param {String or Number} input this will be checked\n\t * @param {Number} min String can't be shorter than n, Number can't be lower than n\n\t * @param {Number} max String can't be longer than n, Number can't be greater than n\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkLength = function(input, min, max) {\n\t\tif (typeof input === 'Number') {\n\t\t\tif (input < min) {\n\t\t\t\treturn 'num-to-small';\n\t\t\t}\n\t\t\telse if (input > max) {\n\t\t\t\treturn 'num-to-large';\n\t\t\t}\n\t\t}\n\t\telse {\n\t\t\tconsole.log(input, input.length);\n\t\t\tif (input.length < min) {\n\t\t\t\treturn 'str-to-short';\n\t\t\t}\n\t\t\telse if (input.length > max) {\n\t\t\t\treturn 'str-to-long';\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\t * Checks the equality of two strings\n\t *\n\t * @param {String} str1 First string\n\t * @param {String} str2 Second string\n\t *\n\t * @returns {String} errorMessage on invalid or void on valid\n\t */\n\tutil.checkEqual = function(str1, str2) {\n\t\tif (str1 !== str2) {\n\t\t\treturn 'str-not-equal';\n\t\t}\n\t};\n\n\t/**\n\t * Checks the validity of an email address\n\t *\n\t * @param {String} email e-Mail address\n\t */\n\tutil.checkEmail = function(email) {\n\t\tif (!/^\\S+\\@\\S+\\.[a-z]{2,10}$/.test(email)) {\n\t\t\treturn 'invalid-email';\n\t\t}\n\t};\n\n\treturn util;\n\n})(jQuery);");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "0:30");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "166:390");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "393:2202");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2205:6909");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6912:12201");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12204:13942");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13945:16439");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16556:18480");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "190:388");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "236:293");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "297:384");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "428:1828");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1832:1875");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1965:2016");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2076:2176");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2180:2196");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "463:478");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "485:500");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "504:522");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "529:546");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "551:612");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "616:667");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "671:695");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "700:749");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "753:764");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "797:1824");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "819:852");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "874:1239");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1245:1532");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1538:1820");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "929:962");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "968:1040");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1047:1232");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1009:1034");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1090:1127");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1151:1226");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1299:1336");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1342:1375");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1382:1427");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1434:1518");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1363:1369");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1478:1512");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1594:1648");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1654:1690");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1697:1806");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1741:1773");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "1780:1800");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2139:2172");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2265:2274");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2278:2887");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2891:2930");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2934:2977");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2981:3046");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3159:3826");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3962:4105");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4263:4336");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4381:4471");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4594:4881");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5005:5296");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5470:5855");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6206:6863");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6867:6879");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2305:2347");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2352:2413");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2417:2464");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2468:2500");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2504:2524");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2528:2549");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2554:2867");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2872:2883");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2334:2343");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2578:2863");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2619:2629");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2636:2657");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2663:2706");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2712:2826");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2833:2846");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "2800:2820");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3022:3042");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3196:3231");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3236:3592");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3597:3783");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3788:3822");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3298:3329");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3334:3368");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3424:3460");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3465:3513");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3531:3588");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3621:3660");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3665:3779");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3691:3747");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "3753:3774");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4002:4101");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4030:4052");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4070:4097");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4303:4332");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4420:4443");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4447:4467");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4644:4673");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4677:4748");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4753:4861");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4866:4877");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4720:4742");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4788:4806");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "4824:4857");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5056:5085");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5089:5160");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5165:5276");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5281:5292");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5132:5154");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5200:5221");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5239:5272");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5521:5566");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5570:5641");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5646:5835");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5840:5851");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5613:5635");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5681:5712");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5717:5739");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "5757:5831");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6260:6268");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6273:6298");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6303:6320");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6325:6448");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6453:6523");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6528:6859");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6348:6427");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6432:6444");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6640:6686");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6752:6837");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6951:9063");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9067:9142");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9146:9186");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9190:9230");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9234:9439");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9443:9485");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9761:9857");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10089:10187");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10302:10382");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10617:11429");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11626:12178");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12184:12195");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "6992:7007");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7012:7048");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7053:7114");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7118:7164");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7168:7194");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7199:7231");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7236:9059");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7254:7288");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7293:9042");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7330:7412");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7419:7463");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7469:7524");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7530:7580");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7618:8840");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8863:8874");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8913:8942");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7383:7397");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7642:8779");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7697:7839");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7848:8764");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7903:7954");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "7963:8680");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8044:8458");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8468:8559");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8112:8157");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8169:8263");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8275:8382");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8394:8446");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8206:8252");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8592:8671");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8710:8756");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8799:8834");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "8963:9037");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9107:9138");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9277:9344");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9348:9396");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9400:9435");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "9813:9853");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10142:10183");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10346:10378");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10681:10791");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10796:10908");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10913:10956");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10961:11014");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11019:11424");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10722:10770");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10775:10787");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10838:10887");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "10892:10904");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11059:11109");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11115:11141");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11147:11152");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11177:11227");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11233:11260");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11266:11271");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11295:11332");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11338:11343");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11361:11420");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11662:11820");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11825:12157");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12162:12174");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11852:12153");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11861:11932");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11938:11960");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11966:11989");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11996:12097");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "11903:11926");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12018:12044");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12051:12079");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12086:12091");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12234:12249");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12254:12575");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12580:12626");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12898:12921");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12924:13101");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13105:13294");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13298:13632");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13636:13920");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13924:13936");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12296:12328");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12335:12379");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12384:12556");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12561:12572");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12410:12428");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12433:12552");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12538:12547");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12607:12622");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12977:13055");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13059:13097");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "12998:13051");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13160:13244");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13248:13290");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13181:13240");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13355:13484");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13489:13578");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13582:13628");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13390:13428");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13433:13463");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13468:13479");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13510:13574");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13692:13779");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13784:13916");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13713:13775");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13817:13849");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "13867:13912");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14006:14271");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14275:14471");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14629:14660");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14768:14969");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15077:15280");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15394:15599");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15746:16182");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16280:16350");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16354:16414");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16420:16433");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14038:14268");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14060:14079");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14115:14160");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14178:14264");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14306:14323");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14328:14404");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14409:14468");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14806:14814");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14819:14965");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14840:14884");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14889:14924");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "14929:14961");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15116:15124");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15129:15276");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15150:15194");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15199:15234");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15239:15272");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15434:15442");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15447:15595");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15468:15512");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15517:15552");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15557:15591");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15790:16017");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16079:16108");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16138:16162");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16166:16178");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15892:15914");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "15920:16007");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16587:16639");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16780:17205");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17557:17934");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "18135:18232");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "18335:18452");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "18456:18467");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16824:16872");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16877:16987");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16992:17088");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17093:17181");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17186:17201");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "16941:16983");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17050:17082");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17114:17177");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17606:17930");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17642:17750");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17665:17686");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17724:17745");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17768:17800");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17805:17926");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17835:17856");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "17901:17921");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "18178:18228");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "18202:18224");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "18373:18448");
__$coverInitRange("webdocs/test/src/lib/xqcore.js", "18422:18444");
__$coverCall('webdocs/test/src/lib/xqcore.js', '0:30');
var XQCore = { version: 0.1 };
__$coverCall('webdocs/test/src/lib/xqcore.js', '166:390');
if (!window.include) {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '190:388');
    window.include = function (file, callback) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '236:293');
        var url = location.protocol + '//' + location.host + file;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '297:384');
        $.ajax({
            url: url,
            dataType: 'script',
            success: callback,
            async: false
        });
    };
}
__$coverCall('webdocs/test/src/lib/xqcore.js', '393:2202');
XQCore.Presenter = function () {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '428:1828');
    var presenter = function (conf) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '463:478');
        var self = this;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '485:500');
        this.root = '/';
        __$coverCall('webdocs/test/src/lib/xqcore.js', '504:522');
        this.debug = false;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '529:546');
        conf = conf || {};
        __$coverCall('webdocs/test/src/lib/xqcore.js', '551:612');
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverCall('webdocs/test/src/lib/xqcore.js', '616:667');
        this.name = (conf.name || 'Nameless') + 'Presenter';
        __$coverCall('webdocs/test/src/lib/xqcore.js', '671:695');
        this.eventCallbacks = {};
        __$coverCall('webdocs/test/src/lib/xqcore.js', '700:749');
        this.log('Initialize presenter with conf:', conf);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '753:764');
        this.init();
        __$coverCall('webdocs/test/src/lib/xqcore.js', '797:1824');
        if (conf.routes) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '819:852');
            this.Router = new XQCore.Router();
            __$coverCall('webdocs/test/src/lib/xqcore.js', '874:1239');
            Object.keys(conf.routes).forEach(function (route) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '929:962');
                var callback = this.routes[route];
                __$coverCall('webdocs/test/src/lib/xqcore.js', '968:1040');
                if (typeof callback === 'string') {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '1009:1034');
                    callback = this[callback];
                }
                __$coverCall('webdocs/test/src/lib/xqcore.js', '1047:1232');
                if (typeof callback === 'function') {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '1090:1127');
                    this.Router.addRoute(route, callback);
                } else {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '1151:1226');
                    this.warn('Router callback isn\'t a function', callback, 'of route', route);
                }
            });
            __$coverCall('webdocs/test/src/lib/xqcore.js', '1245:1532');
            window.addEventListener('popstate', function (e) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '1299:1336');
                self.log('popstate event recived', e);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '1342:1375');
                if (!e.state) {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '1363:1369');
                    return;
                }
                __$coverCall('webdocs/test/src/lib/xqcore.js', '1382:1427');
                var tag = e.state.tag, url = e.state.url;
                __$coverCall('webdocs/test/src/lib/xqcore.js', '1434:1518');
                if (typeof conf[tag] === 'function') {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '1478:1512');
                    conf[tag].call(self, e.state.data);
                }
            }, false);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '1538:1820');
            window.addEventListener('hashchange', function (e) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '1594:1648');
                self.log('hashchange event recived', e, location.hash);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '1654:1690');
                var tag = location.hash.substring(1);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '1697:1806');
                if (typeof conf[tag] === 'function') {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '1741:1773');
                    self.log('Call func', conf[tag]);
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '1780:1800');
                    conf[tag].call(self);
                }
            }, false);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '1832:1875');
    presenter.prototype.init = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '1965:2016');
    presenter.prototype.viewInit = function (view) {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '2076:2176');
    presenter.prototype.pushState = function (data, title, url) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2139:2172');
        history.pushState(data, title, url);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '2180:2196');
    return presenter;
}();
__$coverCall('webdocs/test/src/lib/xqcore.js', '2205:6909');
XQCore.Model = function (window, document, $, undefined) {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '2265:2274');
    var model;
    __$coverCall('webdocs/test/src/lib/xqcore.js', '2278:2887');
    model = function (conf) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2305:2347');
        if (conf === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '2334:2343');
            conf = {};
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2352:2413');
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2417:2464');
        this.name = (conf.name || 'Nameless') + 'Model';
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2468:2500');
        this.debug = Boolean(conf.debug);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2504:2524');
        this.attributes = {};
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2528:2549');
        this._isValid = false;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2554:2867');
        if (conf.validate) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '2578:2863');
            this.validate = function (formData) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '2619:2629');
                var result;
                __$coverCall('webdocs/test/src/lib/xqcore.js', '2636:2657');
                this._isValid = false;
                __$coverCall('webdocs/test/src/lib/xqcore.js', '2663:2706');
                result = conf.validate.call(this, formData);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '2712:2826');
                if (!result || typeof result === 'object' && Object.keys(result).length === 0) {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '2800:2820');
                    this._isValid = true;
                }
                __$coverCall('webdocs/test/src/lib/xqcore.js', '2833:2846');
                return result;
            }.bind(this);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '2872:2883');
        this.init();
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '2891:2930');
    model.prototype.init = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '2934:2977');
    model.prototype.validate = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '2981:3046');
    model.prototype.isValid = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '3022:3042');
        return this._isValid;
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '3159:3826');
    model.prototype.set = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '3196:3231');
        var newData = {}, validateResult;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '3236:3592');
        if (typeof arguments[0] === 'object') {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '3298:3329');
            $.extend(newData, arguments[0]);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '3334:3368');
            this.log('Set data', arguments[0]);
        } else if (typeof arguments[0] === 'string') {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '3424:3460');
            newData[arguments[0]] = arguments[1];
            __$coverCall('webdocs/test/src/lib/xqcore.js', '3465:3513');
            this.log('Set data', arguments[0], arguments[1]);
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '3531:3588');
            this.warn('Data are incorrect in model.set()', arguments);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '3597:3783');
        if (this.validate) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '3621:3660');
            validateResult = this.validate(newData);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '3665:3779');
            if (validateResult) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '3691:3747');
                this.warn('Validate error in model.set', validateResult);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '3753:3774');
                return validateResult;
            }
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '3788:3822');
        $.extend(this.attributes, newData);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '3962:4105');
    model.prototype.get = function (key) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4002:4101');
        if (key === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '4030:4052');
            return this.attributes;
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '4070:4097');
            return this.attributes[key];
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '4263:4336');
    model.prototype.has = function (key) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4303:4332');
        return !!this.attributes[key];
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '4381:4471');
    model.prototype.reset = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4420:4443');
        this.log('Reset model');
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4447:4467');
        this.attributes = {};
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '4594:4881');
    model.prototype.append = function (path, data) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4644:4673');
        var dataset = this.attributes;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4677:4748');
        path.split('.').forEach(function (key) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '4720:4742');
            dataset = dataset[key];
        });
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4753:4861');
        if (dataset instanceof Array) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '4788:4806');
            dataset.push(data);
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '4824:4857');
            dataset = $.extend(dataset, data);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '4866:4877');
        return data;
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '5005:5296');
    model.prototype.prepend = function (path, data) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '5056:5085');
        var dataset = this.attributes;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '5089:5160');
        path.split('.').forEach(function (key) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '5132:5154');
            dataset = dataset[key];
        });
        __$coverCall('webdocs/test/src/lib/xqcore.js', '5165:5276');
        if (dataset instanceof Array) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '5200:5221');
            dataset.unshift(data);
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '5239:5272');
            dataset = $.extend(data, dataset);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '5281:5292');
        return data;
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '5470:5855');
    model.prototype.remove = function (path, index) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '5521:5566');
        var dataset = this.attributes, data = null;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '5570:5641');
        path.split('.').forEach(function (key) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '5613:5635');
            dataset = dataset[key];
        });
        __$coverCall('webdocs/test/src/lib/xqcore.js', '5646:5835');
        if (dataset instanceof Array) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '5681:5712');
            data = dataset.splice(index, 1);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '5717:5739');
            data = data[0] || null;
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '5757:5831');
            this.warn('Model.remove() doesn\'t work with Objects in model', this.name);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '5840:5851');
        return data;
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '6206:6863');
    model.prototype.send = function (method, callback) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '6260:6268');
        var data;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '6273:6298');
        method = method || 'POST';
        __$coverCall('webdocs/test/src/lib/xqcore.js', '6303:6320');
        data = this.get();
        __$coverCall('webdocs/test/src/lib/xqcore.js', '6325:6448');
        if (!this.server) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '6348:6427');
            this.error('Can not send an ajax request! You must define a server URL first.');
            __$coverCall('webdocs/test/src/lib/xqcore.js', '6432:6444');
            return false;
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '6453:6523');
        this.log('Sending an ajax call to ', this.server, 'with data: ', data);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '6528:6859');
        $.ajax({
            url: this.server,
            method: method,
            data: data,
            success: function (data, status, jqXHR) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '6640:6686');
                callback.call(this, null, data, status, jqXHR);
            }.bind(this),
            error: function (jqXHR, status, error) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '6752:6837');
                callback.call(this, {
                    type: status,
                    http: error
                }, null, status, jqXHR);
            }.bind(this)
        });
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '6867:6879');
    return model;
}(window, document, jQuery);
__$coverCall('webdocs/test/src/lib/xqcore.js', '6912:12201');
XQCore.View = function (undefined) {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '6951:9063');
    var view = function (presenter, conf) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '6992:7007');
        var self = this;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7012:7048');
        conf = conf || { events: null };
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7053:7114');
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7118:7164');
        this.name = (conf.name || 'Nameless') + 'View';
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7168:7194');
        this.presenter = presenter;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7199:7231');
        this.debug = Boolean(conf.debug);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '7236:9059');
        $(function () {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '7254:7288');
            this.container = $(conf.container);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '7293:9042');
            if (this.container.length > 0) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '7330:7412');
                window.addEventListener('resize', function (e) {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '7383:7397');
                    self.resize(e);
                }, false);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '7419:7463');
                this.log('Initialize view with conf:', conf);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '7469:7524');
                this.log('  ... using Presenter:', this.presenter.name);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '7530:7580');
                this.log('  ... using Container:', this.container);
                __$coverCall('webdocs/test/src/lib/xqcore.js', '7618:8840');
                if (this.events) {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '7642:8779');
                    Object.keys(this.events).forEach(function (key) {
                        __$coverCall('webdocs/test/src/lib/xqcore.js', '7697:7839');
                        var split = key.split(' ', 2), eventFunc, eventName = split[0], selector = split[1] || this.container, self = this;
                        __$coverCall('webdocs/test/src/lib/xqcore.js', '7848:8764');
                        if (split.length === 1 || split.length === 2) {
                            __$coverCall('webdocs/test/src/lib/xqcore.js', '7903:7954');
                            eventFunc = this.presenter.events[this.events[key]];
                            __$coverCall('webdocs/test/src/lib/xqcore.js', '7963:8680');
                            if (typeof eventFunc === 'function') {
                                __$coverCall('webdocs/test/src/lib/xqcore.js', '8044:8458');
                                this.container.delegate(selector, eventName, function (e) {
                                    __$coverCall('webdocs/test/src/lib/xqcore.js', '8112:8157');
                                    var formData = null, tagData = null;
                                    __$coverCall('webdocs/test/src/lib/xqcore.js', '8169:8263');
                                    if (e.type === 'submit') {
                                        __$coverCall('webdocs/test/src/lib/xqcore.js', '8206:8252');
                                        formData = XQCore.Util.serializeForm(e.target);
                                    }
                                    __$coverCall('webdocs/test/src/lib/xqcore.js', '8275:8382');
                                    tagData = $.extend($(e.target).data(), { itemIndex: getItemIndex.call(self, e.target) });
                                    __$coverCall('webdocs/test/src/lib/xqcore.js', '8394:8446');
                                    eventFunc.call(self.presenter, e, tagData, formData);
                                });
                                __$coverCall('webdocs/test/src/lib/xqcore.js', '8468:8559');
                                this.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);
                            } else {
                                __$coverCall('webdocs/test/src/lib/xqcore.js', '8592:8671');
                                this.warn('Event handler callback not defined in Presenter:', this.events[key]);
                            }
                        } else {
                            __$coverCall('webdocs/test/src/lib/xqcore.js', '8710:8756');
                            this.warn('Incorect event configuration', key);
                        }
                    }, this);
                } else {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '8799:8834');
                    this.warn('No view events defined');
                }
                __$coverCall('webdocs/test/src/lib/xqcore.js', '8863:8874');
                this.init();
                __$coverCall('webdocs/test/src/lib/xqcore.js', '8913:8942');
                this.presenter.viewInit(this);
            } else {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '8963:9037');
                this.error('Can\'t initialize View, Container not found!', this.container);
            }
        }.bind(this));
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '9067:9142');
    view.prototype.init = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '9107:9138');
        console.log('View Init2', this);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '9146:9186');
    view.prototype.show = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '9190:9230');
    view.prototype.hide = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '9234:9439');
    view.prototype.render = function (data) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '9277:9344');
        this.log('Render view template', this.template, 'with data:', data);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '9348:9396');
        var template = Handlebars.compile(this.template);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '9400:9435');
        this.container.html(template(data));
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '9443:9485');
    view.prototype.resize = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '9761:9857');
    view.prototype.append = function (data, options) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '9813:9853');
        this.manipulate('append', data, options);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '10089:10187');
    view.prototype.prepend = function (data, options) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '10142:10183');
        this.manipulate('prepend', data, options);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '10302:10382');
    view.prototype.remove = function (index) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '10346:10378');
        this.manipulate('remove', index);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '10617:11429');
    view.prototype.manipulate = function (action, data, options) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '10681:10791');
        if (this.subSelector === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '10722:10770');
            this.warn('You must set the subSelector option');
            __$coverCall('webdocs/test/src/lib/xqcore.js', '10775:10787');
            return false;
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '10796:10908');
        if (this.itemTemplate === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '10838:10887');
            this.warn('You must set the itemTemplate option');
            __$coverCall('webdocs/test/src/lib/xqcore.js', '10892:10904');
            return false;
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '10913:10956');
        var selector = $(this.subSelector), html;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '10961:11014');
        if (options) {
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '11019:11424');
        switch (action) {
        case 'append':
            __$coverCall('webdocs/test/src/lib/xqcore.js', '11059:11109');
            html = Handlebars.compile(this.itemTemplate)(data);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '11115:11141');
            $(html).appendTo(selector);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '11147:11152');
            break;
        case 'prepend':
            __$coverCall('webdocs/test/src/lib/xqcore.js', '11177:11227');
            html = Handlebars.compile(this.itemTemplate)(data);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '11233:11260');
            $(html).prependTo(selector);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '11266:11271');
            break;
        case 'remove':
            __$coverCall('webdocs/test/src/lib/xqcore.js', '11295:11332');
            selector.children().eq(data).remove();
            __$coverCall('webdocs/test/src/lib/xqcore.js', '11338:11343');
            break;
        default:
            __$coverCall('webdocs/test/src/lib/xqcore.js', '11361:11420');
            this.error('undefined action in view.manipulate()', action);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '11626:12178');
    var getItemIndex = function (el) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '11662:11820');
        var index = null, container = $(this.container).get(0), curEl = $(el), nextEl = curEl.parent(), subSelector = $(this.subSelector).get(0), d = 0;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '11825:12157');
        if (this.subSelector) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '11852:12153');
            do {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '11861:11932');
                if (nextEl.get(0) === subSelector) {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '11903:11926');
                    return $(curEl).index();
                }
                __$coverCall('webdocs/test/src/lib/xqcore.js', '11938:11960');
                curEl = curEl.parent();
                __$coverCall('webdocs/test/src/lib/xqcore.js', '11966:11989');
                nextEl = curEl.parent();
                __$coverCall('webdocs/test/src/lib/xqcore.js', '11996:12097');
                if (++d > 100) {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '12018:12044');
                    console.log(curEl, nextEl);
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '12051:12079');
                    console.error('Break loop!');
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '12086:12091');
                    break;
                }
            } while (curEl.length && curEl.get(0) !== container);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '12162:12174');
        return index;
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '12184:12195');
    return view;
}();
__$coverCall('webdocs/test/src/lib/xqcore.js', '12204:13942');
XQCore.Event = function () {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '12234:12249');
    var ee, event;
    __$coverCall('webdocs/test/src/lib/xqcore.js', '12254:12575');
    function indexOf(eventName, callback) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '12296:12328');
        this.objectName = 'XQCore.Event';
        __$coverCall('webdocs/test/src/lib/xqcore.js', '12335:12379');
        var len = this.store.length, i = 0, el;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '12384:12556');
        for (; i < len; i++) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '12410:12428');
            el = this.store[i];
            __$coverCall('webdocs/test/src/lib/xqcore.js', '12433:12552');
            if (eventName === null || eventName === el.event && callback === null || callback === el.callback) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '12538:12547');
                return el;
            }
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '12561:12572');
        return null;
    }
    __$coverCall('webdocs/test/src/lib/xqcore.js', '12580:12626');
    event = function (conf) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '12607:12622');
        this.store = [];
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '12898:12921');
    ee = new EventEmitter();
    __$coverCall('webdocs/test/src/lib/xqcore.js', '12924:13101');
    event.prototype.emit = function (eventName, data) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '12977:13055');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '12998:13051');
            console.debug('XQCore - Emit event', eventName, data);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '13059:13097');
        return ee.emitEvent(eventName, [data]);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '13105:13294');
    event.prototype.on = function (eventName, listener) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '13160:13244');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '13181:13240');
            console.debug('XQCore - Add listener', eventName, listener);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '13248:13290');
        return ee.addListener(eventName, listener);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '13298:13632');
    event.prototype.once = function (eventName, listener) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '13355:13484');
        var onceListener = function () {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '13390:13428');
            ee.removeListener(eventName, listener);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '13433:13463');
            listener.call(null, arguments);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '13468:13479');
            return true;
        };
        __$coverCall('webdocs/test/src/lib/xqcore.js', '13489:13578');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '13510:13574');
            console.debug('XQCore - Add once listener', eventName, listener);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '13582:13628');
        return ee.addListener(eventName, onceListener);
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '13636:13920');
    event.prototype.off = function (eventName, listener) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '13692:13779');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '13713:13775');
            console.debug('XQCore - Remove listener', eventName, listener);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '13784:13916');
        if (listener === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '13817:13849');
            return ee.removeEvent(eventName);
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '13867:13912');
            return ee.removeListener(eventName, listener);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '13924:13936');
    return event;
}();
__$coverCall('webdocs/test/src/lib/xqcore.js', '13945:16439');
XQCore.Logger = function (conf) {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '14006:14271');
    function getHumanTime(time) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '14038:14268');
        if (time < 1000) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '14060:14079');
            return time + ' ms';
        } else if (time < 60000) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '14115:14160');
            return Math.round(time / 100) / 10 + ' sec';
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '14178:14264');
            return Math.round(time / 60000) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';
        }
    }
    __$coverCall('webdocs/test/src/lib/xqcore.js', '14275:14471');
    function onScreenConsole() {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '14306:14323');
        var conf, html;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '14328:14404');
        conf = localStorage.get('xqcore-onscreen-console') || { pos: 'bottom' };
        __$coverCall('webdocs/test/src/lib/xqcore.js', '14409:14468');
        html = '<div id="XQCoreLogger-OnScreenConsole">\t\t\t</div>';
    }
    __$coverCall('webdocs/test/src/lib/xqcore.js', '14629:14660');
    var logger = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '14768:14969');
    logger.prototype.log = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '14806:14814');
        var args;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '14819:14965');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '14840:14884');
            args = Array.prototype.slice.call(arguments);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '14889:14924');
            args.unshift('[' + this.name + ']');
            __$coverCall('webdocs/test/src/lib/xqcore.js', '14929:14961');
            console.log.apply(console, args);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '15077:15280');
    logger.prototype.warn = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '15116:15124');
        var args;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '15129:15276');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '15150:15194');
            args = Array.prototype.slice.call(arguments);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '15199:15234');
            args.unshift('[' + this.name + ']');
            __$coverCall('webdocs/test/src/lib/xqcore.js', '15239:15272');
            console.warn.apply(console, args);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '15394:15599');
    logger.prototype.error = function () {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '15434:15442');
        var args;
        __$coverCall('webdocs/test/src/lib/xqcore.js', '15447:15595');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '15468:15512');
            args = Array.prototype.slice.call(arguments);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '15517:15552');
            args.unshift('[' + this.name + ']');
            __$coverCall('webdocs/test/src/lib/xqcore.js', '15557:15591');
            console.error.apply(console, args);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '15746:16182');
    logger.prototype.timer = function (name) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '15790:16017');
        var timer = {
                start: null,
                stop: null,
                name: name,
                logger: this,
                end: function () {
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '15892:15914');
                    this.stop = Date.now();
                    __$coverCall('webdocs/test/src/lib/xqcore.js', '15920:16007');
                    this.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));
                }
            };
        __$coverCall('webdocs/test/src/lib/xqcore.js', '16079:16108');
        this.log('Start Timer', name);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '16138:16162');
        timer.start = Date.now();
        __$coverCall('webdocs/test/src/lib/xqcore.js', '16166:16178');
        return timer;
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '16280:16350');
    logger.prototype.timerEnd = function (timer) {
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '16354:16414');
    logger.prototype.__scope = { getHumanTime: getHumanTime };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '16420:16433');
    return logger;
}();
__$coverCall('webdocs/test/src/lib/xqcore.js', '16556:18480');
XQCore.Util = function ($) {
    __$coverCall('webdocs/test/src/lib/xqcore.js', '16587:16639');
    var util = {
            name: 'XQCore.Util',
            debug: true
        };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '16780:17205');
    util.serializeForm = function (selector) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '16824:16872');
        var formData = {}, formSelector = $(selector);
        __$coverCall('webdocs/test/src/lib/xqcore.js', '16877:16987');
        if (formSelector.get(0).tagName === 'INPUT') {
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '16941:16983');
            formSelector = formSelector.find(':input');
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '16992:17088');
        formSelector.serializeArray().forEach(function (item) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '17050:17082');
            formData[item.name] = item.value;
        });
        __$coverCall('webdocs/test/src/lib/xqcore.js', '17093:17181');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '17114:17177');
            console.log('XQCore - Serialize form:', formSelector, formData);
        }
        __$coverCall('webdocs/test/src/lib/xqcore.js', '17186:17201');
        return formData;
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '17557:17934');
    util.checkLength = function (input, min, max) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '17606:17930');
        if (typeof input === 'Number') {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '17642:17750');
            if (input < min) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '17665:17686');
                return 'num-to-small';
            } else if (input > max) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '17724:17745');
                return 'num-to-large';
            }
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '17768:17800');
            console.log(input, input.length);
            __$coverCall('webdocs/test/src/lib/xqcore.js', '17805:17926');
            if (input.length < min) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '17835:17856');
                return 'str-to-short';
            } else if (input.length > max) {
                __$coverCall('webdocs/test/src/lib/xqcore.js', '17901:17921');
                return 'str-to-long';
            }
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '18135:18232');
    util.checkEqual = function (str1, str2) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '18178:18228');
        if (str1 !== str2) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '18202:18224');
            return 'str-not-equal';
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '18335:18452');
    util.checkEmail = function (email) {
        __$coverCall('webdocs/test/src/lib/xqcore.js', '18373:18448');
        if (!/^\S+\@\S+\.[a-z]{2,10}$/.test(email)) {
            __$coverCall('webdocs/test/src/lib/xqcore.js', '18422:18444');
            return 'invalid-email';
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore.js', '18456:18467');
    return util;
}(jQuery);