var CorePresenter = (function() {

	var presenter = function(conf) {
		var self = this;
		
		this.root = '/';
		this.debug = false;
		
		conf = conf || {};

		$.extend(this, conf, new CoreEvent(), new CoreLogger());
		this.name = (conf.name || 'Nameless') + 'Presenter';
		this.eventCallbacks = {};

		this.log('Initialize presenter with conf:', conf);
		this.init();

		//Setup popstate listener
		if (conf.routes) {
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

			console.log('I',view.name, view);
	};

	/**
	 * Add a history item to the browser history
	 */
	presenter.prototype.pushState = function(data, title, url) {
		history.pushState(data,title,url);
	};

	return presenter;
})();
