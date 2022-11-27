#!/usr/bin/env node
import { readFile } from 'node:fs/promises'

import { execa } from 'execa'
import handleCliError from 'handle-cli-error'
import { pathExists } from 'path-exists'

// Generate the release notes automatically by reading the last entry in
// CHANGELOG.md
// Use `prettier` to remove line wrapping, since it looks odd in GitHub
// releases.
const runCli = async function () {
  try {
    await printChangelog()
  } catch (error) {
    handleCliError(error, { stack: false })
  }
}

const printChangelog = async function () {
  if (!(await pathExists(CHANGELOG_FILE))) {
    throw new Error(`Could not find ${CHANGELOG_FILE}.`)
  }

  const contents = await readFile(CHANGELOG_FILE, 'utf8')
  const contentsA = contents.trim()

  if (contentsA === '') {
    await printAutoChangelog()
    return
  }

  await execa(
    `cat CHANGELOG.md \
      | tail -n+3 \
      | sed -n '/^# [0-9]/q; p' \
      | head -n-1 \
      | prettier --stdin-filepath=CHANGELOG.md --prose-wrap=never`,
    { shell: true, stdio: 'inherit' },
  )
}

// If `CHANGELOG.md` is empty, use `git log` as a fallback
const printAutoChangelog = async function () {
  const { stdout: lastTag } = await execa('git', ['describe', '--abbrev=0'])

  if (!lastTag.startsWith('v')) {
    throw new Error('Could not find last git tag.')
  }

  const { stdout: changelog } = await execa('git', [
    'log',
    '--pretty=format:* %s (%h)',
    `${lastTag}..HEAD`,
  ])

  if (changelog.trim() === '') {
    throw new Error('Empty changelog.')
  }

  // eslint-disable-next-line no-console, no-restricted-globals
  console.log(changelog)
}

const CHANGELOG_FILE = 'CHANGELOG.md'

runCli()
