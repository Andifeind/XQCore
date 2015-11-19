/**
 * XQCore.Sync
 *
 * @module  XQCore.Sync
 */
(function(XQCore, undefined) {
    'use strict';

    var $ = XQCore.require('jquery');

    var Sync = function() {
        /**
         * Sets a server URI
         *
         * This URI is used by all send methods as default server URI
         * @property {String} server
         */
        this.server = null;

    };

    /**
     * Called on before sending an ajax request
     * You can use this function to manipulate all data they be send to the server
     *
     * @param {Object} data The data to send to the server
     * @return {Object} data
     */
    Sync.prototype.onSend = function(data) {
        return data;
    };

    /**
     * Send an ajax request to the webserver.
     *
     * You must set the server URI first with model.server = 'http://example.com/post'
     *
     * @param {String} Method send method, GET, POST, PUT, DELETE (default POST)
     * @param {String} url Server URL (optional, then model.server must be set)
     * @param {Object} data The data to sent to the server
     * @param {Function} callback Calls callback(err, data, status, jqXHR) if response was receiving
     */
    Sync.prototype.send = function(method, url, data, callback) {
        var self = this;

        if (typeof url === 'object') {
            callback = data;
            data = url;
            url = this.server;
            method = method;
        }
        else if (typeof data === 'function') {
            callback = data;
            data = this.toJSON();
        }
        else if (data === undefined) {
            data = this.toJSON();
        }

        if (method === undefined) {
            method = 'POST';
        }

        if (!url) {
            url = this.server;
        }

        if (method === 'GET' && Array.isArray(data)) {
            url = url.replace(/\/$/, '') + '/' + data.join('/');
            data = null;
        }

        //Handle onSend
        if (typeof this.onSend === 'function') {
            data = this.onSend.call(this, data);
        }

        this.log('Send an ajax call to ', url, 'with data: ', data);
        this.state('syncing');

        var promise = new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                type: method,
                data: XQCore.isEmpty(data) ? null : JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json',
                headers: {
                    'Accept': 'application/json'
                },
                success: function(data, status, jqXHR) {
                    if (typeof callback === 'function') {
                        callback.call(self, null, data, status, jqXHR);
                    }
                    self.state('success');
                    resolve(data);
                },
                error: function(jqXHR, status, error) {
                    if (typeof callback === 'function') {
                        callback.call(self, {
                            type: status,
                            http: error
                        }, null, status, jqXHR);
                    }
                    self.state('failed');
                    reject({
                        type: status,
                        http: error
                    });
                }
            });
        });

        return promise;
    };

    /**
     * Sends a POST to the Datastore
     *
     * @param {String} url Server URL (optional, then model.server must be set)
     * @param  {Object}   data     Dato to sending
     * @param  {Function} callback Calling on response
     *
     * callback: void function(err, data, status, jqXHR)
     *
     */
    Sync.prototype.sendPOST = function(url, data, callback) {
        return this.send('POST', url, data, callback);
    };

    /**
     * Sends a GET to the Datastore
     *
     * @param {String} url Server URL (optional, then model.server must be set)
     * @param  {Object}   data     Dato to sending
     * @param  {Function} callback Calling on response
     *
     * callback: void function(err, data, status, jqXHR)
     *
     */
    Sync.prototype.sendGET = function(url, data, callback) {
        return this.send('GET', url, data, callback);
    };

    /**
     * Sends a PUT to the Datastore
     *
     * @param {String} url Server URL (optional, then model.server must be set)
     * @param  {Object}   data     Dato to sending
     * @param  {Function} callback Calling on response
     *
     * callback: void function(err, data, status, jqXHR)
     *
     */
    Sync.prototype.sendPUT = function(url, data, callback) {
        return this.send('PUT', url, data, callback);
    };

    /**
     * Sends a DELETE to the Datastore
     *
     * @param {String} url Server URL (optional, then model.server must be set)
     * @param  {Object}   data     Dato to sending
     * @param  {Function} callback Calling on response
     *
     * callback: void function(err, data, status, jqXHR)
     *
     */
    Sync.prototype.sendDELETE = function(url, data, callback) {
        return this.send('DELETE', url, data, callback);
    };

    /**
     * Fetch data from server
     *
     * @param {Object} query MongoDB query 
     * @param {Function} callback Callback function
     */
    Sync.prototype.fetch = function(query, callback) {
        return this.sendGET(query, callback);
    };

    /**
     * Save a model if it's valid
     */
    Sync.prototype.save = function(data, callback) {
        if (typeof data === 'function') {
            callback = data;
            data = this.schema ? this.getByKeys(Object.keys(this.schema)) : this.toJSON();
        }

        if (this.isValid()) {
            return this.sendPOST(data, callback);
        }
        else {
            if (typeof callback === 'function') {
                callback({
                    msg: 'Model isn\'t valid. Cancle save'
                });
            }
            else {
                return Promise.reject({
                    msg: 'Model isn\'t valid. Cancle save'
                });
            }
        }
    };

    /**
     * Update a model if it's valid
     */
    Sync.prototype.update = function(data, callback) {
        if (typeof data === 'function') {
            callback = data;
            data = this.schema ? this.getByKeys(Object.keys(this.schema)) : this.toJSON();
        }

        if (this.isValid()) {
            this.sendPUT(data, callback);
        }
        else {
            if (typeof callback === 'function') {
                callback({
                    msg: 'Model isn\'t valid. Cancel update'
                });
            }
        }
    };

    /**
     * To be called when a form was submited in a coupled model
     *
     * This method merges submited form data with model.
     * If validation doesen't fail, update or save methode have to be called.
     * It calls update if data.id is not undefined, otherwise it calls save
     * Override this function if this behavior isn't desired 
     * 
     * @method sync
     * @override
     * @param  {Any} data     data
     */
    Sync.prototype.submit = function(data) {
        var self = this;

        var promise = new Promise(function(resolve, reject) {
            self.set(data, { extend: true })
            .then(function() {
                if (self.server) {
                    if (data.id === undefined || data.id === null) {
                        self.save(data)
                        .then(function(result) {
                            resolve(result);
                        })
                        .catch(function(err) {
                            reject(err);
                        });
                    }
                    else {
                        self.update(data)
                        .then(function(result) {
                            resolve(result);
                        })
                        .catch(function(err) {
                            reject(err);
                        });
                    }
                }

                self.emit('data.submit', data);
            });
        });
        
        return promise;
    };

    XQCore.Sync = Sync;

})(XQCore);