import { version } from 'node:process'

import { got } from 'got'
import spawn from 'nano-spawn'
import nodeVersionAlias from 'node-version-alias'
import PluginError from 'plugin-error'

// Make sure the latest Node and npm versions are used when releasing
const checkVersion = async (name, { current, latest }) => {
  const [currentVersion, latestVersion] = await Promise.all([
    current(),
    latest(),
  ])

  if (latestVersion === currentVersion) {
    return
  }

  throw new PluginError(
    'gulp-versions',
    `Please use latest ${name} version ${latestVersion}. Current version is ${currentVersion}.`,
  )
}

const getCurrentNode = () => version

const getLatestNode = async () => {
  const latestVersion = await nodeVersionAlias('latest', { fetch: true })
  return `v${latestVersion}`
}

const checkNodeVersion = checkVersion.bind(undefined, 'Node.js', {
  current: getCurrentNode,
  latest: getLatestNode,
})

const getCurrentNpm = async () => {
  const { stdout } = await spawn('npm', ['--version'])
  return stdout
}

const getLatestNpm = async () => {
  const {
    body: { version: npmVersion },
  } = await got(NPM_LATEST_URL, { responseType: 'json' })
  return npmVersion
}

const NPM_LATEST_URL = 'https://registry.npmjs.com/npm/latest'

// eslint-disable-next-line no-unused-vars
const checkNpmVersion = checkVersion.bind(undefined, 'npm', {
  current: getCurrentNpm,
  latest: getLatestNpm,
})

export const checkVersions = async () => {
  // eslint-disable-next-line unicorn/no-single-promise-in-promise-methods
  await Promise.all([
    checkNodeVersion(),
    // TODO: re-enable once latest Node starts using latest npm again
    // checkNpmVersion(),
  ])
}
