/**
 * XQCore Logger module
 *
 * Produces logging output to the browser console. This module is in all XQCore modules as var `log` available.
 * It is not necessary to instantiate it. The logger module has 5 logging levels: `ERROR, WARN, INFO, DEBUG, TRACE`.
 * The log-levels can be controlled by setting it globally by setting the XQCore.logLevel property,
 * or locally for each module by change the log.logLevel property. The locally property overrides the globally property 
 * for the current module.
 *
 * @module XQCore.Logger
 * 
 */
(function(XQCore, undefined) {
    'use strict';

    /**
     * XQCore Logger is a logging module to log messages, warnings, errors to the browser console
     * 
     * @constructor
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
        this.logLevel = XQCore.logLevel;
    };

    /**
     * Logs a message to the console.
     *
     * To log a message of this type a minimum logLevel of INFO is required.
     * Only the first given argument will be logged if log level is set to INFO.
     * To log all arguments, log level must be set to DEBUG.
     *
     * This method can have multiple arguments!
     *
     * @method log
     * @example {js}
     * log.logLevel = 3; //INFO
     * log.log('Write to console', {test: '123'});
     * //Logs only the first argument
     *
     * log.logLevel = 4;
     * log.log('Write to console with args', {test: '123'});
     * //Logs all arguments
     *
     * @param {Any} msg logs all arguments to the console
     */
    Logger.prototype.log = function() {
        var args;
        if (this.logLevel >= 3) {
            args = Array.prototype.slice.call(arguments);
            if (this.logLevel === 3) {
                args = [args[0]];
            }

            if (this.loggerName) {
                args.unshift('[' + this.loggerName + ']');
            }

            console.log.apply(console, args);
        }
    };

    /**
     * Logs a warning message to the console.
     *
     * To log a warning message of this type a minimum logLevel of WARNING is required.
     *
     * This method can have multiple arguments!
     *
     * @method warn
     * @example {js}
     * log.logLevel = 2; //WARNING
     * log.warn('Unvalid number', {test: '123'});
     *
     * @param {Any} msg logs all arguments to the console
     */
    Logger.prototype.warn = function() {
        var args;
        if (this.logLevel >= 2) {
            args = Array.prototype.slice.call(arguments);
            if (this.loggerName) {
                args.unshift('[' + this.loggerName + ']');
            }

            console.warn.apply(console, args);
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
     * @example {js}
     * log.logLevel = 1; //ERROR
     * log.error('Unvalid number', {test: '123'});
     *
     * @param {Any} msg logs all arguments to the console
     */
    Logger.prototype.error = function() {
        var args;
        if (this.logLevel >= 1) {
            args = Array.prototype.slice.call(arguments);
            if (this.loggerName) {
                args.unshift('[' + this.loggerName + ']');
            }

            console.error.apply(console, args);
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
     * @example {js}
     * log.logLevel = 3; //DEBUG
     * log.debug('Write to console', {test: '123'});
     * //Logs only the first argument
     *
     * log.logLevel = 4;
     * log.debug('Write to console with args', {test: '123'});
     * //Logs all arguments
     *
     * @param {Any} msg logs all arguments to the console
     */
    Logger.prototype.debug = function() {
        var args;
        if (this.logLevel >= 4) {
            args = Array.prototype.slice.call(arguments);
            if (this.logLevel === 4) {
                args = [args[0]];
            }

            if (this.loggerName) {
                args.unshift('[' + this.loggerName + ']');
            }

            console.debug.apply(console, args);
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

    // --- new methods

    Logger.prototype.dev = function() {
        var args;

        if (this.debug) {
            args = Array.prototype.slice.call(arguments);
            if (this.loggerName) {
                args.unshift('[' + this.loggerName + ']');
            }
            
            console.debug.apply(console, args);
        }
    };

    Logger.prototype.req = Logger.prototype.log;
    Logger.prototype.res = Logger.prototype.log;

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

    XQCore.Logger = Logger;

})(XQCore);