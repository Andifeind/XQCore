/**
 *	@requires XQCore.Model
 */
(function(XQCore, undefined) {
	'use strict';
	var SyncModel;

	SyncModel = function() {

	};

	XQCore.extend(SyncModel.prototype, new XQCore.Model());

	XQCore.SyncModel = SyncModel;
})(XQCore);