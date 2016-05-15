var gulp = require('gulp');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var ejs = require('gulp-ejs');
var imagemin = require('gulp-imagemin');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var server = require('gulp-server-livereload');
var livereload = require('gulp-livereload');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var svgMin = require('gulp-svgmin');
var inlineSvg = require('gulp-inline-svg');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var browserify = require('browserify');
var envify = require('envify');
var watchify = require('watchify');
var _ = require('lodash');
var s3Upload = require('./customGulpPlugins/s3Upload');
var cloudFrontInvalidation = require('./customGulpPlugins/cloudFrontInvalidation');

var env;
var ENV = {
    DEV : 'dev',
    PROD : 'prod'
};
var version = require('./package.json').version;
var baseUrl;
var resourcesUrl;
var serverPort = '8000';

var files = {
    views : [ 'src/views/**/*.ejs', '!src/views/index.ejs' ],
    indexView : 'src/views/index.ejs',
    sass : 'src/sass/**/*.scss',
    app : 'src/js/app.js',
    js : 'src/js/**/*.js',
    favicon : 'src/images/favicon.ico',
    icons : 'src/icons/**/*.svg',
    textures : 'src/images/scaled/textures/**/*.jpg'
};

TEMPLATE_MODULE = 'FantasyBach.templateCache';
TEMPLATE_HEADER = 'import angular from "angular"; export default angular.module("<%= module %>", []).run(["$templateCache", function($templateCache) {';
TEMPLATE_FOOTER = '}]).name;';

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('indexView', function() {
    verifyEnvSet();
    return gulp.src(files.indexView)
        .pipe(ejs({
            version : version,
            resourcesUrl : resourcesUrl
        }, {
            ext : '.html'
        }))
        .pipe(gulp.dest('build'))
        .pipe(livereload());
});

gulp.task('views', function() {
    verifyEnvSet();
    return gulp.src(files.views)
        .pipe(ejs({
            version : version,
            resourcesUrl : resourcesUrl
        }, {
            ext : '.html'
        }))
        .pipe(templateCache({
            module : TEMPLATE_MODULE,
            templateHeader : TEMPLATE_HEADER,
            templateFooter : TEMPLATE_FOOTER
        }))
        .pipe(gulp.dest('src/js/build'))
        .pipe(livereload());
});

gulp.task('favicon', function() {
    return gulp.src(files.favicon)
        .pipe(gulp.dest('./build/images'));
});

gulp.task('icons', function() {
    verifyEnvSet();
    return gulp.src(files.icons)
        .pipe(svgMin())
        .pipe(inlineSvg({
            filename: '_icons.scss'
        }))
        .pipe(gulp.dest('src/sass/build'))
        .pipe(livereload());
});

gulp.task('sass', ['icons'], function() {
    verifyEnvSet();
    return gulp.src(files.sass)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({
            timeout : 15
        }))
        .pipe(env === ENV.DEV ? sourcemaps.write() : gutil.noop())
        .pipe(rename({
            extname : '.min.css'
        }))
        .pipe(gulp.dest('build/css'))
        .pipe(livereload());
});

gulp.task('watch', function() {
    livereload.listen();

    gulp.watch(files.indexView, ['indexView']);
    gulp.watch(files.views, ['views']);
    gulp.watch(files.sass, ['sass']);
    gulp.watch(files.icons, ['icons']);

    // Uses watchify
    // gulp.watch(files.js, ['bundle']);
});

gulp.task('bundle', [ 'views' ], function() {
    verifyEnvSet();

    var isDev = env === ENV.DEV;

    var bundler = browserify({
        entries: [files.app],
        debug: isDev,
        cache: {}, // required for watchify
        packageCache: {}, // required for watchify
        fullPaths: isDev, // required to be true only for watchify
        sourceType: 'module' // required for ES6
    });
    if (isDev) {
        bundler = watchify(bundler);
    }
    bundler
        .transform(babelify, { presets : ['es2015'] })
        .transform(envify);

    bundler.on('update', bundle); // on any dep update, runs the bundler
    bundler.on('log', gutil.log); // output build logs to terminal
    return bundle();

    function bundle() {
        return bundler.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(ngAnnotate())
            .pipe(isDev ? gutil.noop() : uglify({ mangle : true }))
            .pipe(isDev ? sourcemaps.write() : gutil.noop())
            .pipe(rename({
                extname : '.min.js'
            }))
            .pipe(gulp.dest('build/js'))
            .pipe(livereload());
    }
});

gulp.task('server', function() {
    return gulp.src('build')
        .pipe(server({
            livereload : false,
            port : serverPort
        }));
});

var verifyEnvSet = function() {
    if (env) { return; }
    throw new Error('Environment not set. Please run "env.dev" or "env.prod" before this task.');
};

gulp.task('env.dev', function() {
    env = ENV.DEV;
    process.env.NODE_ENV = 'development';
    baseUrl = 'http://localhost:' + serverPort;
    resourcesUrl = baseUrl;
});

gulp.task('env.prod', function() {
    env = ENV.PROD;
    process.env.NODE_ENV = 'production';
    process.env.AWS_PROFILE = 'fantasy-bach';
    baseUrl = 'https://resources.fantasybach.com';
    resourcesUrl = baseUrl + '/' + version;
});

gulp.task('s3Upload.index', [ 'indexView' ], function() {
    verifyEnvSet();
    return gulp.src('build/index.html')
        .pipe(s3Upload({
            region : 'us-west-2',
            bucket : 'fantasybach.com'
        }));
});

gulp.task('s3Upload.resources', [ 'favicon', 'views', 'sass', 'bundle' ], function() {
    verifyEnvSet();
    return gulp.src([ 'build/**', '!build/index.html'])
        .pipe(s3Upload({
            region : 'us-west-2',
            baseUrl : '/' + version,
            bucket : 'resources.fantasybach.com'
        }));
});

gulp.task('s3Upload', [ 's3Upload.index', 's3Upload.resources']);

gulp.task('cloudFrontInvalidation', [ 's3Upload.index' ], function() {
    verifyEnvSet();
    return gulp.src('build/index.html')
        .pipe(cloudFrontInvalidation({
            region : 'us-west-2',
            distributionId : 'E2UF7SN1N7PFM3'
        }));
});

gulp.task('develop', ['env.dev', 'watch', 'favicon', 'indexView', 'views', 'sass', 'bundle', 'server']);
gulp.task('deploy', ['env.prod', 'favicon', 'indexView', 'views', 'sass', 'bundle', 's3Upload', 'cloudFrontInvalidation']);