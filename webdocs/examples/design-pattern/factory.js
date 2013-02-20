(function() {

	console.profile();
	// console.time('child declaration');

	for (var i = 0; i < 1000; i++) {
		
		var Child = {
			propA2: 'AA',
			propB2: 'BB',
			propC2: 'CC'
		};

		$.extend(Child, new Parent());

		//Override parent func
		Child.funcA = function() {
			return 'A2';
		};
		//Override parent func
		Child.funcB = function() {
			return 'B2';
		};
		//Override parent func
		Child.funcC = function() {
			return 'C2';
		};
		//Override parent func
		Child.funcD = function() {
			return 'D2';
		};


		Child.funcE2 = function() {
			return 'E2';
		};
		Child.funcF2 = function() {
			return 'F2';
		};
		Child.funcG2 = function() {
			return 'G2';
		};
		Child.funcH2 = function() {
			return 'H2';
		};
	}

	// console.timeEnd('child declaration');
	console.profileEnd();

})();