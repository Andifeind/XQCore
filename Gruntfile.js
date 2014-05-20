module.exports = function(grunt) {
	'use strict';

	var pkg = grunt.file.readJSON('package.json'),
		version = pkg.version.replace(/-\d+$/g, '');

	// Project configuration.
	grunt.initConfig({
		pkg: pkg,

		bumpup: {
			file: 'package.json'
		},

		// Lists of files to be linted with JSHint.
		jshint: {
			files: [
				'src/**/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
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
					'src/utils/xqcore-utils.js',
					'src/router/xqcore-router.js',
					'src/socket/xqcore-socket.js',
					'src/syncmodel/xqcore-syncmodel.js',

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
			component: {
				options: {
					processContent: function (content, srcpath) {
						return content.replace('<%= version %>', version);
					}
				},
				files: [
					{
						src: ['build/xqcore.js'],
						dest: '../component-builds/nonamemedia/xqcore/' + version + '/xqcore.js'
					}, {
						src: ['component.json'],
						dest: '../component-builds/nonamemedia/xqcore/' + version + '/',
					}
				]
			},
			firetpl: {
				files: [
					{
						src: ['firetpl.js', 'firetpl-runtime.js'],
						dest: 'lib/',
						cwd: '../firetpl/',
						expand: true
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
		doxit: {
			dest: {
				options: {},
				files: {
					'docs/': ['src/**/*.js']
				}
			}
		},
		version: {
			component: {
				src: ['../component-builds/nonamemedia/xqcore/component.json']
			}
		},
		watch: {
			files: 'webdocs/js/**/*.js',
			tasks: ['build']
		},
		yuidoc: {
			compile: {
				name: 'XQCore',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				url: '<%= pkg.homepage %>',
				options: {
					paths: 'src/',
					outdir: 'docs/v' + version,
					parseOnly: true
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
	grunt.loadNpmTasks('grunt-doxit');
	// grunt.loadNpmTasks('grunt-simple-dox');
	grunt.loadNpmTasks('grunt-version');

	// grunt.loadNpmTasks('grunt-contrib-bump');

	grunt.registerTask('default', 'jshint');
	grunt.registerTask('doc', 'doxit');
	grunt.registerTask('test', 'xqcoretest');
	grunt.registerTask('build', [
		'jshint:files',
		'clean:build',
		'concat:build',
		'concat:minimal',
		'uglify',
		'doc',
		'component-build',
		'bumpup:prerelease'
	]);

	grunt.registerTask('component-build', [
		'copy:component',
		'version:component'
	]);
};