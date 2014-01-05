module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		bumpup: {
			file: 'package.json'
		},

		// Lists of files to be linted with JSHint.
		jshint: {
			files: [
				'src/**/*.js'
			],
			jshintrc: '.jshintrc'
		},
		concat: {
			options: {
				process: true
			},
			build: {
				src: [
					'src/core/xqcore-core.js',
					'src/event/xqcore-event.js',
					'src/logger/xqcore-logger.js',
					'src/presenter/xqcore-presenter.js',
					'src/sync/xqcore-sync.js',
					'src/model/xqcore-model.js',
					'src/getset/xqcore-getset.js',
					'src/tmpl/xqcore-tmpl.js',
					'src/view/xqcore-view.js',
					'src/util/xqcore-util.js',
					'src/router/xqcore-router.js',

					'webdocs/js/plugins/xqcore-viewslide.js',
				],
				dest: 'build/xqcore.js'
			},
			minimal: {
				src: [
					'src/core/xqcore-core.js',
					'src/event/xqcore-event.js',
					'src/logger/xqcore-logger.js',
					'src/model/xqcore-model.js'
				],
				dest: 'build/xqcore-minimal.js'
			},
			cli: {
				src: [
					'src/core/xqcore-cli.js',
					'src/event/xqcore-event.js',
					'src/logger/xqcore-logger.js',
					'src/tmpl/xqcore-tmpl.js'
				],
				dest: 'build/xqcore-cli.js'
			}
		},
		uglify: {
			options: {
				preserveComments: 'some'
			},
			build: {
				files: {
					'build/xqcore.min.js': ['build/xqcore.js']
				}
			},
			minimal: {
				files: {
					'build/xqcore-minimal.min.js': ['build/xqcore-minimal.js']
				}
			}
		},
		copy: {
			akonda: {
				files: [
					{
						src: ['build/xqcore.js'],
						dest: '../akonda/components/xqcore/xqcore.js'
					}
				]
			},
			'xqtools': {
				files: [
					{
						src: ['build/xqcore-minimal.js'],
						dest: '../xqtools/webdocs/ext/xqcore-minimal.js'
					}
				]
			}
		},
		clean: {
			build: [
				'webdocs/build/xqcore.js',
				'webdocs/build/xqcore.min.js',
				'webdocs/build/xqcore-minimal.js',
				'webdocs/build/xqcore-minimal.min.js'
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
					outdir: 'webdocs/doc/',
					exclude: 'xqcore.js, xqcore.min.js'
				}
			}
		}
	});

	// grunt.loadTasks('./modules/grunt-xqcoretest');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-bumpup');
	// grunt.loadNpmTasks('grunt-contrib-bump');

	grunt.registerTask('default', 'jshint');
	grunt.registerTask('doc', 'yuidoc');
	grunt.registerTask('test', 'xqcoretest');
	grunt.registerTask('build', [
		'jshint:files',
		'clean:build',
		'concat:build',
		'concat:minimal',
		'uglify',
		'copy:akonda',
		'copy:xqtools',
		'doc',
		'bumpup:prerelease'
	]);
};