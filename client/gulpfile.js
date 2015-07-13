var gulp = require('gulp');
var serve = require('gulp-serve');
 
gulp.task('serve', serve(''));
gulp.task('serve-build', serve(['', 'build']));
gulp.task('serve-prod', serve({
  root: ['', 'build'],
  port: 80,
  middleware: function(req, res) {
    // custom optional middleware 
  }
}));

//run 'gulp serve' to start server 