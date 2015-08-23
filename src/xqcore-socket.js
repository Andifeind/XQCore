/**
 * XQCore socket module handles socket connections to a socket server
 * 
 * @module XQCore.Socket
 * @requires XQCore.Logger
 * @requires sockJS-client
 *
 */
(function(XQCore, undefined) {
    'use strict';

    var log = new XQCore.Logger('Socket');
    log.logLevel = 5;

    /**
     * Socket connection module
     * @param {String} url     Socket server uri
     * @param {String} channel Socket channel
     *
     * 
     * @example {js}
     * var socket = new XQCore.Socket('http://mysocket.io:9889', 'mychannel');
     * socket.on('data', function() {
     *   console.log('Got data from server');
     * });
     */
    var Socket = function(url, channel) {
        this.__isReady = false;
        this.__onReadyCallbacks = [];

        this.channel = channel;
        this.socket = new XQCore.SocketConnection(url);
        this.socket.registerChannel(channel, this);
        // this.connect(url, channel);
    };

    XQCore.extend(Socket.prototype, new XQCore.Event());
    
    /**
     * Sends a socket message to a connected socket server
     *
     * @method send
     * @param {String} eventName Event name
     * @param {Object} data      Event data, multiple args are allowed
     */
    Socket.prototype.send = function(eventName, data) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.channel);
        this.socket.send.apply(this.socket, args);
    };

    XQCore.Socket = Socket;

})(XQCore);