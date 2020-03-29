// import { env } from 'process'

// import isCi from 'is-ci'

// const { COVERAGE } = env

// Only run test coverage on CI because it's slow.
// Test coverage can also be opted out with the `COVERAGE=false` environment
// variable for example when there is no source code
// (e.g. `@ehmicky/eslint-config`).
export const shouldCover = function () {
  // There is an ongoing with Codecov which prevents uploading test coverage
  //   https://github.com/codecov/codecov-action/issues/68
  // TODO: once fixed, remove next line and uncomment the line after that
  return false
  // return isCi && COVERAGE !== 'false'
}
