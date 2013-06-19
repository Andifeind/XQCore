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
				self.log('popstate event recived', e);

				var route = XQCore.defaultRoute;
				if (XQCore.html5Routes) {
					var pattern = new RegExp('^' + self.root);
					route = location.pathname.replace(pattern, '');
				}
				else {
					if (/^#![a-zA-Z0-9]+/.test(location.hash)) {
						route = location.hash.substr(2);
					}
				}

				route = self.Router.match(route);
				if (route) {
					var data = e.state || route.params;
					if (XQCore.callerEvent) {
						data[XQCore.callerEvent] = 'popstate';
					}

					self.log('Trigger route', route, data);

					route.fn.call(self, data);
				}
			}, false);

			this.on('views.ready',function() {
				var route = XQCore.defaultRoute;
				if (/^#![a-zA-Z0-9]+/.test(location.hash)) {
					route = location.hash.substr(2);
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

	return presenter;
})();
