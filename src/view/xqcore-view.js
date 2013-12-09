/*global $:false */
/**
 * XQCore View module
 *
 * @module XQCore.View
 * @returns {object} Returns a XQCore.View prototype object
 */
(function(XQCore, undefined) {
	'use strict';

	var Handlebars = XQCore.require('handlebars');

	/**
	 * XQCore.View
	 *
	 * @constructor
	 * @class XQCore.View
	 * @param {object} conf View configuration
	 */
	var View = function(name, conf) {

		if (typeof arguments[0] === 'object') {
			conf = name;
			name = conf.name;
		}

		/**
		 * Determines wether the view is hidden after rendering
		 * @property hidden
		 * @type Boolean
		 * @default false
		 */
		
		/**
		 * Sets the container element
		 * @property el
		 * @type Selector
		 * @default "body"
		 */

		conf = conf || {
			events: null
		};

		this.customInit = conf.init;
		this.conf = conf;
		delete conf.init;

		XQCore.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
		this.name = (name.replace(/View$/, '') || 'Nameless') + 'View';

		this.debug = Boolean(conf.debug);
	};

	/**
	 * Init function
	 *
	 * @method init
	 *
	 * @param  {Object} presenter Views presenter object
	 */
	View.prototype.init = function(presenter) {
		var self = this,
			conf = this.conf;

		//Register view at presenter
		this.presenter = presenter;

		$(function() {
			this.container = $(conf.container);
			if (conf.tag) {
				this.$el = $($.parseHTML('<' + conf.tag + '/>'));
				this.$el.appendTo(this.container);
			}
			else {
				this.$el = this.container;
			}
			this.el = this.$el.get(0);

			if (conf.hidden === true) {
				this.$el.hide();
			}

			if (conf.id) {
				this.$el.attr('id', conf.id);
			}

			if (conf.className) {
				this.$el.addClass(conf.className);
			}

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
						var spacePos = key.indexOf(' '),
							eventFunc = this.events[key],
							eventName = key.substr(0, spacePos),
							selector = key.substr(spacePos + 1) || this.container,
							self = this,
							eventDest;

						if (typeof eventFunc === 'function') {
							eventDest = this;
						}
						else if (eventFunc.indexOf('view:') === 0) {
							eventFunc = this[eventFunc.substr(5)];
							eventDest = this;
						}
						else if (typeof this.presenter.events[this.events[key]] === 'function') {
							eventFunc = this.presenter.events[this.events[key]];
							eventDest = this.presenter;
						}
						else {
							var eventFuncStr = eventFunc;
							eventFunc = function(e, tag, data) {
								this.triggerEvent(eventFuncStr, e, tag, data);
							}.bind(this);
							eventDest = this;
						}

						if (eventFunc && eventName) {

							if (typeof eventFunc === 'function') {
								//Register event listener
								this.container.delegate(selector, eventName, function(e) {
									var formData = null,
										tagData = null;

									if (e.type === 'submit') {
										formData = XQCore.Util.serializeForm(e.currentTarget);
									}
									else if (e.type === 'keydown' || e.type === 'keyup' || e.type === 'keypress') {
										formData = $(e.currentTarget).val();
									}

									tagData = $.extend($(e.currentTarget).data(), {
										itemIndex: getItemIndex.call(self, e.currentTarget)
									});

									eventFunc.call(eventDest, e, tagData, formData);
								}.bind(this));
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
				}

				// custom init
				if (typeof this.customInit === 'function') {
					this.customInit.call(this);
				}

				//Call presenter.initView()
				this.presenter.fireViewInit(this);
			}
			else {
				this.error('Can\'t initialize View, Container not found!', this.container);
			}
		}.bind(this));
	};

	View.prototype.show = function() {
		this.$el.show();
	};

	View.prototype.hide = function() {
		this.$el.hide();
	};

	/**
	 * Render view
	 *
	 * @method render
	 * @emits content.change
	 *
	 * @param  {Object} data Render data
	 *
	 */
	View.prototype.render = function(data) {
		this.log('Render view template', this.template, 'with data:', data);
		var template = typeof this.template === 'function' ? this.template : Handlebars.compile(this.template);
		this.$el.html(template(data || {}));

		this.emit('content.change', data);
	};

	View.prototype.renderHTML = function(template, data) {
		this.log('Render view html snipet', template, 'with data:', data);
		template = typeof template === 'function' ? template : Handlebars.compile(template);
		return template(data);
	};

	View.prototype.resize = function() {

	};

	/**
	 * Appends a html fragment to a html element
	 * You must set the itemTemplate and subSelector  option first
	 *
	 * @param {String} selector parent selector
	 * @param {Object} data item data
	 * @param {Object} options Appending options (not implemented yet)
	 */
	View.prototype.append = function(data, options) {
		this.manipulate('append', data, options);
	};

	/**
	 * Prepends a html fragment to a html element
	 * You must set the itemTemplate and subSelector option first
	 *
	 * @param {Object} data item data
	 * @param {Object} options Prepending options (not implemented yet)
	 */
	View.prototype.prepend = function(data, options) {
		this.manipulate('prepend', data, options);
	};

	/**
	 * Remove a item from a dom node
	 *
	 * @param {Number} index Remove item <index> from a node list
	 */
	View.prototype.remove = function(index) {
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
	View.prototype.manipulate = function(action, data, options) {
		if (this.subSelector === undefined) {
			this.warn('You must set the subSelector option');
			return false;
		}

		if (this.itemTemplate === undefined) {
			this.warn('You must set the itemTemplate option');
			return false;
		}

		var selector = $(this.subSelector, this.container),
			html;

		switch (action) {
			case 'append':
				html = Handlebars.compile(this.itemTemplate)(data);
				$(html).appendTo(selector);
				break;
			case 'prepend':
				html = Handlebars.compile(this.itemTemplate)(data);
				$(html).prependTo(selector);
				break;
			case 'remove':
				selector.children().eq(data).remove();
				break;
			default:
				this.error('undefined action in view.manipulate()', action);
		}

	};

	/**
	 * Gets the data of an element
	 *
	 * @param {Object} selector DOM el or a jQuery selector of the element
	 *
	 * @return {Object} Returns the data of an element or null
	 */
	View.prototype.getElementData = function(selector) {
		var el = $(selector, this.container);
		if (el.length) {
			var data = {},
				attrs = el.get(0).attributes,
				i;

			for (i = 0; i < attrs.length; i++) {
				if (attrs[i].name.indexOf('data-') === 0) {
					var name = attrs[i].name.substr(5),
						value = attrs[i].value;

					if (typeof value === 'string') {
						try {
							if (value === 'true' || value === 'TRUE') {
								value = true;
							}
							else if (value === 'false' || value === 'FALSE') {
								value = false;
							}
							else if (value === 'null' || value === 'NULL') {
								value = null;
							}
							else if (value === 'undefined') {
								value = undefined;
							}
							else if (+value + '' === value) {
								value = +value;
							}
							else {
								value = JSON.parse(value);
							}
						}
						catch(err) {

						}
					}

					data[name] = value;
				}
			}

			return data;
		}
		else {
			return null;
		}
	};

	/**
	 * Triggers a view event to the presenter
	 *
	 * @method triggerEvent
	 *
	 * @param {String} eventName Event of the triggered event
	 * @param {Object} e EventObject
	 * @param {Object} tag Tag data
	 * @param {Object} data Event data
	 */
	View.prototype.triggerEvent = function(eventName, e, tag, data) {
		if (this.presenter.events[eventName]) {
			this.presenter.events[eventName].call(this.presenter, e, tag, data);
		}
		else {
			e.preventDefault();
			e.stopPropagation();
			if (this.__coupledWith) {
				this.__coupledWith.forEach(function(m) {
					if (typeof m[eventName] === 'function') {
						this.log('Autotrigger to model:', eventName, data);
						m[eventName](data);
					}
					else {
						this.warn('Autotrigger to model failed! Function doesn\'t exists:', eventName, data);
					}
				}.bind(this));
			}
		}
	};

	/**
	 * Navigate to a given route
	 *
	 * @method navigateTo
	 *
	 * @param {String} route Route url
	 * @param {Object} data Data object
	 * @param {Boolean} replace Replace current history entry with route
	 */
	View.prototype.navigateTo = function(route, data, replace) {
		this.presenter.navigateTo(route, data, replace);
	};

	/**
	 * If a validation failed (Automaticly called in a coupled view)
	 *
	 * @method validationFailed
	 * @param {Object} err Validation error object
	 */
	View.prototype.validationFailed = function(err) {
		
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
			container = $(this.container).get(0),
			curEl = $(el),
			nextEl = curEl.parent(),
			subSelector = $(this.subSelector).get(0),
			d = 0;

		if (this.subSelector) {
			do {
				if (nextEl.get(0) === subSelector) {
					return $(curEl).index();
				}
				curEl = curEl.parent();
				nextEl = curEl.parent();

				if (++d > 100) {
					console.error('Break loop!');
					break;
				}
			} while(curEl.length && curEl.get(0) !== container);
		}

		return index;
	};



	XQCore.View = View;

})(this.XQCore);
