import config from '@ehmicky/prettier-config'
import { exec } from 'gulp-execa'
import isCi from 'is-ci'
import { format } from 'prettier'

import {
  IGNORED_SOURCES,
  JSON_YAML,
  JAVASCRIPT,
  MARKDOWN,
  TYPESCRIPT,
} from '../../files.js'

import { runTwice } from './twice.js'

export const prettier = async () => {
  await runTwice(runPrettier)
}

const runPrettier = async (autofix) => {
  const checkFlag = autofix ? '--write' : '--check'
  const cacheFlag = isCi ? '' : '--cache'
  const files = [
    JAVASCRIPT,
    TYPESCRIPT,
    MARKDOWN,
    ...JSON_YAML,
    ...IGNORED_SOURCES.map((ignoredSource) => `!${ignoredSource}`),
  ].join(' ')
  await exec(
    `prettier ${files} ${checkFlag} ${cacheFlag} --no-error-on-unmatched-pattern --log-level=warn`,
    { echo: false },
  )
}

// Prettier wraps `CHANGELOG.md`, but not GitHub release notes
export const prettierReleaseNotes = async (contents) =>
  await format(contents, { ...config, parser: 'markdown', proseWrap: 'never' })
