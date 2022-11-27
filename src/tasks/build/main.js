import { readFile } from 'node:fs/promises'
import { relative } from 'node:path'

import mapSources from '@gulp-sourcemaps/map-sources'
import { deleteAsync } from 'del'
import gulp from 'gulp'
import gulpBabel from 'gulp-babel'
import { exec } from 'gulp-execa'
import { pathExists } from 'path-exists'

import {
  NOT_BUILT_SOURCES,
  BUILD,
  BUILT_MAIN_SOURCE,
  GENERATED_SOURCES_DIR,
  JAVASCRIPT_EXTS_STR,
  TYPESCRIPT_EXT,
  TYPESCRIPT_MAIN,
  TYPESCRIPT_AMBIENT_EXT,
  TYPESCRIPT_AMBIENT_MAIN,
  TYPESCRIPT_TESTS_EXT,
  TYPESCRIPT_CONFIG,
} from '../../files.js'
import { getWatchTask } from '../../watch.js'

// eslint-disable-next-line import/max-dependencies
import babelConfig from './.babelrc.js'

const SOURCES_GLOB = `{${NOT_BUILT_SOURCES.join(',')}}/**`
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
        `!${SOURCES_GLOB}/*.{${JAVASCRIPT_EXTS_STR},${TYPESCRIPT_EXT}}`,
        `!${SOURCES_ONLY_GLOB}`,
      ],
      { dot: true, since: gulp.lastRun(copy) },
    )
    .pipe(gulp.dest(BUILD))

const babel = () =>
  gulp
    .src(
      [
        `${SOURCES_GLOB}/*.{${JAVASCRIPT_EXTS_STR},${TYPESCRIPT_EXT}}`,
        `!${SOURCES_GLOB}/*.{${TYPESCRIPT_AMBIENT_EXT},${TYPESCRIPT_TESTS_EXT}}`,
      ],
      { dot: true, since: gulp.lastRun(babel), sourcemaps: true },
    )
    .pipe(gulpBabel({ ...babelConfig, babelrc: false }))
    .pipe(mapSources((path) => `${relative(path, '.')}/${path}`))
    .pipe(gulp.dest(BUILD, { sourcemaps: '.' }))

const buildTypes = async function () {
  if (await pathExists(TYPESCRIPT_AMBIENT_MAIN)) {
    await buildAmbientTypes()
    return
  }

  if (await pathExists(TYPESCRIPT_MAIN)) {
    await buildFullTypes()
  }
}

const buildAmbientTypes = async function () {
  await gulp
    .src([`${SOURCES_GLOB}/*.${TYPESCRIPT_AMBIENT_EXT}`], {
      since: gulp.lastRun(buildTypes),
    })
    .pipe(gulp.dest(BUILD))
}

const buildFullTypes = async function () {
  await validateTSConfig()
  await exec(
    `tsc --declaration --emitDeclarationOnly --declarationDir ${BUILT_MAIN_SOURCE}`,
    { echo: false },
  )
}

const validateTSConfig = async function () {
  if (!(await pathExists(TYPESCRIPT_CONFIG))) {
    throw new Error('Missing tsconfig.json.')
  }

  const tsConfigRaw = await readFile(TYPESCRIPT_CONFIG)
  const tsConfig = JSON.parse(tsConfigRaw)
  validateTSFiles(tsConfig)
}

const validateTSFiles = function ({ files }) {
  if (
    !Array.isArray(files) ||
    files.length !== 1 ||
    files[0] !== TYPESCRIPT_MAIN
  ) {
    throw new Error(
      'tsconfig.json should include a "files": ["src/main.ts"] property.',
    )
  }
}

const rebuild = gulp.parallel(copy, babel, buildTypes)
export const build = gulp.series(clean, rebuild)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build source files'

const buildWatchTask = getWatchTask(NOT_BUILT_SOURCES, rebuild)
export const buildWatch = gulp.series(build, buildWatchTask)
