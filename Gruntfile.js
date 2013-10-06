module.exports = function(grunt) {

	var banner = '\
/*!\n\
 * XQCore - <%pkg.version %>\n\
 * <%= pkg.description %>\n\
 *\n\
 * XQCore is licenced under MIT Licence\n\
 * http://opensource.org/licenses/MIT\n\
 *\n\
 * Copyright (c) 2013 Noname Media, http://noname-media.com\n\
 * Author Andi Heinkelein\n\
 */\n\
\n\
(function (root, factory) {\n\
    if (typeof define === \'function\' && define.amd) {\n\
        define(\'xqcore\', [\'jquery\'], factory);\n\
    } else {\n\
        root.XQCore = factory(root.jQuery);\n\
    }\n\
}(this, function (jQuery) {\n\n\n\
 ';

	var footer = '\n\
\n\
 return XQCore;\n\
}));\n\n\n';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Lists of files to be linted with JSHint.
		jshint: {
			files: [
				'webdocs/js/xqcore-(!.spec).js'
			],
			afterconcat: [
				'webdocs/js/xqcore.js',
				'webdocs/js/xqcore-minimal.js'
			],
			options: {
				browser: true,
				smarttabs: true,
				multistr: true,
				laxbreak: true,
				es5: true
			},
			globals: {

			}
		},
		concat: {
			options: {
				process: true
			},
			build: {
				src: [
					'webdocs/js/concat-before.js',
					'webdocs/js/xqcore-core.js',
					'webdocs/js/xqcore-event.js',
					'webdocs/js/xqcore-logger.js',
					'webdocs/js/xqcore-getset.js',
					'webdocs/js/xqcore-presenter.js',
					'webdocs/js/xqcore-model.js',
					'webdocs/js/xqcore-view.js',
					'webdocs/js/xqcore-util.js',
					'webdocs/js/xqcore-router.js',

					'webdocs/js/plugins/xqcore-viewslide.js',
					'webdocs/js/concat-after.js'
				],
				dest: 'webdocs/build/xqcore.js'
			},
			minimal: {
				src: [
					'webdocs/js/concat-before-minimal.js',
					'webdocs/js/xqcore-core.js',
					'webdocs/js/xqcore-event.js',
					'webdocs/js/xqcore-logger.js',
					'webdocs/js/xqcore-getset.js',
					'webdocs/js/concat-after.js'
				],
				dest: 'webdocs/build/xqcore-minimal.js'
			}
		},
		uglify: {
			options: {
				preserveComments: 'some'
			},
			build: {
				files: {
					'webdocs/build/xqcore.min.js': ['webdocs/build/xqcore.js']
				}
			},
			minimal: {
				files: {
					'webdocs/build/xqcore-minimal.min.js': ['webdocs/build/xqcore-minimal.js']
				}
			}
		},
		// xqcoretest: {
		// 	ignore_files: ['init.js', '*.min.js']
		// },
		copy: {
			akonda: {
				files: [
					{
						src: ['webdocs/build/xqcore.js'],
						dest: '../akonda/components/xqcore/xqcore.js'
					}
				]
			},
			'xqtools': {
				files: [
					{
						src: ['webdocs/build/xqcore-minimal.js'],
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
	grunt.loadNpmTasks('grunt-bump');

	grunt.registerTask('default', 'jshint');
	grunt.registerTask('doc', 'yuidoc');
	grunt.registerTask('test', 'xqcoretest');
	grunt.registerTask('build', [
		'jshint:files',
		'clean:build',
		'concat:build',
		'concat:minimal',
		'jshint:afterconcat',
		'uglify',
		'copy:akonda',
		'copy:xqtools',
		'doc',
		'bump:patch'
	]);
};