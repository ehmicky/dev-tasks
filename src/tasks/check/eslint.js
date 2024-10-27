import { resolve } from 'node:path'

import { includeIgnoreFile } from '@eslint/compat'
import { exec } from 'gulp-execa'

import {
  IGNORED_SOURCES,
  JAVASCRIPT,
  MARKDOWN,
  TYPESCRIPT,
} from '../../files.js'
import { bind } from '../../utils.js'

const eslint = async (mode) => {
  const fix = mode === 'strict' ? '' : '--fix '
  const debug = mode !== 'silent'

  const files = [JAVASCRIPT, TYPESCRIPT, MARKDOWN].join(' ')
  const gitIgnore = includeIgnoreFile(resolve('.gitignore')).ignores
  const ignorePatterns = [...gitIgnore, ...IGNORED_SOURCES]
    .map((ignoredPattern) => `--ignore-pattern=${ignoredPattern}`)
    .join(' ')
  // We cannot use `--config` because:
  //  - it seems to change the base directory of rules `overrides` `files`,
  //    which make them not work anymore
  // Also, that module's main export is the Prettier config, i.e. we would need
  // to use `import.meta.resolve()` to load the ESLint config.
  await exec(
    `eslint ${files} ${ignorePatterns} ${fix}--cache --format=codeframe --max-warnings=0 --no-error-on-unmatched-pattern`,
    { debug, echo: false },
  )
}

export const eslintLoose = bind(eslint, 'loose')
export const eslintStrict = bind(eslint, 'strict')
export const eslintSilent = bind(eslint, 'silent')
