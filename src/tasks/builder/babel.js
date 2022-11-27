import { relative } from 'node:path'

import mapSources from '@gulp-sourcemaps/map-sources'
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
      { dot: true, since: gulp.lastRun(babel), sourcemaps: true },
    )
    .pipe(gulpBabel({ ...babelConfig, babelrc: false }))
    .pipe(mapSources((path) => `${relative(path, '.')}/${path}`))
    .pipe(gulp.dest(BUILD, { sourcemaps: '.' }))
