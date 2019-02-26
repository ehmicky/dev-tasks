'use strict'

const { node, npm } = require('node-latest')
const PluginError = require('plugin-error')

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

const checkNodeVersion = checkVersion.bind(null, 'Node.js', node)
const checkNpmVersion = checkVersion.bind(null, 'npm', npm)

const checkVersions = async () => {
  await Promise.all([checkNodeVersion(), checkNpmVersion()])
}

module.exports = {
  checkVersions,
}
