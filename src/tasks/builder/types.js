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
} from '../../files.js'

export const buildTypes = async () => {
  if (await pathExists(TYPESCRIPT_MAIN)) {
    await buildFullTypes()
    return
  }

  if (await pathExists(TYPESCRIPT_AMBIENT_MAIN)) {
    await buildAmbientTypes()
  }
}

const buildFullTypes = async () => {
  if (await pathExists(TYPESCRIPT_AMBIENT_MAIN)) {
    throw new Error('"src/main.d.ts" and "src/main.ts" must not both exist.')
  }

  await exec(`tsc ${TSC_FLAGS}`, { echo: false })
}

// This must be in sync with `tsconfig.json`.
// We cannot use `tsconfig.json` since it is ignored when input files are passed
// to `tsc`.
// We cannot use the `files`/`include` properties in `tsconfig.json` because we
// need to exclude `src/**/*.test-d.ts` from transpiling, while still applying
// the `tsconfig.json` to them.
const TSCONFIG_FLAGS = `
--module nodenext \
--moduleResolution nodenext \
--target esnext \
--lib esnext \
--strict \
--exactOptionalPropertyTypes \
--noUncheckedIndexedAccess \
--noUncheckedSideEffectImports \
--forceConsistentCasingInFileNames \
--verbatimModuleSyntax \
`

const TSC_FLAGS = `\
${TSCONFIG_FLAGS} \
--declaration \
--emitDeclarationOnly \
--declarationDir ${BUILT_MAIN_SOURCE} \
${TYPESCRIPT_MAIN}
`.trim()

const buildAmbientTypes = async () => {
  await gulp
    .src([`${SOURCES_GLOB}/*.${TYPESCRIPT_AMBIENT_EXT}`], {
      since: gulp.lastRun(buildTypes),
    })
    .pipe(gulp.dest(BUILD))
}
