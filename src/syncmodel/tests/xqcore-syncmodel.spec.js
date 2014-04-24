describe.only('SyncModel', function() {
	'use strict';

	describe('initialize', function() {
		it('Should be an instance of SyncModel', function() {
			expect(XQCore.SyncModel).to.be.a('function');
		});

		it('Should create an instance', function() {
			var syncModel = new XQCore.SyncModel('test');
			
			expect(syncModel).to.be.an('object');
			expect(syncModel).to.be.a(XQCore.SyncModel);
		});

		it('Should have been extended by XQCore.Model', function() {
			var syncModel = new XQCore.SyncModel('test');

			expect(syncModel.set).to.be.a('function');
			expect(syncModel.get).to.be.a('function');
			expect(syncModel.has).to.be.a('function');
			expect(syncModel.append).to.be.a('function');
		});

		it('Should have been extended by XQCore.Event', function() {
			var syncModel = new XQCore.SyncModel('test');

			expect(syncModel.on).to.be.a('function');
			expect(syncModel.off).to.be.a('function');
			expect(syncModel.emit).to.be.a('function');
		});
	});
});