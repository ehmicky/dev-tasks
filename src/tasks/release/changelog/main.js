#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { argv } from 'node:process'

import handleCliError from 'handle-cli-error'
import { pathExists } from 'path-exists'

import { printAutoChangelog } from './auto.js'
import { printManualChangelog } from './manual.js'

// Generate the release notes automatically
const runCli = async function () {
  try {
    const [, , increment] = argv
    await printChangelog(increment)
  } catch (error) {
    handleCliError(error, {
      classes: {
        TypeError: { stack: false },
        default: { stack: true },
      },
    })
  }
}

const printChangelog = async function (increment) {
  if (!(await pathExists(CHANGELOG_FILE))) {
    throw new TypeError(`Could not find ${CHANGELOG_FILE}.`)
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

runCli()
