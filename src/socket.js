/**
 * XQCore socket module handles socket connections to a socket server
 *
 * @module Socket
 * @requires Logger
 * @requires sockJS-client
 *
 */

'use strict';

var XQCore = require('./xqcore');
var Logger = require('./logger');
var EventEmitter = require('./event');
var SocketConnection = require('./socket-connection');

var log = new Logger('Socket');
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
  //Call EventEmitter constructor
  EventEmitter.call(this);

  this.__isReady = false;
  this.__onReadyCallbacks = [];

  this.channel = channel;
  this.socket = new SocketConnection(url);
  this.socket.registerChannel(channel, this);
  // this.connect(url, channel);
};

XQCore.extend(Socket.prototype, EventEmitter.prototype);

/**
 * Sends a socket message to a connected socket server
 *
 * @method send
 * @param {String} eventName EventEmitter name
 * @param {Object} data      EventEmitter data, multiple args are allowed
 */
Socket.prototype.send = function(eventName, data) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this.channel);
  this.socket.send.apply(this.socket, args);
};

//--

module.exports = Socket;
