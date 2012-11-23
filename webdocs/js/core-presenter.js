var CorePresenter = (function() {

	var presenter = function(conf) {
		var self = this;

		$.extend(this, conf, new CoreEvent(), new CoreLogger());
		this.name = (conf.name || 'Nameless') + 'Presenter';
		this.debug = Boolean(conf.debug);
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

				var tag = e.state.tag;

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

	return presenter;
})();