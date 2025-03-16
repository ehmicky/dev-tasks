import { version } from 'node:process'

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

export const checkVersions = async () => {
  await checkNodeVersion()
}
