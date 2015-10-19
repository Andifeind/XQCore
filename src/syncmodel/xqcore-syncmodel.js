/**
 * XQCore Syncronniced module module
 *
 * @module XQCore.SyncModel
 * @requires XQCore.Model
 * @requires XQCore.Socket
 */
(function(XQCore, undefined) {
    'use strict';
    var SyncModel;


    SyncModel = function(name, conf) {
        /**
         * @property {Boolean} noAutoRegister Disables auto registration. SyncList.register() must be called manually to register the list at the socket server.
         */
        this.noAutoRegister = false;

        //Call XQCore.Model constructor
        XQCore.Model.call(this, name, conf);

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

    SyncModel.prototype = Object.create(XQCore.Model.prototype);
    SyncModel.prototype.constructor = SyncModel;

    /**
     * Inherits a sync model prototype
     * @method inherit
     * @param  {String} name    model name
     * @param  {Object} options SyncModel properties
     * @return {Object}         Returns a XQCore.SyncModel prototype
     */
    SyncModel.inherit = function(name, options) {
        if (typeof name === 'object') {
            options = name;
            name = undefined;
        }

        var Proto = function() {
            XQCore.SyncModel.call(this, name, options);
        };

        Proto.prototype = Object.create(XQCore.SyncModel.prototype);
        Proto.prototype.constructor = Proto;
        return Proto;
    };

    /**
     * Connect to a socket server
     *
     * @method connectToSocket
     */
    SyncModel.prototype.connectToSocket = function() {
        var socketServer = this.server + ':' + this.port + '/' + this.path;
        if (!this.socket) {
            this.dev('Connect to socket:', socketServer);
            this.socket = new XQCore.Socket(socketServer, this.channel);
        }
    };

    SyncModel.prototype.register = function(enableSync) {
        var self = this;

        this.syncEnabled = !!enableSync;

        self.dev('Register syncmodel at server:', self.name);

        var opts = {
            noSync: true
        };

        self.socket.on('syncmodel.set', function(data) {
            self.set(data, opts);
        });

        self.socket.on('syncmodel.replace', function(data) {
            opts.replace = true;
            self.set(data, opts);
        });

        self.socket.on('syncmodel.item', function(key, value) {
            self.set(key, value, opts);
        });

        self.socket.on('syncmodel.insert', function(path, index, data) {
            self.insert(path, index, data, opts);
        });

        self.socket.on('syncmodel.remove', function(path, index, data) {
            self.remove(path, index, data, opts);
        });

        self.socket.on('syncmodel.reset', function() {
            self.reset(opts);
        });

        self.socket.on('syncmodel.init', function(data) {
            console.log('Got initial data request:', data);
            self.set(data, opts);
        });

        self.socket.send('syncmodel.register', {
            name: self.name
        });
    };

    SyncModel.prototype.unregister = function() {
        var modelName = this.conf.syncWith || this.name.replace(/Model$/,'');
        this.socket.send('syncmodel.unregister', {
            name: modelName
        });

        this.socket.off('syncmodel.set');
        this.socket.off('syncmodel.replace');
        this.socket.off('syncmodel.item');
        this.socket.off('syncmodel.insert');
        this.socket.off('syncmodel.remove');
        this.socket.off('syncmodel.reset');
        this.socket.off('syncmodel.init');
    };

    /**
     * Send a socket message to the server
     * @param  {String} eventName Event name
     * @param  {Object} data      Data object
     */
    SyncModel.prototype.emitRemote = function(eventName, data) {
        this.socket.send(eventName, data);
    };

    SyncModel.prototype.sync = function(method) {
        if (!this.syncEnabled) {
            return;
        }

        var args = Array.prototype.slice.call(arguments, 1);
        args.unshift('syncmodel.' + method);
        this.emitRemote.apply(this, args);
    };

    SyncModel.prototype.fetchModel = function() {
        this.emitRemote('syncmodel.fetch');
    };

    XQCore.SyncModel = SyncModel;
})(XQCore);