import { readFile } from 'node:fs/promises'

import { pathExists } from 'path-exists'
import { inc } from 'semver'

import { prettierReleaseNotes } from '../../check/prettier.js'

// If `CHANGELOG.md` is not empty, use its last entry
export const printManualChangelog = async (contents, increment) => {
  const lines = contents.split('\n')
  await checkFirstLine(lines, increment)
  const linesA = excludePreviousVersions(lines)
  const contentsA = linesA.join('\n')
  const changelog = prettierReleaseNotes(contentsA)
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log(changelog.trim())
}

// Ensure the changelog includes the new release's changes
const checkFirstLine = async (lines, increment) => {
  const currentVersion = await getCurrentVersion()
  const newVersion = getNewVersion(currentVersion, increment)
  const firstVersion = parseVersionLine(lines[0])

  if (firstVersion !== newVersion) {
    throw new TypeError(`CHANGELOG.md should start with ${newVersion}`)
  }

  if (lines[1] !== '') {
    throw new TypeError('CHANGELOG.md second line should be empty.')
  }
}

// Find the version before the release
const getCurrentVersion = async () => {
  if (!(await pathExists(PACKAGE_JSON))) {
    throw new TypeError(`Missing ${PACKAGE_JSON}.`)
  }

  const packageJsonContents = await readFile(PACKAGE_JSON, 'utf8')
  const { version } = JSON.parse(packageJsonContents)
  return version
}

const PACKAGE_JSON = 'package.json'

// Find the version after the release
const getNewVersion = (currentVersion, increment) => {
  if (!VALID_INCREMENTS.has(increment)) {
    throw new TypeError(`Invalid increment parameter: ${increment}`)
  }

  return inc(currentVersion, increment)
}

const VALID_INCREMENTS = new Set(['major', 'minor', 'patch'])

// Do not include previous releases in the changelog
const excludePreviousVersions = (lines) => {
  const linesA = lines.slice(2)
  const nextVersionIndex = linesA.findIndex(isVersionLine)
  return nextVersionIndex === -1 ? linesA : linesA.slice(0, nextVersionIndex)
}

const isVersionLine = (line) => parseVersionLine(line) !== undefined

const parseVersionLine = (line) => {
  const result = VERSION_LINE_REGEXP.exec(line)
  return result === null ? undefined : result[1]
}

// Changelog version header like `# 1.0.0`
const VERSION_LINE_REGEXP = /^# (\d+\.\d+\.\d+)$/u
