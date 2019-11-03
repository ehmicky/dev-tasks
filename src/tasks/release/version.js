import { npm } from 'node-latest'
import normalizeNodeVersions from 'normalize-node-version'
import PluginError from 'plugin-error'

// Make sure the latest Node and npm versions are used when releasing
const checkVersion = async function(name, { current, latest }) {
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

const getLatestNode = function() {
  return normalizeNodeVersions('*', { cache: false })
}

const checkNodeVersion = checkVersion.bind(null, 'Node.js', getLatestNode)
const checkNpmVersion = checkVersion.bind(null, 'npm', npm)

export const checkVersions = async () => {
  await Promise.all([checkNodeVersion(), checkNpmVersion()])
}
