describe('Core Model', function() {
	var testModel,
		testModel2;

	beforeEach(function() {

	});

	afterEach(function() {

	});

	it('Should create and initialize a Core Model', function() {
		var initFunc = sinon.spy();
		testModel = new CoreModel();
		testModel = new CoreModel({
			init: initFunc
		});

		expect(initFunc.called).to.be(true);
	});

	it('Should set and get attributes to the model', function() {
		testModel = new CoreModel({

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
		testModel = new CoreModel({

		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel.has('a')).to.be(true);
		expect(testModel.has('z')).to.be(false);
	});

	it('Should validate attributes and shouldn\'t be added to the model if the validation fails', function() {
		testModel = new CoreModel({
			validate: function() {
				return null; //Validation is successfull
			}
		});

		testModel2 = new CoreModel({
			validate: function() {
				return 'fail'; //Validation fails
			}
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel.attributes).to.eql({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel2.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel2.attributes).to.eql({});
	});

	it('Should gets the validating state of the model', function() {
		testModel = new CoreModel({
			validate: function() {
				return null; //Validation is successfull
			}
		});

		testModel2 = new CoreModel({
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

	it('Should reset the model attributes', function() {
		testModel = new CoreModel({
			validate: function() {
				return null; //Validation is successfull
			}
		});

		testModel.set({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		expect(testModel.attributes).to.eql({
			a: 'aaa',
			b: 'bbb',
			c: 'ccc'
		});

		testModel.reset();

		expect(testModel.attributes).to.eql({});
	});
});