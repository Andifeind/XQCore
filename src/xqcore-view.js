/**
 * XQCore View module
 *
 * A view renders a .fire or .hbs template and injects the result into the dom.
 *
 * @module XQCore.View
 * @returns {object} Returns a XQCore.View prototype object
 */
(function(XQCore, undefined) {
    'use strict';

    var $ = XQCore.require('jquery'),
        log;

    /**
     * XQCore.View
     *
     * @class XQCore.View
     * @constructor
     * 
     * @param {object} conf View configuration
     */
    var View = function(name, conf) {
        //Call Event constructor
        XQCore.Event.call(this);
    
        if (typeof arguments[0] === 'object' || typeof arguments[0] === 'function') {
            conf = name;
            name = null;
        }
        else if (typeof arguments[0] === 'string') {
            this.name = name;
        }

        /**
         * Logger instance
         * @ignore
         * @type {Object}
         */
        log = new XQCore.Logger(this.name + 'View');

        /**
         * Sets the container element
         * @property container
         * @type Selector
         * @default 'body'
         */
        this.container = 'body';

        /**
         * Set the view element tag. If no tag are set, a tag dependent from its parent type will be created
         *
         * Tag types dependent from parent:
         * 
         * | parent  | view tag |
         * ----------------------
         * | body    | section  |
         * | section | section  |
         * | ul      | li       |
         * | table   | tbody    |
         * | tbody   | tr       |
         * | tr      | td       |
         * | *       | div      |
         * ----------------------
         *
         * @property tag
         * @type {String}
         * @default '<parent dependent>'
         */
        this.tag = undefined;

        /**
         * Defines css class name(s) of the view element
         *
         * @property {string}
         * @default undefined
         */
        this.className = undefined;

        /**
         * Sets an id attribute
         *
         * @property {string}
         * @default undefined
         */
        this.id = undefined;

        /**
         * Set the insert mode
         *
         * @property mode
         * @type {String}
         * @default replace
         */
        this.mode = 'replace';

        /**
         * Enable/Disable autoInjection of the view into the DOM
         *
         * @property autoInject
         * @type {Boolean}
         * @default true
         */
        this.autoInject = true;

        /**
         * Holds the domReady state
         *
         * @property __domReady
         * @type {Boolean}
         * @default false
         * @private
         */
        this.__domReady = false;

        /**
         * Registered view events
         * @type {array}
         * @private
         */
        this.__viewEvents = [];

        var self = this;

        if (typeof conf === 'function') {
            conf.call(this, self);
        }
        else {
            XQCore.extend(this, conf);
        }

        /**
         * Set view name
         * @public
         * @type {String}
         */
        this.name = (this.name ? this.name.replace(/View$/, '') : 'Nameless') + 'View';

        this.__createView();

        $(function() {
            if (self.container.length > 0) {
                window.addEventListener('resize', function(e) {
                    self.resize(e);
                }, false);

                log.info('Initialize view ' + this.name, ' with conf:', conf);
                log.info(' ... using Container:', self.container);
            }
            else {
                log.error('Can\'t initialize View, Container not found!', self.container);
            }
        });
    };

    XQCore.extend(View.prototype, XQCore.Event.prototype);

    /**
     * Show view if it is invisible
     *
     * @method show
     * @param {Boolean} hideOther Hide all other sibling views
     * @chainable
     * @fires view.show Fires a v`view.show` event
     * @returns {Object} Returns this value
     */
    View.prototype.show = function(hideOther) {
        var self = this;

        if (hideOther) {
            self.$ct.children('.xq-view').each(function() {
                if (this !== self.el) {
                    var view = $(this).data('view');
                    view.hide();
                }
            });
        }

        this.$el.show().removeClass('xq-hidden');
        this.emit('view.show');
        return this;
    };

    /**
     * Hide view
     * 
     * @method hide
     * @chainable
     * @fires view.hide Fires a v`view.hide` event
     * @return {Object} Returns this value
     */
    View.prototype.hide = function() {
        this.$el.hide().addClass('xq-hidden');
        this.emit('view.hide');
        return this;
    };

    /**
     * Marks a view as active, optionally inactivates all other sibling views
     *
     * @method active
     * @param {Boolean} inactivateOther Makes all other sibling views inactive
     * @chainable
     * @fires view.active Fires a v`view.active` event
     * @returns {Object} Returns this value
     */
    View.prototype.active = function(inactivateOther) {
        var self = this;

        if (inactivateOther) {
            self.$ct.children('.xq-view').each(function() {
                if (this !== self.el) {
                    var view = $(this).data('view');
                    view.inactive();
                }
            });
        }

        this.$el.addClass('xq-active').removeClass('xq-inactive');

        this.emit('view.active');
        return this;
    };

    /**
     * Marks a view as inactive
     * 
     * @method inactivate
     * @chainable
     * @fires view.inactive Fires a v`view.inactive` event
     * @return {Object} Returns this value
     */
    View.prototype.inactive = function() {
        this.$el.removeClass('xq-active').addClass('xq-inactive');
        this.emit('view.inactive');
        return this;
    };

    View.prototype.renderHTML = function(template, data) {
        log.log('Render html snippet', template, 'with data:', data);
        template = typeof template === 'function' ? template : XQCore.Tmpl.compile(template);
        return template(data);
    };

    /**
     * To be called if window resizes
     * This is a placeholder method. Override this method if its needed
     *
     * @overridable
     * @return {Object} Returns this value
     */
    View.prototype.resize = function() {
        return this;
    };

    /**
     * Gets the data of an element
     *
     * @param {Object} selector DOM el or a jQuery selector of the element
     *
     * @return {Object} Returns the data of an element or null
     */
    View.prototype.getElementData = function(selector) {
        var el = $(selector, this.container);
        if (el.length) {
            var data = {},
                attrs = el.get(0).attributes,
                i;

            for (i = 0; i < attrs.length; i++) {
                if (attrs[i].name.indexOf('data-') === 0) {
                    var name = attrs[i].name.substr(5),
                        value = attrs[i].value;

                    if (typeof value === 'string') {
                        try {
                            if (value === 'true' || value === 'TRUE') {
                                value = true;
                            }
                            else if (value === 'false' || value === 'FALSE') {
                                value = false;
                            }
                            else if (value === 'null' || value === 'NULL') {
                                value = null;
                            }
                            else if (value === 'undefined') {
                                value = undefined;
                            }
                            else if (+value + '' === value) {
                                value = +value;
                            }
                            else {
                                value = JSON.parse(value);
                            }
                        }
                        catch(err) {

                        }
                    }

                    data[name] = value;
                }
            }

            return data;
        }
        else {
            return null;
        }
    };

    /**
     * If a validation failed (Automatically called in a coupled view)
     *
     * @method validationFailed
     * @param {Object} err Validation error object
     */
    View.prototype.validationFailed = function(err, data) {
        var self = this;

        err.forEach(function(item) {
            self.$el.find('[name="' + item.property + '"]').addClass('xq-invalid');
        });
    };

    /**
     * If a validation succeeds (Automatically called in a coupled view)
     *
     * @method validationSucceeded
     * @param {String} name Input name
     * @param {String} value Input value
     */
    View.prototype.validationSucceeded = function(name, value) {
        var self = this;

        self.$el.find('[name="' + name + '"]').removeClass('xq-invalid');
    };

    /**
     * To be called when a state.change event from a coupled model was revived
     *
     * @param {String} state Model state
     * @override
     */
    View.prototype.onStateChange = function(state) {
        var classNames = this.el.className.split(' ');
        classNames = classNames.filter(function(cssClass) {
            return !/^xq-state-/.test(cssClass);
        });

        classNames.push('xq-state-' + state);
        this.el.className = classNames.join(' ');
    };

    /**
     * Wait till view is ready
     *
     * @method ready
     * @param {Function} callback Callback
     */
    View.prototype.ready = function(callback) {
        if (this.isReady) {
            callback.call(this);
        }
        else {
            if (!this.__readyCallbacks) {
                this.__readyCallbacks = [];
            }

            this.__readyCallbacks.push(callback);
        }
    };

    View.prototype.__setReadyState = function() {
        var self = this;

        this.isReady = true;
        if (this.__readyCallbacks) {
            this.__readyCallbacks.forEach(function(fn) {
                fn.call(self);
            });
            this.__readyCallbacks = [];
        }
    };

    /**
     * Inject element into the DOM
     *
     * @public
     * @method inject
     */
    View.prototype.inject = function() {
        if (this.el.parentNode === this.ct) {
            return;
        }

        log.info('Inject view into container', this.$ct);

        if (this.mode === 'replace') {
            var childs = this.$ct.contents();
            childs.each(function() {
                var view = $(this).data('view');
                if (view) {
                    view.destroy();
                }
                else {
                    $(this).remove();
                }
            });

            // this.$ct.contents().detach();
            this.$ct.append(this.$el);
        }
        else if (this.mode === 'append') {
            this.$ct.append(this.$el);
        }
        else if (this.mode === 'prepend') {
            this.$ct.prepend(this.$el);
        }
        else {
            throw new Error('Unknown insert mode in view constructor');
        }

    };

    /**
     * Parse a precompiled template and returns a html string
     *
     * @method parse
     *
     * @param {Function} template Precompiled template
     * @param {Object} data Data object
     *
     * @return {String} compiled html
     */
    View.prototype.parse = function(template, data, __scopes) {
        var html,
            $newEl;

        template.scopeStore = {};
        template.scopes = __scopes || {};

        try {
            html = template(data || {}, template.scopes);
        }
        catch(err) {
            html = '<p class="renderError"><b>View render error!</b><br>' + err.message + '</p>';
            log.error('View render error!', err);
        }

        var parseScope = function(html, data, parent) {
            html = $.parseHTML(html);
            var $scopeEl = $(html);
            var els = $scopeEl.find('scope');

            var counter = {};

            els.each(function() {
                var scopeId = $(this).attr('id'),
                    path = $(this).attr('path'),
                    content;

                var dataPath = parent ? parent + '.' + path : path;

                var templateData = data;
                if (Array.isArray(data)) {
                    counter[path] = counter[path] || 0;
                    templateData = data[counter[path]++];
                }

                content = {};
                if (scopeId) {
                    var scopeHTML = template.scopes[scopeId](data[path], data);
                    content.value = scopeHTML ? parseScope(scopeHTML, data[path], dataPath) : document.createTextNode('');
                    content.id = scopeId;
                }
                else {
                    content.value = $.parseHTML(data[path]);
                }

                template.scopeStore[dataPath] = template.scopeStore[dataPath] || [];
                template.scopeStore[dataPath].push(content);

                $(this).replaceWith($(content.value));
            });

            return $scopeEl;
        };

        if (html) {
            $newEl = parseScope(html, data);
        }

        return $newEl;
    };

    /**
     * Render view
     *
     * @method render
     * @chainable
     * @emits content.change
     *
     * @param  {Object} data Render data
     * @returns {Object} Returns this value
     */
    View.prototype._render = function(data) {
        if (this.__domReady === false) {
            this.__initialData = data || {};
            return this;
        }

        if (this.autoInject) {
            this.inject();
        }

        var html;

        log.info('Render view template of view ' + this.name, 'with data:', data);

        var template = typeof this.template === 'function' ? this.template : XQCore.Tmpl.compile(this.template);
        this.scopes = {};

        try {
            html = template(data || {}, this.scopes);
        }
        catch(err) {
            html = '<p class="renderError"><b>View render error!</b><br>' + err.message + '</p>';
            log.error('View render error!', err);
        }

        this.el.innerHTML = html;
        this.emit('content.change', data);

        this.registerListener(this.$el);
        this.registerForms();

        return this;
    };

    /**
     * Render view
     *
     * @method render
     * @chainable
     * @emits content.change
     *
     * @param  {Object} data Render data
     * @returns {Object} Returns this value
     */
    View.prototype.render = function(data) {
        if (this.__domReady === false) {
            this.__initialData = data || {};
            return this;
        }

        if (this.autoInject) {
            this.inject();
        }

        var html;

        log.info('Render view template of view ' + this.name, 'with data:', data);

        var template = typeof this.template === 'function' ? this.template : XQCore.Tmpl.compile(this.template);
        
        this.scopes = {
            dataFn: function(path, data) {
                return '<ftl path="' + path + '">'+data[path]+'</ftl>';
            },
            scopeFn: function(scopeId, path, data) {
                if (path === 'data' && Array.isArray(data)) {
                    path = '_ftl_root';
                }

                return '<ftl scope="' + scopeId + '" path="' + path + '"></ftl>';
            },
            attrFn: function(attr, value) {
                var val1 = value.replace(/<ftl path="([a-zA-Z0-9_.-]+)">(.+?)<\/ftl>/g, function(str, p1, p2) {
                    return p2;
                });

                var val2 = value.replace(/<ftl path="([a-zA-Z0-9_.-]+)">(.+?)<\/ftl>/g, function(str, p1, p2) {
                    return '%s';
                });

                var attrs = attr + '="' + val1 + '" xq-' + attr + '="' + val2 + '"';
                return attrs;
            }
        };

        try {
            html = template(data || {}, this.scopes);
        }
        catch(err) {
            html = '<p class="renderError"><b>View render error!</b><br>' + err.message + '</p>';
            log.error('View render error!', err);
        }

        this.el.innerHTML = html;
        var self = this;
        this.scopesMap = {};

        //Replace scopes
        this.$el.find('ftl').each(function() {
            var scope = $(this).attr('scope');
            var path = $(this).attr('path');
            if (scope) {
                self.replaceScopes($(this), scope, data, path, path);
            }
            else {
                self.replaceNode($(this), path);
            }
        });

        console.log('Scopes map', this.scopesMap);
        this.emit('content.change', data);

        this.registerListener(this.$el);
        this.registerForms();

        return this;
    };

    View.prototype.replaceScopes = function($el, scope, data, path, fullPath) {
        console.log('Replace scope', scope, data, path);
        var self = this;
        var scopeData = path && path !== '_ftl_root' ? data[path] : data;
        var html = self.scopes[scope](scopeData, data);
        var $html = $($.parseHTML(html));
        var $parent = $el.parent();

        //Replace scopes
        $html.find('ftl').each(function() {
            var scope = $(this).attr('scope');
            var path = $(this).attr('path');
            if (scope) {
                self.replaceScopes($(this), scope, scopeData, path, fullPath + (Array.isArray(scopeData) ? '[].' : '.') + path);
            }
            else {
                self.replaceNode($(this), fullPath + (Array.isArray(scopeData) ? '[].' : '.') + path);
            }
        });

        $el.replaceWith($html);

        if (fullPath.indexOf('[].') !== -1) {
            return;
        }

        if (!(fullPath in self.scopesMap)) {
            self.scopesMap[fullPath] = [];
        }

        var splitItems = function($html) {
            if (!Array.isArray(scopeData)) {
                return [$html];
            }
            var len = $html.length / scopeData.length;
            var out = [];
            
            var next = [];
            $html.each(function() {
                next.push($(this).get(0));
                if (next.length === len) {
                    out.push(next);
                    next = [];
                }
            });

            return out;
        };

        self.scopesMap[fullPath].push({
            type: 'scope',
            fn: self.scopes[scope],
            childs: splitItems($html, scopeData),
            parentData: data,
            parent: $parent
        });
    };

    View.prototype.replaceNode = function($el, fullPath) {
        console.log('Replace node', fullPath);
        var self = this;
        var nodeData = $el.html();

        var node = document.createTextNode(nodeData);
        $el.replaceWith(node);

        if (fullPath.indexOf('[].') !== -1) {
            return;
        }

        if (!(fullPath in self.scopesMap)) {
            self.scopesMap[fullPath] = [];
        }

        self.scopesMap[fullPath].push({
            type: 'node',
            node: node
        });
    };

    View.prototype.renderScope = function(scope, path, data) {
        var self = this;
        var html = $.parseHTML(scope.fn(data, scope.parentData));
        var $html = $(html);
        $html.find('ftl').each(function() {
            var scope = $(this).attr('scope');
            var path = $(this).attr('path');
            if (scope) {
                self.replaceScopes($(this), scope, data, path, path);
            }
            else {
                self.replaceNode($(this), path);
            }
        });

        this.registerListener($html);

        return $html;
    };

    View.prototype.renderNode = function(scope, path, data) {
        scope.node.nodeValue = data;
    };

    View.prototype.registerListener = function($el) {
        var self = this;

        $el.find('[on]').addBack('[on]').each(function() {
            var $cur = $(this);
            var events = $(this).attr('on');
            var data = $(this).data();
            var listenerFunc;
            $cur.removeAttr('on');

            events = events.split(';');
            events.forEach(function(ev) {
                ev = ev.split(':');

                if (ev[0] === 'submit') {
                    listenerFunc = function(e) {
                        e.preventDefault();
                        data = self.serializeForm(e.target);
                        data = self.onSubmit(data, e.target);
                        self.emit(ev[1], data, e);
                    };
                }
                else {
                    listenerFunc = function(e) {
                        var value;

                        if (e.originalEvent instanceof KeyboardEvent) {
                            value = {
                                key: e.key,
                                code: e.keyCode,
                                alt: e.altKey,
                                ctrl: e.ctrlKey,
                                meta: e.metaKey,
                                shift: e.shiftKey
                            };
                        }
                        else if (e.originalEvent instanceof MouseEvent) {
                            e.preventDefault();
                            value = {
                                button: e.button,
                                alt: e.altKey,
                                ctrl: e.ctrlKey,
                                meta: e.metaKey,
                                shift: e.shiftKey
                            };

                            if (e.type === 'click' && e.currentTarget.href) {
                                value.href = e.currentTarget.href;
                            }

                        } else {
                            e.preventDefault();
                            value = e.currentTarget.value || '';
                        }

                        self.emit(ev[1], value, data, e);
                    };
                }

                $cur.bind(ev[0], listenerFunc);
            });
        });
    };

    /**
     * Serialize a form and return its values as JSON
     *
     * @param {Object} Form selector
     * @return {Object} FormData as JSON
     */
    View.prototype.serializeForm = function(selector) {
        var formData = {},
            formSelector = $(selector);

        if (formSelector.get(0).tagName !== 'INPUT') {
            formSelector = formSelector.find(':input');
        }

        formSelector.serializeArray().forEach(function(item) {
            XQCore.dedotify(formData, item.name, item.value);
        });

        log.info('Serialize form of view ' + this.name, 'form selector:', formSelector, 'form data:', formData);

        return formData;
    };

    /**
     * Insert a subset
     * @param  {String} path  Data path
     * @param  {Number} index Index after which item the insert should be happen or use -1 to prepend
     * @param  {Object} data  Item data
     */
    View.prototype.insert = function(path, index, data) {
        var self = this;
        console.log('INSERT new item', path, index, data);
        if (path in this.scopesMap) {
            console.log(' matched items', this.scopesMap[path]);
            this.scopesMap[path].forEach(function(scope) {
                var $html = self.renderScope(scope, path, [data]);
                if (index === -1) {
                    scope.parent.append($html);
                    scope.childs.push([$html.get()]);
                }
                else if (index === 0) {
                    scope.parent.prepend($html);
                    scope.childs.unshift([$html.get()]);
                }
                else {
                    var els = scope.childs[index];
                    $(els[0]).before($html);
                    var args = [index, 0].concat([$html.get()]);
                    scope.childs.splice.apply(scope.childs, args);
                }
            });
        }
    };

    View.prototype.update = function(path, data) {
        log.warn('XQCore doesn`t support update events yet');
    };

    View.prototype.append = function(path, data) {
        if (arguments.length === 1) {
            data = path;
            path = 'data';
        }

        this.insert(path, -1, data);
    };

    View.prototype.prepend = function(path, data) {
        if (arguments.length === 1) {
            data = path;
            path = 'data';
        }

        this.insert(path, 0, data);
    };

    /**
     * Remove an item from a subset. Removes the item with the given index.
     * If index is negative number it will be removed from the end
     * 
     * @param  {String} path  data path
     * @param  {Number} index Index of the item
     */
    View.prototype.remove = function(path, index) {
        console.log('REMOVE item', path, index);
        if (path in this.scopesMap) {
            console.log(' matched items', this.scopesMap[path]);
            this.scopesMap[path].forEach(function(scope) {
                var els = scope.childs[index];
                if (Array.isArray(els)) {
                    els.forEach(function(el) {
                        $(el).remove();
                    });
                }
                else {
                    $(els).remove();
                }

                scope.childs.splice(index, 1);
            });
        }
    };

    View.prototype.removeLast = function(path) {
        log.warn('XQCore doesn`t support pop events yet');
    };

    View.prototype.removeFirst = function(path) {
        log.warn('XQCore doesn`t support shift events yet');
    };

    View.prototype.change = function(path, value) {
        var self = this;

        this.ready(function() {
            if (path in this.scopesMap) {
                console.log(' change item', this.scopesMap[path]);
                this.scopesMap[path].forEach(function(scope) {
                    if (scope.type === 'node') {
                        self.renderNode(scope, path, value);
                    }
                });
            }
        });
    };

    /**
     * Seting up forms
     * It's wating till view is ready
     * @param  {Object} model Coupled model
     * @param  {Object} $el   Form element
     */
    View.prototype.formSetup = function(model, $el) {
        var self = this;

        this.ready(function() {
            // var errClassName = 'xq-invalid',
                // disabledClass = 'xq-disabled';

            // if (!$el) {
            //     $el = this.$el.find('form');
            // }

            var changeHandler = function(e) {
                var value = e.target.value;
                var name = e.target.name;
                
                self.emit('input.change', name, value);
            };

            var keyUpHandler = function(e) {
                var value = e.target.value;
                var name = e.target.name;
                
                self.emit('input.edit', name, value);
            };

            var submitHandler = function(e) {
                e.preventDefault();
                var data = self.serializeForm(e.target);
                self.emit('form.submit', data);
            };

            this.addEvent(':input', 'change', changeHandler);
            this.addEvent(':input', 'keyup', keyUpHandler);
            this.addEvent('form', 'submit', submitHandler);
        });
    };

    /**
     * Called on submiting a form. 
     * 
     * @method onSubmit
     * @param {Object} data Form data
     * @param {Object} $form jQuery selector of the submited form
     * @returns {Object} Changed form data
     */
    View.prototype.onSubmit = function(data, $form) {
        return data;
    };

    /**
     * Removes a view from dom and unregisters all its listener
     *
     * @fires view.destroy Fires a `view.destroy` event before view is removing from dom.
     * @return {[type]} [description]
     */
    View.prototype.destroy = function() {
        log.info('Destroy view');

        this.emit('view.destroy');

        this.$el.remove();

        if (this.__coupled) {
            //Uncouple other participate
            if (this.__coupled.obj.__coupled && this.__coupled.obj.__coupled.obj === this) {
                this.__coupled.obj.__coupled.uncouple();
            }
            
            this.__coupled.uncouple();
        }

        //TODO remove all events
        
        log.info('View ' + this.name + ' has been destroyed');
    };

    /**
     * Register a DOM event listerner for a given element. The DOM element mustnt exists at this time. (Using jQuery.deleget() on the this.$el element)
     * @param {String}   selector A selector to the item that should trigger the event
     * @param {String}   events   A string of on ore more Javascript event handler. Use a space separated list for mor then one event. E.g: 'click mousedown'
     * @param {Function} callback Callback function to be called when event is triggered
     */
    View.prototype.addEvent = function(selector, events, callback) {
        this.__viewEvents.push({
            events: events,
            selector: selector,
            callback: callback
        });

        if (this.$el) {
            this.$el.delegate(selector, events, callback);
        }
    };


    /**
     * Defines a container -> view tag type mapping
     * 
     * @private true
     * @type {Object}
     */
    View.prototype.__viewTagTypes = {
        '*': 'div',
        'body': 'section',
        'section': 'section',
        'ul': 'li',
        'table': 'tbody',
        'tbody': 'tr',
        'tr': 'td'
    };

    /**
     * Creates new view element, based on *tag* option
     * 
     * @private true
     * @return {object} Returns a DOM element
     */
    View.prototype.__createViewElement = function() {
        if (this.tag) {
            return document.createElement(this.tag);
        }

        var parentTag = this.ct ? this.ct.tagName.toLowerCase() : '*',
            viewTag = this.__viewTagTypes['*'];

        if (this.__viewTagTypes[parentTag]) {
            viewTag = this.__viewTagTypes[parentTag];
        }

        return document.createElement(viewTag);
    };

    /**
     * Creates a view and registers event listeners as soon as DOM is ready.
     *
     * @private true
     */
    View.prototype.__createView = function() {
        var self = this,
            classNames = [];

        $(function() {
            //Create view element
            self.$ct = self.$ct || $(self.container);
            self.ct = self.$ct.get(0);
            
            self.el = self.__createViewElement();
            self.$el = $(self.el);
            self.$el.data('view', self);
            classNames.push('xq-view xq-' + self.name.replace(/View$/, '-view').toLowerCase());

            if (self.id) {
                self.el.setAttribute('id', self.id);
            }

            if (self.className) {
                classNames.push(self.className);
            }
            
            if (self.hidden === true) {
                classNames.push('xq-hidden');
                self.$el.hide();
            }

            self.el.className = classNames.join(' ');

            //Set DOM ready state
            self.__domReady = true;
            if (self.__initialData) {
                self.render(self.__initialData);
                delete self.__initialData;
            }

            // if (self.autoInject) {
            //     self.inject();
            // }

            //Set ready state
            self.__setReadyState();
            self.registerListener(self.$el);

            //Register view listener
            if (XQCore.html5Routes) {
                self.$el.on('click', 'a', function(e) {
                    if (/^http(s)?:\/\//.test(e.currentTarget.href)) {
                        return;
                    }

                    if (!/^\/?[a-z]/.test(e.currentTarget.href)) {
                        return;
                    }
                    
                    e.preventDefault();
                    e.stopPropagation();

                    self.emit('xqcore.navigate', e.currentTarget.href);
                });
            }

            if (self.forms) {
                self.formSetup();
            }
        });
    };

    View.prototype.registerForms = function() {
        if (this.forms) {
            var formSelector = 'form';
            if (typeof this.forms === 'string') {
                formSelector = this.forms;
            }
            
            this.ready(function() {
                this.$forms = this.$el.find(formSelector);
                this.$forms.addClass('xq-forms');
                this.$forms.find(':input').addClass('xq-input');
            });
        }
    };

    XQCore.View = View;

})(XQCore);
