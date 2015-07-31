  // I believe you only minify the client code!
  // Since you don't send over the server code.. so you don't need to!

  // Include gulp
  var gulp = require('gulp');

  // Include Our Plugins
  var jshint = require('gulp-jshint');
  //var sass = require('gulp-sass');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var shell = require('gulp-shell'); 
  var jasmine = require('gulp-jasmine');
  var gulp = require('gulp');
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
    gulp.src('client/scss/*.scss')
      .pipe(compass({
        css: 'client/css',
        sass: 'client/scss'
      }))
      .pipe(minifyCSS())
      .pipe(gulp.dest('./client/css'));
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
  });


  gulp.task("monitor-client", function(callback) {
      gulp.watch('client/js/**/*.js', ['webpack']);
      gulp.watch('client/js/**/*.jsx', ['webpack']);
  });

  gulp.task("monitor-styles", function(callback) {
      gulp.watch('client/scss/*.scss', ['compass']);
  });

  gulp.task("webpack", function(callback) {
    console.log("running.")
      // run webpack
      webpack({
          entry: './client/js/app.jsx',
          output: {
            path: './client/build/',
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
          // gutil.log("[webpack]", stats.toString({
          //     // output options
          // }));
          callback();
      });
  });


  // Default Task
  gulp.task('default', ['test', 'scripts']);


  gulp.task('dev', ['monitor-client']);

  gulp.task('dev-styles', ['monitor-client', 'monitor-styles']);


