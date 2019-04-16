import { relative } from 'path'

import { src, dest, series, parallel, lastRun } from 'gulp'
import gulpBabel from 'gulp-babel'
import del from 'del'
import yamlToJson from 'gulp-yaml'
import mapSources from '@gulp-sourcemaps/map-sources'
import PluginError from 'plugin-error'

import { BUILD_SOURCES, BUILD } from '../../files.js'
import { getWatchTask } from '../../watch.js'

import babelConfig from './.babelrc.js'

const SOURCES_GLOB = `{${BUILD_SOURCES.join(',')}}/**`
const SOURCES_ARR = BUILD_SOURCES.map(source => `${source}/`)

// We remove files deeply but leave empty [sub]directories. Otherwise it creates
// issues with `chokidar` (file waching used by `ava --watch` and
// `gulp.watch()`)
const clean = () => del(`${BUILD}/**`, { nodir: true })

const copy = () =>
  src(
    [
      `${SOURCES_GLOB}/*[^~]`,
      `!${SOURCES_GLOB}/*.js`,
      `!${SOURCES_GLOB}/*.y{,a}ml`,
    ],
    { dot: true, since: lastRun(copy) },
  ).pipe(dest(BUILD))

const babel = () =>
  src(`${SOURCES_GLOB}/*.js`, {
    dot: true,
    since: lastRun(babel),
    sourcemaps: true,
  })
    .pipe(gulpBabel({ ...babelConfig, babelrc: false }))
    .pipe(mapSources(path => `${relative(path, '.')}/${path}`))
    .pipe(dest(BUILD, { sourcemaps: '.' }))

const yaml = () =>
  src(`${SOURCES_GLOB}/*.y{,a}ml`, { dot: true, since: lastRun(yaml) })
    .pipe(yamlToJson(JS_YAML_CONFIG))
    .pipe(dest(BUILD))

const onWarning = function(error) {
  throw new PluginError('gulp-yaml', error.message)
}

const JS_YAML_CONFIG = {
  schema: 'JSON_SCHEMA',
  space: 2,
  onWarning,
}

const rebuild = parallel(copy, babel, yaml)
const build = series(clean, rebuild)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build source files'

const buildw = getWatchTask(SOURCES_ARR, rebuild, { initial: build })

module.exports = {
  build,
  buildw,
}
