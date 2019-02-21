'use strict'

const { src, dest, series, parallel, lastRun } = require('gulp')
const { include } = require('gulp-ignore')
const del = require('del')
const yamlToJson = require('gulp-yaml')

const { BUILD, BUILD_DIST } = require('../files')
const { getWatchTask } = require('../watch')
const gulpExeca = require('../exec')

const clean = () => del(BUILD_DIST)

const copy = () =>
  src([`${BUILD}/**`, `!${BUILD}/**/*.{y{,a}ml,js,ts,jsx,tsx}`], {
    dot: true,
    since: lastRun(copy),
  }).pipe(dest(BUILD_DIST))

const babel = () =>
  gulpExeca(
    `babel ${BUILD} --out-dir ${BUILD_DIST} --source-maps --no-comments --minified --retain-lines`,
  )

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
