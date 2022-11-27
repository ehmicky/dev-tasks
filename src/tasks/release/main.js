import gulp from 'gulp'
import releaseIt from 'release-it'

import { testTask } from '../test.js'

import { checkVersions } from './version.js'

const releaseItTask = async function (increment) {
  await releaseIt({ ...RELEASE_IT_CONFIG, increment })
}

const RELEASE_IT_CONFIG = {
  ci: true,
  git: {
    // eslint-disable-next-line no-template-curly-in-string
    commitMessage: 'v${version}',
    // Generate the release notes automatically by reading the last entry in
    // CHANGELOG.md
    // Use `prettier` to remove line wrapping, since it looks odd in GitHub
    // releases.
    changelog: `cat CHANGELOG.md \
      | tail -n+3 \
      | sed -n '/^# [0-9]/q; p' \
      | head -n-1 \
      | prettier --stdin-filepath=CHANGELOG.md --prose-wrap=never`,
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
