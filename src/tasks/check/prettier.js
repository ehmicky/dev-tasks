import config from '@ehmicky/prettier-config'
import { exec } from 'gulp-execa'
import isCi from 'is-ci'
import { format } from 'prettier'

import {
  IGNORED_SOURCES,
  JAVASCRIPT,
  JSON_YAML,
  MARKDOWN,
  TYPESCRIPT,
} from '../../files.js'

export const prettier = async () => {
  const files = [
    JAVASCRIPT,
    TYPESCRIPT,
    MARKDOWN,
    ...JSON_YAML,
    ...IGNORED_SOURCES.map((ignoredSource) => `!${ignoredSource}`),
  ].join('')
  const writeFlag = isCi ? '--check' : '--write'
  await exec(`prettier ${files} ${writeFlag} --cache`, { debug: isCi })
}

// Prettier wraps `CHANGELOG.md`, but not GitHub release notes
export const prettierReleaseNotes = async (contents) =>
  await format(contents, { ...config, parser: 'markdown', proseWrap: 'never' })
