# Model

## Connect a model with your backend

var mode = new XQCore.SyncModel('mymodel', {
	server: 'http://syncserver.de',
	port: 9999
});

This connects your model with :9999/xqconnect/mymodel

## TODO

New events:
	* unset
	* shift
	* pop
	* slice
	* unshift
	* push

New methods:
	* merge