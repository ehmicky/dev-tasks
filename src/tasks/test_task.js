import gulp from 'gulp'

import { build } from './build/main.js'
import { check } from './check/main.js'
import { type } from './type.js'
import { unit } from './unit/main.js'

const postBuildTest = gulp.parallel(type, unit)
export const testTask = gulp.series(check, build, postBuildTest)

// eslint-disable-next-line fp/no-mutation
testTask.description = 'Build, lint and test source files'
