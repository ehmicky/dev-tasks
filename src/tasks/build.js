'use strict'

const { relative } = require('path')

const { src, dest, series, parallel, lastRun } = require('gulp')
const gulpBabel = require('gulp-babel')
const del = require('del')
const yamlToJson = require('gulp-yaml')
const mapSources = require('@gulp-sourcemaps/map-sources')
const PluginError = require('plugin-error')

const { SRC, TEST, BUILD } = require('../files')
const { getWatchTask } = require('../watch')

const SOURCES = `{${SRC},${TEST}}/**`

const clean = () => del(BUILD)

const copy = () =>
  src([`${SOURCES}/*[^~]`, `!${SOURCES}/*.js`, `!${SOURCES}/*.y{,a}ml`], {
    dot: true,
    since: lastRun(copy),
  }).pipe(dest(BUILD))

const babel = () =>
  src(`${SOURCES}/*.js`, { dot: true, since: lastRun(babel), sourcemaps: true })
    .pipe(gulpBabel(BABEL_CONFIG))
    .pipe(mapSources(path => `${relative(path, '.')}/${path}`))
    .pipe(dest(BUILD, { sourcemaps: '.' }))

const BABEL_CONFIG = {
  babelrc: false,
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: '8.10.0' }, useBuiltIns: 'usage' },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
  comments: false,
  shouldPrintComment: comment => comment.includes('istanbul ignore'),
  minified: true,
  retainLines: true,
}

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
