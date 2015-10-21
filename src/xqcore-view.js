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
     * @returns {Object} Returns this value
     */
    View.prototype.show = function(hideOther) {
        var self = this;

        if (hideOther) {
            self.$ct.children('.xq-view').each(function() {
                if (this !== self.el) {
                    $(this).hide().addClass('xq-hidden');
                }
            });
        }

        this.$el.show().removeClass('xq-hidden');
        return this;
    };

    /**
     * Hide view
     * 
     * @method hide
     * @chainable
     * @return {Object} Returns this value
     */
    View.prototype.hide = function() {
        this.$el.hide().addClass('xq-hidden');
        return this;
    };

    View.prototype.renderHTML = function(template, data) {
        log.log('Render html snippet', template, 'with data:', data);
        template = typeof template === 'function' ? template : XQCore.Tmpl.compile(template);
        return template(data);
    };

    View.prototype.resize = function() {

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
            this.error('View render error!', err);
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
     * @emits content.change
     *
     * @param  {Object} data Render data
     *
     */
    View.prototype.render = function(data) {
        if (this.__domReady === false) {
            this.__initialData = data || {};
            return;
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
            this.error('View render error!', err);
        }

        this.el.innerHTML = html;
        this.emit('content.change', data);

        this.registerListener(this.$el);
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
                        // self.presenter.emit(ev[1], data, e);
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
                        // self.presenter.emit(ev[1], value, data, e);
                    };
                }

                $cur.bind(ev[0], listenerFunc);
            });
        });

        //Register DOM listener
        this.__viewEvents.forEach(function(listener) {
            self.$el.delegate(listener.selector, listener.events, listener.callback);
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
        var $scope = this.$el.find('[fire-path="' + path + '"]');
        if ($scope.length) {
            $scope.each(function() {
                var scope = $(this).attr('fire-scope');
                var html = self.scopes[scope]([data]);

                var $childs = $(this).children();
                if (index > -1) {
                    if (index > $childs.length - 1) {
                        index = $childs.length - 1;
                    }

                    $childs.eq(index).before(html);
                }
                else {
                    $childs.eq(index).after(html);
                }
            });
        }
    };

    View.prototype.update = function(path, data) {
        log.warn('XQCore doesn`t support update events yet');
    };

    View.prototype.append = function(path, data) {
        this.insert(path, -1, data);
    };

    View.prototype.prepend = function(path, data) {
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
        var $scope = this.$el.find('[fire-path="' + path + '"]');
        $scope.children(':eq(' + index + ')').remove();
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
            var errClassName = 'xq-invalid',
                disabledClass = 'xq-disabled';

            if (!$el) {
                $el = this.$el.find('form');
            }

            var blurHandler = function(e) {
                var $form = $(this).closest('form'),
                    $input = $(this);

                $input.removeClass(errClassName);
                var name = $input.attr('name'),
                    value = $input.val();

                if (name && model.schema && model.schema[name]) {
                    var result = model.validateOne(model.schema[name], value);
                    if (result.isValid) {

                        //Set form valid state
                        if ($form.find(':input[class~="' + errClassName + '"]').length === 0) {
                            $form.removeClass(errClassName);
                            $form.find(':submit').removeAttr('disabled').removeClass(disabledClass);
                        }
                    }
                    else {
                        $input.addClass(errClassName);
                        $form.addClass(errClassName);
                        $form.find(':submit').attr('disabled', 'disabled').addClass(disabledClass);
                    }
                }
            };

            var submitHandler = function(e) {
                e.preventDefault();
                var data = self.serializeForm(e.target);
                self.emit('form.submit', data);
            };

            this.addEvent(':input', 'blur', blurHandler);
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
                    if (/^http(s)?:\/\//.test(e.href)) {
                        return;
                    }

                    if (!/^\/?[a-z]/.test(e.href)) {
                        return;
                    }
                    
                    e.preventDefault();
                    e.stopPropagation();

                    self.emit('xqcore.navigate', e.href);
                });
            }
        });
    };

    XQCore.View = View;

})(XQCore);
