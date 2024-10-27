import gulp from 'gulp'

import { eslint } from './eslint.js'
import { jscpd } from './jscpd.js'
import { prettier } from './prettier.js'

const lint = gulp.series(prettier, eslint)
export const check = gulp.parallel(lint, jscpd)

// eslint-disable-next-line fp/no-mutation
check.description = 'Lint/check source files'
