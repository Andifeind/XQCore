/**
 * XQCore Logger
 *
 * Based on EventEmitter.js
 * 
 * 
 */
(function(XQCore, undefined) {
	'use strict';

	//var timerStore = {};

	function getHumanTime(time) {
		if (time < 1000) {
			return time + ' ms';
		}
		else if (time < 60000) {
			return (Math.round(time / 100) / 10) + ' sec';
		}
		else {
			return (Math.round(time / 60000)) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';
		}
	}

	/**
	 * XQCore Logger is a logging tool to log messages, warnings, errors to the browser or onscreen console
	 *
	 * @module XQCore.Logger
	 * @class XQCore.Logger
	 *
	 */
	var Logger = function() {
		
	};

	/**
	 * Loggs a message to the console
	 *
	 * @method log
	 *
	 * @param {Any} msg logs all arguments to the console
	 */
	Logger.prototype.log = function() {
		var args;

		if (this.debug) {
			args = Array.prototype.slice.call(arguments);
			args.unshift('[' + this.name + ']');
			console.log.apply(console, args);
		}
	};

	/**
	 * Loggs a warning to the console
	 *
	 * @method warn
	 * @param {Any} msg logs all arguments to the console
	 */
	Logger.prototype.warn = function() {
		var args;

		if (this.debug) {
			args = Array.prototype.slice.call(arguments);
			args.unshift('[' + this.name + ']');
			console.warn.apply(console, args);
		}
	};

	/**
	 * Loggs a error message to the console
	 *
	 * @method error
	 * @param {Any} msg logs all arguments to the console
	 */
	Logger.prototype.error = function() {
		var args;

		if (this.debug) {
			args = Array.prototype.slice.call(arguments);
			args.unshift('[' + this.name + ']');
			console.error.apply(console, args);
		}
	};

	/**
	 * Start a timeTracer
	 *
	 * @method timer
	 * @param {String} timerName Set the name for your (Optional)
	 * @return {Object} Returns a TimerObject
	 */
	Logger.prototype.timer = function(name) {
		var timer = {
			start: null,
			stop: null,
			name: name,
			logger: this,
			end: function() {
				this.stop = Date.now();
				this.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));
			}
		};

		/*if (name) {
			this.timerStore[name] = timer;
		}*/

		this.log('Start Timer', name);

		//Set timer start time
		timer.start = Date.now();
		return timer;
	};

	// --- new methods

	Logger.prototype.dev = function() {
		var args;

		if (this.debug) {
			args = Array.prototype.slice.call(arguments);
			args.unshift('[' + this.name + ']');
			console.debug.apply(console, args);
		}
	};

	Logger.prototype.req = Logger.prototype.log;
	Logger.prototype.res = Logger.prototype.log;

	Logger.prototype.__scope = {
		getHumanTime: getHumanTime
	};
	

	XQCore.Logger = Logger;

})(XQCore);