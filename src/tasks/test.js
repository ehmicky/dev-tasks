import { series } from 'gulp'

import { check } from './check/main.js'
import { build } from './build/main.js'
import { unit } from './unit/main.js'

export const testTask = series(check, build, unit)

// eslint-disable-next-line fp/no-mutation
testTask.description = 'Build, lint and test source files'
