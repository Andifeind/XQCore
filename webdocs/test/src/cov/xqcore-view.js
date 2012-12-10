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
__$coverInit("webdocs/test/src/lib/xqcore-view.js", "XQCore.View = (function(undefined) {\n\n\tvar view = function(presenter, conf) {\n\t\tvar self = this;\n\n\t\tconf = conf || {\n\t\t\tevents: null\n\t\t};\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'View';\n\t\tthis.presenter = presenter;\n\n\t\tthis.debug = Boolean(conf.debug);\n\n\t\t$(function() {\n\t\t\tthis.container = $(conf.container);\n\t\t\tif (this.container.length > 0) {\n\t\t\t\twindow.addEventListener('resize', function(e) {\n\t\t\t\t\tself.resize(e);\n\t\t\t\t}, false);\n\n\t\t\t\tthis.log('Initialize view with conf:', conf);\n\t\t\t\tthis.log('  ... using Presenter:', this.presenter.name);\n\t\t\t\tthis.log('  ... using Container:', this.container);\n\n\t\t\t\t//Send events to presenter\n\t\t\t\tif (this.events) {\n\t\t\t\t\tObject.keys(this.events).forEach(function(key) {\n\t\t\t\t\t\tvar split = key.split(' ', 2),\n\t\t\t\t\t\t\teventFunc,\n\t\t\t\t\t\t\teventName = split[0],\n\t\t\t\t\t\t\tselector = split[1] || this.container,\n\t\t\t\t\t\t\tself = this;\n\n\t\t\t\t\t\tif (split.length === 1 || split.length === 2) {\n\t\t\t\t\t\t\teventFunc = this.presenter.events[this.events[key]];\n\t\t\t\t\t\t\tif (typeof eventFunc === 'function') {\n\t\t\t\t\t\t\t\t//Register event listener\n\t\t\t\t\t\t\t\tthis.container.delegate(selector, eventName, function(e) {\n\t\t\t\t\t\t\t\t\tvar formData = null,\n\t\t\t\t\t\t\t\t\t\ttagData = null;\n\n\t\t\t\t\t\t\t\t\tif (e.type === 'submit') {\n\t\t\t\t\t\t\t\t\t\tformData = XQCore.Util.serializeForm(e.target);\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\ttagData = $.extend($(e.target).data(), {\n\t\t\t\t\t\t\t\t\t\titemIndex: getItemIndex.call(self, e.target)\n\t\t\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\t\t\teventFunc.call(self.presenter, e, tagData, formData);\n\t\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\t\tthis.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\telse {\n\t\t\t\t\t\t\t\tthis.warn('Event handler callback not defined in Presenter:', this.events[key]);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\telse {\n\t\t\t\t\t\t\tthis.warn('Incorect event configuration', key);\n\t\t\t\t\t\t}\n\t\t\t\t\t}, this);\n\t\t\t\t} else {\n\t\t\t\t\tthis.warn('No view events defined');\n\t\t\t\t}\n\n\t\t\t\t//Self init\n\t\t\t\tthis.init();\n\n\t\t\t\t//Call presenter.initView()\n\t\t\t\tthis.presenter.viewInit(this);\n\t\t\t}\n\t\t\telse {\n\t\t\t\tthis.error('Can\\'t initialize View, Container not found!', this.container);\n\t\t\t}\n\t\t}.bind(this));\n\t};\n\n\tview.prototype.init = function() {\n\n\t\t\t\tconsole.log('View Init2', this);\n\t};\n\n\tview.prototype.show = function() {\n\t\t\n\t};\n\n\tview.prototype.hide = function() {\n\t\t\n\t};\n\n\tview.prototype.render = function(data) {\n\t\tthis.log('Render view template', this.template, 'with data:', data);\n\t\tvar template = Handlebars.compile(this.template);\n\t\tthis.container.html(template(data));\n\t};\n\n\tview.prototype.resize = function() {\n\t\t\n\t};\n\n\t/**\n\t * Appends a html fragment to a html element\n\t * You must set the itemTemplate and subSelector  option first\n\t *\n\t * @param {String} selector parent selector\n\t * @param {Object} data item data\n\t * @param {Object} options Appending options (not implemented yet)\n\t */\n\tview.prototype.append = function(data, options) {\n\t\tthis.manipulate('append', data, options);\n\t};\n\n\t/**\n\t * Prepends a html fragment to a html element\n\t * You must set the itemTemplate and subSelector option first\n\t *\n\t * @param {Object} data item data\n\t * @param {Object} options Prepending options (not implemented yet)\n\t */\n\tview.prototype.prepend = function(data, options) {\n\t\tthis.manipulate('prepend', data, options);\n\t};\n\n\t/**\n\t * Remove a item from a dom node\n\t *\n\t * @param {Number} index Remove item <index> from a node list\n\t */\n\tview.prototype.remove = function(index) {\n\t\tthis.manipulate('remove', index);\n\t};\n\n\t/**\n\t * Manipulates a dom node\n\t *\n\t * @param  {String} action  Manipulation method\n\t * @param  {[type]} data    [description]\n\t * @param  {[type]} options (not implemented yet)\n\t *\n\t * @return {[type]}         [description]\n\t */\n\tview.prototype.manipulate = function(action, data, options) {\n\t\tif (this.subSelector === undefined) {\n\t\t\tthis.warn('You must set the subSelector option');\n\t\t\treturn false;\n\t\t}\n\n\t\tif (this.itemTemplate === undefined) {\n\t\t\tthis.warn('You must set the itemTemplate option');\n\t\t\treturn false;\n\t\t}\n\n\t\tvar selector = $(this.subSelector),\n\t\t\thtml;\n\n\t\tif (options) {\n\t\t\t//TODO handle transition options\n\t\t}\n\n\t\tswitch (action) {\n\t\t\tcase 'append':\n\t\t\t\thtml = Handlebars.compile(this.itemTemplate)(data);\n\t\t\t\t$(html).appendTo(selector);\n\t\t\t\tbreak;\n\t\t\tcase 'prepend':\n\t\t\t\thtml = Handlebars.compile(this.itemTemplate)(data);\n\t\t\t\t$(html).prependTo(selector);\n\t\t\t\tbreak;\n\t\t\tcase 'remove':\n\t\t\t\tselector.children().eq(data).remove();\n\t\t\t\tbreak;\n\t\t\tdefault:\n\t\t\t\tthis.error('undefined action in view.manipulate()', action);\n\t\t}\n\n\t};\n\n\t/**\n\t * Gets the index of a subSelector item\n\t * This function must binded to the view\n\t *\n\t * @param  {Object} el Start element.\n\t *\n\t * @return {Number}    index of the element or null\n\t */\n\tvar getItemIndex = function(el) {\n\t\tvar index = null,\n\t\t\tcontainer = $(this.container).get(0),\n\t\t\tcurEl = $(el),\n\t\t\tnextEl = curEl.parent(),\n\t\t\tsubSelector = $(this.subSelector).get(0),\n\t\t\td = 0;\n\n\t\tif (this.subSelector) {\n\t\t\tdo {\n\t\t\t\tif (nextEl.get(0) === subSelector) {\n\t\t\t\t\treturn $(curEl).index();\n\t\t\t\t}\n\t\t\t\tcurEl = curEl.parent();\n\t\t\t\tnextEl = curEl.parent();\n\n\t\t\t\tif (++d > 100) {\n\t\t\t\t\tconsole.log(curEl, nextEl);\n\t\t\t\t\tconsole.error('Break loop!');\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t} while(curEl.length && curEl.get(0) !== container);\n\t\t}\n\n\t\treturn index;\n\t};\n\n\n\n\treturn view;\n})();\n");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "0:5289");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "39:2151");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2155:2230");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2234:2274");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2278:2318");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2322:2527");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2531:2573");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2849:2945");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "3177:3275");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "3390:3470");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "3705:4517");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4714:5266");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "5272:5283");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "80:95");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "100:136");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "141:202");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "206:252");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "256:282");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "287:319");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "324:2147");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "342:376");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "381:2130");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "418:500");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "507:551");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "557:612");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "618:668");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "706:1928");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "1951:1962");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2001:2030");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "471:485");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "730:1867");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "785:927");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "936:1852");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "991:1042");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "1051:1768");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "1132:1546");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "1556:1647");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "1200:1245");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "1257:1351");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "1363:1470");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "1482:1534");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "1294:1340");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "1680:1759");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "1798:1844");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "1887:1922");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2051:2125");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2195:2226");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2365:2432");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2436:2484");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2488:2523");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "2901:2941");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "3230:3271");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "3434:3466");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "3769:3879");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "3884:3996");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4001:4044");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4049:4102");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4107:4512");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "3810:3858");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "3863:3875");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "3926:3975");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "3980:3992");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4147:4197");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4203:4229");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4235:4240");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4265:4315");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4321:4348");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4354:4359");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4383:4420");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4426:4431");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4449:4508");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4750:4908");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4913:5245");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "5250:5262");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4940:5241");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4949:5020");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "5026:5048");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "5054:5077");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "5084:5185");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "4991:5014");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "5106:5132");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "5139:5167");
__$coverInitRange("webdocs/test/src/lib/xqcore-view.js", "5174:5179");
__$coverCall('webdocs/test/src/lib/xqcore-view.js', '0:5289');
XQCore.View = function (undefined) {
    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '39:2151');
    var view = function (presenter, conf) {
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '80:95');
        var self = this;
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '100:136');
        conf = conf || { events: null };
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '141:202');
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '206:252');
        this.name = (conf.name || 'Nameless') + 'View';
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '256:282');
        this.presenter = presenter;
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '287:319');
        this.debug = Boolean(conf.debug);
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '324:2147');
        $(function () {
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '342:376');
            this.container = $(conf.container);
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '381:2130');
            if (this.container.length > 0) {
                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '418:500');
                window.addEventListener('resize', function (e) {
                    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '471:485');
                    self.resize(e);
                }, false);
                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '507:551');
                this.log('Initialize view with conf:', conf);
                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '557:612');
                this.log('  ... using Presenter:', this.presenter.name);
                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '618:668');
                this.log('  ... using Container:', this.container);
                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '706:1928');
                if (this.events) {
                    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '730:1867');
                    Object.keys(this.events).forEach(function (key) {
                        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '785:927');
                        var split = key.split(' ', 2), eventFunc, eventName = split[0], selector = split[1] || this.container, self = this;
                        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '936:1852');
                        if (split.length === 1 || split.length === 2) {
                            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '991:1042');
                            eventFunc = this.presenter.events[this.events[key]];
                            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '1051:1768');
                            if (typeof eventFunc === 'function') {
                                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '1132:1546');
                                this.container.delegate(selector, eventName, function (e) {
                                    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '1200:1245');
                                    var formData = null, tagData = null;
                                    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '1257:1351');
                                    if (e.type === 'submit') {
                                        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '1294:1340');
                                        formData = XQCore.Util.serializeForm(e.target);
                                    }
                                    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '1363:1470');
                                    tagData = $.extend($(e.target).data(), { itemIndex: getItemIndex.call(self, e.target) });
                                    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '1482:1534');
                                    eventFunc.call(self.presenter, e, tagData, formData);
                                });
                                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '1556:1647');
                                this.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);
                            } else {
                                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '1680:1759');
                                this.warn('Event handler callback not defined in Presenter:', this.events[key]);
                            }
                        } else {
                            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '1798:1844');
                            this.warn('Incorect event configuration', key);
                        }
                    }, this);
                } else {
                    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '1887:1922');
                    this.warn('No view events defined');
                }
                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '1951:1962');
                this.init();
                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2001:2030');
                this.presenter.viewInit(this);
            } else {
                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2051:2125');
                this.error('Can\'t initialize View, Container not found!', this.container);
            }
        }.bind(this));
    };
    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2155:2230');
    view.prototype.init = function () {
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2195:2226');
        console.log('View Init2', this);
    };
    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2234:2274');
    view.prototype.show = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2278:2318');
    view.prototype.hide = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2322:2527');
    view.prototype.render = function (data) {
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2365:2432');
        this.log('Render view template', this.template, 'with data:', data);
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2436:2484');
        var template = Handlebars.compile(this.template);
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2488:2523');
        this.container.html(template(data));
    };
    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2531:2573');
    view.prototype.resize = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2849:2945');
    view.prototype.append = function (data, options) {
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '2901:2941');
        this.manipulate('append', data, options);
    };
    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '3177:3275');
    view.prototype.prepend = function (data, options) {
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '3230:3271');
        this.manipulate('prepend', data, options);
    };
    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '3390:3470');
    view.prototype.remove = function (index) {
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '3434:3466');
        this.manipulate('remove', index);
    };
    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '3705:4517');
    view.prototype.manipulate = function (action, data, options) {
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '3769:3879');
        if (this.subSelector === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '3810:3858');
            this.warn('You must set the subSelector option');
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '3863:3875');
            return false;
        }
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '3884:3996');
        if (this.itemTemplate === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '3926:3975');
            this.warn('You must set the itemTemplate option');
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '3980:3992');
            return false;
        }
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4001:4044');
        var selector = $(this.subSelector), html;
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4049:4102');
        if (options) {
        }
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4107:4512');
        switch (action) {
        case 'append':
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4147:4197');
            html = Handlebars.compile(this.itemTemplate)(data);
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4203:4229');
            $(html).appendTo(selector);
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4235:4240');
            break;
        case 'prepend':
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4265:4315');
            html = Handlebars.compile(this.itemTemplate)(data);
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4321:4348');
            $(html).prependTo(selector);
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4354:4359');
            break;
        case 'remove':
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4383:4420');
            selector.children().eq(data).remove();
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4426:4431');
            break;
        default:
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4449:4508');
            this.error('undefined action in view.manipulate()', action);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4714:5266');
    var getItemIndex = function (el) {
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4750:4908');
        var index = null, container = $(this.container).get(0), curEl = $(el), nextEl = curEl.parent(), subSelector = $(this.subSelector).get(0), d = 0;
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4913:5245');
        if (this.subSelector) {
            __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4940:5241');
            do {
                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4949:5020');
                if (nextEl.get(0) === subSelector) {
                    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '4991:5014');
                    return $(curEl).index();
                }
                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '5026:5048');
                curEl = curEl.parent();
                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '5054:5077');
                nextEl = curEl.parent();
                __$coverCall('webdocs/test/src/lib/xqcore-view.js', '5084:5185');
                if (++d > 100) {
                    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '5106:5132');
                    console.log(curEl, nextEl);
                    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '5139:5167');
                    console.error('Break loop!');
                    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '5174:5179');
                    break;
                }
            } while (curEl.length && curEl.get(0) !== container);
        }
        __$coverCall('webdocs/test/src/lib/xqcore-view.js', '5250:5262');
        return index;
    };
    __$coverCall('webdocs/test/src/lib/xqcore-view.js', '5272:5283');
    return view;
}();