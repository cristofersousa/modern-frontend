const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const babel       = require('gulp-babel');
const surge       = require('gulp-surge')



gulp.task('deploy', [], () => {
  return surge({
    project: './build',         // Path to your static build directory
    domain: 'example.surge.sh'  // Your domain or Surge subdomain
  })
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});


// Move the javascript files into our /src/js folder
gulp.task('js', () => {
     gulp.src(['node_modules/jquery/dist/jquery.min.js','node_modules/popper.js/dist//umd/popper.js', , 'node_modules/tether/dist/js/tether.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js' ])
        .pipe(browserSync.stream())
        .pipe(babel({
            presets: ['env']
        }))
      .pipe(gulp.dest("src/js"))
});


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], () => {

    browserSync.init({
        server: "./src"
    });

    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['js','serve']);
