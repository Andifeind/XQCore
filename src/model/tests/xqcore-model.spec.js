/*global jQuery:false */
describe.only('XQCore Model', function() {
	'use strict';

	describe('initialize', function() {
		it('Should initialize a model', function() {
			var model,
				initFunc = sinon.spy();

			model = new XQCore.Model('Test I', {
				init: initFunc
			});

			expect(model).to.be.a(XQCore.Model);
			model.init();
			expect(initFunc).was.called();
		});

		it('Should initialize a model in the scope way', function() {
			var model,
				initFunc = sinon.spy();

			model = new XQCore.Model('Test II', initFunc);

			expect(model).to.be.a(XQCore.Model);
			model.init();
			expect(initFunc).was.called();
		});

		it('Should get a model name from first arg', function() {
			var model = new XQCore.Model('Test');
			expect(model.name).to.equal('TestModel');
		});

		it('Should get a presener name from conf object', function() {
			var model = new XQCore.Model({
				name: 'Test'
			});

			expect(model.name).to.equal('TestModel');
		});

		it('Should set a default model name', function() {
			var model = new XQCore.Model();
			expect(model.name).to.equal('NamelessModel');
		});
	});

	xit('Should set and get properties to the model', function() {
		var testModel = new XQCore.Model({

		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel.get('a')).to.equal('aaa');
		expect(testModel.get('b')).to.equal('bbb');
		expect(testModel.get('c')).to.equal('ccc');

		testModel.set('d', 'ddd');
		expect(testModel.get('d')).to.equal('ddd');

		testModel.set('b', 'BBB');
		expect(testModel.get('b')).to.equal('BBB');

		expect(testModel.get()).to.eql({
			a: 'aaa',
			b: 'BBB',
			c: 'ccc',
			d: 'ddd'
		});
	});

	xit('Should check whether an attribute exists in model', function() {
		var testModel = new XQCore.Model({

		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel.has('a')).to.be(true);
		expect(testModel.has('z')).to.be(false);
	});

	xit('Should validate properties and shouldn\'t be added to the model if the validation fails', function() {
		var testModel = new XQCore.Model({
			validate: function() {
				return null; //Validation is successfull
			}
		});

		var testModel2 = new XQCore.Model({
			validate: function() {
				return ['fail']; //Validation fails
			}
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel.properties).to.eql({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel2.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		console.log('TM2', testModel2.properties);
		expect(testModel2.properties).to.eql({});
	});

	xit('Should gets the validating state of the model', function() {
		var testModel = new XQCore.Model({
			validate: function() {
				return null; //Validation is successfull
			}
		});

		var testModel2 = new XQCore.Model({
			validate: function() {
				return 'fail'; //Validation fails
			}
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel2.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel.isValid()).to.be(true);
		expect(testModel2.isValid()).to.be(false);
	});

	xit('Should reset the model properties', function() {
		var testModel = new XQCore.Model({
			validate: function() {
				return null; //Validation is successfull
			}
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel.properties).to.eql({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel.reset();

		expect(testModel.properties).to.eql({});
	});

	xit('Should make a POST request', function() {
		//Stub jQuery.ajax
		sinon.stub(jQuery, 'ajax');
		var testModel = new XQCore.Model({
			debug: true,
			server: 'http://test.com'
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel.send();

		expect(jQuery.ajax).was.calledWith(sinon.match({
			url: 'http://test.com',
			type: 'POST',
			data: {
				a: 'aaa',
				b: 'bbb',
				c: 'ccc'
			}
		}));

		//Restore jQuery.ajax
		jQuery.ajax.restore();
	});

	xit('Should make a GET request', function() {
		//Stub jQuery.ajax
		sinon.stub(jQuery, 'ajax');
		var testModel = new XQCore.Model({
			server: 'http://test.com'
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel.send('GET');

		expect(jQuery.ajax).was.calledWith(sinon.match({
			url: 'http://test.com',
			type: 'GET',
			data: {
				a: 'aaa',
				b: 'bbb',
				c: 'ccc'
			}
		}));

		//Restore jQuery.ajax
		jQuery.ajax.restore();
	});

	xit('Should make a PUT request', function() {
		//Stub jQuery.ajax
		sinon.stub(jQuery, 'ajax');
		var testModel = new XQCore.Model({
			server: 'http://test.com'
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel.send('PUT');

		expect(jQuery.ajax).was.calledWith(sinon.match({
			url: 'http://test.com',
			type: 'PUT',
			data: {
				a: 'aaa',
				b: 'bbb',
				c: 'ccc'
			}
		}));

		//Restore jQuery.ajax
		jQuery.ajax.restore();
	});

	xit('Should make a DELETE request', function() {
		//Stub jQuery.ajax
		sinon.stub(jQuery, 'ajax');
		var testModel = new XQCore.Model({
			server: 'http://test.com'
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel.send('DELETE');

		expect(jQuery.ajax).was.calledWith(sinon.match({
			url: 'http://test.com',
			type: 'DELETE',
			data: {
				a: 'aaa',
				b: 'bbb',
				c: 'ccc'
			}
		}));

		//Restore jQuery.ajax
		jQuery.ajax.restore();
	});

	xit('Should send a ajax request, this should point to the model in the success callback', function(done) {

		this.timeout(5000);
		//Stub jQuery.ajax
		var testModel = new XQCore.Model({
			server: 'http://xqcore.lc/test/post-success.php'
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel.send('POST', null, function(err, data, status) {
			if (status) {
				expect(this).to.be(testModel);
				done();
			}
		});
	});

	xit('Should fail a ajax request, 404 page not found', function(done) {

		this.timeout(5000);
		//Stub jQuery.ajax
		var testModel = new XQCore.Model({
			server: 'http://xqcore.lc/test/post-404.php'
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel.send('POST', null, function(err) {
			if (err) {
				expect(this).to.be(testModel);
				done();
			}
		});
	});

	xit('Should fail a ajax request, 500 server error', function(done) {

		this.timeout(5000);
		//Stub jQuery.ajax
		var testModel = new XQCore.Model({
			server: 'http://xqcore.lc/test/post-500.php'
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel.send('POST', null, function(err) {
			if (err) {
				expect(this).to.be(testModel);
				done();
			}
		});
	});

	xit('Should search a property, searching in the first level', function() {
		var testModel = new XQCore.Model({

		});

		testModel.set({
			a: [
				{name: 'aaa1'},
				{name: 'aaa2'},
				{name: 'aaa3'},
				{name: 'aaa4'},
				{name: 'aaa5'}
			]
		});

		var result = testModel.search('a', {
			name: 'aaa3'
		});

		console.log('Result', result);

		expect(result).to.be(testModel.properties.a[2]);
	});

	xit('Should search a property, searching in the third level', function() {
		var testModel = new XQCore.Model({

		});

		testModel.set({
			data: {
				values: {
					a: [
						{name: 'aaa1'},
						{name: 'aaa2'},
						{name: 'aaa3'},
						{name: 'aaa4'},
						{name: 'aaa5'}
					]
				}
			}
		});

		var result = testModel.search('data.values.a', {
			name: 'aaa3'
		});

		expect(result).to.be(testModel.properties.data.values.a[2]);
	});

	xit('Should validate data on set', function() {
		var model = new XQCore.Model({
			schema: {
				title: { type: String, required: true },
				description: { type: String },
				status: { type: Number, 'default': 1 }
			}
		});
		console.log('testModel', model);

		model.set({
			title: 'Title',
			description: 'A very long text... yeah!',
			status: 2
		});

		expect(model.isValid()).to.be(true);
	});

	xit('Should wait till model is ready', function(done) {
		var counter = 0;
		var model = new XQCore.Model({

		});

		model.ready(function() {
			++counter;
			expect(counter).to.be(1);
		});

		model.ready(function() {
			++counter;
			expect(counter).to.be(2);
		});

		model.ready(true);

		model.ready(function() {
			++counter;
			expect(counter).to.be(3);
		});

		model.ready(function() {
			++counter;
			expect(counter).to.be(4);
			done();
		});
	});

	xit('Should fetch data from server', function() {
		var ajaxStub = sinon.stub(jQuery, 'ajax');

		var model = new XQCore.Model({

		});

		model.fetch({
			a: 'aa',
			b: 'bb'
		}, function(err, data) {
			expect(data).to.be.an('object');
		});

		expect(ajaxStub).was.called();
		expect(ajaxStub).was.calledWithMatch({
			data: {
				a: 'aa',
				b: 'bb'
			}
		});

		ajaxStub.restore();
	});

	xit('Should fetch data from cache', function() {
		var ajaxStub = sinon.stub(jQuery, 'ajax');

		var model = new XQCore.Model({

		});

		model.isOffline = function() {
			return true;
		};

		model.fetch({
			a: 'aa',
			b: 'bb'
		}, function(err, data) {
			expect(data).to.be.an('object');
		});

		expect(ajaxStub).was.neverCalled();


		ajaxStub.restore();
	});
});