XQCore.Presenter = (function() {

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
				if (/^#![a-zA-Z0-9]+/.test(location.hash)) {
					route = location.hash.substr(2);
				}

				route = self.Router.match(route);
				if (route) {
					route.fn.call(self, e.state);
				}
			}, false);

			window.addEventListener('hashchange', function(e) {
				self.log('hashchange event recived', e, location.hash);
				// var tag = location.hash.substring(1);

				// if (typeof conf[tag] === 'function') {
				//	self.log('Call func', conf[tag]);
				//	conf[tag].call(self);
				// }
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
	};

	presenter.prototype.init = function(views) {
		var i;

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

		// custom init
		if (typeof this.customInit === 'function') {
			this.customInit.call(this);
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
	 */
	presenter.prototype.pushState = function(data, title, url) {
		history.pushState(data, title, url);
	};

	return presenter;
})();
