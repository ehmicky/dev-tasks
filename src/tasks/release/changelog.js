#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { argv } from 'node:process'

import { execa } from 'execa'
import handleCliError from 'handle-cli-error'
import { pathExists } from 'path-exists'

// Generate the release notes automatically.
const runCli = async function () {
  try {
    const [, , increment] = argv
    await printChangelog(increment)
  } catch (error) {
    handleCliError(error, { stack: false })
  }
}

const printChangelog = async function (increment) {
  if (!(await pathExists(CHANGELOG_FILE))) {
    throw new Error(`Could not find ${CHANGELOG_FILE}.`)
  }

  const contents = await readFile(CHANGELOG_FILE, 'utf8')
  const contentsA = contents.trim()

  if (contentsA === '') {
    await printAutoChangelog()
    return
  }

  await printManualChangelog(contentsA, increment)
}

const CHANGELOG_FILE = 'CHANGELOG.md'

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

// If `CHANGELOG.md` is not empty, use its last entry.
const printManualChangelog = async function (contents, increment) {
  await execa(
    `cat CHANGELOG.md \
      | tail -n+3 \
      | sed -n '/^# [0-9]/q; p' \
      | head -n-1 \
      | prettier --stdin-filepath=CHANGELOG.md --prose-wrap=never`,
    { shell: true, stdio: 'inherit' },
  )
}

runCli()
