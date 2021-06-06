import gulp from 'gulp'

import { build } from './build/main.js'
import { check } from './check/main.js'
import { unit } from './unit/main.js'

export const testTask = gulp.series(check, build, unit)

// eslint-disable-next-line fp/no-mutation
testTask.description = 'Build, lint and test source files'
