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
  var shell = require('gulp-shell'); 
  var jasmine = require('gulp-jasmine');
   
  gulp.task('test', function () {
      return gulp.src('spec/test.js')
          .pipe(jasmine());
  });

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

  // Concatenate & Minify JS
  gulp.task('scripts', function() {
      return gulp.src('client/**/*.js')
          .pipe(concat('all.js'))
          .pipe(gulp.dest('dist'))
          .pipe(rename('all.min.js')) 
          .pipe(gulp.dest('dist'));
  });

  // gulp.task('test', function(done){
  //   //start jasmine 
  // });

  gulp.task('docs', shell.task([ 
   'node_modules/jsdoc/jsdoc.js '+ 
     //'-c docs/templates/jaguar/conf.json '+   // config file
     //'-t docs/templates/jaguar '+    // template file
     '-c docs/templates/minami/conf.json '+   // config file
     '-t docs/templates/minami '+    // template file
     '-d docs/dist '+                             // output directory
     './README.md ' +                              // to include README.md as index contents
     '-r ./server ./client'                              // source code directory
  ]));

  // Watch Files For Changes
  gulp.task('watch', function() {
      gulp.watch(['client/**/*.js', 'client/*.js'], ['lint', 'scripts']);
      //gulp.watch('scss/*.scss', ['sass']);
  });

  // Default Task
  gulp.task('default', ['test', 'scripts', 'watch']);
