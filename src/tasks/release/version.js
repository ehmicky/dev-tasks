import { version } from 'process'

import { npm } from 'node-latest'
import nodeVersionAlias from 'node-version-alias'
import PluginError from 'plugin-error'

// Make sure the latest Node and npm versions are used when releasing
const checkVersion = async function (name, { current, latest }) {
  const currentVersion = current()
  const latestVersion = await latest()

  if (latestVersion === currentVersion) {
    return
  }

  throw new PluginError(
    'gulp-versions',
    `Please use latest ${name} version ${latestVersion}. Current version is ${currentVersion}.`,
  )
}

const getCurrentNode = function () {
  return version
}

const getLatestNode = async function () {
  const latestVersion = await nodeVersionAlias('latest', { fetch: true })
  return `v${latestVersion}`
}

const checkNodeVersion = checkVersion.bind(undefined, 'Node.js', {
  current: getCurrentNode,
  latest: getLatestNode,
})
const checkNpmVersion = checkVersion.bind(undefined, 'npm', npm)

export const checkVersions = async () => {
  await Promise.all([checkNodeVersion(), checkNpmVersion()])
}
