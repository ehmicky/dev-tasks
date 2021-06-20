import { promises as fs } from 'node:fs'

import { exec } from 'gulp-execa'
import isCi from 'is-ci'
import PluginError from 'plugin-error'

import { NPMRC } from '../../files.js'

// The release process has two steps:
//   - `gulp release` is performed locally. It tags the commit and creates a
//     GitHub release.
//   - `gulp publish` is performed on CI if `gulp release` was used, and after
//     all tests have passed. It publishes to npm.
export const publish = async function () {
  if (!isCi) {
    throw new PluginError(
      'gulp-publish',
      'This can only be performed in CI. Use `gulp release` instead.',
    )
  }

  await fs.appendFile(NPMRC, NPMRC_CONTENT)

  try {
    const { all } = await exec('npm publish', { stdio: 'pipe', all: true })
    // eslint-disable-next-line no-console, no-restricted-globals
    console.log(all)
  } catch (error) {
    // eslint-disable-next-line max-depth
    if (error.all.includes(ALREADY_PUBLISH_MESSAGE)) {
      // eslint-disable-next-line no-console, no-restricted-globals
      console.error(error.all)
      return
    }

    throw error
  }
}

// The NPM_TOKEN environment variable is sensitive, i.e. encrypted in CI.
// `${NPM_TOKEN}` is expansed by npm. We avoid doing it outselves so the token
// does not get leaked in CI logs.
// eslint-disable-next-line no-template-curly-in-string
const NPMRC_CONTENT = '//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n'

// It is possible to run `npm publish` locally before CI has completed to
// speed up the release process. In that case, the following error message will
// be shown, but we want to ignore it.
const ALREADY_PUBLISH_MESSAGE =
  'You cannot publish over the previously published versions'

// eslint-disable-next-line fp/no-mutation
publish.description = 'Publish to npm'
