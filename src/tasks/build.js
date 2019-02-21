'use strict'

const { src, dest, series, parallel, lastRun } = require('gulp')
const { include } = require('gulp-ignore')
const gulpBabel = require('gulp-babel')
const del = require('del')
const yamlToJson = require('gulp-yaml')
const sourcemaps = require('gulp-sourcemaps')

const { BUILD, BUILD_DIST } = require('../files')
const { getWatchTask } = require('../watch')

const clean = () => del(BUILD_DIST)

const copy = () =>
  src([`${BUILD}/**`, `!${BUILD}/**/*.{y{,a}ml,js,ts,jsx,tsx}`], {
    dot: true,
    since: lastRun(copy),
  }).pipe(dest(BUILD_DIST))

const babel = () =>
  src(`${BUILD}/**`, { dot: true, since: lastRun(babel) })
    .pipe(include(/\.(js)$/u))
    .pipe(sourcemaps.init())
    .pipe(gulpBabel({ comments: false, minified: true, retainLines: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(BUILD_DIST))

const yaml = () =>
  src(`${BUILD}/**`, { dot: true, since: lastRun(yaml) })
    .pipe(include(/\.ya?ml$/u))
    .pipe(yamlToJson({ schema: 'JSON_SCHEMA', space: 2 }))
    .pipe(dest(BUILD_DIST))

const rebuild = parallel(copy, babel, yaml)
const build = series(clean, rebuild)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build the application'

const buildw = getWatchTask(rebuild, BUILD, { initial: build })

module.exports = {
  build,
  buildw,
}
