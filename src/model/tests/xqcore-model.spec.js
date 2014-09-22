/*global jQuery:false */
describe('XQCore Model', function() {
	'use strict';

	describe('initialize', function() {
		it('Should initialize a model', function() {
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

		it('Should set default data', function() {
			var model = new XQCore.Model('test', function(self) {
				self.schema = { name: { type: 'string', required: true }};
				self.defaults = {name: 'Andi'};
			});

			var changeStub = sinon.stub();
			var validationStub = sinon.stub(model, 'validate');
			var setSpy = sinon.spy(model, 'set');

			model.on('data.change', changeStub);
			model.init();

			expect(validationStub).was.notCalled();
			expect(model.properties).to.eql({name: 'Andi'});
			expect(changeStub).was.notCalled();
			expect(setSpy).was.calledOnce();
			expect(setSpy).was.calledWith({
				name: 'Andi'
			}, {
				silent: true,
				noValidation: true
			});


			validationStub.restore();
			setSpy.restore();
		});

		it('Should overwrite a core method', function() {
			var fetchStub = sinon.stub();
			var model = new XQCore.Model('Test', function(self) {
				self.fetch = fetchStub;
			});
			model.init();
			model.fetch();

			expect(fetchStub).was.called();
		});
	});

	describe('get', function() {
		var model,
			modelData;

		beforeEach(function() {
			modelData = {
				name: 'Andi',
				favorites: [
					{name: 'Augustiner', voting: 'Best beer ever'},
					{name: 'Bulmers', voting: 'Very delicious cider'}
				],
				sayHello: function() {
					return 'Servus!';
				},
				profession: {
					name: 'Developer'
				}
			};

			model = new XQCore.Model('test');
			model.properties = modelData;
		});

		it('Should get all data of a model', function() {
			expect(model.get()).to.be.an('object');
			expect(model.get()).to.eql(modelData);
		});

		it('Should get a item of a model (type string)', function() {
			expect(model.get('name')).to.be.a('string');
			expect(model.get('name')).to.eql('Andi');
		});

		it('Should get a item of a model (type object)', function() {
			expect(model.get('favorites')).to.be.an('object');
			expect(model.get('favorites')).to.eql(modelData.favorites);
		});

		it('Should get a item of a model (type function)', function() {
			expect(model.get('sayHello')).to.be.a('function');
			expect(model.get('sayHello')()).to.eql('Servus!');
		});

		it('Should get a deep item of a model (type string)', function() {
			expect(model.get('profession.name')).to.be.a('string');
			expect(model.get('profession.name')).to.eql('Developer');
		});

		it('Should get a pointer of the dataset', function() {
			var data = model.get();

			expect(data).to.equal(modelData);
		});

		it('Should get a pointer of the sub dataset (string)', function() {
			var data = model.get('name');

			expect(data).to.equal(modelData.name);
		});

		it('Should get a pointer of the sub dataset (array)', function() {
			var data = model.get('favorites');

			expect(data).to.be.an('array');
			expect(data).to.equal(modelData.favorites);
		});

		it('Should get a pointer of the sub dataset (function)', function() {
			var data = model.get('sayHello');

			expect(data).to.equal(modelData.sayHello);
		});

		it('Should get a pointer of the sub dataset (object)', function() {
			var data = model.get('profession');

			expect(data).to.equal(modelData.profession);
		});

		//Set copy flag

		it('Should get all data of a model, copy flag is true', function() {
			expect(model.get(null, { copy: true })).to.be.an('object');
			expect(model.get(null, { copy: true })).to.eql(modelData);
		});

		it('Should get a item of a model (type string), copy flag is true', function() {
			expect(model.get('name', { copy: true })).to.be.a('string');
			expect(model.get('name', { copy: true })).to.eql('Andi');
		});

		it('Should get a item of a model (type object), copy flag is true', function() {
			expect(model.get('favorites', { copy: true })).to.be.an('object');
			expect(model.get('favorites', { copy: true })).to.eql(modelData.favorites);
		});

		it('Should get a item of a model (type function), copy flag is true', function() {
			expect(model.get('sayHello', { copy: true })).to.be.a('function');
			expect(model.get('sayHello', { copy: true })()).to.eql('Servus!');
		});

		it('Should get a deep item of a model (type string), copy flag is true', function() {
			expect(model.get('profession.name', { copy: true })).to.be.a('string');
			expect(model.get('profession.name', { copy: true })).to.eql('Developer');
		});

		it('Should get a copy of the dataset', function() {
			var data = model.get(null, {copy: true});

			expect(data).not.to.equal(modelData);
			expect(data).to.eql(modelData);
		});

		it('Should get a copy of the sub dataset (string)', function() {
			var data = model.get('name', { copy: true });

			expect(data).to.eql(modelData.name);
		});

		it('Should get a copy of the sub dataset (array)', function() {
			var data = model.get('favorites', { copy: true });

			expect(data).to.be.an('array');
			expect(data).not.to.equal(modelData.favorites);
			expect(data).to.eql(modelData.favorites);
		});

		it('Should get a copy of the sub dataset (function)', function() {
			var data = model.get('sayHello', { copy: true });

			expect(data).not.to.equal(modelData.sayHello);
			expect(data.toString()).to.eql(modelData.sayHello.toString());
		});

		it('Should get a copy of the sub dataset (object)', function() {
			var data = model.get('profession', { copy: true });

			expect(data).not.to.equal(modelData.profession);
			expect(data).to.eql(modelData.profession);
		});
	});

	describe('set', function() {
		var model,
			modelData;

		beforeEach(function() {
			modelData = {
				name: 'Andi',
				sayHello: function() {
					return 'Servus!';
				}
			};
			model = new XQCore.Model('test');
		});

		it('Should set model data', function() {
			model.set(modelData);
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(modelData);
		});

		it('Should set model item', function() {
			model.set(modelData);
			model.set('profession', 'Developer');
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(XQCore.extend(modelData, {
				profession: 'Developer'
			}));
		});

		it('Should set deep item', function() {
			model.set(modelData);
			model.set('profession.name', 'Developer');
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(XQCore.extend(modelData, {
				profession: {
					name: 'Developer'
				}
			}));
		});

		it('Should set model data and should trigger an event', function() {
			var emitStub = sinon.stub(model, 'emit');
			
			model.set(modelData);
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(modelData);

			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.replace', model.properties, {});
			expect(emitStub).was.calledWith('data.change', model.properties, {});

			emitStub.restore();
		});

		it('Should set model item and should trigger an event', function() {
			var emitStub = sinon.stub(model, 'emit');
			
			model.properties = modelData;
			model.set('profession', 'Developer');
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(XQCore.extend(modelData, {
				profession: 'Developer'
			}));

			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.item', 'profession', 'Developer');
			expect(emitStub).was.calledWith('data.change', model.properties, modelData);

			emitStub.restore();
		});

		it('Should set deep item and should trigger an event', function() {
			var emitStub = sinon.stub(model, 'emit');
			
			model.properties = modelData;
			model.set('profession.name', 'Developer');
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(XQCore.extend(modelData, {
				profession: {
					name: 'Developer'
				}
			}));

			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.item', 'profession.name', 'Developer');
			expect(emitStub).was.calledWith('data.change', model.properties, modelData);

			emitStub.restore();
		});

		it('Should set model data and should never trigger an event', function() {
			var emitStub = sinon.stub(model, 'emit');
			
			model.set(modelData, { silent: true });
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(modelData);

			expect(emitStub).was.notCalled();

			emitStub.restore();
		});

		it('Should set model item and should never trigger an event', function() {
			var emitStub = sinon.stub(model, 'emit');
			
			model.properties = modelData;
			model.set('profession', 'Developer', { silent: true });
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(XQCore.extend(modelData, {
				profession: 'Developer'
			}));

			expect(emitStub).was.notCalled();

			emitStub.restore();
		});

		it('Should set deep item and should never trigger an event', function() {
			var emitStub = sinon.stub(model, 'emit');
			
			model.properties = modelData;
			model.set('profession.name', 'Developer', { silent: true });
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(XQCore.extend(modelData, {
				profession: {
					name: 'Developer'
				}
			}));

			expect(emitStub).was.notCalled();

			emitStub.restore();
		});

		it('Should set model data and should validate the model. The validation fails and no data may be changed', function() {
			var validationStub = sinon.stub(model, 'validate');
			validationStub.returns({});
			model.schema = { name: 'String' };

			model.set(modelData);
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql({});

			expect(validationStub).was.called();
			expect(validationStub).was.calledWith(modelData);

			validationStub.restore();
		});

		it('Should set model data and should validate the model. The validation succeeds and the data may be changed', function() {
			var validationStub = sinon.stub(model, 'validate');
			validationStub.returns(null);
			model.schema = { name: 'String' };

			model.set(modelData);
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(modelData);

			expect(validationStub).was.called();
			expect(validationStub).was.calledWith(modelData);

			validationStub.restore();
		});

		it('Should set model item and should validate the model. The validation fails and no data may be changed', function() {
			var validationStub = sinon.stub(model, 'validate');
			validationStub.returns({});
			model.schema = { profession: { type: 'String' } };
			
			model.properties = modelData;
			model.set('profession', 'Developer');
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(modelData);

			expect(validationStub).was.called();
			expect(validationStub).was.calledWith(XQCore.extend({}, modelData, {
				profession: 'Developer'
			}));

			validationStub.restore();
		});

		it('Should set model item and should validate the model. The validation succeeds and the data may be changed', function() {
			var validationStub = sinon.stub(model, 'validate');
			validationStub.returns(null);
			model.schema = { profession: { type: 'String' } };
			
			model.properties = modelData;
			model.set('profession', 'Developer');
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(XQCore.extend({}, modelData, {
				profession: 'Developer'
			}));

			expect(validationStub).was.called();
			expect(validationStub).was.calledWith(XQCore.extend({}, modelData, {
				profession: 'Developer'
			}));

			validationStub.restore();
		});

		it('Should set deep item and should validate the model. The validation fails and no data may be changed', function() {
			var validationStub = sinon.stub(model, 'validate');
			validationStub.returns({});
			model.schema = { name: 'String' };
			
			model.properties = modelData;
			model.set('profession.name', 'Developer');
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(modelData);

			expect(validationStub).was.called();
			expect(validationStub).was.calledWith(XQCore.extend({}, modelData, {
				profession: {
					name: 'Developer'
				}
			}));

			validationStub.restore();
		});

		it('Should set deep item and should validate the model. The validation succeeds and the data may be changed', function() {
			var validationStub = sinon.stub(model, 'validate');
			validationStub.returns(null);
			model.schema = { name: 'String' };
			
			model.properties = modelData;
			model.set('profession.name', 'Developer');
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(XQCore.extend({}, modelData, {
				profession: {
					name: 'Developer'
				}
			}));

			expect(validationStub).was.called();
			expect(validationStub).was.calledWith(XQCore.extend({}, modelData, {
				profession: {
					name: 'Developer'
				}
			}));

			validationStub.restore();
		});

		it('Should set model item enable validateOne, the validation fails', function() {
			var validationStub = sinon.stub(model, 'validate');
			var validationOneStub = sinon.stub(model, 'validateOne');
			validationOneStub.returns({ isValid: false });
			model.schema = { profession: { type: 'String' } };
			
			model.properties = modelData;
			model.set('profession', 'Developer', { validateOne: true });
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(modelData);

			expect(validationStub).was.notCalled();
			expect(validationOneStub).was.called();
			expect(validationOneStub).was.calledWith({ type: 'String' }, 'Developer');

			validationStub.restore();
			validationOneStub.restore();
		});

		it('Should set model item enable validateOne, the validation succeeds', function() {
			var validationStub = sinon.stub(model, 'validate');
			var validationOneStub = sinon.stub(model, 'validateOne');
			validationOneStub.returns({ isValid: true });
			model.schema = { profession: { type: 'String' } };
			
			model.properties = modelData;
			model.set('profession', 'Developer', { validateOne: true });
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(XQCore.extend({}, modelData, {
				profession: 'Developer'
			}));

			expect(validationStub).was.notCalled();
			expect(validationOneStub).was.called();
			expect(validationOneStub).was.calledWith({ type: 'String' }, 'Developer');

			validationStub.restore();
			validationOneStub.restore();
		});

		it('Should call sync method with replace mode', function() {
			var syncStub = sinon.stub();
			model.sync = syncStub;

			model.set({a: 'aa'});

			expect(syncStub).was.calledOnce();
			expect(syncStub).was.calledWith('replace', {a:'aa'});
		});

		it('Should call sync method with item mode', function() {
			var syncStub = sinon.stub();
			model.sync = syncStub;

			model.set('a', 'aa');

			expect(syncStub).was.calledOnce();
			expect(syncStub).was.calledWith('item', 'a', 'aa');
		});

		it('Should not call sync method when sync option is false', function() {
			var syncStub = sinon.stub();
			model.sync = syncStub;

			model.set({a: 'aa'}, { sync: false });

			expect(syncStub).was.notCalled();
		});

		it('Should not call sync method when sync option is false', function() {
			var syncStub = sinon.stub();
			model.sync = syncStub;

			model.set('a', 'aa', { sync: false });

			expect(syncStub).was.notCalled();
		});

		it('Should not call sync method when validation fails', function() {
			var syncStub = sinon.stub();
			var validationStub = sinon.stub(model, 'validate');
			validationStub.returns({});

			model.sync = syncStub;
			model.schema = { a: 'Number' };

			model.set({a: 'aa'});

			expect(validationStub).was.calledOnce();
			expect(syncStub).was.notCalled();
		});

		it('Should not call sync method when validation fails', function() {
			var syncStub = sinon.stub();
			var validationStub = sinon.stub(model, 'validate');
			validationStub.returns({});

			model.sync = syncStub;
			model.schema = { a: 'Number' };

			model.set('a', 'aa');

			expect(validationStub).was.calledOnce();
			expect(syncStub).was.notCalled();
		});
	});

	describe('set with custom validation', function() {
		var model,
			modelData;

		beforeEach(function() {
			modelData = {
				name: 'Andi',
				sayHello: function() {
					return 'Servus!';
				}
			};

			model = new XQCore.Model('test', {
				validate: function() {}
			});
		});

		it('Should set model item a custom validation was set and the validation fails', function() {
			var validationStub = sinon.stub(model, 'validate');
			var validationOneStub = sinon.stub(model, 'validateOne');
			var customValidationStub = sinon.stub(model, 'customValidate');
			
			customValidationStub.returns({});
			model.schema = { profession: { type: 'String' } };
			
			model.properties = modelData;
			model.set('profession', 'Developer');
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(modelData);

			expect(validationStub).was.notCalled();
			expect(validationOneStub).was.notCalled();
			expect(customValidationStub).was.called();
			expect(customValidationStub).was.calledWith(XQCore.extend({}, modelData, {
				profession: 'Developer'
			}));

			validationStub.restore();
			validationOneStub.restore();
			customValidationStub.restore();
		});

		it('Should set model item a custom validation was set and the validation fails', function() {
			var validationStub = sinon.stub(model, 'validate');
			var validationOneStub = sinon.stub(model, 'validateOne');
			var customValidationStub = sinon.stub(model, 'customValidate');
			
			customValidationStub.returns(null);
			model.schema = { profession: { type: 'String' } };
			
			model.properties = modelData;
			model.set('profession', 'Developer');
			expect(model.properties).to.be.an('object');
			expect(model.properties).to.eql(XQCore.extend({}, modelData, {
				profession: 'Developer'
			}));

			expect(validationStub).was.notCalled();
			expect(validationOneStub).was.notCalled();
			expect(customValidationStub).was.called();
			expect(customValidationStub).was.calledWith(XQCore.extend({}, modelData, {
				profession: 'Developer'
			}));

			validationStub.restore();
			validationOneStub.restore();
			customValidationStub.restore();
		});

	});

	describe('append', function() {
		var model;

		beforeEach(function() {
			model = new XQCore.Model('test');
			model.init();
		});

		it('Should append data to a subset', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = {
				listing: [
					{ name: 'AAA', value: '1' },
					{ name: 'BBB', value: '2' },
					{ name: 'CCC', value: '3' }
				]
			};

			var finalData = {
				listing: [
					{ name: 'AAA', value: '1' },
					{ name: 'BBB', value: '2' },
					{ name: 'CCC', value: '3' },
					{ name: 'DDD', value: '4' }
				]
			};

			model.append('listing', {name: 'DDD', value: '4'});
			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.append', 'listing', {name: 'DDD', value: '4'});
			expect(emitStub).was.calledWith('data.change', finalData);

			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should append data to a subset (path ist listing.data)', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = {
				listing: {
					data: [
						{ name: 'AAA', value: '1' },
						{ name: 'BBB', value: '2' },
						{ name: 'CCC', value: '3' }
					]
				}
			};

			var finalData = {
				listing: {
					data: [
						{ name: 'AAA', value: '1' },
						{ name: 'BBB', value: '2' },
						{ name: 'CCC', value: '3' },
						{ name: 'DDD', value: '4' }
					]
				}
			};

			model.append('listing.data', {name: 'DDD', value: '4'});
			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.append', 'listing.data', {name: 'DDD', value: '4'});
			expect(emitStub).was.calledWith('data.change', finalData);

			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should append data to a subset (path is null)', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = [
				{ name: 'AAA', value: '1' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' }
			];

			var finalData = [
				{ name: 'AAA', value: '1' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' },
				{ name: 'DDD', value: '4' }
			];

			model.append(null, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.append', null, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledWith('data.change', finalData);

			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should append data to a not existing dataset', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = {};

			var finalData = [
				{ name: 'DDD', value: '4' }
			];

			model.append(null, {name: 'DDD', value: '4'});

			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.append', null, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledWith('data.change', finalData);


			emitStub.restore();
		});

		it('Should append data to a existing dataset and should fail with an error', function() {
			var emitStub = sinon.stub(model, 'emit'),
				errorStub = sinon.stub(model, 'error');
			
			model.properties = { listing: {} };
			model.append('listing', {name: 'DDD', value: '4'});
			expect(errorStub).was.called();
			expect(errorStub).was.calledWithMatch(/Model.append requires an array./);
			expect(emitStub).was.notCalled();

			emitStub.restore();
			errorStub.restore();
		});

		it('Should call sync method with append mode', function() {
			var syncStub = sinon.stub();
			model.sync = syncStub;

			model.properties = { listing: [] };
			model.append('listing', {a: 'aa'});

			expect(syncStub).was.calledOnce();
			expect(syncStub).was.calledWith('append', 'listing', {a:'aa'});
		});

		it('Should not call sync method when sync option is false', function() {
			var syncStub = sinon.stub();
			model.sync = syncStub;

			model.properties = { listing: [] };
			model.append('listing', {a: 'aa'}, { sync: false });

			expect(syncStub).was.notCalled();
		});
	});

	describe('prepend', function() {
		var model;

		beforeEach(function() {
			model = new XQCore.Model('test');
			model.init();
		});

		it('Should prepend data to a subset', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = { listing: [
				{ name: 'AAA', value: '1' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' }
			]};

			var finalData = {
				listing: [
					{ name: 'DDD', value: '4' },
					{ name: 'AAA', value: '1' },
					{ name: 'BBB', value: '2' },
					{ name: 'CCC', value: '3' }
				]
			};

			model.prepend('listing', {name: 'DDD', value: '4'});
			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.prepend', 'listing', {name: 'DDD', value: '4'});
			expect(emitStub).was.calledWith('data.change', finalData);

			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should prepend data to a subset (path ist listing.data)', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = {
				listing: {
					data: [
						{ name: 'AAA', value: '1' },
						{ name: 'BBB', value: '2' },
						{ name: 'CCC', value: '3' }
					]
				}
			};

			var finalData = {
				listing: {
					data: [
						{ name: 'DDD', value: '4' },
						{ name: 'AAA', value: '1' },
						{ name: 'BBB', value: '2' },
						{ name: 'CCC', value: '3' }
					]
				}
			};

			model.prepend('listing.data', {name: 'DDD', value: '4'});
			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.prepend', 'listing.data', {name: 'DDD', value: '4'});
			expect(emitStub).was.calledWith('data.change', finalData);
			
			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should prepend data to a subset (path is null)', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = [
				{ name: 'AAA', value: '1' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' }
			];

			var finalData = [
				{ name: 'DDD', value: '4' },
				{ name: 'AAA', value: '1' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' }
			];

			model.prepend(null, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.prepend', null, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledWith('data.change', finalData);

			
			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should prepend data to a not existing dataset', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = {};

			var finalData = [
				{ name: 'DDD', value: '4' }
			];

			model.prepend(null, {name: 'DDD', value: '4'});

			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.prepend', null, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledWith('data.change', finalData);


			emitStub.restore();
		});

		it('Should prepend data to a existing dataset and should fail with an error', function() {
			var emitStub = sinon.stub(model, 'emit'),
				errorStub = sinon.stub(model, 'error');
			
			model.properties = { listing: {} };
			model.prepend('listing', {name: 'DDD', value: '4'});
			expect(errorStub).was.called();
			expect(errorStub).was.calledWithMatch(/Model.prepend requires an array./);
			expect(emitStub).was.notCalled();

			emitStub.restore();
			errorStub.restore();
		});

		it('Should call sync method with prepend mode', function() {
			var syncStub = sinon.stub();
			model.sync = syncStub;

			model.properties = { listing: [] };
			model.prepend('listing', {a: 'aa'});

			expect(syncStub).was.calledOnce();
			expect(syncStub).was.calledWith('prepend', 'listing', {a:'aa'});
		});

		it('Should not call sync method when sync option is false', function() {
			var syncStub = sinon.stub();
			model.sync = syncStub;

			model.properties = { listing: [] };
			model.prepend('listing', {a: 'aa'}, { sync: false });

			expect(syncStub).was.notCalled();
		});
	});

	describe('insert', function() {
		var model;

		beforeEach(function() {
			model = new XQCore.Model('test');
			model.init();
		});

		it('Should insert data to a subset', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = { listing: [
				{ name: 'AAA', value: '1' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' }
			]};

			var finalData = {
				listing: [
					{ name: 'AAA', value: '1' },
					{ name: 'DDD', value: '4' },
					{ name: 'BBB', value: '2' },
					{ name: 'CCC', value: '3' }
				]
			};

			model.insert('listing', 1, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.insert', 'listing', 1, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledWith('data.change', finalData);

			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should insert data to a subset (path ist listing.data)', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = {
				listing: {
					data: [
						{ name: 'AAA', value: '1' },
						{ name: 'BBB', value: '2' },
						{ name: 'CCC', value: '3' }
					]
				}
			};

			var finalData = {
				listing: {
					data: [
						{ name: 'AAA', value: '1' },
						{ name: 'DDD', value: '4' },
						{ name: 'BBB', value: '2' },
						{ name: 'CCC', value: '3' }
					]
				}
			};

			model.insert('listing.data', 1, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.insert', 'listing.data', 1, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledWith('data.change', finalData);
			
			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should insert data to a subset (path is null)', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = [
				{ name: 'AAA', value: '1' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' }
			];

			var finalData = [
				{ name: 'AAA', value: '1' },
				{ name: 'DDD', value: '4' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' }
			];

			model.insert(null, 1, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.insert', null, 1, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledWith('data.change', finalData);

			
			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should insert data to a subset and should never emit an event', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = [
				{ name: 'AAA', value: '1' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' }
			];

			var finalData = [
				{ name: 'AAA', value: '1' },
				{ name: 'DDD', value: '4' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' }
			];

			model.insert(null, 1, {name: 'DDD', value: '4'}, {
				silent: true
			});

			expect(emitStub).was.notCalled();
			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should insert data to a not existing dataset', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = {};

			var finalData = [
				{ name: 'DDD', value: '4' }
			];

			model.insert(null, 1, {name: 'DDD', value: '4'});

			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.insert', null, 1, {name: 'DDD', value: '4'});
			expect(emitStub).was.calledWith('data.change', finalData);


			emitStub.restore();
		});

		it('Should insert data to a existing dataset and should fail with an error', function() {
			var emitStub = sinon.stub(model, 'emit'),
				errorStub = sinon.stub(model, 'error');
			
			
			model.properties = { listing: {} };
			model.insert('listing', 1, {name: 'DDD', value: '4'});
			expect(errorStub).was.called();
			expect(errorStub).was.calledWithMatch(/Model.insert requires an array./);
			expect(emitStub).was.notCalled();

			emitStub.restore();
			errorStub.restore();
		});

		it('Should call sync method with insert mode', function() {
			var syncStub = sinon.stub();
			model.sync = syncStub;

			model.properties = { listing: [] };
			model.insert('listing', 1, {a: 'aa'});

			expect(syncStub).was.calledOnce();
			expect(syncStub).was.calledWith('insert', 'listing', 1, {a:'aa'});
		});

		it('Should not call sync method when sync option is false', function() {
			var syncStub = sinon.stub();
			model.sync = syncStub;

			model.properties = { listing: [] };
			model.insert('listing', 1, {a: 'aa'}, { sync: false });

			expect(syncStub).was.notCalled();
		});
	});

	describe('remove', function() {
		var model;

		beforeEach(function() {
			model = new XQCore.Model('test');
			model.init();
		});

		it('Should remove data to a subset', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = { listing: [
				{ name: 'AAA', value: '1' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' }
			]};

			var finalData = {
				listing: [
					{ name: 'AAA', value: '1' },
					{ name: 'CCC', value: '3' }
				]
			};

			model.remove('listing', 1);
			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.remove', 'listing', 1, { name: 'BBB', value: '2' });
			expect(emitStub).was.calledWith('data.change', finalData);

			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should remove data to a subset (path ist listing.data)', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = {
				listing: {
					data: [
						{ name: 'AAA', value: '1' },
						{ name: 'BBB', value: '2' },
						{ name: 'CCC', value: '3' }
					]
				}
			};

			var finalData = {
				listing: {
					data: [
						{ name: 'AAA', value: '1' },
						{ name: 'CCC', value: '3' }
					]
				}
			};

			model.remove('listing.data', 1);
			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.remove', 'listing.data', 1, { name: 'BBB', value: '2' });
			expect(emitStub).was.calledWith('data.change', finalData);
			
			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should remove data to a subset (path is null)', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = [
				{ name: 'AAA', value: '1' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' }
			];

			var finalData = [
				{ name: 'AAA', value: '1' },
				{ name: 'CCC', value: '3' }
			];

			model.remove(null, 1);
			expect(emitStub).was.calledTwice();
			expect(emitStub).was.calledWith('data.remove', null, 1, { name: 'BBB', value: '2' });
			expect(emitStub).was.calledWith('data.change', finalData);

			
			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should remove data to a subset and should never emit an event', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = [
				{ name: 'AAA', value: '1' },
				{ name: 'BBB', value: '2' },
				{ name: 'CCC', value: '3' }
			];

			var finalData = [
				{ name: 'AAA', value: '1' },
				{ name: 'CCC', value: '3' }
			];

			model.remove(null, 1, {
				silent: true
			});

			expect(emitStub).was.notCalled();
			expect(model.properties).to.eql(finalData);

			emitStub.restore();
		});

		it('Should remove data from a not existing dataset', function() {
			var emitStub = sinon.stub(model, 'emit');
			model.properties = {};

			model.remove('listing', 1);

			expect(emitStub).was.notCalled();
			emitStub.restore();
		});

		it('Should remove data to a existing dataset and should fail with an error', function() {
			var emitStub = sinon.stub(model, 'emit'),
				errorStub = sinon.stub(model, 'error');
			
			
			model.properties = { listing: {} };
			model.remove('listing', 1);
			expect(errorStub).was.called();
			expect(errorStub).was.calledWithMatch(/Model.remove requires an array./);
			expect(emitStub).was.notCalled();

			emitStub.restore();
			errorStub.restore();
		});

		it('Should call sync method with remove mode', function() {
			var syncStub = sinon.stub();
			model.sync = syncStub;

			model.properties = { listing: [] };
			model.remove('listing', 1);

			expect(syncStub).was.calledOnce();
			expect(syncStub).was.calledWith('remove', 'listing', 1);
		});

		it('Should not call sync method when sync option is false', function() {
			var syncStub = sinon.stub();
			model.sync = syncStub;

			model.properties = { listing: [] };
			model.remove('listing', 1, { sync: false });

			expect(syncStub).was.notCalled();
		});
	});

	describe('registerFilter', function() {
		var model;

		beforeEach(function() {
			model = new XQCore.Model('filtertest');
			model.init();
		});

		it('Should register a filter method to models prototype', function() {
			var fn = sinon.spy();

			XQCore.Model.registerFilter('testfilter', fn);
			expect(XQCore.Model.prototype.__registeredFilter).to.be.an('object');
			expect(XQCore.Model.prototype.__registeredFilter.testfilter).to.be.eql(fn);

			//Instance got the filter from prototype
			expect(model.__registeredFilter).to.be.an('object');
			expect(model.__registeredFilter.testfilter).to.be.eql(fn);
		});

		it('Should register a filter method to an instance', function() {
			var fn = sinon.spy();

			model.registerFilter('testfilter', fn);
			expect(model.__registeredFilter).to.be.an('object');
			expect(model.__registeredFilter.testfilter).to.be.eql(fn);
		});

		it('Should fail registering a filter method', function() {
			expect(function() {
				model.registerFilter('testfilter', 'string');
			}).to.throwError();
		});
	});

	describe('filter', function() {
		var model,
			testData;

		beforeEach(function() {
			model = new XQCore.Model('filtertest');
			model.init();

			testData = [
				{ name: 'Andi' },
				{ name: 'Donnie' },
				{ name: 'Bubu' },
				{ name: 'Stummi' },
				{ name: 'Barney' },
				{ name: 'Tini' },
				{ name: 'Carl' },
				{ name: 'Rogger' },
				{ name: 'Piglet' }
			];
		});

		it('Should filter a dataset with query "a"', function() {
			//Set data
			model.set({
				listing: testData
			});

			model.filter('listing', 'name', 'a', 'quicksearch');
			expect(model.get('listing')).to.eql([
				{ name: 'Andi' },
				{ name: 'Barney' },
				{ name: 'Carl' }
			]);

			expect(model.__unfiltered).to.eql({
				path: 'listing',
				data: testData
			});
		});

		it('Should filter a dataset with query "an"', function() {
			//Set data
			model.set({
				listing: testData
			});

			model.filter('listing', 'name', 'an', 'quicksearch');
			expect(model.get('listing')).to.eql([
				{ name: 'Andi' },
				{ name: 'Barney' }
			]);

			expect(model.__unfiltered).to.eql({
				path: 'listing',
				data: testData
			});
		});

		it('Should filter a dataset with query "andi"', function() {
			//Set data
			model.set({
				listing: testData
			});

			model.filter('listing', 'name', 'andi', 'quicksearch');
			expect(model.get('listing')).to.eql([
				{ name: 'Andi' }
			]);

			expect(model.__unfiltered).to.eql({
				path: 'listing',
				data: testData
			});
		});

		it('Should filter a dataset with query "idna"', function() {
			//Set data
			model.set({
				listing: testData
			});

			model.filter('listing', 'name', 'idna', 'quicksearch');
			expect(model.get('listing')).to.eql([]);

			expect(model.__unfiltered).to.eql({
				path: 'listing',
				data: testData
			});
		});
	});

	describe('filterReset', function() {
		var model,
			testData;

		beforeEach(function() {
			model = new XQCore.Model('filtertest');
			model.init();

			testData = [
				{ name: 'Andi' },
				{ name: 'Donnie' },
				{ name: 'Bubu' },
				{ name: 'Stummi' },
				{ name: 'Barney' },
				{ name: 'Tini' },
				{ name: 'Carl' },
				{ name: 'Rogger' },
				{ name: 'Piglet' }
			];
		});

		it('Should reset a filtered dataset', function() {
			model.__unfiltered = {
				path: 'listing',
				data: testData
			};

			model.properties = {
				listing: [
					{ name: 'andi' }
				]
			};

			model.filterReset();
			expect(model.get('listing')).to.eql(testData);
		});
	});

	describe('state', function() {
		xit('Should set a state', function() {
			
		});
	});

	describe('getState', function() {
		xit('Should get a state', function() {
			
		});
	});

	describe('has', function() {
		xit('Should check wheter a dataset exists', function() {
			
		});
	});

	describe('restore', function() {
		xit('Should reset a model', function() {
			
		});
	});

	describe('search', function() {
		xit('Should search data in a model', function() {
			
		});
	});

	describe('sortBy', function() {
		xit('Should sort a subset', function() {
			
		});
	});

	describe('registerValidation', function() {
		var model;

		beforeEach(function() {
			model = new XQCore.Model();
		});

		it('Should register a validation method', function() {
			var fn1 = sinon.stub();
			var fn2 = sinon.stub();

			model.registerValidation('test1', fn1);
			model.registerValidation('test2', fn2);

			expect(model.__registeredValidations.test1).to.eql(fn1);
			expect(model.__registeredValidations.test2).to.eql(fn2);
		});

		it('Should register a validation method for all models', function() {
			var fn1 = sinon.stub();
			var fn2 = sinon.stub();

			XQCore.Model.registerValidation('test1', fn1);
			XQCore.Model.registerValidation('test2', fn2);

			expect(model.__registeredValidations.test1).to.eql(fn1);
			expect(model.__registeredValidations.test2).to.eql(fn2);
		});
	});

	describe.only('validate', function() {
		var model;

		beforeEach(function() {
			model = new XQCore.Model('validation-test', function(self) {
				self.schema = {
					title: { type: 'string' }
				};
			});	
		});

		it('Should validate a model', function() {
			var result = model.validate({
				title: 'Test'
			});

			expect(result).to.be(null);
			expect(model.isValid()).to.be(true);
		});
	});

	describe('validateOne', function() {
		var model;

		beforeEach(function() {
			model = new XQCore.Model('validation-test', function(self) {
				self.schema = {
					title: { type: 'string' },
					number: { type: 'number' }
				};
			});

			model.init();
		});

		it('Should validate on model item', function() {
			var result = model.validateOne(model.schema.title, 'Test title');
			expect(result).to.eql({
				isValid: true,
				value: 'Test title',
				error: null
			});
		});
	});

	describe('isValid', function() {
		xit('Should return the validation state of a model', function() {
			
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

//Old getset tests
describe.skip('XQCore Model', function() {
	'use strict';
	XQCore.Model = XQCore.Model;
	beforeEach(function() {

	});

	afterEach(function() {

	});

	it('Should validate an item an should get an undefined but required error', function(done) {
		var test = new XQCore.Model({
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
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'string', required: true }, undefined).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property is undefined or null, but it\'s required');
		expect(err.errCode).to.equal(10);
	});

	it('Should validate one and should get a type error', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'string' }, 1).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property type is a number, but a string is required');
		expect(err.errCode).to.equal(11);
	});

	it('Should validate one and should get a string to short error', function() {
		var test = new XQCore.Model();

		var err = test.validateOne({ type: 'string', min: 10 }, 'test').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('String length is too short');
		expect(err.errCode).to.equal(12);
	});

	it('Should validate one and should get a string to long error', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'string', max: 10 }, 'testing ist so beautifull').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('String length is too long');
		expect(err.errCode).to.equal(13);
	});

	it('Should validate one and should get a string doesn\'t match regexp', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'string', match: /^a/ }, 'blabla').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('String doesn\'t match regexp');
		expect(err.errCode).to.equal(14);
	});

	it('Should validate one and should get a type error', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'number' }, '1').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property type is a string, but a number is required');
		expect(err.errCode).to.equal(21);
	});

	it('Should validate one and should get a number to low error', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'number', min: 10 }, 9).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Number is too low');
		expect(err.errCode).to.equal(22);
	});

	it('Should validate one and should get a number to high error', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'number', max: 10 }, 12).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Number is too high');
		expect(err.errCode).to.equal(23);
	});

	it('Should validate one and should get a not a valid date error', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'date' }, 'Not a date').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property isn\'t a valid date');
		expect(err.errCode).to.equal(31);
	});

	it('Should validate one and should get a type not an array error', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'array' }, {
			a: 'aa',
			b: 'bb'
		}).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property type is a object, but an array is required');
		expect(err.errCode).to.equal(41);
	});

	it('Should validate one and should get an array length to low error', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'array', min: 5 }, [
			'aa', 'bb', 'cc'
		]).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Array length is 3 but must be greater than 5');
		expect(err.errCode).to.equal(42);
	});

	it('Should validate one and should get an array length to long error', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'array', max: 2 }, [
			'aa', 'bb', 'cc'
		]).error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Array length is 3 but must be lesser than 2');
		expect(err.errCode).to.equal(43);
	});

	it('Should validate one and should get a not a valid object error', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'object' }, 'Not an object').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property isn\'t a valid object');
		expect(err.errCode).to.equal(51);
	});

	it('Should validate one and should get a not a valid objectId error', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'objectId' }, 'abc').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property isn\'t a valid objectId');
		expect(err.errCode).to.equal(52);
	});

	it('Should validate one and should get a not a valid boolean error', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'boolean' }, 'Not a boolean').error;

		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property isn\'t a valid boolean');
		expect(err.errCode).to.equal(61);
	});

	it('A empty string should cause a validation error if property is required', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'string', required: true }, '').error;
		expect(err).to.be.an('object');
		expect(err.msg).to.equal('Property is undefined or null, but it\'s required');
		expect(err.errCode).to.equal(10);
	});

	it('Should use the default value, noEmpty: true on a String', function() {
		var test = new XQCore.Model();
		var err = test.validateOne({ type: 'string', 'default': 'test', noEmpty: true }, '');
		expect(err.error).to.be(null);
		expect(err.value).to.equal('test');
	});

	it('Should validate a nested struckture', function() {
		var test = new XQCore.Model({
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
		var test = new XQCore.Model();
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
		var test = new XQCore.Model();
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
		var test = new XQCore.Model();
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
		var test = new XQCore.Model();
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
		var test = new XQCore.Model();
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
		var test = new XQCore.Model();
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
		var test = new XQCore.Model();
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
		var test = new XQCore.Model();
		test.set([
			{name: 'Homer', surname: 'Simpson'},
			{name: 'Lenny', surname: 'Leonard'}
		]);

		test.once('data.change', function() {
			done();
		});

		test.sortBy({name: 1});
	});

	it('Model should inherit from event listener', function() {
		var model1 = new XQCore.Model();
		var model2 = new XQCore.Model();
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