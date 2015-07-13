// I believe you only minify the client code!
// Since you don't send over the server code.. so you don't need to!

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
//var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jsdoc = require("gulp-jsdoc");
 


// Lint Task
gulp.task('lint', function() {
    return gulp.src('client/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
// gulp.task('sass', function() {
//     return gulp.src('scss/*.scss')
//         .pipe(sass())
//         .pipe(gulp.dest('css'));
// });
gulp.task('document', function() {
    gulp.src("./server/**/*.js")
      .pipe(jsdoc('./documentation-output'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('client/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['client/**/*.js', 'client/*.js'], ['lint', 'scripts']);
    //gulp.watch('scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'watch']);
