module.exports = function(grunt) {

	var fs = require('fs'),
		exec = require('child_process').exec,
		child;

	grunt.registerTask('coretest', 'Prepare core test', function() {
		var specs = [],
			libs = [],
			conf;

		// console.log(this.data);

		this.requiresConfig('coretest');
		conf = grunt.config('coretest');
		// console.log(conf);

		grunt.log.writeln('Core Test');


		grunt.file.recurse('webdocs/js/', function(abspath, rootdir, subdir, filename) {

			//Check exclude files
			if (grunt.file.isMatch(conf.ignore_files, abspath)) {
				grunt.log.writeln('Ignore file ' + rootdir + filename);
				return;
			}

			if (/\.spec\.js$/.test(filename)) {
				//Is a spec file
				specs.push({
					abspath: abspath,
					rootdir: rootdir,
					subdir: subdir,
					filename: filename
				});
			}
			else if (/\.js$/.test(filename)) {
				//Is a spec file
				libs.push({
					abspath: abspath,
					rootdir: rootdir,
					subdir: subdir,
					filename: filename
				});
			}
			else {
				grunt.log.writeln('Ignore unmatched file ' + rootdir + filename);
			}
		});

		//Link files
		if (libs.length > 0) {
			grunt.log.writeln('\n' + libs.length + ' lib files found.\n');
			libs.forEach(function(file) {
				var destDir = 'webdocs/test/src/lib/';
				grunt.log.write('Link ' + file.rootdir + file.filename + ' to ' + destDir + file.filename);

				//Create symlink
				if (!fs.existsSync(destDir + file.filename)) {
					fs.symlinkSync(fs.realpathSync(file.abspath), destDir + file.filename);
					grunt.log.writeln('..... \033[0;32mDone!\033[0m');
				}
				else {
					grunt.log.writeln('..... Allready exists!', fs.existsSync(destDir + file.filename));
				}
			});
		}

		//Link specs
		if (specs.length > 0) {
			grunt.log.writeln('\n' + specs.length + ' spec files found.\n');
			specs.forEach(function(file) {
				var destDir = 'webdocs/test/spec/';
				grunt.log.write('Link ' + file.rootdir + file.filename + ' to ' + destDir + file.filename);

				//Create symlink
				if (!fs.existsSync(destDir + file.filename)) {
					fs.symlinkSync(fs.realpathSync(file.abspath), destDir + file.filename);
					grunt.log.writeln('..... \033[0;32mDone!\033[0m');
				}
				else {
					grunt.log.writeln('..... Allready exists!', fs.existsSync(destDir + file.filename));
				}
			});
		}

		//Parse jsconf files
		exec('coverjs -o webdocs/test/src/cov/ webdocs/test/src/lib/*.js', function(error, stdout, stderr) {
			if (error !== null) {
				grunt.log.error('coverjs error: ' + error);
			}

			grunt.log.writeln(stdout);
			grunt.log.writeln(stderr);
		});
	});
};