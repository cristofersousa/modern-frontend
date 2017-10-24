const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const babel       = require('gulp-babel');
const surge       = require('gulp-surge');
const runSequence = require('run-sequence');



gulp.task('deploy', ['build'], () => {
  return surge({
    project: './src',         // Path to your static build directory
    domain: 'ifsp.surge.sh'  // Your domain or Surge subdomain
  })
});

gulp.task('build', () =>
    runSequence([
        'sass',
        'js'
    ])
)

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});


// Move the javascript files into our /src/js folder
gulp.task('js', () => runSequence(['js:files' , 'js:vendor']))

gulp.task('js:files', () => {
    let files = [
        'js/helpers.js'
    ]

    return gulp.src(files)
        .pipe(browserSync.stream())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest("src/js"))
});

gulp.task('js:vendor', () => {
    let vendors = [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/popper.js/dist/umd/popper.js',
        'node_modules/tether/dist/js/tether.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ]

    return gulp.src(vendors)
        .pipe(gulp.dest('src/js'))
})


// Static Server + watching scss/html files
gulp.task('serve', () => {
    browserSync.init({
        server: "./src"
    });

    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['build', 'serve']);
