module.exports = function(grunt) {
	grunt.loadTasks('./modules/grunt-xqcoretest');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	// Project configuration.
	grunt.initConfig({
		// Lists of files to be linted with JSHint.
		lint: {
			files: [
				'webdocs/js/xqcore-(!.spec).js'
			],
			afterconcat: [
				'webdocs/js/xqcore.js'
			]
		},
		jshint: {
			options: {
				browser: true,
				smarttabs: true,
				multistr: true
			},
			globals: {

			}
		},
		concat: {
			dist: {
				src: [
					'webdocs/js/xqcore-core.js',
					'webdocs/js/xqcore-presenter.js',
					'webdocs/js/xqcore-model.js',
					'webdocs/js/xqcore-view.js',
					'webdocs/js/xqcore-event.js',
					'webdocs/js/xqcore-logger.js',
					'webdocs/js/xqcore-util.js'
				],
				dest: 'webdocs/js/xqcore.js'
			}
		},
		min: {
			dist: {
				src: ['webdocs/js/xqcore.js'],
				dest: 'webdocs/js/xqcore.min.js'
			}
		},
		xqcoretest: {
			ignore_files: ['init.js', '*.min.js']
		},
		copy: {
			akonda: {
				files: {
					'../akonda-files/webdocs/js/xqcore.js': 'webdocs/js/xqcore.js',
					'../akonda-files/webdocs/js/xqcore.min.js': 'webdocs/js/xqcore.min.js'
				}
			}
		},
		clean: {
			build: [
				'webdocs/js/xqcore.js',
				'webdocs/js/xqcore.min.js'
			]
		},
		watch: {
			files: 'webdocs/js/xqcore-*.js',
			tasks: ['build']
		}
	});

	grunt.registerTask('default', 'lint');
	grunt.registerTask('test', 'xqcoretest');
	grunt.registerTask('build', 'lint concat:dist lint:afterconcat min copy:akonda');
};