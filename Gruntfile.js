/* jshint indent: 4 */
'use strict';

var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'lodash'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('assemble');

    // configurable paths
    var yeomanConfig = {
        app: 'app', // dev app
        dist: 'dist', // dist for webap
        lib: 'lib', // dist for library
        ghpages: 'gh-pages'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        yeoman: yeomanConfig,
        site  : grunt.file.readYAML('_config.yml'),
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    '<%= yeoman.app %>/scripts/templates/*.{ejs,mustache,hbs}',
                    '<%= site.templates %>/**/*.{ejs,mustache,hbs}',
                    'test/spec/**/*.js',
                    '_config.*'
                ],
                tasks: [
                    'clean:server',
                    'assemble:dev'
                ]
            },
            jst: {
                files: [
                    '<%= yeoman.app %>/scripts/templates/*.ejs'
                ],
                tasks: ['jst']
            },
            test: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js', 'test/spec/**/*.js'],
                tasks: ['test:true']
            }
        },
        connect: {
            options: {
                port: SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            },
            ghpages: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.ghpages)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            },
            test: {
                path: 'http://localhost:<%= connect.test.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        requirejs: {
            dist: {
                options: {
                    baseUrl: '<%= yeoman.app %>/scripts',
                    mainConfigFile: '<%= yeoman.app %>/scripts/rconfig.js',
                    findNestedDependencies: true,
                    optimize: 'none', //uglify2',
                    paths: {
                        'almond': '../../app/bower_components/almond/almond',
                        'jquery': 'empty:' // module is stubbed/shimmed in the endFile Fragment of the Wrapper
                    },
                    almond: true,
                    name: 'gallery/app',
                    include: ['almond'],
                    out: '<%= yeoman.dist %>/scripts/gallery.pkgd.js',
                    wrap: {
                        startFile: '<%= yeoman.app %>/scripts/build/gallery.wrap.open.frag.js',
                        endFile: '<%= yeoman.app %>/scripts/build/gallery.wrap.close.frag.js'
                    }
                }
            }
        },
        uglify: {
            options: {
                banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %>, (c) ' +
                    '<%= grunt.template.today("yyyy") %> <%= pkg.author %>, ' +
                    'licenced under <%= pkg.licence %>\n' +
                    ' * see <%= pkg.repository.url %>\n' +
                    ' */\n',
                preserveComments: 'some'
            }
        },
        cssmin: {
            options: {
                banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %>, (c) ' +
                '<%= grunt.template.today("yyyy") %> <%= pkg.author %>, ' +
                'licenced under <%= pkg.licence %>\n' +
                ' * see <%= pkg.repository.url %>\n' +
                ' */\n',
            }
        },
        useminPrepare: {
            html: '<%= yeoman.dist %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                options: {
                    // http://stackoverflow.com/questions/21175673/grunt-contrib-imagemin-output-fatal-error-enoent-no-such-file-or-directory
                    cache: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: [
                        '{,*/}*.{png,jpg,jpeg}'
                    ],
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        assemble: {
            options: {
                flatten: true,
                // Metadata
                pkg: '<%= pkg %>',
                site: '<%= site %>',
                // data: ['<%= site.data %>'], // not used

                // Templates
                partials: '<%= site.includes %>',
                layoutdir: '<%= site.layouts %>',
                layout: '<%= site.layout %>',

                // Extensions
                // helpers: '<%= site.helpers %>', // not used
                // plugins: '<%= site.plugins %>'  // not used
            },
            dev: {
                options: {
                    production: false,
                    pdfService: '<%= site.pdf_service.dev %>'
                },
                files: {'.tmp/': ['<%= site.templates %>/*.hbs']}
            },
            dist: {
                options: {
                    production: true,
                    pdfService: '<%= site.pdf_service.dist %>'
                },
                files: {'<%= yeoman.dist %>/': ['<%= site.templates %>/*.hbs']}
            }
        },
        copy: {
            lib: {
                files: {
                    '<%= yeoman.lib %>/gallery.pkgd.js': [
                        '<%= yeoman.dist %>/scripts/gallery.pkgd.js'
                    ],
                    '<%= yeoman.lib %>/gallery.css': [
                        '<%= yeoman.dist %>/styles/gallery.css'
                    ]
                }
            },
            libMin: {
                files: {
                    '<%= yeoman.lib %>/gallery.pkgd.min.js': [
                        '<%= yeoman.dist %>/scripts/gallery.pkgd.js'
                    ],
                    '<%= yeoman.lib %>/gallery.min.css': [
                        '<%= yeoman.dist %>/styles/gallery.css'
                    ]
                }
            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,txt}',
                            '.htaccess',
                            'images/{,*/}*.{webp,gif,svg,png,gif,jpg}',
                            'styles/fonts/{,*/}*.*',
                            'scripts/main.js',
                            '*.json'
                        ]
                    }
                ]
            },
            ghpages: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.dist %>',
                    dest: '<%= yeoman.ghpages %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif,svg,png,gif,jpg}',
                        'scripts/**/*.js',
                        'styles/**/*.*', // also fonts
                        '*.json',
                        '*.html'
                    ]
                }]
            }
        },
        jst: {
            options: {
                amd: true
            },
            compile: {
                files: {
                    '.tmp/scripts/templates.js': ['<%= yeoman.app %>/scripts/templates/*.ejs']
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '/styles/fonts/{,*/}*.*',
                    ]
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg'],
                push: true,
                pushTo: 'origin',
                commitFiles: ['-a']
            }
        }
    });

    grunt.registerTask('createDefaultTemplate', function () {
        grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open:server', 'connect:dist:keepalive']);
        }

        if (target === 'test') {
            return grunt.task.run([
                'clean:server',
                'createDefaultTemplate',
                'jst',
                'connect:test',
                'open:test',
                'watch:livereload'
            ]);
        }

        if (target === 'ghpages') {
            return grunt.task.run(['open:server', 'connect:ghpages:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'assemble:dev',
            'createDefaultTemplate',
            'jst',
            'connect:livereload',
            'open:server',
            'watch'
        ]);
    });

    grunt.registerTask('test', function (isConnected) {
        isConnected = Boolean(isConnected);
        var testTasks = [
                'clean:server',
                'createDefaultTemplate',
                'jst',
                'connect:test',
                'mocha',
                'watch:test'
            ];
            
        if(!isConnected) {
            return grunt.task.run(testTasks);
        } else {
            // already connected so not going to connect again, remove the connect:test task
            testTasks.splice(testTasks.indexOf('connect:test'), 1);
            return grunt.task.run(testTasks);
        }
    });

    grunt.registerTask('build', function (target) {
        
        var buildTasks = [
            'jshint',
            'clean:dist',
            'assemble:dist',
            'createDefaultTemplate',
            'jst',
            'useminPrepare',
            'requirejs',
            'imagemin',
            // reinsert, when data-attribs for gallery opts are removed, as this
            // destroys json strings in data attribs through escaping
            // 'htmlmin', 
            'concat',
            'copy:lib',
            'cssmin',
            'uglify',
            'copy:libMin',
            'copy:dist',
            'rev',
            'usemin'
        ];

        if (target === 'ghpages') {
            buildTasks.push(
                'copy:ghpages'
            );
        }

        grunt.task.run(buildTasks);
    });

    grunt.registerTask('releaseLib', function (target) {
        if (target) {
            grunt.task.run([
                'bump-only:' + target,
                'build:dist',
                'bump-commit'
            ]);
        } else {
            grunt.warn('no target given for bump task. Has to be one of "patch", "minor", "mayor"');
        }
    });

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
