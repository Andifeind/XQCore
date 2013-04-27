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
				'webdocs/js/xqcore.js'
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
			dist: {
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
				dest: 'webdocs/js/xqcore.js'
			}
		},
		uglify: {
			options: {
				preserveComments: 'some'
			},
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
				files: [
					{
						src: ['webdocs/js/xqcore.js'],
						dest: '../akonda/akonda-files/webdocs/js/xqcore.js'
					}, {
						src: ['webdocs/js/xqcore.min.js'],
						dest: '../akonda/akonda-files/webdocs/js/xqcore.min.js'
					}
				]
			},
			'jam-libs': {
				files: [
					{
						src: ['webdocs/js/xqcore.js'],
						dest: '../jam-libs/xqcore/xqcore.js'
					}
				]
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

	grunt.loadTasks('./modules/grunt-xqcoretest');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-bump');

	grunt.registerTask('default', 'lint');
	grunt.registerTask('doc', 'yuidoc');
	grunt.registerTask('test', 'xqcoretest');
	grunt.registerTask('build', [
		'jshint:files',
		'clean:build',
		'concat:dist',
		'jshint:afterconcat',
		'uglify',
		'copy:akonda',
		'copy:jam-libs',
		'bump:patch'
	]);
};