/**
 * XQCore Presenter
 *
 * @module XQCore Presenter
 */
XQCore.Presenter = (function(undefined) {

	/**
	 * XQCore.Presenter base class
	 *
	 * @class XQCore.Presenter
	 * @constructor
	 *
	 * @extends XQCore.Logger
	 * @extends XQCore.Event
	 *
	 * @param  {Object} conf Presenter extend object
	 */
	var presenter = function(conf) {
		var self = this;
		
		this.root = '/';
		this.debug = false;
		this.routes = [];
		
		conf = conf || {};

		this.customInit = conf.init;
		this.conf = conf;
		delete conf.init;

		$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
		this.name = (conf.name || 'Nameless') + 'Presenter';
		this.eventCallbacks = {};

		/**
		 * Points to the last shown view
		 *
		 * @property {Object} lastShownView Points to the last shown view
		 */
		this.lastShownView = null;

		this.registeredViews = [];
		this.fireViewInit = function(view) {
			var allReady = true;
			this.registeredViews.forEach(function(item) {
				if (view === item.view) {
					item.isReady = true;
				}

				if (item.isReady === false) {
					allReady = false;
				}
			});

			this.viewInit(view);

			if (allReady === true) {
				this.emit('views.ready');
			}
		};

		this.registerView = function(view) {
			var i;
			if (view instanceof Array) {
				for (i = 0; i < view.length; i++) {
					this.registeredViews.push({
						view: view[i],
						isReady: false
					});
				}
			}
			else {
				this.registeredViews.push({
					view: view,
					isReady: false
				});
			}
		};

		
	};

	/**
	 * Listen View events
	 * @property {Array} events Observed view events
	 */
	presenter.prototype.events = {};

	presenter.prototype.init = function(views) {
		var i,
			self = this,
			conf = this.conf;

		//Setup popstate listener
		if (conf.routes) {
			this.Router = new XQCore.Router();

			//Add routes
			Object.keys(conf.routes).forEach(function(route) {
				var callback = this.routes[route];
				if (typeof callback === 'string') {
					callback = this[callback];
				}

				if (typeof callback === 'function') {
					this.Router.addRoute(route, callback);
				}
				else {
					this.warn('Router callback isn\'t a function', callback, 'of route', route);
				}
			}.bind(this));

			window.addEventListener('popstate', function(e) {
				self.__onPopstate(e.state);
			}, false);

			this.on('views.ready',function() {
				var route = XQCore.defaultRoute;
				if (/^#![a-zA-Z0-9]+/.test(self.getHash())) {
					route = self.getHash().substr(2);
				}

				route = self.Router.match(route);
				if (route) {
					var data = route.params;
					if (XQCore.callerEvent) {
						data[XQCore.callerEvent] = 'pageload';
					}

					self.log('Trigger route', route, data);

					route.fn.call(self, route.params);
				}
			});
		}

		// custom init
		if (typeof this.customInit === 'function') {
			this.customInit.call(this);
		}

		//Initialize views
		console.log('views', views);
		if (views instanceof Array) {
			for (i = 0; i < views.length; i++) {
				this.registerView(views[i]);
			}
		}
		else if (views) {
			this.registerView(views);
		}

		this.registeredViews.forEach(function(view) {
			view.view.init(self);
		});
	};

	/**
	 * Calling on view init
	 *
	 * @param {object} view The initializing view
	 */
	presenter.prototype.viewInit = function(view) {

	};

	/**
	 * Add a history item to the browser history
	 *
	 * @param {Object} data Data object
	 * @param {String} url Page URL (Optional) defaults to the curent URL
	 */
	presenter.prototype.pushState = function(data, url) {
		// this.log('Check State', data, history.state, XQCore.compare(data, history.state));
		// if (XQCore.compare(data, history.state)) {
		// 	this.warn('Abborting history.pushState because data are equale to current history state');
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
	presenter.prototype.replaceState = function(data, url) {
		// if (data === history.state) {
		// 	this.warn('Abborting history.replaceState because data are equale to current history state');
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
	presenter.prototype.navigateTo = function(route, data, replace) {
		this.log('Navigate to route: ', route, data, replace);
		if (replace) {
			this.replaceState(data, route);
		} else {
			this.pushState(data, route);
		}

		this.__onPopstate(data);
	};

	/**
	 * Gets a view by it's name
	 *
	 * @method getView
	 * @param {String} viewName Required view name
	 * @return {Object} Returns view object or null if no view was found
	 */
	presenter.prototype.getView = function(viewName) {
		var i, view;

		for (i = 0; i < this.registeredViews.length; i++) {
			view = this.registeredViews[i].view;
			if (view.name === viewName) {
				return view;
			}
		}

		return null;
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
	presenter.prototype.showView = function(viewName, data) {
		var view = this.getView(viewName + 'View');
		if (!view) {
			this.warn('View not defined!', viewName);
			return;
		}

		this.log('Show view:', viewName, data);
		this.log('Hide view:', this.lastShownView);

		if (this.lastShownView !== view) {
			if (this.lastShownView && typeof this.lastShownView.hide === 'function') {
				this.lastShownView.hide();
				view.show();
			}
			else {
				view.show(true);
			}
		}
	};

	/**
	 * Returns the current hash
	 *
	 * @method getHash
	 * @returns {String} Returns the current value from location.hash
	 */
	presenter.prototype.getHash = function() {
		return location.hash;	
	};

	/**
	 * Returns the current pathname
	 *
	 * @method getPathname
	 * @returns {String} Returns the current value from location.pathname
	 */
	presenter.prototype.getPathname = function() {
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
	presenter.prototype.couple = function(conf) {
		var view = conf.view,
			model = conf.model;

		if (!view instanceof XQCore.View) {
			this.error('Can\'t couple view with model! View isn\'t a XQCore.View');
			return;
		}

		if (!model instanceof XQCore.Model) {
			this.error('Can\'t couple model with model! Model isn\'t a XQCore.Model');
			return;
		}

		model.on('data.change', function(data) {
			view.render(data);
		});

		return this;
	};


	/**
	 * PopstateEvent
	 *
	 * @method __onPopstate
	 * @param {Object} data Event data
	 * @private
	 */
	presenter.prototype.__onPopstate = function(data) {
		var self = this;

		self.log('popstate event recived', data);

		var route = XQCore.defaultRoute;
		if (XQCore.html5Routes) {
			var pattern = new RegExp('^' + self.root);
			route = self.getPathname().replace(pattern, '');
		}
		else {
			if (/^#![a-zA-Z0-9]+/.test(this.getHash())) {
				route = self.getHash().substr(2);
			}
		}

		route = self.Router.match(route);
		if (route) {
			data = data || route.params;
			if (XQCore.callerEvent) {
				data[XQCore.callerEvent] = 'popstate';
			}

			self.log('Trigger route', route, data);

			route.fn.call(self, data);
		}
	};

	return presenter;
})();
