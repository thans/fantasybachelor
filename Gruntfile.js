module.exports = function(grunt) {

    grunt.initConfig({
        useminPrepare: {
            html: 'build/public/index.ejs',
            options: {
                dest: 'build/public',
                staging: 'build/.tmp'
            }
        },
        usemin: {
            html: 'build/public/index.ejs'
        },
        clean: {
            all: 'build',
            js: 'build/public/js/*',
            css: 'build/public/css/*',
            sass: 'build/public/sass',
            images: 'build/public/images',
            html: ['build/public/views/*', 'build/public/index.ejs'],
            components: 'build/components',
            server: 'build/server'
        },
        copy: {
            all: {
                files: [
                    {
                        expand: true,
                        dest: 'build',
                        cwd: 'src',
                        src: ['**/*']
                    },
                    {
                        expand: true,
                        dest: 'build/public/components',
                        cwd: 'bower_components',
                        src: ['**/*']
                    },
                    {
                        expand: true,
                        dest: 'build/public/images',
                        cwd: 'src/public/images/compressed',
                        src: ['**/*']
                    }
                ]
            },
            js: {
                expand: true,
                dest: 'build/public/js',
                cwd: 'src/public/js',
                src: ['**/*.js']
            },
            sass: {
                expand: true,
                dest: 'build/public/sass',
                cwd: 'src/public/sass',
                src: ['**/*.scss']
            },
            html: {
                files : [
                    {
                        expand: true,
                        dest: 'build/public/views',
                        cwd: 'src/public/views',
                        src: ['**/*.ejs']
                    },
                    {
                        expand: true,
                        dest: 'build/public',
                        cwd: 'src/public',
                        src: ['index.ejs']
                    }
                ]
            },
            components: {
                expand: true,
                dest: 'build/public/components',
                cwd: 'bower_components',
                src: ['**/*']
            },
            server: {
                expand: true,
                dest: 'build/server',
                cwd: 'src/server',
                src: ['**/*']
            },
            images: {
                expand: true,
                dest: 'build/public/images',
                cwd: 'src/public/images/compressed',
                src: ['**/*']
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'build/public/sass',
                    src: ['*.scss'],
                    dest: 'build/public/css',
                    ext: '.css'
                }]
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'build/public/sass',
                    cssDir: 'build/public/css'
                }
            }
        },
        watch: {
            js: {
                files: ['src/public/**/*.js'],
                tasks: ['clean:js', 'copy:js'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['src/public/**/*.scss'],
                tasks: ['clean:css', 'clean:sass', 'copy:sass', 'compass'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['src/public/**/*.ejs', 'src/public/**/*.html'],
                tasks: ['clean:html', 'copy:html'],
                options: {
                    livereload: true
                }
            },
            server: {
                files: ['src/server/**/*'],
                tasks: ['clean:server', 'copy:server'],
                options: {
                    livereload: true
                }
            },
            rebooted: {
                files: ['.rebooted'],
                options: {
                    livereload: true
                }
            },
            images: {
                files: ['src/public/images/**/*'],
                tasks: ['clean:images', 'copy:images'],
                options: {
                    livereload: true
                }
            }
        },
        'node-inspector': {
            dev: {
                options: {
                    'web-port': 5859
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'node-inspector:dev', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'build/server/server.js',
                options: {
                    nodeArgs: ['--debug', '--debug-brk'],
                    watch: ['build/server/**/*'],

                    callback: function (nodemon) {

                        // opens browser on initial server start
                        nodemon.on('config:update', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('open')('http://localhost:5859/debug?port=5858');
                                require('open')('http://localhost:8000');
                            }, 1000);
                        });

                        // refreshes browser when server reboots
                        nodemon.on('restart', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },
            dev: {
            }
        }
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-env');

    grunt.registerTask('default', ['clean:all', 'copy:all', 'compass', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin']);
    grunt.registerTask('debug', ['clean:all', 'copy:all', 'compass', 'env:dev', 'concurrent:dev']);

};