const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('default', () => {
    nodemon({
        script: 'app.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    })
});