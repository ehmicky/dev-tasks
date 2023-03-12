import gulp from 'gulp'
import gulpBabel from 'gulp-babel'

import {
  SOURCES_GLOB,
  BUILD,
  JAVASCRIPT_EXTS_STR,
  TYPESCRIPT_EXT,
  TYPESCRIPT_AMBIENT_EXT,
  TYPESCRIPT_TESTS_EXT,
} from '../../files.js'

import babelConfig from './.babelrc.js'

export const babel = () =>
  gulp
    .src(
      [
        `${SOURCES_GLOB}/*.{${JAVASCRIPT_EXTS_STR},${TYPESCRIPT_EXT}}`,
        `!${SOURCES_GLOB}/*.{${TYPESCRIPT_AMBIENT_EXT},${TYPESCRIPT_TESTS_EXT}}`,
      ],
      { dot: true, since: gulp.lastRun(babel) },
    )
    .pipe(gulpBabel({ ...babelConfig, babelrc: false }))
    .pipe(gulp.dest(BUILD))
