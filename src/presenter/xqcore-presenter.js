/**
 * XQCore Presenter
 *
 * @module XQCore.Presenter
 */
(function(XQCore, undefined) {
    'use strict';

    var $ = XQCore.include('jquery');

    /**
     * XQCore.Presenter base class
     *
     * @class XQCore.Presenter
     * @constructor
     *
     * @uses XQCore.Logger
     * @uses XQCore.Event
     *
     * @param {Object} conf Presenter extend object
     */
    var Presenter = function(name, conf) {

        if (typeof arguments[0] === 'object') {
            conf = name;
            name = conf.name;
        }
        
        /**
         * Stores registered views
         * @private
         * @type {Object}
         */
        this.__views = {};
        
        /**
         * Enable debug mode
         * @public
         * @type {Boolean}
         */
        this.debug = XQCore.debug;

        /**
         * Set presenter name
         * @public
         * @type {String}
         */
        this.name = (name ? name.replace(/Presenter$/, '') : 'Nameless') + 'Presenter';

        /* ++++++++++ old stuff +++++++++++++ */

        /**
         * Stores registered routes
         * @type {Array}
         * @protected
         */
        this.routes = [];
        
        conf = conf || {};

        this.conf = conf;

        /**
         * Points to the last shown view
         *
         * @deprecated  sinve v0.8.1
         * @property {Object} lastShownView Points to the last shown view
         */
        // this.lastShownView = null;

        //Deprecated sinve v0.8.1
        // this.registeredViews = [];
        // this.registeredModels = [];
        // this.fireViewInit = function(view) {
        //     var allReady = true;
        //     this.registeredViews.forEach(function(item) {
        //         if (view === item.view) {
        //             item.isReady = true;
        //         }

        //         if (item.isReady === false) {
        //             allReady = false;
        //         }
        //     });

        //     this.viewInit(view);

        //     if (allReady === true) {
        //         this.emit('views.ready');
        //     }
        // };

        /**
         * @deprecated since v0.8.1
         */
        this.registerView = function(view) {
            this.warn('presenter.registerView was deprecated since XQCore 0.7.0');

            // var i;
            // if (view instanceof Array) {
            //     for (i = 0; i < view.length; i++) {
            //         this.registeredViews.push({
            //             view: view[i],
            //             isReady: false
            //         });
            //     }
            // }
            // else {
            //     this.registeredViews.push({
            //         view: view,
            //         isReady: false
            //     });
            // }
        };

        /**
         * @deprecated since v0.8.1
         */
        this.registerModel = function(model) {
            this.warn('presenter.registerModel was deprecated since XQCore 0.7.0');

            // var i;
            // if (model instanceof Array) {
            //     for (i = 0; i < model.length; i++) {
            //         this.registeredModels.push({
            //             model: model[i],
            //             isReady: false
            //         });
            //     }
            // }
            // else {
            //     this.registeredModels.push({
            //         model: model,
            //         isReady: false
            //     });
            // }
        };

        
        this.__Router = new XQCore.Router();
    };


    XQCore.extend(Presenter.prototype, new XQCore.Event(), new XQCore.Logger());

    /**
     * Listen View events
     *
     * @deprecated  since v0.8.1
     * @property {Array} events Observed view events
     */
    Presenter.prototype.events = {};

    /**
     * Initialize a presenter
     *
     * @method init
     */
    Presenter.prototype.init = function() {
        var self = this,
            conf = this.conf;

        if (typeof conf === 'function') {
            conf.call(this, self);
        }
        else {
            XQCore.extend(this, conf);
        }

        //Setup popstate listener
        if (conf.routes) {

            //Add routes
            Object.keys(conf.routes).forEach(function(route) {
                var callback = this.routes[route];
                if (typeof callback === 'string') {
                    callback = this[callback];
                }

                if (typeof callback === 'function') {
                    this.__Router.addRoute(route, callback);
                }
                else {
                    this.warn('Router callback isn\'t a function', callback, 'of route', route);
                }
            }.bind(this));
        }

        window.addEventListener('popstate', function(e) {
            self.__onPopstate(e.state);
        }, false);

        var route = XQCore.defaultRoute;
        if (/^#![a-zA-Z0-9]+/.test(self.getHash())) {
            route = self.getHash().substr(2);
        }

        route = self.__Router.match(route);
        if (route) {
            var data = route.params;
            if (XQCore.callerEvent) {
                data[XQCore.callerEvent] = 'pageload';
            }

            $(function() {
                self.log('Trigger route', route, data);
                route.fn.call(self, route.params);
            });
        }

        // custom init function
        if (typeof conf.init === 'function') {
            conf.init.call(this);
        }

        //Deprecated code since v0.8.1
        // //Initialize views
        // if (views instanceof Array) {
        //  for (i = 0; i < views.length; i++) {
        //      this.registerView(views[i]);
        //  }
        // }
        // else if (views) {
        //  this.registerView(views);
        // }

        // this.registeredViews.forEach(function(view) {
        //  view.view.init(self);
        // });

        // this.registeredModels.forEach(function(model) {
        //  model.model.init(self);
        // });
    };

    /**
     * Calling on view init
     *
     * @deprecated  since v0.8.1
     * @param {object} view The initializing view
     */
    Presenter.prototype.viewInit = function(view) {

    };

    /**
     * Add a history item to the browser history
     *
     * @param {Object} data Data object
     * @param {String} url Page URL (Optional) defaults to the curent URL
     */
    Presenter.prototype.pushState = function(data, url) {
        // this.log('Check State', data, history.state, XQCore.compare(data, history.state));
        // if (XQCore.compare(data, history.state)) {
        //     this.warn('Abborting history.pushState because data are equale to current history state');
        // }
        var hash = XQCore.html5Routes || url.charAt(0) === '/' ? '' : XQCore.hashBang;
        url = hash + url;
        history.pushState(data, '', url || null);
        this.log('Update history with pushState', data, url);
    };

    /**
     * Add a history item to the browser history
     *
     * @param {Object} data Data object
     * @param {String} url Page URL (Optional) defaults to the current URL
     */
    Presenter.prototype.replaceState = function(data, url) {
        // if (data === history.state) {
        //     this.warn('Abborting history.replaceState because data are equale to current history state');
        // }
        var hash = XQCore.html5Routes || url.charAt(0) === '/' ? '' : XQCore.hashBang;
        url = hash + url;
        history.replaceState(data, '', url || null);
        this.log('Update history with replaceState', data, url);
    };

    /**
     * Navigates to a given route
     *
     * @param {String} route Route url
     * @param {Object} data Data object
     * @param {Boolean} replace Replace current history entry with route
     */
    Presenter.prototype.navigateTo = function(route, data, replace) {
        this.log('Navigate to route: ', route, data, replace);
        if (replace) {
            this.replaceState(data, route);
        } else {
            this.pushState(data, route);
        }

        // this.__onPopstate(data);
        /*global PopStateEvent:false */
        var evt = new PopStateEvent('popstate', {
            bubbles: false,
            cancelable: false,
            state: null
        });
        window.dispatchEvent(evt);
    };

    /**
     * Gets a view by it's name
     *
     * @method getView
     * @param {String} viewName Required view name
     * @return {Object} Returns view object or null if no view was found
     */
    Presenter.prototype.getView = function(viewName) {
        return this.__views[viewName] || null;
    };


    /**
     * Show a view if it's not visible and update the history state
     *
     * @method showView
     *
     * @param  {String} viewName The name of the view
     * @param  {Object} data Data it's neede to showing the view
     *
     */
    Presenter.prototype.showView = function(viewName, data) {
        console.log('Presenter.showView was deprecated since v0.8.1');
        // var view = this.getView(viewName + 'View');
        // if (!view) {
        //     this.warn('View not defined!', viewName);
        //     return;
        // }

        // this.log('Show view:', viewName, data);
        // this.log('Hide view:', this.lastShownView);

        // if (this.lastShownView !== view) {
        //     if (this.lastShownView && typeof this.lastShownView.hide === 'function') {
        //         this.lastShownView.hide();
        //         view.show();
        //     }
        //     else {
        //         view.show(true);
        //     }
        // }
    };

    /**
     * Returns the current hash
     *
     * @method getHash
     * @returns {String} Returns the current value from location.hash
     */
    Presenter.prototype.getHash = function() {
        return location.hash;
    };

    /**
     * Returns the current pathname
     *
     * @method getPathname
     * @returns {String} Returns the current value from location.pathname
     */
    Presenter.prototype.getPathname = function() {
        return location.pathname;
    };

    /**
     * Couple a model with a view
     *
     * @method couple
     * @chainable
     * @param {Object} conf Configuration object
     *
     * conf: {
     *   model: String modelname
     *   view: String viewname
     *   route String routename
     * }
     */
    Presenter.prototype.couple = function(conf) {
        var view = conf.view,
            model = conf.model,
            key;

        var modelEventConf = XQCore.extend({
            'data.replace': 'render',
            'data.item': 'update',
            'data.append': 'append',
            'data.prepend': 'prepend',
            'data.insert': 'insert',
            'data.remove': 'remove',
            'validation.error': 'validationFailed',
            'state.change': 'stateChanged'
        }, conf.modelEvents);

        var viewEventConf = XQCore.extend({
            'form.submit': 'setData'
        }, conf.viewEvents);

        if (!view instanceof XQCore.View) {
            this.error('Can\'t couple view with model! View isn\'t a XQCore.View');
            return;
        }

        if (!model instanceof XQCore.Model) {
            this.error('Can\'t couple model with model! Model isn\'t a XQCore.Model');
            return;
        }

        this.log('Couple view ', view.name, 'with model', model.name);

        if (!view.__coupledWith) {
            view.__coupledWith = [];
        }

        if (!model.__coupledWith) {
            model.__coupledWith = [];
        }

        if (!view.__coupledWith.some(function(m) { return (m === model); })) {
            view.__coupledWith.push(model);
        }
        
        if (!model.__coupledWith.some(function(v) { return (v === view); })) {
            model.__coupledWith.push(view);
        }

        var registerModelListener = function(listener, func) {
            model.on(listener, function() {
                var args = Array.prototype.slice.call(arguments);
                args.push(model.name, listener);
                view[func].apply(view, args);
            });
        };

        var registerViewListener = function(listener, func) {
            view.on(listener, function(arg, arg2) {
                model[func](arg, arg2, view.name);
            });
        };

        for (key in modelEventConf) {
            if (modelEventConf.hasOwnProperty(key)) {
                registerModelListener(key, modelEventConf[key]);
            }
        }

        for (key in viewEventConf) {
            if (viewEventConf.hasOwnProperty(key)) {
                registerViewListener(key, viewEventConf[key]);
            }
        }

        //Initial view render with current model data
        view.render(model.properties);

        if (conf.forms) {
            view.formSetup(model);
        }

        return this;
    };

    /**
     * Triggers a view event to the presenter
     *
     * @method triggerEvent
     * @deprecated  sinve v0.8.1
     *
     * @param {String} eventName Event of the triggered event
     * @param {Object} e EventObject
     * @param {Object} tag Tag data
     * @param {Object} data Event data
     */
    Presenter.prototype.triggerEvent = function(v, eventName, e, tag, data) {
        console.warn('Presenter.triggerEvent was removed since v0.8.1');

        // if (this.events[eventName]) {
        //     this.events[eventName].call(this, e, tag, data);
        // }
        // else {
        //     e.preventDefault();
        //     e.stopPropagation();
        //     v.__coupledWith.forEach(function(m) {
        //         if (typeof m[eventName] === 'function') {
        //             this.log('Autotrigger to model ', m.name, ' - ', eventName, data);
        //             m[eventName](data);
        //         }
        //         else {
        //             this.warn('Autotrigger to model failed! Function doesn\'t exists:', eventName, data);
        //         }
        //     });
        // }
    };


    /**
     * PopstateEvent
     *
     * @method __onPopstate
     * @param {Object} data Event data
     * @private
     */
    Presenter.prototype.__onPopstate = function(data) {
        var self = this;

        self.log('popstate event recived', data, self);

        var route = XQCore.defaultRoute;
        if (XQCore.html5Routes) {
            var pattern = new RegExp('^' + self.root);
            route = self.getPathname().replace(pattern, '');
        }
        else {
            if (/^#!\S+/.test(this.getHash())) {
                route = self.getHash().substr(2);
            }
        }

        route = self.__Router.match(route);
        if (route) {
            data = data || route.params;
            if (XQCore.callerEvent) {
                data[XQCore.callerEvent] = 'popstate';
            }

            self.log('Trigger route', route, data);

            route.fn.call(self, data);
        }
    };

    /**
     * Initialize a new view into the presenter scope
     *
     * options: {
     *   mode: String       Insert mode, (append, prepend or replace) replace is default
     *   inject: Boolean    Set to false to disable injecting view into the DOM
     * }
     * 
     * @method initView
     * @public
     * @param  {String} viewName  Name of the view
     * @param  {String} container Container selector, default is 'body'
     * @param  {Object} options   View options
     * @return {Object}           Returns a view object
     */
    Presenter.prototype.initView = function(viewName, container, options) {
        options = options || {};

        if (this.__views[viewName]) {
            this.warn('View allready registered!', viewName);
            return;
        }

        if (this.debug) {
            this.log('Init view', viewName);
        }

        var view = new XQCore.View(viewName, function(self) {
            self.template = XQCore.Tmpl.getTemplate(viewName);
            self.mode = options.mode || 'replace';
            self.container = container || 'body';
            self.hidden = !!options.hidden;
            if (options.inject === false) {
                self.autoInject = false;
            }
        });
        this.__views[viewName] = view;
        view.init(this);
        return view;
    };

    /**
     * Register a route listen
     *
     * @public
     * @method route
     * @param {String | Array} route Route string
     * @param {Function} callback Callback function
     */
    Presenter.prototype.route = function(route, callback) {
        if (typeof callback === 'string') {
            callback = this[callback];
        }

        if (typeof callback === 'function') {
            if (typeof route === 'string') {
                this.log('Register route', route, 'with callback', callback);
                this.__Router.addRoute(route, callback);
            }
            else if (Array.isArray(route)) {
                route.forEach(function(r) {
                    this.log('Register route', r, 'with callback', callback);
                    this.__Router.addRoute(r, callback);
                }.bind(this));
            }

        }
        else {
            this.warn('Router callback isn\'t a function', callback, 'of route', route);
        }
    };

    /**
     * Return Presenter
     */
    XQCore.Presenter = Presenter;

})(XQCore);
