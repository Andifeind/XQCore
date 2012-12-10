XQCore.View = (function(undefined) {

	var view = function(presenter, conf) {
		var self = this;

		conf = conf || {
			events: null
		};

		$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
		this.name = (conf.name || 'Nameless') + 'View';
		this.presenter = presenter;

		this.debug = Boolean(conf.debug);

		$(function() {
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
							selector = split[1] || this.container,
							self = this;

						if (split.length === 1 || split.length === 2) {
							eventFunc = this.presenter.events[this.events[key]];
							if (typeof eventFunc === 'function') {
								//Register event listener
								this.container.delegate(selector, eventName, function(e) {
									var formData = null,
										tagData = null;

									if (e.type === 'submit') {
										formData = XQCore.Util.serializeForm(e.target);
									}

									tagData = $.extend($(e.target).data(), {
										itemIndex: getItemIndex.call(self, e.target)
									});

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
		}.bind(this));
	};

	view.prototype.init = function() {

				console.log('View Init2', this);
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

	/**
	 * Appends a html fragment to a html element
	 * You must set the itemTemplate and subSelector  option first
	 *
	 * @param {String} selector parent selector
	 * @param {Object} data item data
	 * @param {Object} options Appending options (not implemented yet)
	 */
	view.prototype.append = function(data, options) {
		this.manipulate('append', data, options);
	};

	/**
	 * Prepends a html fragment to a html element
	 * You must set the itemTemplate and subSelector option first
	 *
	 * @param {Object} data item data
	 * @param {Object} options Prepending options (not implemented yet)
	 */
	view.prototype.prepend = function(data, options) {
		this.manipulate('prepend', data, options);
	};

	/**
	 * Remove a item from a dom node
	 *
	 * @param {Number} index Remove item <index> from a node list
	 */
	view.prototype.remove = function(index) {
		this.manipulate('remove', index);
	};

	/**
	 * Manipulates a dom node
	 *
	 * @param  {String} action  Manipulation method
	 * @param  {[type]} data    [description]
	 * @param  {[type]} options (not implemented yet)
	 *
	 * @return {[type]}         [description]
	 */
	view.prototype.manipulate = function(action, data, options) {
		if (this.subSelector === undefined) {
			this.warn('You must set the subSelector option');
			return false;
		}

		if (this.itemTemplate === undefined) {
			this.warn('You must set the itemTemplate option');
			return false;
		}

		var selector = $(this.subSelector),
			html = Handlebars.compile(this.itemTemplate)(data);

		if (options) {
			//TODO handle transition options
		}

		switch (action) {
			case 'append':
				$(html).appendTo(selector);
				break;
			case 'prepend':
				$(html).prependTo(selector);
				break;
			case 'remove':
				selector.children().index(data).remove();
				break;
			default:
				this.error('undefined action in view.manipulate()', action);
		}

	};

	/**
	 * Gets the index of a subSelector item
	 * This function must binded to the view
	 *
	 * @param  {Object} el Start element.
	 *
	 * @return {Number}    index of the element or null
	 */
	var getItemIndex = function(el) {
		var index = null,
			container = $(this.container),
			curEl = el,
			nextEl = curEl.parent.parentNode,
			subSelector = $(this.subSelector).get(0),
			d = 0;

		if (this.subSelector) {
			do {
				if (nextEl === subSelector) {
					return nextEl.index(curEl);
				}
				curEl = curEl.parentNode;
				nextEl = curEl.parentNode;

				if (++d > 100) {
					console.error('Break loop!');
					break;
				}
			} while(curEl && curEl !== container);
		}

		return index;
	};



	return view;
})();
