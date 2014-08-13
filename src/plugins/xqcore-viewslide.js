(function(proto, undefined) {
	'use strict';
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
		var self = this;

		conf = XQCore.extend({
			parent: this.el.parentNode,
			transition: 'left .75s',
			direction: 'auto'
		}, conf);

		if (cssTransition === undefined) {
			cssTransition = setTransitionFunction();
		}

		if (conf.parent && this.el) {
			this.log('> slide plugin > Slide view', this.el, 'in container', conf.parent);
			/*console.log({
				el: conf.parent,
				cw: conf.parent.clientWidth,
				ow: conf.parent.offsetWidth,
				w: conf.parent.style.width
			});*/
			var posX = conf.parent.offsetWidth;
			this.el.style.display = 'block';
			this.el.style[cssTransition] = 'none';
			this.el.style.left = posX + 'px';
			window.setTimeout(function() {
				self.el.style[cssTransition] = conf.transition;
				self.el.style.left = '0';
			});
		}
		else {
			this.warn('> slide plugin > Can\'t slide view! View or parent not found! View', this.el, 'in container', conf.parent);
		}
	};

	proto.slideOut = function(conf) {
		var self = this;
		
		conf = XQCore.extend({
			parent: this.el.parentNode,
			transition: 'left .75s',
			direction: 'auto'
		}, conf);

		if (cssTransition === undefined) {
			cssTransition = setTransitionFunction();
		}

		if (conf.parent && this.el) {
			this.log('> slide plugin > Slide view', this.el, 'in container', conf.parent);
			/*console.log({
				el: conf.parent,
				cw: conf.parent.clientWidth,
				ow: conf.parent.offsetWidth,
				w: conf.parent.style.width
			});*/
			var posX = conf.parent.offsetWidth;
				this.el.style[cssTransition] = conf.transition;
				this.el.style.left = posX + 'px';

			var transitionEndFunc = function() {
				if (+self.el.style.left.replace('px', '') >= posX) {
					self.el.style.display = 'none';
					self.el.style[cssTransition] = 'none';
				}
				self.el.removeEventListener('transitionend', transitionEndFunc);
			};
			
			this.el.addEventListener('transitionend', transitionEndFunc);
		}
		else {
			this.warn('> slide plugin > Can\'t slide view! View or parent not found! View', this.el, 'in container', conf.parent);
		}
	};

})(XQCore.View.prototype);