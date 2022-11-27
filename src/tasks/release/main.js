import { fileURLToPath } from 'node:url'

import gulp from 'gulp'
import releaseIt from 'release-it'

import { testTask } from '../test_task.js'

import { checkVersions } from './version.js'

const CHANGELOG_SCRIPT = fileURLToPath(
  new URL('changelog/main.js', import.meta.url),
)

const releaseItTask = async function (increment) {
  await releaseIt({
    ...RELEASE_IT_CONFIG,
    increment,
    git: {
      ...RELEASE_IT_CONFIG.git,
      changelog: `node ${CHANGELOG_SCRIPT} ${increment}`,
    },
  })
}

const RELEASE_IT_CONFIG = {
  ci: true,
  git: {
    // eslint-disable-next-line no-template-curly-in-string
    commitMessage: 'v${version}',
    requireBranch: 'main',
    requireCommits: true,
  },
  github: {
    release: true,
    // eslint-disable-next-line no-template-curly-in-string
    releaseName: 'v${version}',
  },
  npm: {
    // This cannot be used with `ci: true`
    publish: false,
  },
}

const prereleaseTasks = [checkVersions, testTask]

// Cannot use `func.bind()` otherwise task name will be prepended with `bound `
const releaseItMajor = () => releaseItTask('major')
export const releaseMajor = gulp.series(...prereleaseTasks, releaseItMajor)

// eslint-disable-next-line fp/no-mutation
releaseMajor.description = 'Release a new major version x.*.*'

const releaseItMinor = () => releaseItTask('minor')
export const releaseMinor = gulp.series(...prereleaseTasks, releaseItMinor)

// eslint-disable-next-line fp/no-mutation
releaseMinor.description = 'Release a new minor version *.x.*'

const releaseItPatch = () => releaseItTask('patch')
export const releasePatch = gulp.series(...prereleaseTasks, releaseItPatch)

// eslint-disable-next-line fp/no-mutation
releasePatch.description = 'Release a new patch version *.*.x'
