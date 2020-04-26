import { env } from 'process'

import isCi from 'is-ci'

const { COVERAGE } = env

// Only run test coverage on CI because it's slow.
// Test coverage can also be opted out with the `COVERAGE=false` environment
// variable for example when there is no source code
// (e.g. `@ehmicky/eslint-config`).
export const shouldCover = function () {
  return isCi && COVERAGE !== 'false'
}
