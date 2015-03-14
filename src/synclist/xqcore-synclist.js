/**
 * XQCore.SyncList - Syncronized list
 * 
 * @requires XQCore.List
 * @requires XQCore.Socket
 *
 * @example
 *
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
(function(XQCore, undefined) {
    'use strict';
    var SyncList;

    
    SyncList = function(name, conf) {
        /**
         * @property {Boolean} noAutoRegister Disables auto registration. SyncList.register() must be called manually to register the list at the socket server.
         */
        this.noAutoRegister = false;

        //Call XQCore.List constructor
        XQCore.List.call(this, name, conf);

        this.server = this.server || location.protocol + '//' + location.hostname;
        this.port = this.port || XQCore.socketPort;
        this.path = this.path || 'xqsocket/' + this.name.toLowerCase();
        this.syncEnabled = false;
        this.connectToSocket();
        if (!this.noAutoRegister) {
            this.register();
        }
    };

    SyncList.prototype = Object.create(XQCore.List.prototype);
    SyncList.prototype.constructor = SyncList;

    /**
     * Connect to a socket server
     *
     * @method connectToSocket
     */
    SyncList.prototype.connectToSocket = function() {
        var socketServer = this.server + ':' + this.port + '/' + this.path;
        if (!this.socket) {
            this.socket = new XQCore.Socket();
            this.socket.connect(socketServer);
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

        console.log('Register synclist listener');
        self.dev('Register synclist at server:', self.name);

        var opts = {
            noSync: true
        };
        
        self.socket.on('synclist.push', function(data) {
            self.push(data, opts);
        });
        
        self.socket.on('synclist.unshift', function(data) {
            self.push(data, opts);
        });
        
        self.socket.on('synclist.pop', function() {
            self.push(opts);
        });
        
        self.socket.on('synclist.shift', function() {
            self.push(opts);
        });
        
        self.socket.on('synclist.init', function(data) {
            console.log('Got initial data:', data);
            self.push(data, opts);
        });

        self.socket.emit('synclist.register', {
            name: self.name
        });
    };

    SyncList.prototype.unregister = function() {
        this.dev('Unregister synclist at server:', this.name);
        this.socket.emit('synclist.unregister', {
            name: this.name
        });

        this.socket.off('synclist.push');
        this.socket.off('synclist.unshift');
        this.socket.off('synclist.pop');
        this.socket.off('synclist.shift');
    };

    /**
     * Send a socket emit to the server
     * @param  {String} eventName Event name
     * @param  {Object} data      Data object
     */
    SyncList.prototype.emitRemote = function(eventName, data) {
        this.socket.emit(eventName, data);
    };

    SyncList.prototype.sync = function() {
        if (!this.syncEnabled) {
            return;
        }

        var args = Array.prototype.slice.call(arguments);
        this.emitRemote('syncmodel.change', args);
    };

    SyncList.prototype.fetchList = function() {
        this.emitRemote('synclist.fetch');
    };

    XQCore.SyncList = SyncList;
})(XQCore);