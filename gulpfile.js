// gulp
const gulp = require('gulp');
// gulp-sass
const sass = require('gulp-sass');
// Autoprefixer
const autoprefixer = require('gulp-autoprefixer');
// BrowserSync
const browserSync = require('browser-sync');
// eslint
const eslint = require('gulp-eslint');
// Concat
const contact = require('gulp-concat');
// connect php
const connect = require('gulp-connect-php');


// Default setup
gulp.task('default', ['styles', 'js', 'lint', 'copy-html', 'copy-images', 'copy-js', 'copy-php'], function() {
// watch all files
	gulp.watch('sass/**/*.scss', ['styles']).on('change', browserSync.reload);
	gulp.watch('js-production/**/*.js', ['js']).on('change', browserSync.reload);
	gulp.watch('js-production/**/*.js', ['lint']).on('change', browserSync.reload);
	gulp.watch('*.html', ['copy-html']).on('change', browserSync.reload);
	gulp.watch('*.html', ['copy-php']).on('change', browserSync.reload);
	gulp.watch('img/*', ['copy-images']).on('change', browserSync.reload);
	gulp.watch('js-production/*', ['copy-js']).on('change', browserSync.reload);
	gulp.watch('*.html').on('change', browserSync.reload);
	gulp.watch('sass/*').on('change', browserSync.reload);

	// call the BrowserSync
	// browserSync.init({
	//	server: './'
	// });
}); // end gulp Default setup

gulp.task('sync', function() {
	connect.server({}, function() {
		gulp.watch('sass/**/*.scss', ['styles']).on('change', browserSync.reload);
		gulp.watch('js-production/**/*.js', ['js']).on('change', browserSync.reload);
		gulp.watch('js-production/**/*.js', ['lint']).on('change', browserSync.reload);
		gulp.watch('*.html', ['copy-html']).on('change', browserSync.reload);
		gulp.watch('img/*', ['copy-images']).on('change', browserSync.reload);
		gulp.watch('js-production/**/*.js', ['copy-js']).on('change', browserSync.reload);
		gulp.watch('*.html').on('change', browserSync.reload);
		gulp.watch('**/*.php').on('change', browserSync.reload);
		gulp.watch('sass/*').on('change', browserSync.reload);
		browserSync({
			proxy: '127.0.0.1:8000'
		});
	});

	gulp.watch('**/*.php').on('change', function() {
		browserSync.reload();
	});
});

// lint
gulp.task('lint', function() {
	return (
		gulp
			.src(['js-production/**/*.js'])
			// eslint() attaches the lint output to the eslint property
			// of the file object so it can be used by other modules.
			.pipe(eslint())
			// eslint.format() outputs the lint results to the console.
			// Alternatively use eslint.formatEach() (see Docs).
			.pipe(eslint.format())
			// To have the process exit with an error code (1) on
			// lint error, return the stream and pipe to failOnError last.
			.pipe(eslint.failOnError())
	);
});

// styles
gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(contact('app.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(gulp.dest('css'))
		.pipe(browserSync.stream());
});

// js
gulp.task('js', function() {
	gulp.src('js-production/**/*.js')
		.pipe(contact('app.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(gulp.dest('js'));
});

gulp.task('copy-js', function() {
	gulp.src('js-production/**/*.js')
		.pipe(contact('app.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream());
});

// copy html
gulp.task('copy-html', function() {
	gulp.src('./*.html')
		.pipe(gulp.dest('./dist'));
});

// copy php
gulp.task('copy-php', function() {
	gulp.src('./*.php')
		.pipe(gulp.dest('./dist'));
});

// copy images
gulp.task('copy-images', function() {
	gulp.src('img/**/*')
		.pipe(gulp.dest('dist/img'));
});

// copy parts
gulp.task('copy-inc', function() {
	gulp.src('inc/**/*')
		.pipe(gulp.dest('dist/inc'));
});