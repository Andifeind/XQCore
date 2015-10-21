/**
 * XQCore Presenter
 *
 * A presenter controlls your models, lists and views.
 * It renders views as long as any data had been changed.
 *
 * @module XQCore.Presenter
 */
(function(XQCore, undefined) {
    'use strict';

    var $ = XQCore.require('jquery'),
        log;

    /**
     * XQCore.Presenter base class
     *
     * @class XQCore.Presenter
     * @constructor
     *
     * @uses XQCore.Logger
     * @uses XQCore.Event
     *
     * @param {String} name Presenter name
     * @param {Function} fn Init callback and presenter scope method. To be called during the instantiating progress
     */
    var Presenter = function(name, fn) {
        var self = this;

        if (typeof arguments[0] === 'function') {
            fn = name;
            name = null;
        }

        /**
         * Set presenter name
         * @public
         * @type {String}
         */
        this.name = name || 'Nameless';

        /**
         * Router instance
         * @private
         * @type {Object}
         */
        this.router = XQCore.Router.getInstance();

        /**
         * Logger instance
         * @ignore
         * @type {Object}
         */
        log = new XQCore.Logger(this.name + 'Presenter');
        
        /**
         * Stores registered views
         * @private
         * @type {Object}
         */
        this.__views = {};

        if (typeof fn === 'function') {
            fn.call(this, self, log);
        }

        $(function() {
            //Call current page
            self.router.callRoute(self.router.getPath());
        });
    };

    XQCore.extend(Presenter.prototype, new XQCore.Event());

    /**
     * Initialize a presenter
     *
     * @method init
     */
    Presenter.prototype.init = function() {
    };

    /**
     * Add a history item to the browser history
     *
     * @param {String} url Page URL (Optional) defaults to the curent URL
     * @param {Object} data Data object
     */
    Presenter.prototype.pushState = function(url, data) {
        // log.info('Check State', data, history.state, XQCore.compare(data, history.state));
        // if (XQCore.compare(data, history.state)) {
        //     this.warn('Abborting history.pushState because data are equale to current history state');
        // }
        var hash = XQCore.html5Routes || url.charAt(0) === '/' ? '' : XQCore.hashBang;
        url = hash + url;
        history.pushState(data, '', url || null);
        log.info('Update history with pushState. New URL: ' + data, url);
    };

    /**
     * Add a history item to the browser history
     *
     * @param {String} url Page URL (Optional) defaults to the current URL
     * @param {Object} data Data object
     */
    Presenter.prototype.replaceState = function(url, data) {
        var hash = XQCore.html5Routes || url.charAt(0) === '/' ? '' : XQCore.hashBang;
        url = hash + url;
        history.replaceState(data, '', url || null);
        log.info('Update history with replaceState. New URL: ' + data, url);
    };

    /**
     * Navigates to a given route
     *
     * Options: {
     *  replace: <Boolean> Replace current history entry with route (Only when html5 routes are enabled)
     *  noPush: <Boolean> Set this to false to surpress a route change when new route equals to old route
     * }
     *
     * @param {String} route Route url
     * @param {Object} options Options
     */
    Presenter.prototype.navigateTo = function(route, options) {
        //TODO check route trigger
        options = options || {};
        if (XQCore.html5Routes) {
            this.router.callRoute(route, options);
        }
        else {
            location.hash = XQCore.hashBang + route;
            this.router.callRoute(route, options);
        }
    };

    /**
     * Navigate back
     * 
     * @method navigateBack
     */
    Presenter.prototype.navigateBack = function() {
        history.back();
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
    Presenter.prototype.couple = function(view, model, conf) {
        conf = conf || {};

        if (model instanceof XQCore.List) {
            this.coupleList(view, model, conf);
        }
        else {
            this.coupleModel(view, model, conf);
        }

        this.coupleView(view, model, conf);
    };

    /**
     * Couples a view onto a model
     *
     * @method coupleModel
     * @param {Object} view XQCore.View instance
     * @param {Object} model XQCore.Model instance
     */
    Presenter.prototype.coupleModel = function(view, model, conf) {
        conf = conf || {};

        if (!(view instanceof XQCore.View)) {
            return log.error('Could not couple model with view. First arg is not a valid view!');
        }

        if (!(model instanceof XQCore.Model)) {
            return log.error('Could not couple model with view. Second arg is not a valid model!');
        }

        log.info('Couple model', model.name, 'with', view.name);

        if (model.__coupled) {
            model.__coupled.uncouple();
            // return log.error('View', view.name, 'already coupled with', view.__coupled.obj.name, '. Only one model or list can be coupled with a view!');
        }

        model.__coupled = {
            obj: view,
            events: [],
            uncouple: function() {
                log.info('Uncouple model', model.name, 'from', view.name);
                model.__coupled.events.forEach(function(ev) {
                    ev.remove();
                });

                delete model.__coupled;
            }
        };

        var eventsMap = {
            'data.replace': 'xrender',
            'data.set': 'xrender',
            'value.set': 'xrender',
            'item.insert': 'xrender',
            'item.remove': 'remove',
            'validation.error': 'validationFailed',
            'state.change': 'onStateChange'
        };

        var listener = function(listener, func) {
            var fn = view[func];
            if (func === 'xrender') {
                fn = function() {
                    view.render(model.get());
                };
            }

            var handler = model.on(listener, fn);
            model.__coupled.events.push(handler);
        };
        
        for (var key in eventsMap) {
            if (eventsMap.hasOwnProperty(key)) {
                listener(key, eventsMap[key]);
            }
        }

        //Initial view render with current model data
        view.render(model.get());

        console.log('VIEW', view);
        console.log('MODEL', model);
    };

    /**
     * Couples a listwith a view
     *
     * @method coupleList
     * @param {Object} view XQCore.View instance
     * @param {Object} model XQCore.Model instance
     */
    Presenter.prototype.coupleList = function(view, list) {
        if (!(view instanceof XQCore.View)) {
            return log.error('Could not couple list with view. First arg is not a valid view!');
        }

        if (!(list instanceof XQCore.List)) {
            return log.error('Could not couple list with view. Second arg is not a valid list!');
        }

        log.info('Couple list', list.name, 'with', view.name);

        if (list.__coupled) {
            list.__coupled.uncouple();
            // return log.error('View', view.name, 'already coupled with', view.__coupled.obj.name, '. Only one model or list can be coupled with a view!');
        }

        list.__coupled = {
            obj: view,
            events: [],
            uncouple: function() {
                log.info('Uncouple list', list.name, 'from', view.name);
                list.__coupled.events.forEach(function(ev) {
                    ev.remove();
                });

                delete list.__coupled;
            }
        };

        var eventsMap = {
            'item.push': 'xrender',
            'item.unshift': 'xrender',
            'item.pop': 'xrender',
            'item.shift': 'xrender',
            'item.update': 'xrender',
            'state.change': 'onStateChange'
        };

        var listener = function(listener, func) {
            var fn = view[func];
            if (func === 'xrender') {
                fn = function() {
                    view.render(list.get());
                };
            }

            var handler = list.on(listener, fn);
            list.__coupled.events.push(handler);
        };
        
        for (var key in eventsMap) {
            if (eventsMap.hasOwnProperty(key)) {
                listener(key, eventsMap[key]);
            }
        }

        //Initial view render with current list data
        view.render(list.toArray());

        console.log('VIEW', view);
        console.log('LIST', list);
    };

    /**
     * Couples a view with a model or a list
     *
     * @method coupleView
     * @param {Object} view XQCore.View instance
     * @param {Object} model XQCore.Model or XQCore.List instance
     */
    Presenter.prototype.coupleView = function(view, model) {
        if (!(view instanceof XQCore.View)) {
            return log.error('Could not couple list with view. First arg is not a valid view!');
        }

        if (!(model instanceof XQCore.Model) && !(model instanceof XQCore.List)) {
            return log.error('Could not couple list with view. Second arg is not a valid model or list!');
        }

        log.info('Couple view', view.name, 'with', model.name);

        if (view.__coupled) {
            view.__coupled.uncouple();
            // return log.error('Model or List', model.name, 'already coupled with', model.__coupled.obj.name, '. Only one view can be coupled with a model or a list !');
        }

        view.__coupled = {
            obj: model,
            events: [],
            uncouple: function(onlySelf) {
                log.info('Uncouple view', view.name, 'from', model.name);
                view.__coupled.events.forEach(function(ev) {
                    ev.remove();
                });

                delete view.__coupled;
            }
        };

        var eventsMap = {
           'form.submit': 'submit'
        };

        var listener = function(listener, func) {
            var fn = view[func];
            var handler = view.on(listener, fn);
            view.__coupled.events.push(handler);
        };
        
        for (var key in eventsMap) {
            if (eventsMap.hasOwnProperty(key)) {
                listener(key, eventsMap[key]);
            }
        }

        console.log('VIEW', view);
        console.log('MODE or LIST', model);
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
        var tmplOptions = {};

        if (options.viewDir) {
            tmplOptions.viewDir = options.viewDir;
        }

        var view = new XQCore.View(viewName, function(self) {
            self.template = XQCore.Tmpl.getTemplate(viewName, tmplOptions);
            self.mode = options.mode || 'replace';
            self.container = container || 'body';
            self.hidden = !!options.hidden;
            if (options.inject === false) {
                self.autoInject = false;
            }
        });

        this.__views[viewName] = view;

        var self = this;
        if (XQCore.html5Routes) {
            view.on('xqcore.navigate', function(url) {
                self.router.callRoute(url);
            });
        }

        return view;
    };

    /**
     * Register a route listener
     *
     * @public
     * @method route
     * @chainable
     * @param {String | Array} route Route string
     * @param {Function} callback Callback function
     * @returns {Object} Returns this value
     */
    Presenter.prototype.route = function(route, callback) {
        var self = this;

        if (typeof callback === 'string') {
            callback = this[callback];
        }

        if (typeof callback === 'function') {
            if (typeof route === 'string') {
                this.router.addRoute(route, callback);
            }
            else if (Array.isArray(route)) {
                route.forEach(function(r) {
                    self.router.addRoute(r, callback);
                });
            }

        }
        else {
            log.warn('Router callback isn\'t a function', callback, 'of route', route);
        }

        return self;
    };

    /**
     * Return Presenter
     */
    XQCore.Presenter = Presenter;

})(XQCore);
