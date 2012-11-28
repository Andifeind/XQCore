module.exports = function(grunt) {
	grunt.loadTasks('./modules/grunt-coretest');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	// Project configuration.
	grunt.initConfig({
		// Lists of files to be linted with JSHint.
		lint: {
			files: [
				'webdocs/js/core-(!.spec).js'
			],
			afterconcat: [
				'webdocs/js/core.js'
			]
		},
		jshint: {
			options: {
				browser: true,
				smarttabs: true
			},
			globals: {

			}
		},
		concat: {
			dist: {
				src: [
					'webdocs/js/core-router.js',
					'webdocs/js/core-presenter.js',
					'webdocs/js/core-model.js',
					'webdocs/js/core-view.js',
					'webdocs/js/core-event.js',
					'webdocs/js/core-logger.js',
					'webdocs/js/core-util.js'
				],
				dest: 'webdocs/js/core.js'
			}
		},
		min: {
			dist: {
				src: ['webdocs/js/core.js'],
				dest: 'webdocs/js/core.min.js'
			}
		},
		coretest: {
			ignore_files: ['init.js', '*.min.js']
		},
		copy: {
			akonda: {
				files: {
					'../akonda-files/webdocs/js/core.js': 'webdocs/js/core.js',
					'../akonda-files/webdocs/js/core.min.js': 'webdocs/js/core.min.js'
				}
			}
		}
	});

	grunt.registerTask('default', 'lint');
	grunt.registerTask('test', 'coretest');
	grunt.registerTask('build', 'lint concat:dist lint:afterconcat min copy:akonda');
};