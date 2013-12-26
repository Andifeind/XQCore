(function(XQCore, undefined) {
	'use strict';

	var Tmpl = function() {
		this.indentionPattern = /\t/g;
	};

	
	/**
	 * Precompiles a .tmpl file
	 * 
	 * @method precompile
	 * @param {String} tmpl Tmpl source
	 * @return {Function} Returns a parsed tmpl source as a function.
	 */
	Tmpl.prototype.precompile = function(tmpl) {
		var out = '',
			match,
			pattern = /^([ \t]*)?(\/\/)?(if|end|else|each|unless)?([a-zA-Z0-9]+=(?:(?:\"[^\"]+\")|(?:\'[^\']+\')|(?:\S+)))?([a-z0-9]+)?(.*)?$/gm,
			closer = [],
			attrs = '';

		this.pos = 0;
		this.indention = 0;
		this.prevIndention = 0;
		this.len = tmpl.length;
		var d = 10000;

		do {
			match = pattern.exec(tmpl);
			attrs = '';
			console.log('Match', match);
			if (--d < 0) {
				throw 'Never ending loop!';
			}

			//It's an empty line or a comment
			if (!match[0] || match[2]) {
				continue;
			}

			var indention = this.getIndention(match[1]);
			if (match[5]) {
				if (indention <= this.indention) {
					do {
						out += (closer.pop() || '');
						this.indention--;
					} while(indention < this.indention);
				}

				if (match[6]) {
					var res = this.stripAttributes(match[6]);
					if (res) {
						attrs = ' ' + res.attrs.join(' ');

						if (res.events.length !== 0) {
							//TODO register events
						}
					}
				}

				this.indention = indention;
				out += '<' + match[5] + attrs + '>';
				closer.push('</' + match[5] + '>');
			}
			else if (match[6]) {
				//It's a string
				out += match[6];
			}
			else if (match[4]) {
				var res = this.stripAttributes(match[4]);
				if (res) {
					attrs = ' ' + res.attrs.join(' ');

					if (res.events.length !== 0) {
						//TODO register events
					}

					out = out.replace(/\>$/, attrs + '>');
				}
				else {
					throw 'Parse error (3)';
				}
			}


		} while (match[0]);

		if (closer.length > 0) {
			while (true) {
				var el = closer.pop();
				if (!el) {
					break;
				}

				out += el;
			}
		}

		return function(data) {
			return out;
		};
	};

	Tmpl.prototype.__parseLine = function(line) {
		//var indention = this.indentionPattern;
	};

	Tmpl.prototype.getIndention = function(str) {
		var i = 0;

		this.indentionPattern.lastIndex = 0;
		while(this.indentionPattern.test(str)) {
			i++;
		}

		return i;
	};

	Tmpl.prototype.stripAttributes = function(str) {
		var pattern = /(?:(on[A-Z][a-zA-Z0-9-]+)|([a-zA-Z0-9-]+))=((?:\"[^\"]+\")|(?:\'[^\']+\')|(?:\S+))/g;
		var attrs = [],
			events = [],
			d = 1000,
			match;
		
		while (match = pattern.exec(str)) {
			// console.log('Submatch',match);
			if (!match[0]) {
				break;
			}

			if (--d < 0) {
				throw 'Never ending loop!';
			}

			if (match[1]) {
				events.push([match[1], match[3]]);
				continue;
			}
			
			if (match[2]) {
				attrs.push(match[2] + '="' + match[3] + '"');
			}			
		}

		return attrs.length || events.length ? {
			attrs: attrs,
			events: events
		} : null;
	};

	XQCore.Tmpl = Tmpl;
})(XQCore);