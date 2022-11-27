import { relative } from 'node:path'

import mapSources from '@gulp-sourcemaps/map-sources'
import { deleteAsync } from 'del'
import gulp from 'gulp'
import gulpBabel from 'gulp-babel'

import {
  BUILD_SOURCES,
  BUILD,
  GENERATED_SOURCES_DIR,
  JAVASCRIPT_EXTS_STR,
} from '../../files.js'
import { getWatchTask } from '../../watch.js'

import babelConfig from './.babelrc.js'

const SOURCES_GLOB = `{${BUILD_SOURCES.join(',')}}/**`
const SOURCES_ONLY_GLOB = `${GENERATED_SOURCES_DIR}/**`

// We remove files deeply but leave empty [sub]directories. Otherwise it creates
// issues with `chokidar` (file watching used by `ava --watch` and
// `gulp.watch()`)
const clean = () => deleteAsync(`${BUILD}/**`, { onlyFiles: true })

const copy = () =>
  gulp
    .src(
      [
        `${SOURCES_GLOB}/*[^~]`,
        `!${SOURCES_GLOB}/*.{${JAVASCRIPT_EXTS_STR}}`,
        `!${SOURCES_ONLY_GLOB}`,
      ],
      { dot: true, since: gulp.lastRun(copy) },
    )
    .pipe(gulp.dest(BUILD))

const babel = () =>
  gulp
    .src(`${SOURCES_GLOB}/*.{${JAVASCRIPT_EXTS_STR}}`, {
      dot: true,
      since: gulp.lastRun(babel),
      sourcemaps: true,
    })
    .pipe(gulpBabel({ ...babelConfig, babelrc: false }))
    .pipe(mapSources((path) => `${relative(path, '.')}/${path}`))
    .pipe(gulp.dest(BUILD, { sourcemaps: '.' }))

const rebuild = gulp.parallel(copy, babel)
export const build = gulp.series(clean, rebuild)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build source files'

const buildWatchTask = getWatchTask(BUILD_SOURCES, rebuild)
export const buildw = gulp.series(build, buildWatchTask)
