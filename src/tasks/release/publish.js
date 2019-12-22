import { promises } from 'fs'

import { series } from 'gulp'
import isCi from 'is-ci'
import PluginError from 'plugin-error'
import { exec } from 'gulp-execa'

import { NPMRC } from '../../files.js'
import { build } from '../build/main.js'

// The release process has two steps:
//   - `gulp release` is performed locally. It tags the commit and creates a
//     GitHub release.
//   - `gulp publish` is performed on CI if `gulp release` was used, and after
//     all tests have passed. It publishes to npm.
const npmPublish = async function() {
  if (!isCi) {
    throw new PluginError(
      'gulp-publish',
      'This can only be performed in CI. Use `gulp release` instead.',
    )
  }

  await promises.appendFile(NPMRC, NPMRC_CONTENT)
  await exec('npm publish')
}

// The NPM_TOKEN environment variable is sensitive, i.e. encrypted in CI.
// `${NPM_TOKEN}` is expansed by npm. We avoid doing it outselves so the token
// does not get leaked in CI logs.
// eslint-disable-next-line no-template-curly-in-string
const NPMRC_CONTENT = '//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n'

// We do not need to run tests since they were performed in previous stages.
export const publish = series(build, npmPublish)

// eslint-disable-next-line fp/no-mutation
publish.description = 'Publish to npm'
