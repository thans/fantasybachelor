var fs = require('fs');
var nconf = require('nconf');
nconf
    .argv()
    .env()
    .file(__dirname + '/config/' + process.env.NODE_ENV + '.json')
    .file('resources', __dirname + '/config/resources.json')
    .load();

// console.log(nconf.get());

var config = nconf.get();

config.PACKAGE = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8'));

module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json');
    var javascript = grunt.file.readJSON('config/resources.json').RESOURCES.JAVASCRIPT;
    for (var i = 0; i < javascript.length; i++) {
        javascript[i] = 'build/tmp/' + javascript[i];
    }
    grunt.initConfig({
        pkg: pkg,
        config: config,
        clean: {
            all: 'build',
            js: 'build/public/js/*',
            css: 'build/public/css/*',
            sass: 'build/tmp/sass',
            images: 'build/public/images',
            html: ['build/public/views/*', 'build/public/index.ejs'],
            components: 'build/components',
            server: 'build/server'
        },
        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        dest: 'build/public/js',
                        cwd: 'src/public/js',
                        src: ['**/*.js']
                    },
                    {
                        expand: true,
                        dest: 'build/tmp/sass',
                        cwd: 'src/public/sass',
                        src: ['**/*.scss']
                    },
                    {
                        expand: true,
                        dest: 'build/server',
                        cwd: 'src/server',
                        src: ['**/*']
                    },
                    {
                        expand: true,
                        dest: 'build/server/config',
                        cwd: 'config',
                        src: ['**']
                    },
                    {
                        expand: true,
                        dest: 'build/server/config',
                        src: ['package.json']
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
                        cwd: 'src/public/images/scaled',
                        src: ['**/*']
                    }
                ]
            },
            prod: {
                files: [
                    {
                        expand: true,
                        dest: 'build/tmp/js',
                        cwd: 'src/public/js',
                        src: ['**/*.js']
                    },
                    {
                        expand: true,
                        dest: 'build/tmp/sass',
                        cwd: 'src/public/sass',
                        src: ['**/*.scss']
                    },
                    {
                        expand: true,
                        dest: 'build/server',
                        cwd: 'src/server',
                        src: ['**/*']
                    },
                    {
                        expand: true,
                        dest: 'build/server/config',
                        cwd: 'config',
                        src: ['**']
                    },
                    {
                        expand: true,
                        dest: 'build/server/config',
                        src: ['package.json']
                    },
                    {
                        expand: true,
                        dest: 'build/tmp/components',
                        cwd: 'bower_components',
                        src: ['**/*']
                    },
                    {
                        expand: true,
                        dest: 'build/tmp/images',
                        cwd: 'src/public/images/scaled',
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
                dest: 'build/tmp/sass',
                cwd: 'src/public/sass',
                src: ['**/*.scss']
            },
            components: {
                expand: true,
                dest: 'build/public/components',
                cwd: 'bower_components',
                src: ['**']
            },
            ejs: {
                expand: true,
                dest: 'build/server/views',
                cwd: 'src/server/views',
                src: ['**/*.ejs']
            },
            server: {
                expand: true,
                dest: 'build/server',
                cwd: 'src/server',
                src: ['**', '!views/**/*.ejs']
            },
            config: {
                expand: true,
                dest: 'build/server/config',
                cwd: 'config',
                src: ['**']
            },
            images: {
                expand: true,
                dest: 'build/public/images',
                cwd: 'src/public/images/scaled',
                src: ['**']
            },
            nonGzipIndex: {
                dest: 'build/public/views/index.nonGzip.html',
                src: 'build/public/views/index.html'
            }
        },
        compass: {
            prod: {
                options: {
                    sassDir: 'build/tmp/sass',
                    cssDir: 'build/tmp/css',
                    imagesDir: 'build/tmp/images',
                    httpGeneratedImagesPath: '<%= config.RESOURCES_URL %>/<%= pkg.version %>/images',
                    assetCacheBuster: false
                }
            },
            dev: {
                options: {
                    sassDir: 'build/tmp/sass',
                    cssDir: 'build/public/css',
                    imagesDir: 'build/public/images',
                    httpGeneratedImagesPath: '<%= config.RESOURCES_URL %>/<%= pkg.version %>/images',
                    assetCacheBuster: false
                }
            }
        },
        watch: {
            js: {
                files: ['src/public/**/*.js'],
                tasks: ['copy:js'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['src/public/**/*.scss'],
                tasks: ['copy:sass', 'compass:dev'],
                options: {
                    livereload: true
                }
            },
            server: {
                files: ['src/server/**/*', '!src/server/views/**/*.ejs'],
                tasks: ['copy:server'],
                options: {
                    livereload: true
                }
            },
            ejs: {
                files: ['src/server/views/**/*.ejs'],
                tasks: ['copy:ejs'],
                options: {
                    livereload: true
                }
            },
            config: {
                files: ['config/**/*'],
                tasks: ['copy:config'],
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
                tasks: ['copy:images'],
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
                    args: ['debug'],
                    // nodeArgs: ['--debug', '--debug-brk'],
                    watch: ['build/server/**/*'],

                    callback: function (nodemon) {

                        // opens browser on initial server start
                        nodemon.on('config:update', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('open')('http://localhost:5859/debug?port=5858');
                                require('open')('http://localhost:' + config.PORT);
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
        imagemin: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'build/tmp/images',
                    src: ['**/*.{png,jpg,gif,svg,ico}'],
                    dest: 'build/public/images/'
                }]
            }
        },
        concat: {
            prod: {
                src: javascript,
                dest: 'build/tmp/js/app.cat.js'
            }
        },
        uglify: {
            prod: {
                files: [{
                    expand: true,
                    cwd: 'build/tmp/js',
                    src: ['app.cat.js'],
                    dest: 'build/public/js',
                    ext: '.min.js'
                }]
            }
        },
        cssmin: {
            prod: {
                files: [{
                    expand: true,
                    cwd: 'build/tmp/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build/public/css',
                    ext: '.min.css'
                }]
            }
        },
        ejs: {
            prod : {
                options: {
                    config: config
                },
                cwd: 'src/server/views',
                src: ['**/*.ejs'],
                dest: 'build/public/views',
                expand: true,
                ext: '.html'
            }
        },
        aws_s3: {
            prod: {
                options: {
                    accessKeyId: '<%= config.AWS.ACCESS_KEY %>',
                    secretAccessKey: '<%= config.AWS.ACCESS_SECRET %>',
                    action: 'upload',
                    bucket: 'resources.fantasybach.com',
                    region: 'us-west-2',
                    uploadConcurrency: 4,
                    gzip: true,
                    excludeFromGzip: ['*.png', '*.jpg', '*.jpeg', '*.ico', '*.gif'],
                    params: {
                        CacheControl: 'public, max-age=86400'
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: 'build/public',
                        src: ['**', '!**/*.html'],
                        dest: '<%= pkg.version %>/'
                    },
                    {
                        expand: true,
                        cwd: 'build/public',
                        src: ['**/*.html'],
                        dest: '<%= pkg.version %>/',
                        ext: ''
                    }
                ]
            },
            prod2: {
                options: {
                    accessKeyId: '<%= config.AWS.ACCESS_KEY %>',
                    secretAccessKey: '<%= config.AWS.ACCESS_SECRET %>',
                    action: 'upload',
                    bucket: 'fantasybach.com',
                    region: 'us-west-2',
                    uploadConcurrency: 4,
                    gzip: true,
                    params: {
                        CacheControl: 'public, max-age=86400'
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: 'build/public/views',
                        src: ['index.html'],
                        dest: ''
                    }
                ]
            },
            prod3: {
                options: {
                    accessKeyId: '<%= config.AWS.ACCESS_KEY %>',
                    secretAccessKey: '<%= config.AWS.ACCESS_SECRET %>',
                    action: 'upload',
                    bucket: 'fantasybach.com',
                    region: 'us-west-2',
                    uploadConcurrency: 4,
                    gzip: false,
                    params: {
                        CacheControl: 'public, max-age=86400'
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: 'build/public/views',
                        src: ['index.nonGzip.html'],
                        dest: ''
                    }
                ]
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
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-aws-s3-gzip');
    grunt.loadNpmTasks('grunt-ejs');

    grunt.registerTask('build:production', ['clean:all', 'copy:prod', 'compass:prod', 'imagemin', 'concat:prod', 'uglify:prod', 'cssmin:prod', 'ejs:prod', 'copy:nonGzipIndex', 'aws_s3:prod', 'aws_s3:prod2', 'aws_s3:prod3']);
    grunt.registerTask('build:development', ['clean:all', 'copy:dev', 'compass:dev', 'concurrent:dev']);
};
