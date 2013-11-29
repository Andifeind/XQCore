/*!
 * XQCore - 0.4.11
 * 
 * Model View Presenter Javascript Framework
 *
 * XQCore is licenced under MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2012 - 2013 Noname Media, http://noname-media.com
 * Author Andi Heinkelein
 *
 * Creation Date: 2013-11-22
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('xqcore', ['jquery', 'handlebars'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'), require('handlebars'));
    } else {
        root.XQCore = factory(root.jQuery, root.Handlebars);
    }
}(this, function (jQuery, Handlebars) {


/*jshint evil:true */
/*global XQCore:true */

/**
 * XQCore main object
 *
 * @package XQcore
 * @type {Object}
 */
var XQCore = {
	version: '0.4.11',
	defaultRoute: 'default',
	html5Routes: false,
	hashBang: '#!',
	callerEvent: 'callerEvent'
};


//XQCore helper functions
XQCore.extend = $.extend;

XQCore._dump = {};
XQCore.dump = function(componentName) {
	if (XQCore._dump[componentName]) {
		console.log('[XQCore dump]', componentName, XQCore._dump[componentName]);
		return XQCore._dump[componentName];
	}

	return false;
};
(function(proto, undefined) {
	var cssTransition;

	var setTransitionFunction = function() {
		return 'transition' in document.body.style ? 'transition' :
				'MozTransition' in document.body.style ? 'MozTransition' :
				'WebkitTransition' in document.body.style ? 'WebkitTransition' :
				'OTransition' in document.body.style ? 'OTransition' :
				'MsTransition' in document.body.style ? 'MsTransition' :
				undefined;
	};

	proto.slideIn = function(conf) {
		conf = $.extend({
			parent: this.el.parentNode,
			transition: 'left .75s',
			direction: 'auto'
		}, conf);

		if (cssTransition === undefined) {
			cssTransition = setTransitionFunction();
		}

		if (conf.parent && this.el) {
			this.log('> slide plugin > Slide view', this.el, 'in container', conf.parent);
			// console.log({
			// 	el: conf.parent,
			// 	cw: conf.parent.clientWidth,
			// 	ow: conf.parent.offsetWidth,
			// 	w: conf.parent.style.width
			// });
			var posX = conf.parent.offsetWidth;
			this.el.style.display = 'block';
			this.el.style[cssTransition] = 'none';
			this.el.style.left = posX + 'px';
			window.setTimeout(function() {
				this.el.style[cssTransition] = conf.transition;
				this.el.style.left = '0';
			}.bind(this));
		}
		else {
			this.warn('> slide plugin > Can\'t slide view! View or parent not found! View', this.el, 'in container', conf.parent);
		}
	};

	proto.slideOut = function(conf) {
		conf = $.extend({
			parent: this.el.parentNode,
			transition: 'left .75s',
			direction: 'auto'
		}, conf);

		if (cssTransition === undefined) {
			cssTransition = setTransitionFunction();
		}

		if (conf.parent && this.el) {
			this.log('> slide plugin > Slide view', this.el, 'in container', conf.parent);
			// console.log({
			// 	el: conf.parent,
			// 	cw: conf.parent.clientWidth,
			// 	ow: conf.parent.offsetWidth,
			// 	w: conf.parent.style.width
			// });
			var posX = conf.parent.offsetWidth;
				this.el.style[cssTransition] = conf.transition;
				this.el.style.left = posX + 'px';

			var transitionEndFunc = function() {
				if (+this.el.style.left.replace('px', '') >= posX) {
					this.el.style.display = 'none';
					this.el.style[cssTransition] = 'none';
				}
				this.el.removeEventListener('transitionend', transitionEndFunc);
			}.bind(this);
			
			this.el.addEventListener('transitionend', transitionEndFunc);
		}
		else {
			this.warn('> slide plugin > Can\'t slide view! View or parent not found! View', this.el, 'in container', conf.parent);
		}
	};

})(XQCore.View.prototype);

 return XQCore;
}));

