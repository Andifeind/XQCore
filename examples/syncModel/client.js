/*global $:false */

$(function() {
	'use strict';

	var model1 = new XQCore.SyncModel('model1', {
		port: 8888
	});

	model1.init();
	model1.register(true);

	var model2 = new XQCore.SyncModel('model2', {
		port: 8888
	});

	model2.init();
	model2.register(true);

	console.log('Model1', model1);
	console.log('Model1', model2);

	model1.on('data.change', function(data) {
		$('.model1').html(JSON.stringify(data, null, '  '));
	});

	model2.on('data.change', function(data) {
		$('.model2').html(JSON.stringify(data, null, '  '));
	});
});