module.exports = function(grunt) {
	grunt.loadTasks('./modules/grunt-xqcoretest');
	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-concat');
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Lists of files to be linted with JSHint.
		jshint: {
			files: [
				'webdocs/js/xqcore-(!.spec).js'
			],
			afterconcat: [
				'webdocs/js/xqcore.js'
			],
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
					'webdocs/js/xqcore-event.js',
					'webdocs/js/xqcore-logger.js',
					'webdocs/js/xqcore-getset.js',
					'webdocs/js/xqcore-presenter.js',
					'webdocs/js/xqcore-model.js',
					'webdocs/js/xqcore-view.js',
					'webdocs/js/xqcore-util.js',
					'webdocs/js/xqcore-router.js',

					'webdocs/js/plugins/xqcore-viewslide.js'
				],
				dest: 'webdocs/js/xqcore.js'
			}
		},
		uglify: {
			dist: {
				files: {
					'webdocs/js/xqcore.min.js': ['webdocs/js/xqcore.js']
				}
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
		},
		yuidoc: {
			compile: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				url: '<%= pkg.homepage %>',
				options: {
					paths: 'webdocs/js/',
					outdir: 'webdocs/doc/yuidoc/',
					exclude: 'xqcore.js, xqcore.min.js'
				}
			}
		}
	});

	grunt.registerTask('default', 'lint');
	grunt.registerTask('doc', 'yuidoc');
	grunt.registerTask('test', 'xqcoretest');
	grunt.registerTask('build', ['jshint:files', 'clean:build', 'concat:dist', 'jshint:afterconcat', 'uglify', 'copy:akonda']);
};