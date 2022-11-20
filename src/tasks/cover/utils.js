import { readFile } from 'node:fs/promises'

import isCi from 'is-ci'

// Only run test coverage on CI because it's slow.
// Test coverage can also be opted out by not including the Codecov badge in
// README, for example when there is no source code
// (e.g. `@ehmicky/eslint-config`).
export const shouldCover = async function () {
  if (!isCi) {
    return false
  }

  const readmeContents = await readFile('README.md')
  return readmeContents.includes('Codecov')
}
