'use strict'

const { src, dest, series, parallel, lastRun } = require('gulp')
const gulpBabel = require('gulp-babel')
const del = require('del')
const yamlToJson = require('gulp-yaml')
const mapSources = require('@gulp-sourcemaps/map-sources')

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
    .pipe(gulpBabel({ comments: false, minified: true, retainLines: true }))
    .pipe(mapSources(path => `../../${path}`))
    .pipe(dest(BUILD, { sourcemaps: '.' }))

const yaml = () =>
  src(`${SOURCES}/*.y{,a}ml`, { dot: true, since: lastRun(yaml) })
    .pipe(yamlToJson({ schema: 'JSON_SCHEMA', space: 2 }))
    .pipe(dest(BUILD))

const rebuild = parallel(copy, babel, yaml)
const build = series(clean, rebuild)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build source files'

const buildw = getWatchTask([SRC, TEST], rebuild, { initial: build })

module.exports = {
  build,
  buildw,
}
