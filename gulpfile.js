
  // Include gulp
  var gulp = require('gulp');

  // Include Our Plugins
  var jshint = require('gulp-jshint');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var nodemon = require('gulp-nodemon');
  var shell = require('gulp-shell'); 
  var jasmine = require('gulp-jasmine');
  var changed = require('gulp-changed');
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');
  var watch = require('gulp-watch');
  var compass = require('gulp-compass');
  var minifyCSS = require('gulp-minify-css');

   
  gulp.task('test', function () {
      return gulp.src('spec/test.js')
          .pipe(jasmine());
  });

  gulp.task('compass', function() {
    gulp.src('client/src/scss/*.scss')
      .pipe(compass({
        css: 'client/dist/css',
        sass: 'client/src/scss',
        sourcemap: true
      }))
      .pipe(minifyCSS())
      .pipe(gulp.dest('./client/dist/css'));
  });

  // Lint Task
  gulp.task('lint', function() {
      return gulp.src('client/src/**/*.js')
          .pipe(jshint())
          .pipe(jshint.reporter('default'));
  }); 


  // Concatenate & Minify JS
  gulp.task('scripts', function() {
    return gulp.src('client/src/**/*.js')
      .pipe(concat('all.js'))
      .pipe(gulp.dest('dist'))
      .pipe(rename('all.min.js')) 
      .pipe(gulp.dest('dist'));
  });


  gulp.task('docs', shell.task([ 
   'node_modules/jsdoc/jsdoc.js '+ 
     '-c docs/templates/minami/conf.json '+   // config file
     '-t docs/templates/minami '+    // template file
     '-d docs/dist '+                             // output directory
     './README.md ' +                              // to include README.md as index contents
     '-r ./server ./client'                              // source code directory
  ]));

  // Watch Files For Changes
  gulp.task('watch', function() {
    gulp.watch(['client/src/**/*.js', 'client/src/*.js'], ['lint', 'scripts']);
  });

  gulp.task("monitor-client", function(callback) {
    gulp.watch('client/src/js/**/*.js', ['webpack']);
    gulp.watch('client/src/js/**/*.jsx', ['webpack']);
  });

  gulp.task("monitor-styles", function(callback) {
    gulp.watch('client/src/scss/*.scss', ['compass']);
  });

  gulp.task("webpack", function(callback) {
    console.log("running.")
      // run webpack
      webpack({
        entry: './client/src/js/app.jsx',
        output: {
          path: '.client/dist/js/',
          filename: 'bundle.js'
        },
        devtool: 'source-map',
        module: {
          loaders: [
            {
              test: /\.jsx$/,
              loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            }
          ]
        },
        resolve: {
          extensions: ['', '.js', '.jsx']
        }
      }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        callback();
      });
  });

  gulp.task('fonts', function () {
    gulp.src('client/src/css/fonts/*.*')
      .pipe(changed('client/dist/css/fonts'))
      .pipe(gulp.dest('client/dist/css/fonts'))
  });

  gulp.task('dist', function () {
    gulp.src('client/src/index.html')
      .pipe(changed('client/dist', {extension: '.html'}))
      .pipe(gulp.dest('client/dist'))
  });

  gulp.task('img', function () {
    gulp.src('client/src/img/*.*')
      .pipe(changed('client/dist/img'))
      .pipe(gulp.dest('client/dist/img'))
  });

  gulp.task("nodemon", function(){
    nodemon({
      script: 'index.js'
    })
  });

  // Default Task
  gulp.task('default', ['test', 'scripts']);

  gulp.task('dev', ['webpack', 'dist', 'monitor-client', 'nodemon']);

  gulp.task('dev-styles', ['webpack', 'dist', 'fonts', 'img', 'monitor-client', 'monitor-styles', 'nodemon']);

  gulp.task('deploy', ['webpack']);
