var CorePresenter = (function() {

	var presenter = function(conf) {
		$.extend(this, conf, new CoreEvent(), new CoreLogger());
		this.name = (conf.name || 'Nameless') + 'Presenter';
		this.debug = Boolean(conf.debug);
		this.eventCallbacks = {};

		this.log('Initialize presenter with conf:', conf);
		this.init();
	};

	presenter.prototype.init = function() {

	};

	return presenter;
})();