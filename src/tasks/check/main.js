import gulp from 'gulp'

import { jscpd } from './jscpd.js'
import { lint } from './lint.js'

export const check = gulp.parallel(lint(), jscpd)

// eslint-disable-next-line fp/no-mutation
check.description = 'Lint/check source files'
