(function() {

	console.profile();
	// console.time('child declaration');

	for (var i = 0; i < 1000; i++) {
		var child = $.extend(new Parent(), {
			propA2: 'AA',
			propB2: 'BB',
			propC2: 'CC',

			//Override parent func
			funcA: function() {
				return 'A2';
			},
			//Override parent func
			funcB: function() {
				return 'B2';
			},
			//Override parent func
			funcC: function() {
				return 'C2';
			},
			//Override parent func
			funcD: function() {
				return 'D2';
			},


			funcE2: function() {
				return 'E2';
			},
			funcF2: function() {
				return 'F2';
			},
			funcG2: function() {
				return 'G2';
			},
			funcH2: function() {
				return 'H2';
			}

		});
	}

	// console.timeEnd('child declaration');
	console.profileEnd();

})();