/**
 * Socket connection
 * Creates a socket connection to a socket server. Only one connection is used per server/port combination.
 *
 * @module XQCore.SocketConnection
 */

/*global XQCore:false */
(function(XQCore) {
    'use strict';

    var log = new XQCore.Logger('SocketConnection');

    var SockJS = XQCore.require('sockjs');
    var instances = {};

    /**
     * SocetConnection object
     * Handles a socket connection
     *
     * @singelton
     * @constructor
     *
     * @example {js}
     * var conn = new XQCore.SocketConnection('http://localhost:9889/xqsocket');
     * conn.ready(function() {
     *     //Connection was successfull
     * });
     */
    var SocketConnection = function(url) {
        if (instances[url]) {
            return instances[url];
        }

        //Only one instance per socket server
        instances[url] = this;

        this.__isReady = false;
        this.__onReadyCallbacks = [];
        
        /**
         * Holds all registered channels
         * @type {Object} __channels
         */
        this.__channels = {};

        /**
         * Holds the SockJS instance
         * @private
         * @type {Object} SockJS instance
         */
        this.conn = null;

        this.connect(url);

        /**
         * Reconnect if connection gets lost
         * @property {Boolean} autoReconnect
         */
        this.autoReconnect = true;

        /**
         * Defines a reconnection interval
         * @type {Number}
         */
        this.reconnectionInterval = 1500;
    };

    /**
     * Connects to a socket server
     * @param  {String} url Socket server url
     */
    SocketConnection.prototype.connect = function(url) {
        var self = this;

        if (!this.conn || this.connectionState === 'disconnected') {
            log.info('Connect to socket server ', url);
            this.conn = new SockJS(url, null, {
                debug: log.logLevel >= 4
            });

            this.connectionState = 'connecting';
            this.conn.onopen = function() {
                log.info('Connection was successful!');
                self.setReady();
                self.connectionState = 'connected';
            };

            this.conn.onmessage = function(e) {
                var msg;

                try {
                    msg = JSON.parse(e.data);
                }
                catch(err) {
                    console.error('Could not parse socket message!', e.data);
                }

                if (!msg.channel) {
                    throw new Error('No socket channel was sent!');
                }

                log.info('Got socket message', msg.eventName, 'in channel ' + msg.channel, msg.args);
                var args = msg.args || [];
                args.unshift(msg.eventName);
                if (self.__channels[msg.channel]) {
                    self.__channels[msg.channel].emit.apply(self.__channels[msg.channel], args);
                }
                else {
                    log.info(' ... channel not found!', msg.channel);
                }
            };

            this.conn.onclose = function(err) {
                self.connectionState = 'disconnected';
                self.unsetReady();
                log.warn('Connection to ' + url + ' closed!', err);
                
                if (self.autoReconnect) {
                    log.info('Try to reconnect to ' + url);

                    setTimeout(function() {
                        self.connect(url);
                    }, self.reconnectionInterval);
                }
            };
        }
    };

    /**
     * Register a channel
     * @param  {String} channel  Channel name
     * @param  {Object} listener Socket object
     */
    SocketConnection.prototype.registerChannel = function(channel, listener) {
        log.info('Register new channel', channel);
        if (this.__channels[channel]) {
            log.info(' ... channel already registered!');
        } else {
            this.__channels[channel] = listener;
        }
    };

    /**
     * Unregister a channel
     * @param  {String} channel  Channel name
     * @param  {Object} listener Socket object
     */
    SocketConnection.prototype.unregisterChannel = function(channel) {
        log.info('Unregister channel', channel);
        if (this.__channels[channel]) {
            delete this.__channels[channel];
        } else {
            log.info(' ... channel not found!');
        }
    };

    /**
     * Sends a socket message to a connected socket server
     *
     * @method send
     * @param {String} channel   Channel name
     * @param {String} eventName Event name
     * @param {Object} data      Data
     * 
     */
    SocketConnection.prototype.send = function(channel, eventName, data) {
        var self = this;

        var args = Array.prototype.slice.call(arguments, 2);

        this.ready(function() {
            log.info('Send socket message to channel ' + channel, eventName, args);
            self.conn.send(JSON.stringify({
                channel: channel,
                eventName: eventName,
                args: args
            }));
        });
    };

    /**
     * Call function fn when socket is connected
     *
     * @method ready
     * @param  {Function} fn Function to be called if socket is ready
     */
    SocketConnection.prototype.ready = function(fn) {
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
    SocketConnection.prototype.setReady = function() {
        var self = this;
        
        this.__isReady = true;
        this.__onReadyCallbacks.forEach(function(fn) {
            fn.call(self);
        });

        this.__onReadyCallbacks = [];
    };

    SocketConnection.prototype.unsetReady = function() {
        this.__isReady = false;
    };


    XQCore.SocketConnection = SocketConnection;

})(XQCore);