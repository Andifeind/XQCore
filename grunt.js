module.exports = function(grunt) {
	grunt.loadTasks('./modules/grunt-xqcoretest');
	grunt.loadNpmTasks('grunt-contrib');
	
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
				multistr: true,
				laxbreak: true
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
					'webdocs/js/xqcore-util.js',
					'webdocs/js/xqcore-router.js',

					'webdocs/js/plugins/xqcore-viewslide.js'
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
					'../akonda/akonda-files/webdocs/js/xqcore.js': 'webdocs/js/xqcore.js',
					'../akonda/akonda-files/webdocs/js/xqcore.min.js': 'webdocs/js/xqcore.min.js'
				}
			},
			frogshit: {
				files: {
					'../frogshit/webdocs/js/xqcore.js': 'webdocs/js/xqcore.js',
					'../frogshit/webdocs/js/xqcore.min.js': 'webdocs/js/xqcore.min.js'
				}
			}
		},
		clean: {
			build: [
				'webdocs/js/ext/xqcore.js',
				'webdocs/js/ext/xqcore.min.js'
			]
		},
		watch: {
			files: 'webdocs/js/**/*.js',
			tasks: ['build']
		}
	});

	grunt.registerTask('default', 'lint');
	grunt.registerTask('test', 'xqcoretest');
	grunt.registerTask('build', 'lint:files clean:build concat:dist lint:afterconcat min copy:akonda');
};