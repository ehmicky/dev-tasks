import { task } from 'gulp-execa'

export const type = task('tsd')

// eslint-disable-next-line fp/no-mutation
type.description = 'Run TypeScript type tests'
