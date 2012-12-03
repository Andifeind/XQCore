XQCore.View = (function() {

	var view = function(presenter, conf) {
		var self = this;

		conf = conf || {
			events: null
		};

		$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
		this.name = (conf.name || 'Nameless') + 'View';
		this.presenter = presenter;

		this.debug = Boolean(conf.debug);
		this.container = $(conf.container);
		if (this.container.length > 0) {
			window.addEventListener('resize', function(e) {
				self.resize(e);
			}, false);

			this.log('Initialize view with conf:', conf);
			this.log('  ... using Presenter:', this.presenter.name);
			this.log('  ... using Container:', this.container);

			//Send events to presenter
			if (this.events) {
				Object.keys(this.events).forEach(function(key) {
					var split = key.split(' ', 2),
						eventFunc,
						eventName = split[0],
						selector = split[1] || null,
						self = this;

					if (split.length === 1 || split.length === 2) {
						eventFunc = this.presenter.events[this.events[key]];
						if (typeof eventFunc === 'function') {
							//Register event listener
							this.container.on(eventName, function(e) {
								var formData = null,
									tagData = null;

								if (e.type === 'submit') {
									formData = XQCore.Util.serializeForm(e.target);
									tagData = $(e.target).data();
								}

								eventFunc.call(self.presenter, e, tagData, formData);
							});
							this.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);
						}
						else {
							this.warn('Event handler callback not defined in Presenter:', this.events[key]);
						}
					}
					else {
						this.warn('Incorect event configuration', key);
					}
				}, this);
			} else {
				this.warn('No view events defined');
			}

			//Self init
			this.init();

			//Call presenter.initView()
			this.presenter.viewInit(this);
		}
		else {
			this.error('Can\'t initialize View, Container not found!', this.container);
		}
	};

	view.prototype.init = function() {

	};

	view.prototype.show = function() {
		
	};

	view.prototype.hide = function() {
		
	};

	view.prototype.render = function(data) {
		this.log('Render view template', this.template, 'with data:', data);
		var template = Handlebars.compile(this.template);
		this.container.html(template(data));
	};

	view.prototype.resize = function() {
		
	};



	return view;
})();
