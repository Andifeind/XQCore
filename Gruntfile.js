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
                    'src/xqcore-core.js',
                    'src/utils/xqcore-utils.js',
                    'src/xqcore-logger.js',
                    'src/xqcore-event.js',
                    'src/xqcore-readystate.js',
                    'src/sync/xqcore-sync.js',
                    'src/xqcore-presenter.js',
                    'src/xqcore-model.js',
                    'src/getset/xqcore-getset.js',
                    'src/tmpl/xqcore-tmpl.js',
                    'src/xqcore-view.js',
                    'src/xqcore-utils-browser.js',
                    'src/xqcore-router.js',
                    'src/xqcore-socket-connection.js',
                    'src/xqcore-socket.js',
                    'src/syncmodel/xqcore-syncmodel.js',
                    'src/list/xqcore-list.js',
                    'src/synclist/xqcore-synclist.js',
                    'src/xqcore-service.js'
                ],
                dest: 'xqcore.js'
            }
        },
        uglify: {
            options: {
                preserveComments: 'some'
            },
            build: {
                files: {
                    'xqcore.min.js': ['xqcore.js']
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
                        src: ['xqcore.js'],
                        dest: '../component-builds/xqcore/xqcore.js'
                    }, {
                        src: ['component.json'],
                        dest: '../component-builds/xqcore/',
                    }, {
                        src: ['xqcore.css'],
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
                        src: ['xqcore.css'],
                        dest: '../component-builds/xqcore/xqcore.css'
                    }
                ]
            },
        },
        less: {
            dist: {
                options: {
                    paths: 'less/'
                },
                files: {
                    'xqcore.css': 'less/main.less'
                }
            }
        },
        release: {
            options: {
                npm: true, //default: true
                indentation: '    ', //default: '  ' (two spaces)
                tagName: 'v<%= version %>', //default: '<%= version %>'
                commitMessage: 'Release v<%= version %>', //default: 'release <%= version %>'
                tagMessage: 'Tagging release v<%= version %>', //default: 'Version <%= version %>',
                beforeRelease: ['build']
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

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-available-tasks');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-version');
    
    grunt.registerTask('default', ['availabletasks']);
    grunt.registerTask('test', 'xqcoretest');
    grunt.registerTask('build', [
        'less',
        'jshint:files',
        'concat:build',
        'uglify',
        'bumpup:prerelease'
    ]);
};
