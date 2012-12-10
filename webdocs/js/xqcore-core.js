var XQCore = {
	version: 0.1
};

/**
 * Implement include support
 *
 * File must be absolute to the document root
 *
 * @param {String} file Filename to be load
 */
if (!window.include) {
	window.include = function(file, callback) {
		var url = location.protocol + '//' + location.host + file;
		$.ajax({
			url: url,
			dataType: "script",
			success: callback,
			async: false
		});
	};
}
