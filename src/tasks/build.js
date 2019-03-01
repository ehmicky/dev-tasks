'use strict'

const { src, dest, series, parallel, lastRun } = require('gulp')
const gulpBabel = require('gulp-babel')
const del = require('del')
const yamlToJson = require('gulp-yaml')
const mapSources = require('@gulp-sourcemaps/map-sources')

const { SRC, TEST, DIST } = require('../files')
const { getWatchTask } = require('../watch')

const BUILD = `{${SRC},${TEST}}/**`

const clean = () => del(DIST)

const copy = () =>
  src([`${BUILD}/*[^~]`, `!${BUILD}/*.js`, `!${BUILD}/*.y{,a}ml`], {
    dot: true,
    since: lastRun(copy),
  }).pipe(dest(DIST))

const babel = () =>
  src(`${BUILD}/*.js`, { dot: true, since: lastRun(babel), sourcemaps: true })
    .pipe(gulpBabel({ comments: false, minified: true, retainLines: true }))
    .pipe(mapSources(path => `../../${path}`))
    .pipe(dest(DIST, { sourcemaps: '.' }))

const yaml = () =>
  src(`${BUILD}/*.y{,a}ml`, { dot: true, since: lastRun(yaml) })
    .pipe(yamlToJson({ schema: 'JSON_SCHEMA', space: 2 }))
    .pipe(dest(DIST))

const rebuild = parallel(copy, babel, yaml)
const build = series(clean, rebuild)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build source files'

const buildw = getWatchTask([SRC, TEST], rebuild, { initial: build })

module.exports = {
  build,
  buildw,
}
