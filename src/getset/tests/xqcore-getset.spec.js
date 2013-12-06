describe('XQCore GetSet', function() {
	'use strict';
	XQCore.GetSet = XQCore.Model;
	beforeEach(function() {

	});

	afterEach(function() {

	});

	it('Should set data to the dataset', function() {
		var test = new XQCore.GetSet({
		});

		test.set({
			'aaa': 'AAA'
		});

		expect(test.get()).to.eql({
			'aaa': 'AAA'
		});

		test.set('bbb', 'BBB');

		expect(test.get()).to.eql({
			'aaa': 'AAA',
			'bbb': 'BBB'
		});

		// test.set('ccc.ddd', 'DDD');

		/*expect(test.get()).to.eql({
			'aaa': 'AAA',
			'bbb': 'BBB',
			'ccc': {
				'ddd': 'DDD'
			}
		});*/
	});

	it('Should set data to the dataset, path is null', function() {
		var test = new XQCore.GetSet({
		});

		test.set(null, {
			'aaa': 'AAA',
			'bbb': 'BBB',
			'ccc': 'CCC'
		});

		expect(test.get()).to.eql({
			'aaa': 'AAA',
			'bbb': 'BBB',
			'ccc': 'CCC'
		});
	});

	it('Should validate an item an should get an undefined but required error', function(done) {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'string', required: true }
			}
		});

		test.on('validation.error', function(err) {
			expect(err[0]).to.be.an('object');
			expect(err[0].property).to.equal('test');
			expect(err[0].msg).to.equal('Property is undefined or null, but it\'s required');
			expect(err[0].errCode).to.equal(10);
			done();
		});

		test.set('test', undefined);

		expect(test.isValid()).to.be(false);
	});

	it('Should validate one and should get a undefined but required error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'string', required: true }, undefined).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property is undefined or null, but it\'s required');
		expect(err.errCode).to.equal(10);
	});

	it('Should validate one and should get a type error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'string' }, 1).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property type is a number, but a string is required');
		expect(err.errCode).to.equal(11);
	});

	it('Should validate one and should get a string to short error', function() {
		var test = new XQCore.GetSet();

		var err = test.validateOne({ type: 'string', min: 10 }, 'test').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('String length is too short');
		expect(err.errCode).to.equal(12);
	});

	it('Should validate one and should get a string to long error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'string', max: 10 }, 'testing ist so beautifull').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('String length is too long');
		expect(err.errCode).to.equal(13);
	});

	it('Should validate one and should get a string doesn\'t match regexp', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'string', match: /^a/ }, 'blabla').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('String doesn\'t match regexp');
		expect(err.errCode).to.equal(14);
	});

	it('Should validate one and should get a type error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'number' }, '1').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property type is a string, but a number is required');
		expect(err.errCode).to.equal(21);
	});

	it('Should validate one and should get a number to low error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'number', min: 10 }, 9).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Number is too low');
		expect(err.errCode).to.equal(22);
	});

	it('Should validate one and should get a number to high error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'number', max: 10 }, 12).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Number is too high');
		expect(err.errCode).to.equal(23);
	});

	it('Should validate one and should get a not a valid date error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'date' }, 'Not a date').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property isn\'t a valid date');
		expect(err.errCode).to.equal(31);
	});

	it('Should validate one and should get a type not an array error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'array' }, {
			a: 'aa',
			b: 'bb'
		}).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property type is a object, but an array is required');
		expect(err.errCode).to.equal(41);
	});

	it('Should validate one and should get an array length to low error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'array', min: 5 }, [
			'aa', 'bb', 'cc'
		]).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Array length is 3 but must be greater than 5');
		expect(err.errCode).to.equal(42);
	});

	it('Should validate one and should get an array length to long error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'array', max: 2 }, [
			'aa', 'bb', 'cc'
		]).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Array length is 3 but must be lesser than 2');
		expect(err.errCode).to.equal(43);
	});

	it('Should validate one and should get a not a valid object error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'object' }, 'Not an object').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property isn\'t a valid object');
		expect(err.errCode).to.equal(51);
	});

	it('Should validate one and should get a not a valid objectId error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'objectId' }, 'abc').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property isn\'t a valid objectId');
		expect(err.errCode).to.equal(52);
	});

	it('Should validate one and should get a not a valid boolean error', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'boolean' }, 'Not a boolean').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property isn\'t a valid boolean');
		expect(err.errCode).to.equal(61);
	});

	it('A empty string should cause a validation error if property is required', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'string', required: true }, '').error;
		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property is undefined or null, but it\'s required');
		expect(err.errCode).to.equal(10);
	});

	it('Should use the default value, noEmpty: true on a String', function() {
		var test = new XQCore.GetSet();
		var err = test.validateOne({ type: 'string', 'default': 'test', noEmpty: true }, '');
		expect(err.error).to.be(null);
		expect(err.value).to.equal('test');
	});

	it('Should validate a nested struckture', function() {
		var test = new XQCore.GetSet({
			schema: {
				test: { type: 'string', 'default': 'test', noEmpty: true },
				data: {
					name: { type: 'string' },
					status: { type: 'number' },
					content: { type: 'string' },
					tags: {
						draft: { type: 'boolean', require: true },
						isPublic: { type: 'boolean', require: true },
						isWriteable: { type: 'boolean', require: true }
					}
				}
			}
		});

		var errStub = sinon.stub();

		test.on('validation.error', errStub);

		test.set({
			test: 'Test one',
			data: {
				name: 'Test1',
				status: 1,
				content: 'Nested test',
				tags: {
					draft: false,
					isPublic: true,
					isWriteable: true
				}
			}
		});


		expect(test.isValid()).to.be(true);
		expect(errStub).was.callCount(0);
	});

	it('Should append data to an existing data set and should trigger a data.change event', function(done) {
		var test = new XQCore.GetSet();
		test.set([
			{ name: 'AAA', value: '1' },
			{ name: 'BBB', value: '2' },
			{ name: 'CCC', value: '3' }
		]);

		test.on('data.change', function(newdata, olddata) {
			var data = test.get();
			expect(data).to.have.length(4);
			expect(data[3]).to.eql({
				name: 'DDD',
				value: '4'
			});

			done();
		});

		test.append({
			name: 'DDD',
			value: '4'
		});
	});

	it('Should prepend data to an existing data set and should trigger a data.change event', function(done) {
		var test = new XQCore.GetSet();
		test.set([
			{ name: 'AAA', value: '1' },
			{ name: 'BBB', value: '2' },
			{ name: 'CCC', value: '3' }
		]);

		test.on('data.change', function(newdata, olddata) {
			var data = test.get();
			expect(data).to.have.length(4);
			expect(data[0]).to.eql({
				name: 'DDD',
				value: '4'
			});

			done();
		});

		test.prepend({
			name: 'DDD',
			value: '4'
		});
	});

	it('Should append data to a not existing data set', function() {
		var test = new XQCore.GetSet();
		test.append({
			name: 'AAA',
			value: '1'
		});

		test.append({
			name: 'BBB',
			value: '2'
		});

		test.append({
			name: 'CCC',
			value: '3'
		});

		var data = test.get();
		expect(data).to.have.length(3);
		expect(data[2]).to.eql({
			name: 'CCC',
			value: '3'
		});
	});

	it('Should prepend data to a not existing data set', function() {
		var test = new XQCore.GetSet();
		test.prepend({
			name: 'AAA',
			value: '1'
		});

		test.prepend({
			name: 'BBB',
			value: '2'
		});

		test.prepend({
			name: 'CCC',
			value: '3'
		});

		var data = test.get();
		expect(data).to.have.length(3);
		expect(data[0]).to.eql({
			name: 'CCC',
			value: '3'
		});
	});

	it('Should sort an array collection (Simple ascend)', function() {
		var test = new XQCore.GetSet();
		test.set([
			{name: 'Homer', surname: 'Simpson'},
			{name: 'Marge', surname: 'Simpson'},
			{name: 'Bart', surname: 'Simpson'},
			{name: 'Lisa', surname: 'Simpson'},
			{name: 'Maggie', surname: 'Simpson'},
			{name: 'Moe', surname: 'Szyslak'},
			{name: 'Barney', surname: 'Gumble'},
			{name: 'Carl', surname: 'Carlson'},
			{name: 'Lenny', surname: 'Leonard'}
		]);

		var sorted = test.sortBy({surname: 1, name: 1});
		expect(sorted).to.be.an(Array);
		expect(sorted).to.eql([
			{name: 'Carl', surname: 'Carlson'},
			{name: 'Barney', surname: 'Gumble'},
			{name: 'Lenny', surname: 'Leonard'},
			{name: 'Bart', surname: 'Simpson'},
			{name: 'Homer', surname: 'Simpson'},
			{name: 'Lisa', surname: 'Simpson'},
			{name: 'Maggie', surname: 'Simpson'},
			{name: 'Marge', surname: 'Simpson'},
			{name: 'Moe', surname: 'Szyslak'}
		]);
	});

	it('Should sort an array collection (Simple descend)', function() {
		var test = new XQCore.GetSet();
		test.set([
			{name: 'Homer', surname: 'Simpson'},
			{name: 'Marge', surname: 'Simpson'},
			{name: 'Bart', surname: 'Simpson'},
			{name: 'Lisa', surname: 'Simpson'},
			{name: 'Maggie', surname: 'Simpson'},
			{name: 'Moe', surname: 'Szyslak'},
			{name: 'Barney', surname: 'Gumble'},
			{name: 'Carl', surname: 'Carlson'},
			{name: 'Lenny', surname: 'Leonard'}
		]);

		var sorted = test.sortBy({surname: -1, name: -1});
		expect(sorted).to.be.an(Array);
		expect(sorted).to.eql([
			{name: 'Moe', surname: 'Szyslak'},
			{name: 'Marge', surname: 'Simpson'},
			{name: 'Maggie', surname: 'Simpson'},
			{name: 'Lisa', surname: 'Simpson'},
			{name: 'Homer', surname: 'Simpson'},
			{name: 'Bart', surname: 'Simpson'},
			{name: 'Lenny', surname: 'Leonard'},
			{name: 'Barney', surname: 'Gumble'},
			{name: 'Carl', surname: 'Carlson'}
		]);
	});

	it('Should sort an array collection (Simple ascend - descend)', function() {
		var test = new XQCore.GetSet();
		test.set([
			{name: 'Homer', surname: 'Simpson'},
			{name: 'Marge', surname: 'Simpson'},
			{name: 'Bart', surname: 'Simpson'},
			{name: 'Lisa', surname: 'Simpson'},
			{name: 'Maggie', surname: 'Simpson'},
			{name: 'Moe', surname: 'Szyslak'},
			{name: 'Barney', surname: 'Gumble'},
			{name: 'Carl', surname: 'Carlson'},
			{name: 'Lenny', surname: 'Leonard'}
		]);

		var sorted = test.sortBy({surname: 1, name: -1});
		expect(sorted).to.be.an(Array);
		expect(sorted).to.eql([
			{name: 'Carl', surname: 'Carlson'},
			{name: 'Barney', surname: 'Gumble'},
			{name: 'Lenny', surname: 'Leonard'},
			{name: 'Marge', surname: 'Simpson'},
			{name: 'Maggie', surname: 'Simpson'},
			{name: 'Lisa', surname: 'Simpson'},
			{name: 'Homer', surname: 'Simpson'},
			{name: 'Bart', surname: 'Simpson'},
			{name: 'Moe', surname: 'Szyslak'}
		]);
	});

	it('Should sort an array collection and should trigger a data.change event', function(done) {
		var test = new XQCore.GetSet();
		test.set([
			{name: 'Homer', surname: 'Simpson'},
			{name: 'Lenny', surname: 'Leonard'}
		]);

		test.once('data.change', function() {
			done();
		});

		test.sortBy({name: 1});
	});

	it('GetSet should inherit from event listener', function() {
		var model1 = new XQCore.GetSet();
		var model2 = new XQCore.GetSet();
		var cbSpy1 = sinon.spy();
		var cbSpy2 = sinon.spy();
		
		model1.on('data.change', cbSpy1);
		model2.on('data.change', cbSpy2);

		model1.set({a: 'AA'});
		model2.set({b: 'BB'});

		expect(cbSpy1).was.calledOnce();
		expect(cbSpy2).was.calledOnce();
		expect(cbSpy1).was.calledWith({ a: 'AA' });
		expect(cbSpy2).was.calledWith({ b: 'BB' });
	});
});