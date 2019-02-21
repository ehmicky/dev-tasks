'use strict'

const { src, dest, series, parallel } = require('gulp')
const { include } = require('gulp-ignore')
const del = require('del')
const yamlToJson = require('gulp-yaml')

const { BUILD, BUILD_DIST } = require('../files')
const gulpExeca = require('../exec')
const { getWatchTask } = require('../watch')

const clean = () => del(BUILD_DIST)

const copy = () =>
  src([`${BUILD}/**`, `!${BUILD}/**/*.{y{,a}ml,js,ts,jsx,tsx}`], {
    dot: true,
  }).pipe(dest(BUILD_DIST))

const babel = () =>
  gulpExeca(
    `babel ${BUILD} --out-dir ${BUILD_DIST} --source-maps --no-comments --minified --retain-lines`,
  )

const yaml = () =>
  src(`${BUILD}/**`, { dot: true })
    .pipe(include(/\.ya?ml$/u))
    .pipe(yamlToJson({ schema: 'JSON_SCHEMA', space: 2 }))
    .pipe(dest(BUILD_DIST))

const build = series(clean, parallel(copy, babel, yaml))

// eslint-disable-next-line fp/no-mutation
build.description = 'Build the application'

const buildw = getWatchTask(build, BUILD)

module.exports = {
  build,
  buildw,
}
