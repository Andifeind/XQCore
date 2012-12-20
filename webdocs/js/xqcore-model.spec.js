describe('XQCore Model', function() {
	var testModel,
		testModel2;

	beforeEach(function() {

	});

	afterEach(function() {

	});

	it('Should create and initialize a XQCore Model', function() {
		var initFunc = sinon.spy();
		testModel = new XQCore.Model();
		testModel = new XQCore.Model({
			init: initFunc
		});

		expect(initFunc.called).to.be(true);
	});

	it('Should set and get propertys to the model', function() {
		testModel = new XQCore.Model({

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

	it('Should check whether an attribute exists in model', function() {
		testModel = new XQCore.Model({

		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel.has('a')).to.be(true);
		expect(testModel.has('z')).to.be(false);
	});

	it('Should validate propertys and shouldn\'t be added to the model if the validation fails', function() {
		testModel = new XQCore.Model({
			validate: function() {
				return null; //Validation is successfull
			}
		});

		testModel2 = new XQCore.Model({
			validate: function() {
				return 'fail'; //Validation fails
			}
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel.propertys).to.eql({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel2.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel2.propertys).to.eql({});
	});

	it('Should gets the validating state of the model', function() {
		testModel = new XQCore.Model({
			validate: function() {
				return null; //Validation is successfull
			}
		});

		testModel2 = new XQCore.Model({
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

	it('Should reset the model propertys', function() {
		testModel = new XQCore.Model({
			validate: function() {
				return null; //Validation is successfull
			}
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel.propertys).to.eql({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel.reset();

		expect(testModel.propertys).to.eql({});
	});

	it('Should make a POST request', function() {
		//Stub jQuery.ajax
		sinon.stub(jQuery, 'ajax');
		testModel = new XQCore.Model({
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

	it('Should make a GET request', function() {
		//Stub jQuery.ajax
		sinon.stub(jQuery, 'ajax');
		testModel = new XQCore.Model({
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

	it('Should make a PUT request', function() {
		//Stub jQuery.ajax
		sinon.stub(jQuery, 'ajax');
		testModel = new XQCore.Model({
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

	it('Should make a DELETE request', function() {
		//Stub jQuery.ajax
		sinon.stub(jQuery, 'ajax');
		testModel = new XQCore.Model({
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

	it('Should send a ajax request, this should point to the model in the success callback', function(done) {

		this.timeout(5000);
		//Stub jQuery.ajax
		testModel = new XQCore.Model({
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

	it('Should fail a ajax request, 404 page not found', function(done) {

		this.timeout(5000);
		//Stub jQuery.ajax
		testModel = new XQCore.Model({
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

	it('Should fail a ajax request, 500 server error', function(done) {

		this.timeout(5000);
		//Stub jQuery.ajax
		testModel = new XQCore.Model({
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

	it('Should search a property, searching in the first level', function() {
		testModel = new XQCore.Model({
			
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

		expect(result).to.be(testModel.propertys.a[2]);
	});

	it('Should search a property, searching in the third level', function() {
		testModel = new XQCore.Model({
			
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

		expect(result).to.be(testModel.propertys.data.values.a[2]);
	});
});