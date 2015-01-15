module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json'),
        version = pkg.version.replace(/-\d+$/g, '');

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,

        availabletasks: {
            tasks: {}
        },
        bumpup: {
            files: 'package.json',
            dateformat: 'YYYY-MM-DD HH:mm:ss Z',
            normalize: true
        },
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
                    'src/list/xqcore-list.js',
                    'src/synclist/xqcore-synclist.js'
                ],
                dest: 'build/xqcore.js'
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
                        dest: '../component-builds/xqcore/xqcore.js'
                    }, {
                        src: ['component.json'],
                        dest: '../component-builds/xqcore/',
                    }, {
                        src: ['build/xqcore.css'],
                        dest: '../component-builds/xqcore/xqcore.css'
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
            },
            styles: {
                options: {
                    processContent: function (content, srcpath) {
                        return content.replace('<%= version %>', version);
                    }
                },
                files: [
                    {
                        src: ['build/xqcore.css'],
                        dest: '../component-builds/xqcore/xqcore.css'
                    }
                ]
            },
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
                options: {
                    beautifyCode: true
                },
                files: {
                    'docs/': ['src/**/*.js']
                }
            }
        },
        less: {
            dist: {
                options: {
                    paths: 'less/'
                },
                files: {
                    'build/xqcore.css': 'less/main.less'
                }
            }
        },
        version: {
            component: {
                src: ['../component-builds/xqcore/component.json']
            }
        },
        watch: {
            js: {
                files: 'src/**/*.js',
                tasks: ['build']
            },
            styles: {

                files: 'less/*.less',
                tasks: ['less', 'copy:styles']
            }
        }
    });

    // grunt.loadTasks('./modules/grunt-xqcoretest');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-available-tasks');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-doxit');
    // grunt.loadNpmTasks('grunt-simple-dox');
    grunt.loadNpmTasks('grunt-version');

    // grunt.loadNpmTasks('grunt-contrib-bump');
    
    grunt.registerTask('default', ['availabletasks']);
    grunt.registerTask('doc', 'doxit');
    grunt.registerTask('test', 'xqcoretest');
    grunt.registerTask('build', [
        'less',
        'jshint:files',
        'clean:build',
        'concat:build',
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