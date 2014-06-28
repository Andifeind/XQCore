/**
 *	@requires XQCore.Model
 *	@requires XQCore.Socket
 */
(function(XQCore, undefined) {
	'use strict';
	var SyncModel;

	SyncModel = function(name, conf) {
		//Call XQCore.Model constructor
		XQCore.Model.call(this, name, conf);

		conf = conf || {};

		this.server = conf.server || location.protocol + '//' + location.hostname;
		this.port = conf.port || 9999;
		this.path = conf.path || 'xqsocket/' + name;
		this.syncEnabled = false;
	};

	SyncModel.prototype = Object.create(XQCore.Model.prototype);
	SyncModel.prototype.constructor = SyncModel;

	SyncModel.prototype.init = function() {
		//Call XQCore.Model constructor
		XQCore.Model.prototype.init.call(this);

		this.connectToSocket();
	};

	/**
	 * Connect to a socket server
	 *
	 * @method connectToSocket
	 */
	SyncModel.prototype.connectToSocket = function() {
		var socketServer = this.server + ':' + this.port + '/' + this.path;
		if (!this.socket) {
			this.socket = new XQCore.Socket();
			this.socket.connect(socketServer);
		}
	};

	SyncModel.prototype.register = function(enableSync) {
		var self = this,
			modelName = this.conf.syncWith || this.name.replace(/Model$/,'');

		this.syncEnabled = !!enableSync;

		console.log('register model at server');
		this.socket.emit('syncmodel.register', {
			name: modelName
		});

		this.socket.on('syncmodel.change', function(data) {
			var opts = {
				sync: false
			};

			var args = data.slice(1);
			args.push(opts);

			switch (data[0]) {
				case 'replace':
				case 'item':
					self.set.apply(self, args);
					break;
				case 'append':
					self.append.apply(self, args);
					break;
				case 'prepend':
					self.prepend.apply(self, args);
					break;
				case 'insert':
					self.insert.apply(self, args);
					break;
				case 'remove':
					self.remove.apply(self, args);
					break;

				default:
					self.warn('Unknown syncmodel event', data[0]);
			}
		});
	};

	SyncModel.prototype.unregister = function() {
		var modelName = this.conf.syncWith || this.name.replace(/Model$/,'');
		this.socket.emit('syncmodel.unregister', {
			name: modelName
		});

		this.socket.off('syncmodel.change');
	};

	/**
	 * Send a socket emit to the server
	 * @param  {String} eventName Event name
	 * @param  {Object} data      Data object
	 */
	SyncModel.prototype.emitRemote = function(eventName, data) {
		this.socket.emit(eventName, data);
	};

	SyncModel.prototype.sync = function() {
		if (!this.syncEnabled) {
			return;
		}

		var args = Array.prototype.slice.call(arguments);
		this.emitRemote('syncmodel.change', args);
	};

	XQCore.SyncModel = SyncModel;
})(XQCore);