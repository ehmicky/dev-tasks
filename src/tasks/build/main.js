'use strict'

const { relative } = require('path')

const { src, dest, series, parallel, lastRun } = require('gulp')
const gulpBabel = require('gulp-babel')
const del = require('del')
const yamlToJson = require('gulp-yaml')
const mapSources = require('@gulp-sourcemaps/map-sources')
const PluginError = require('plugin-error')

const { SRC, TEST, BUILD } = require('../../files')
const { getWatchTask } = require('../../watch')

const babelConfig = require('./.babelrc.js')

const SOURCES = `{${SRC},${TEST}}/**`

// We remove files deeply but leave empty [sub]directories. Otherwise it creates
// issues with `chokidar` (file waching used by `ava --watch` and
// `gulp.watch()`)
const clean = () => del(`${BUILD}/**`, { nodir: true })

const copy = () =>
  src([`${SOURCES}/*[^~]`, `!${SOURCES}/*.js`, `!${SOURCES}/*.y{,a}ml`], {
    dot: true,
    since: lastRun(copy),
  }).pipe(dest(BUILD))

const babel = () =>
  src(`${SOURCES}/*.js`, { dot: true, since: lastRun(babel), sourcemaps: true })
    .pipe(gulpBabel({ ...babelConfig, babelrc: false }))
    .pipe(mapSources(path => `${relative(path, '.')}/${path}`))
    .pipe(dest(BUILD, { sourcemaps: '.' }))

const yaml = () =>
  src(`${SOURCES}/*.y{,a}ml`, { dot: true, since: lastRun(yaml) })
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

const buildw = getWatchTask([SRC, TEST], rebuild, { initial: build })

module.exports = {
  build,
  buildw,
}
