XQCore.Presenter = (function() {

	var presenter = function(conf) {
		var self = this;
		
		this.root = '/';
		this.debug = false;
		
		conf = conf || {};

		$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
		this.name = (conf.name || 'Nameless') + 'Presenter';
		this.eventCallbacks = {};

		this.log('Initialize presenter with conf:', conf);
		this.init();

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
			});

			window.addEventListener('popstate', function(e) {
				self.log('popstate event recived', e);
				if (!e.state) {
					return;
				}

				var tag = e.state.tag,
					url = e.state.url;

				if (typeof conf[tag] === 'function') {
					conf[tag].call(self, e.state.data);
				}
			}, false);

			window.addEventListener('hashchange', function(e) {
				self.log('hashchange event recived', e, location.hash);
				var tag = location.hash.substring(1);

				if (typeof conf[tag] === 'function') {
					self.log('Call func', conf[tag]);
					conf[tag].call(self);
				}
			}, false);
		}
	};

	presenter.prototype.init = function() {

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
		history.pushState(data,title,url);
	};

	return presenter;
})();
