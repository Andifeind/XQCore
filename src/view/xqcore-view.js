/**
 * XQCore View module
 *
 * @module XQCore.View
 * @returns {object} Returns a XQCore.View prototype object
 */
(function(XQCore, undefined) {
	'use strict';

	var $ = XQCore.require('jquery');

	/**
	 * XQCore.View
	 *
	 * @class XQCore.View
	 * @constructor
	 *
	 * @uses XQCore.Logger
	 * @uses XQCore.Event
	 * 
	 * @param {object} conf View configuration
	 */
	var View = function(name, initFunc) {
		var conf;

		if (typeof arguments[0] === 'object') {
			conf = name;
			name = conf.name;
		}
		
		/**
		 * Enable debug mode
		 * @public
		 * @type {Boolean}
		 */
		this.debug = XQCore.debug;

		/**
		 * Set presenter name
		 * @public
		 * @type {String}
		 */
		this.name = (name ? name.replace(/View$/, '') : 'Nameless') + 'View';

		/**
		 * Sets the container element
		 * @property container
		 * @type Selector
		 * @default 'body'
		 */
		this.container = 'body';

		/**
		 * Set the view element tag
		 *
		 * @property tag
		 * @type {String}
		 * @default 'div'
		 */
		this.tag = 'div';

		/**
		 * Set the insert mode
		 *
		 * @property mode
		 * @type {String}
		 * @default	replace
		 */
		this.mode = 'replace';

		/**
		 * Enable/Disable autoInjection of the view into the DOM
		 *
		 * @property autoInject
		 * @type {Boolean}
		 * @default true
		 */
		this.autoInject = true;

		/**
		 * Set initFunc
		 *
		 * @method initFunc
		 * @protected
		 */
		this.initFunc = initFunc;

		/**
		 * Holds the domReady state
		 *
		 * @property __domReady
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		this.__domReady = false;


		/* ++++++++++ old stuff +++++++++++++ */

		conf = conf || {
			events: null
		};

		this.conf = conf;
	};

	XQCore.extend(View.prototype, new XQCore.Event(), new XQCore.Logger());

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


		if (typeof this.initFunc === 'function') {
			this.initFunc.call(this, self);
		}

		if (typeof presenter !== 'object') {
			throw new Error('No presenter was set in view.init()');
		}

		//Register view at presenter
		this.presenter = presenter;

		$(function() {

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
				// this.presenter.fireViewInit(this);
			}
			else {
				this.error('Can\'t initialize View, Container not found!', this.container);
			}

			//Set DOM ready state
			this.__domReady = true;
			if (this.__initialData) {
				this.render(this.__initialData);
				delete this.__initialData;
			}
			
		}.bind(this));

	};

	View.prototype.show = function() {
		this.$el.show();
	};

	View.prototype.hide = function() {
		this.$el.hide();
	};

	View.prototype.renderHTML = function(template, data) {
		this.log('Render view html snipet', template, 'with data:', data);
		template = typeof template === 'function' ? template : XQCore.Tmpl.compile(template);
		return template(data);
	};

	View.prototype.resize = function() {

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
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}
			
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
	View.prototype.validationFailed = function(err, data) {
		console.log(err, data);
		err.forEach(function(item) {
			this.$el.find('[name="' + item.property + '"]').addClass('xq-invalid');
		}.bind(this));
	};

	/**
	 * Recive a state.change event from a coupled model
	 *
	 * @param {String} state Model state
	 */
	View.prototype.stateChanged = function(state) {
		
	};

	/**
	 * Wait til view is ready
	 *
	 * @method ready
	 * @param {Function} callback Callback
	 */
	View.prototype.ready = function(callback) {
		if (this.isReady) {
			callback.call(this);
		}
		else {
			if (!this.__readyCallbacks) {
				this.__readyCallbacks = [];
			}

			this.__readyCallbacks.push(callback);
		}
	};

	View.prototype.__setReadyState = function() {
		this.isReady = true;
		if (this.__readyCallbacks) {
			this.__readyCallbacks.forEach(function(fn) {
				fn.call(this);
			}.bind(this));
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

	/* +---------- new since v0.7.0 ----------+ */

	/**
	 * Inject element into the DOM
	 *
	 * @public
	 * @method inject
	 */
	View.prototype.inject = function() {
		this.$ct = $(this.container);
		this.log('Inject view into container', this.$ct);

		this.el = this.$el.get(0);
		this.$el.addClass('xq-view xq-view-' + this.name.toLowerCase());
		this.ct = this.$ct.get(0);

		if (this.hidden === true) {
			this.$el.hide();
		}

		if (this.id) {
			this.$el.attr('id', this.id);
		}

		if (this.className) {
			this.$el.addClass(this.className);
		}
		
		if (this.mode === 'replace') {
			this.$ct.contents().detach();
			this.$ct.append(this.$el);
			// this.$ct.children().replaceWith(this.$el);
		}
		else if(this.mode === 'append') {
			this.$ct.append(this.$el);
		}
		else if (this.mode === 'prepend') {
			this.$ct.prepend(this.$el);
		}
		else {
			throw new Error('Unknow insert mode in view.init()');
		}
	};

	/**
	 * Parse a precompiled template and returns a html string
	 *
	 * @method parse
	 *
	 * @param {Function} template Precompiled template
	 * @param {Object} data Data object
	 *
	 * @return {String} compiled html
	 */
	View.prototype.parse = function(template, data) {
		var html;

		template.scopeStore = {};
		template.scopes = {};

		try {
			html = template(data || {}, template.scopes);
		}
		catch(err) {
			html = '<p class="renderError"><b>View render error!</b><br>' + err.message + '</p>';
			this.error('View render error!', err);
		}


		if (html) {
			html = $.parseHTML(html);
			var $newEl = $(html);
			var els = $newEl.find('scope');
			console.log('EL', els.length);
			els.each(function() {
				var scopeId = $(this).attr('id'),
					path = $(this).attr('path'),
					content;

				console.log('Parse path', path);
				content = {};
				if (scopeId) {
					content.value = $.parseHTML(template.scopes[scopeId](data[path], data));
					content.id = scopeId
				}
				else {
					content.value = $.parseHTML(data[path]);
				}

				template.scopeStore[path] = template.scopeStore[path] || [];
				template.scopeStore[path].push(content);

				console.log('EL', $(this).get(0).outerHTML);
				console.log('CONTENT', $(content.value).get(0).outerHTML);
				$(this).replaceWith($(content.value));
				console.log('REPLACETD', $newEl.get(0).outerHTML);
			});
		}

		return $newEl;
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
		if (this.__domReady === false) {
			this.__initialData = data;
			return;
		}

		var $newEl,
			html,
			isInitialRender = false;

		//Initial render and injection
		if (!this.$el) {
			isInitialRender = true;
		}

		this.log('Render view template', this.template, 'with data:', data);

		var template = typeof this.template === 'function' ? this.template : XQCore.Tmpl.compile(this.template);
		this.scopes = {};
		/*if (this.$el) {
			this.$el.remove();
		}*/

		try {
			html = template(data || {}, this.scopes);
		}
		catch(err) {
			html = '<p class="renderError"><b>View render error!</b><br>' + err.message + '</p>';
			this.error('View render error!', err);
		}

		html = $.parseHTML(html);
		$newEl = $(html);
		
		if (this.$el) {
			this.$el.replaceWith($newEl);
		}

		this.$el = $newEl;

		if (isInitialRender) {
			if (this.autoInject) {
				this.inject();
			}
			//Set ready state
			this.__setReadyState();
		}

		this.registerListener(this.$el);
		this.emit('content.change', data);
	};

	View.prototype.registerListener = function($el) {
		var self = this;

		//TODO get form data on submit event
		$el.find('[on]').addBack('[on]').each(function() {
			var $cur = $(this);
			var events = $(this).attr('on');
			var data = $(this).data();
			var listenerFunc;
			$cur.removeAttr('on');

			events = events.split(';');
			events.forEach(function(ev) {
				ev = ev.split(':');

				if (ev[0] === 'submit') {
					listenerFunc = function(e) {
						e.preventDefault();
						data = self.serializeForm(e.target);
						self.presenter.emit(ev[1], data, e);
						self.emit('form.submit', data);
					}.bind(this);
				}
				else {
					listenerFunc = function(e) {
						e.preventDefault();
						var value = e.currentTarget.value || '';
						self.presenter.emit(ev[1], value, data, e);
					}.bind(this);
				}

				$cur.bind(ev[0], listenerFunc);
			});
		});
	};

	/**
	 * Serialize a form and return its values as JSON
	 *
	 * @param {Object} Form selector
	 * @return {Object} FormData as JSON
	 */
	View.prototype.serializeForm = function(selector) {
		var formData = {},
			formSelector = $(selector);

		if (formSelector.get(0).tagName !== 'INPUT') {
			formSelector = formSelector.find(':input');
		}

		formSelector.serializeArray().forEach(function(item) {
			XQCore.dedotify(formData, item.name, item.value);
		});

		if (this.debug) {
			console.log('XQCore - Serialize form:', formSelector, formData);
		}

		return formData;
	};

	/**
	 * Insert a subset
	 * @param  {String} path  Data path
	 * @param  {Number} index Index after which item the insert should be happen or use -1 to prepend
	 * @param  {Object} data  Item data
	 */
	View.prototype.insert = function(path, index, data) {
		var self = this;
		var $scope = this.$el.find('.xq-scope[xq-path="' + path + '"]');
		if ($scope.length) {
			$scope.each(function() {
				var scope = $(this).attr('xq-scope');
				var html = self.scopes[scope]([data]);

				var $childs = $(this).children();
				if (index > -1) {
					if (index > $childs.length - 1) {
						index = $childs.length - 1;
					}

					$childs.eq(index).before(html);
				}
				else {
					$childs.eq(index).after(html);
				}
			});
		}
	};

	View.prototype.update = function(path, data) {
		console.warn('XQCore doesn`t support update event yet');
	};

	View.prototype.append = function(path, data) {
		this.insert(path, -1, data);
	};

	View.prototype.prepend = function(path, data) {
		this.insert(path, 0, data);
	};

	/**
	 * Remove an item from a subset. Removes the item with the given index.
	 * If index is negative number it will be removed from the end
	 * 
	 * @param  {String} path  data path
	 * @param  {Number} index Index of the item
	 */
	View.prototype.remove = function(path, index) {
		var $scope = this.$el.find('.xq-scope[xq-path="' + path + '"]');
		$scope.children(':eq(' + index + ')').remove();
	};


	XQCore.View = View;

})(XQCore);
