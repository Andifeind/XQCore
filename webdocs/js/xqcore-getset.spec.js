describe('XQCore GetSet', function() {
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

		// expect(test.get()).to.eql({
		// 	'aaa': 'AAA',
		// 	'bbb': 'BBB',
		// 	'ccc': {
		// 		'ddd': 'DDD'
		// 	}
		// });
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
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'string', required: true }
			}
		});

		var err = test.validateOne('test', undefined).error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('Property is undefined or null, but it\'s required');
		expect(err.errCode).to.equal(10);
	});

	it('Should validate one and should get a type error', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'string' }
			}
		});

		var err = test.validateOne('test', 1).error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('Property type is a number, but a string is required');
		expect(err.errCode).to.equal(11);
	});

	it('Should validate one and should get a string to short error', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'string', min: 10 }
			}
		});

		var err = test.validateOne('test', 'test').error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('String length is too short');
		expect(err.errCode).to.equal(12);
	});

	it('Should validate one and should get a string to long error', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'string', max: 10 }
			}
		});

		var err = test.validateOne('test', 'testing ist so beautifull').error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('String length is too long');
		expect(err.errCode).to.equal(13);
	});

	it('Should validate one and should get a string doesn\'t match regexp', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'string', match: /^a/ }
			}
		});

		var err = test.validateOne('test', 'blabla').error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('String doesn\'t match regexp');
		expect(err.errCode).to.equal(14);
	});

	it('Should validate one and should get a type error', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'number' }
			}
		});

		var err = test.validateOne('test', '1').error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('Property type is a string, but a number is required');
		expect(err.errCode).to.equal(21);
	});

	it('Should validate one and should get a number to low error', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'number', min: 10 }
			}
		});

		var err = test.validateOne('test', 9).error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('Number is too low');
		expect(err.errCode).to.equal(22);
	});

	it('Should validate one and should get a number to high error', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'number', max: 10 }
			}
		});

		var err = test.validateOne('test', 12).error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('Number is too high');
		expect(err.errCode).to.equal(23);
	});

	it('Should validate one and should get a not a valid date error', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'date' }
			}
		});

		var err = test.validateOne('test', 'Not a date').error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('Property isn\'t a valid date');
		expect(err.errCode).to.equal(31);
	});

	it('Should validate one and should get a type not an array error', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'array' }
			}
		});

		var err = test.validateOne('test', {
			a: 'aa',
			b: 'bb'
		}).error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('Property type is a object, but an array is required');
		expect(err.errCode).to.equal(41);
	});

	it('Should validate one and should get an array length to low error', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'array', min: 5 }
			}
		});

		var err = test.validateOne('test', [
			'aa', 'bb', 'cc'
		]).error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('Array length is 3 but must be greater than 5');
		expect(err.errCode).to.equal(42);
	});

	it('Should validate one and should get an array length to long error', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'array', max: 2 }
			}
		});

		var err = test.validateOne('test', [
			'aa', 'bb', 'cc'
		]).error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('Array length is 3 but must be lesser than 2');
		expect(err.errCode).to.equal(43);
	});

	it('Should validate one and should get a not a valid object error', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'object' }
			}
		});

		var err = test.validateOne('test', 'Not an object').error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('Property isn\'t a valid object');
		expect(err.errCode).to.equal(51);
	});

	it('Should validate one and should get a not a valid boolean error', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'boolean' }
			}
		});

		var err = test.validateOne('test', 'Not a boolean').error;

		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('Property isn\'t a valid boolean');
		expect(err.errCode).to.equal(61);
	});

	it('A empty string should cause a validation error if property is required', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'string', required: true }
			}
		});

		var err = test.validateOne('test', '').error;
		expect(err).to.be.an('object');
		expect(err.property).to.equal('test');
		expect(err.msg).to.equal('Property is undefined or null, but it\'s required');
		expect(err.errCode).to.equal(10);
	});

	it('Should use the default value, noEmpty: true on a String', function() {
		var test = new XQCore.GetSet({
			schema: {
				'test': { type: 'string', 'default': 'test', noEmpty: true }
			}
		});

		var err = test.validateOne('test', '');
		expect(err.error).to.be(null);
		expect(err.value).to.equal('test');
	});
});