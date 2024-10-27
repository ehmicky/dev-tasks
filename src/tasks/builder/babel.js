import { pipeline } from 'node:stream/promises'

import gulp from 'gulp'
import gulpBabel from 'gulp-babel'

import {
  BUILD,
  JAVASCRIPT_EXTS_STR,
  SOURCES_GLOB,
  TYPESCRIPT_AMBIENT_EXT,
  TYPESCRIPT_EXT,
  TYPESCRIPT_TESTS_EXT,
} from '../../files.js'

import babelConfig from './.babelrc.js'

export const babel = () =>
  pipeline(
    gulp.src(
      [
        `${SOURCES_GLOB}/*.{${JAVASCRIPT_EXTS_STR},${TYPESCRIPT_EXT}}`,
        `!${SOURCES_GLOB}/*.{${TYPESCRIPT_AMBIENT_EXT},${TYPESCRIPT_TESTS_EXT}}`,
      ],
      { dot: true, since: gulp.lastRun(babel) },
    ),
    gulpBabel({ ...babelConfig, babelrc: false }),
    gulp.dest(BUILD),
  )
