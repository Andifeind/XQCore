module.exports = (function() {
	'use strict';
	
	var fs = require('fs'),
		path = require('path');

	var mkdirp = require('mkdirp'),
		handlebars = require('handlebars');

	var homeDir = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

	var projectBuilder = {
		lookupPaths: [
			path.join(process.cwd(), '.drafts/'),
			path.join(homeDir, '.xqcore/'),
			path.join(__dirname, '../drafts/')
		]
	};

	projectBuilder.createDirs = function (directories) {
		directories.forEach(function(dir) {
			if (fs.existsSync(dir)) {
				console.log('Dir %s exists. Skipping', dir);
				return;
			}

			console.log('Create dir %s', dir);
			mkdirp(dir);
		});
	};

	projectBuilder.createFile = function(file, opts) {
		this.createFiles([file], opts);
	};

	projectBuilder.createFiles = function (files, opts) {
		opts = opts || {};

		for (var file in files) {
			if (files.hasOwnProperty(file)) {
				if (fs.existsSync(file)) {
					console.log('File %s exists. Skipping', file);
					continue;
				}

				var src = null;
				for (var i = 0, len = this.lookupPaths.length; i < len; i++) {
					if (fs.existsSync(path.join(this.lookupPaths[i], files[file]))) {
						src = path.join(this.lookupPaths[i], files[file]);
						break;
					}
				}

				if (src) {
					//Read file
					var source = fs.readFileSync(src, 'utf8');
					if (source) {
						source = handlebars.compile(source);
						source = source(opts);
					}
					
					fs.writeFileSync(file, source);
					console.log('Create file %s using template %s', file, src);
				}
				else {
					console.log('Create empty file %s', file);
					fs.writeFileSync(file, '');
				}
			}
		}
	};

	return projectBuilder;

})();