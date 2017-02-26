/**
 * XQCore Logger module
 *
 * Produces logging output to the browser console. This module is in all XQCore modules as var `log` available.
 * It is not necessary to instantiate it. The logger module has 5 logging levels: `ERROR, WARN, INFO, DEBUG`.
 * The log-levels can be controlled by setting it globally by setting the XQCore.logLevel property,
 * or locally for each module by change the log.logLevel property. The locally property overrides the globally property
 * for the current module.
 *
 * @module XQCore.Logger
 *
 */

'use strict';

/**
 * XQCore Logger is a logging module to log messages, warnings, errors to the browser console
 *
 * @constructor
 * @version 1.0.0
 *
 * @param {String} name Logger name (Optional)
 *
 * @example {js}
 * var log = new XQCore.Logger('myLog');
 * log.log('Hello World');
 *
 * //Logs this to the console: [myLog] Hello World
 *
 * var log2 = new XQCore.Logger();
 * log2.log('Hello World');
 *
 * //Logs this to the console: Hello World
 *
 *
 */
var Logger = function(name) {
  this.loggerName = name;
  this.logLevel = 1;
};

/**
 * Log level constan `ERROR`
 * @const ERROR
 * @version 1.0.0
 */
 Logger.ERROR = 1;

/**
 * Log level constan `WARN`
 * @const WARN
 * @version 1.0.0
 */
 Logger.WARN = 2;

/**
 * Log level constan `INFO`
 * @const INFO
 * @version 1.0.0
 */
 Logger.INFO = 3;

/**
 * Log level constan `DEBUG`
 * @const DEBUG
 * @version 1.0.0
 */
 Logger.DEBUG = 4;


/**
 * Sets a loglevel
 *
 * @method setLevel
 * @version 1.0.0
 *
 * @param  {number|sstring} level Loglevel
 *
 * @example {js}
 * var log = new XQCore.Logger('mylogger');
 * log.setLevel(2); // sets log level to `info`
 */
Logger.prototype.setLevel = function(level) {
  if (typeof level === 'string') {
    level = Logger[level.toUpperCase()];
  }

  if (typeof level === 'number' && level > 0 && level < 5) {
    this.logLevel = level;
  }
}

/**
 * Logs a message to the console.
 *
 * To log a message of this type a minimum logLevel of INFO is required.
 * Only the first given argument will be logged if log level is set to INFO.
 * To log all arguments, log level must be set to DEBUG.
 *
 * This method can have multiple arguments!
 *
 * @method info
 * @version 1.0.0
 *
 * @param  {any} ...args Log args. Logs all args to the console, seperated by a space.
 *
 * @example {js}
 * log.setLevel('info');
 * log.info('Write to console', {test: '123'});
 *
 * @param {Any} msg logs all arguments to the console
 */
Logger.prototype.info = function() {
  var args;
  if (this.logLevel >= Logger.INFO) {
    args = Array.prototype.slice.call(arguments);

    if (this.loggerName) {
      args.unshift('[' + this.loggerName + ']');
    }

    console.log.apply(console, args); // eslint-disable-line
  }
};

Logger.prototype.log = Logger.prototype.info;

/**
 * Logs a warning message to the console.
 *
 * To log a warning message of this type a minimum logLevel of WARNING is required.
 *
 * This method can have multiple arguments!
 *
 * @method warn
 * @version 1.0.0
 *
 * @param  {any} ...args Logs all args to the console, seperated by a space.
 *
 * @example {js}
 * log.setLevel('warn');
 * log.warn('Unvalid number', {test: '123'});
 *
 * @param {Any} msg logs all arguments to the console
 */
Logger.prototype.warn = function() {
  var args;
  if (this.logLevel >= Logger.WARN) {
    args = Array.prototype.slice.call(arguments);
    if (this.loggerName) {
      args.unshift('[' + this.loggerName + ']');
    }

    console.warn.apply(console, args); // eslint-disable-line
  }
};

/**
 * Logs a error message to the console.
 *
 * To log a error message of this type a minimum logLevel of WARNING is required.
 *
 * This method can have multiple arguments!
 *
 * @method error
 * @version 1.0.0
 *
 * @param  {any} ...args Logs all args to the console, seperated by a space.
 *
 * @example {js}
 * log.logLevel = 1; //ERROR
 * log.error('Unvalid number', {test: '123'});
 */
Logger.prototype.error = function() {
  var args;
  if (this.logLevel >= Logger.ERROR) {
    args = Array.prototype.slice.call(arguments);
    if (this.loggerName) {
      args.unshift('[' + this.loggerName + ']');
    }

    console.error.apply(console, args); // eslint-disable-line
  }
};

/**
 * Logs a debug message to the console.
 *
 * To log a debug message of this type a minimum logLevel of DEBUG is required.
 * Only the first given argument will be logged if log level is set to DEBUG.
 * To log all arguments, log level must be set to TRACE.
 *
 * This method can have multiple arguments!
 *
 * @method debug
 * @version 1.0.0
 *
 * @param  {any} ...args Logs all args to the console, seperated by a space.
 *
 * @example {js}
 * log.setLevel('debug');
 * log.debug('Write to console', {test: '123'});
 */
Logger.prototype.debug = function() {
  var args;
  if (this.logLevel >= Logger.DEBUG) {
    args = Array.prototype.slice.call(arguments);

    if (this.loggerName) {
      args.unshift('[' + this.loggerName + ']');
    }

    console.debug.apply(console, args); // eslint-disable-line
  }
};

/**
 * Logs a log message to the console. This is just an alias for log
 *
 * @method info
 */
Logger.prototype.info = Logger.prototype.log;

/**
 * Start a timeTracer
 *
 * @method timer
 * @version 1.0.0
 * 
 * @param {String} timerName Set the name for your (Optional)
 * @return {Object} Returns a TimerObject
 */
Logger.prototype.timer = function(name) {
  var self = this;

  var timer = {
    start: null,
    stop: null,
    name: name,
    logger: this,
    end: function() {
      this.stop = Date.now();
      this.logger.log('Timer ' + name + ' finished after ' + self.getHumanTime(this.stop - this.start));
    }
  };

  /*if (name) {
    this.timerStore[name] = timer;
  }*/

  this.log('Start Timer ' + name);

  //Set timer start time
  timer.start = Date.now();
  return timer;
};

/**
 * Returns a human readable time format
 * @method getHumanTime
 * @private
 * @param  {Number}     time Time in milliseconds
 * @return {String}          Returns a readable time string
 */
Logger.prototype.getHumanTime = function(time) {
  if (time < 1000) {
    return time + 'ms';
  }
  else if (time < 60000) {
    return (Math.round(time / 100) / 10) + 'sec';
  }
  else {
    return (Math.round(time / 60000)) + 'min ' + Math.round(time % 60000 / 1000) + 'sec';
  }
};

//--

module.exports = Logger;
