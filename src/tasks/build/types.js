import { readFile } from 'node:fs/promises'

import gulp from 'gulp'
import { exec } from 'gulp-execa'
import { pathExists } from 'path-exists'

import {
  SOURCES_GLOB,
  BUILD,
  BUILT_MAIN_SOURCE,
  TYPESCRIPT_MAIN,
  TYPESCRIPT_AMBIENT_EXT,
  TYPESCRIPT_AMBIENT_MAIN,
  TYPESCRIPT_CONFIG,
} from '../../files.js'

export const buildTypes = async function () {
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
