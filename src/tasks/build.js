'use strict'

const {
  // Source maps use URLs, i.e. should use slashes.
  // So we use `path.posix.relative()` instead of `path.relative()`
  posix: { relative },
} = require('path')

const { src, dest, series, parallel, lastRun } = require('gulp')
const gulpBabel = require('gulp-babel')
const del = require('del')
const yamlToJson = require('gulp-yaml')
const mapSources = require('@gulp-sourcemaps/map-sources')

const { SRC, DIST, JAVASCRIPT_SRC, YAML_SRC } = require('../files')
const { getWatchTask } = require('../watch')

const clean = () => del(DIST)

const copy = () =>
  src([`${SRC}/**`, `!${JAVASCRIPT_SRC}`, `!${YAML_SRC}`], {
    dot: true,
    since: lastRun(copy),
  }).pipe(dest(DIST))

const babel = () =>
  src(JAVASCRIPT_SRC, { dot: true, since: lastRun(babel), sourcemaps: true })
    .pipe(gulpBabel({ comments: false, minified: true, retainLines: true }))
    .pipe(mapSources(path => `${sourceRoot}/${path}`))
    .pipe(dest(DIST, { sourcemaps: '.' }))

const sourceRoot = relative(DIST, SRC)

const yaml = () =>
  src(YAML_SRC, { dot: true, since: lastRun(yaml) })
    .pipe(yamlToJson({ schema: 'JSON_SCHEMA', space: 2 }))
    .pipe(dest(DIST))

const rebuild = parallel(copy, babel, yaml)
const build = series(clean, rebuild)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build source files'

const buildw = getWatchTask(SRC, rebuild, { initial: build })

module.exports = {
  build,
  buildw,
}
