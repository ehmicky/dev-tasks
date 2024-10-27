import { resolve } from 'node:path'

import { includeIgnoreFile } from '@eslint/compat'
import { exec } from 'gulp-execa'
import isCi from 'is-ci'

import {
  IGNORED_SOURCES,
  JAVASCRIPT,
  MARKDOWN,
  TYPESCRIPT,
} from '../../files.js'

export const eslint = async () => {
  try {
    await runEslint(false)
  } catch (error) {
    await applyAutoFix()
    throw error
  }
}

const applyAutoFix = async () => {
  if (isCi) {
    return
  }

  try {
    await runEslint(true)
  } catch {}
}

const runEslint = async (autofix) => {
  const fixFlag = autofix ? '--fix ' : ''
  const cacheFlag = isCi ? '' : '--cache --cache-strategy=content '
  const files = [JAVASCRIPT, TYPESCRIPT, MARKDOWN].join(' ')
  const gitIgnore = includeIgnoreFile(resolve('.gitignore')).ignores
  const ignorePatterns = [...gitIgnore, ...IGNORED_SOURCES]
    .map((ignoredPattern) => `--ignore-pattern=${ignoredPattern}`)
    .join(' ')
  await exec(
    `eslint ${files} ${ignorePatterns} ${fixFlag}${cacheFlag}--format=codeframe --max-warnings=0 --no-error-on-unmatched-pattern`,
    { echo: false },
  )
}
