/**
 * XQCore SyncList - Syncronized list
 *
 * @package XQCore
 * @module  SyncList
 * @requires List
 * @requires Socket
 *
 * @example {js}
 * var syncList = new XQCore.SyncList('mylist', {
 *     port: 3434,
 *     server: 'http://socket.xqcore.com'
 * });
 *
 * This call connects to a socket server
 * http://socket.xqcore.com/xqsocket/mylist
 *
 * A <code>synclist.register</code> event will be fiered to the socket server
 * These data will be send:
 * <code class="json">
 * {
 *     name: this.name
 * }
 *
 * Registers a few listeners:
 * synclist.push, synclist.shift, synclist.pop, synclist.unshift
 *
 * </code>
 */
'use strict';

var XQCore = require('./xqcore');
var Logger = require('./logger');
var List = require('./list');
var Socket = require('./socket');

var log;

var SyncList = function(name, conf) {
  /**
   * @property {Boolean} noAutoRegister Disables auto registration. SyncList.register() must be called manually to register the list at the socket server.
   */
  this.noAutoRegister = false;

  //Call List constructor
  List.call(this, name, conf);
  log = new Logger(this.name + 'SyncList');

  this.server = this.server || location.protocol + '//' + location.hostname;
  this.port = this.port || XQCore.socketPort;
  this.path = this.path || 'xqsocket';
  this.channel = this.channel || this.name.toLowerCase();
  this.syncEnabled = false;
  this.connectToSocket();
  if (!this.noAutoRegister) {
    this.register();
  }
};

SyncList.prototype = Object.create(List.prototype);
SyncList.prototype.constructor = SyncList;


/**
 * Inherits a sync model prototype
 * @method inherit
 * @param  {String} name    model name
 * @param  {Object} options SyncList properties
 * @return {Object}         Returns a SyncList prototype
 */
SyncList.inherit = function(name, options) {
  if (typeof name === 'object') {
    options = name;
    name = undefined;
  }

  var Proto = function() {
    SyncList.call(this, name, options);
  };

  Proto.prototype = Object.create(SyncList.prototype);
  Proto.prototype.constructor = Proto;
  return Proto;
};
/**
 * Connect to a socket server
 *
 * @method connectToSocket
 */
SyncList.prototype.connectToSocket = function() {
  var socketServer = this.server + ':' + this.port + '/' + this.path;
  if (!this.socket) {
    log.debug('Connect to socket:', socketServer);
    this.socket = new Socket(socketServer, this.channel);
  }
};

/**
 * Register a sync list at the socket server. This action is called automatically except the noAutoRegister option is set.
 * @param  {Boolean} enableSync Enables/Disables the initial sync. Defaults to false
 */
SyncList.prototype.register = function(enableSync) {
  var self = this;
  if (typeof enableSync === 'boolean') {
    this.syncEnabled = enableSync;
  }

  log.debug('Register synclist at server:', self.name);

  var opts = {
    noSync: true
  };

  self.socket.on('synclist.push', function(data) {
    self.push(data, opts);
  });

  self.socket.on('synclist.unshift', function(data) {
    self.unshift(data, opts);
  });

  self.socket.on('synclist.pop', function() {
    self.pop(opts);
  });

  self.socket.on('synclist.shift', function() {
    self.shift(opts);
  });

  self.socket.on('synclist.update', function(match, data) {
    self.update(match, data, opts);
  });

  self.socket.on('synclist.clear', function() {
    self.clear(opts);
  });

  self.socket.on('synclist.init', function(data) {
    self.push(data, opts);
  });

  self.socket.send('synclist.register', {
    name: self.name
  });
};

SyncList.prototype.unregister = function() {
  log.debug('Unregister synclist at server:', this.name);
  this.socket.send('synclist.unregister', {
    name: this.name
  });

  this.socket.off('synclist.push');
  this.socket.off('synclist.unshift');
  this.socket.off('synclist.pop');
  this.socket.off('synclist.shift');
  this.socket.off('synclist.update');
  this.socket.off('synclist.clear');
  this.socket.off('synclist.init');
};

/**
 * Send a socket message to the server
 * @param  {String} eventName EventEmitter name
 * @param  {Object} data      Data object
 */
SyncList.prototype.emitRemote = function(eventName, data) {
  this.socket.send(eventName, data);
};

SyncList.prototype.sync = function(method) {
  if (!this.syncEnabled) {
    return;
  }

  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift('syncmodel.' + method);
  this.emitRemote.apply(this, args);
};

SyncList.prototype.fetchList = function() {
  this.emitRemote('synclist.fetch');
};

//--

module.exports = SyncList;
