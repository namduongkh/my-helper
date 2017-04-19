var nodemon = require('gulp-nodemon');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
var minify = require('gulp-minify');

gulp.task('nodemon', () => {
    nodemon({
        script: 'app.js',
        ext: 'js html scss json',
        env: {
            'NODE_ENV': 'development'
        }
    })
});

// process JS files and return the stream.
// js in client
gulp.task('js', function() {
    return gulp.src(['public/assets/js/*.js', 'app/modules/*/views/js/config.js', 'app/modules/*/views/js/*.js'])
        .pipe(concat('main.js'))
        .pipe(browserify())
        .pipe(minify())
        .pipe(gulp.dest('./public/assets/js'))
});

gulp.task('sass', function() {
    return gulp.src("app/modules/*/views/css/*.scss")
        .pipe(sass())
        .pipe(concatCss("main.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest("./public/assets/css"))
        .pipe(browserSync.stream());
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function(done) {
    browserSync.reload();
    done();
});

// use default task to launch Browsersync and watch JS files
// gulp.task('serve', ['js', 'sass'], function() {
//     // Serve files from the root of this project
//     browserSync.init({
//         server: {
//             baseDir: "./",
//             index: "./app/index.html",
//         }
//     });

//     // add browserSync.reload to the tasks array to make
//     // all browsers reload after tasks are complete.
//     gulp.watch(['app/js/*/*js', 'app/js/*js'], ['js-watch']);
//     gulp.watch("app/css/*.scss", ['sass']);
//     gulp.watch("app/*.html").on('change', browserSync.reload);
// });

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        // files: ["public/**/*.*", "modules/**/*.*"],
        // browser: "google chrome",
        port: 3090
    });
});

gulp.task('default', ['nodemon', 'browser-sync', 'sass', 'js'], function() {
    gulp.watch('app/modules/*/views/css/*.scss', ['sass']);
    gulp.watch(['public/assets/js/*.js', 'app/modules/*/views/js/config.js', 'app/modules/*/views/js/*.js'], ['js']);
    gulp.watch(['app/views/layouts/**/*.html', 'app/modules/**/*.html']).on('change', browserSync.reload);
});