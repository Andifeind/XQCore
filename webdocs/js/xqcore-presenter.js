XQCore.Presenter = (function(undefined) {

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
			this.registeredViews.push({
				view: view,
				isReady: false
			});
		};

		this.getView = function(viewName) {
			var i, view;

			for (i = 0; i < this.registeredViews.length; i++) {
				view = this.registeredViews[i].view;
				if (view.name === viewName) {
					return view;
				}
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
					var data = e.state || {};
					if (XQCore.callerEvent) {
						data[XQCore.callerEvent] = 'popstate';
					}

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
					route.fn.call(self, route);
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

			for (i = 0; i < views.length; i++) {
				views[i].init(this);
			}
		}
		else {
			this.registerView(views);
			views.init(this);
		}
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
	 * Navigates to a route
	 *
	 * @param {String} url Route url
	 * @param {Object} data Data object
	 */
	presenter.prototype.navigateTo = function(url, data) {
		var route = this.Router.match(url);
		if (route) {
			if (XQCore.callerEvent) {
				data = data || {};
				data[XQCore.callerEvent] = 'redirect';
			}
			route.fn.call(this, data);
		}

		this.log('Navigate to', url, data);
	};

	return presenter;
})();
