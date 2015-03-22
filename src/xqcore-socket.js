/**
 * XQCore socket module handles socket connections to a socket server
 * @module XQCore.Socket
 * @requires XQCore.Logger
 * @requires sockJS-client
 *
 */
(function(XQCore, undefined) {
    'use strict';

    var log = new XQCore.Logger('Socket');

    var SockJS = XQCore.require('sockjs');

    var Socket = function() {
        this.__isReady = false;
        this.__onReadyCallbacks = [];
        this.__eventEmitter = new XQCore.Event();
    };

    XQCore.extend(Socket.prototype);

    /**
     * Connects to a socket server
     *
     * @method connect
     * @param {String}   url      Socket server url
     * @param {Object}   options  SockJS options
     * @param {Function} callback Callback function. Its called if connection was successful and its called before ready state becomes true
     * @example {js}
     * var socket = new XQCore.Socket();
     * socket.connect('http://mysocket.io:9889');
     * socket.on('data', function() {
     *   console.log('Got data from server');
     * });
     * 
     */
    Socket.prototype.connect = function(url, options, callback) {
        var self = this;


        log.req('Connect to socket server ', url, 'using options:', options);
        this.sockJS = new SockJS(url, null, options);

        this.sockJS.onopen = function() {
            log.req('Connection was successful!');
            if (typeof callback === 'function') {
                callback();
            }

            self.setReady();
        };

        this.sockJS.onmessage = function(e) {
            var msg;

            try {
                msg = JSON.parse(e.data);
            }
            catch(err) {
                console.error('Could not parse socket message!', e.data);
            }

            log.log('Got message', msg.eventName, 'with args:', msg.args);
            var args = msg.args || [];
            args.unshift(msg.eventName);
            self.__eventEmitter.emit.apply(self.__eventEmitter, args);
        };

        this.sockJS.onclose = function() {
            log.log('Connection closed!');
        };
    };

    /**
     * Sends a socket message to a connected socket server
     *
     * @method emit
     * @param {String} eventName Event name
     * @param {Object} data      Data
     * 
     */
    Socket.prototype.emit = function(eventName, data) {
        var self = this;

        var args = Array.prototype.slice.call(arguments, 1);

        this.ready(function() {
            log.log('Send message ', eventName, args);
            self.sockJS.send(JSON.stringify({
                eventName: eventName,
                args: args
            }));
        });
    };

    /**
     * Registers a listener for an incoming socket message
     *
     * @method  on
     * @param {String}   eventName Event name
     * @param {Function} callback  Listener callback
     */
    Socket.prototype.on = function(eventName, callback) {
        this.__eventEmitter.on(eventName, callback);
    };


    /**
     * Registers a once-listener for an incoming socket message.
     * This listener will be removed if a socet message with the same name has been arrived.
     *
     * @method  once
     * @param  {String}   eventName Event name
     * @param  {Function} callback  Listener callback
     */
    Socket.prototype.once = function(eventName, callback) {
        this.__eventEmitter.once(eventName, callback);
    };

    /**
     * Unregisters a socket listener
     *
     * @method off
     * @param  {String}   eventName Event name
     * @param  {Function} callback  Listener callback (Optional)
     */
    Socket.prototype.off = function(eventName, callback) {
        this.__eventEmitter.off(eventName, callback);
    };

    /**
     * Call function fn when socket is connected
     *
     * @method ready
     * @param  {Function} fn Function to be called if socket is ready
     */
    Socket.prototype.ready = function(fn) {
        if (this.__isReady) {
            fn.call(this);
        }
        else {
            this.__onReadyCallbacks.push(fn);
        }
    };

    /**
     * Sets readyState and calls all queued functions
     *
     * @method setReady
     * @private
     */
    Socket.prototype.setReady = function() {
        var self = this;
        
        this.__isReady = true;
        this.__onReadyCallbacks.forEach(function(fn) {
            fn.call(self);
        });

        this.__onReadyCallbacks = [];
    };

    XQCore.Socket = Socket;

})(XQCore);