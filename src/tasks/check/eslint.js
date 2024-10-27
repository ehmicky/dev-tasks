import { resolve } from 'node:path'
import { includeIgnoreFile } from '@eslint/compat'
import gulp from 'gulp'
import gulpEslint from 'gulp-eslint'
import { exec } from 'gulp-execa'
import gulpIf from 'gulp-if'

import {
  JAVASCRIPT,
  TYPESCRIPT,
  MARKDOWN,
  IGNORED_SOURCES,
} from '../../files.js'
import { bind } from '../../utils.js'

// `gulp-eslint` does not support --cache
// (https://github.com/adametry/gulp-eslint/issues/132)
// `gulp.lastRun()` allows linting only modified files, which is 10 times faster
// than using `eslint --cache`. However it does not persist the cache.
// This leads us to two use cases:
//   - `eslint` task is faster when not running in watch mode
//   - `eslintWatch` task is faster when running in watch mode
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

export const eslintWatch = () =>
  gulp
    .src([JAVASCRIPT, TYPESCRIPT, MARKDOWN, `!${IGNORED_SOURCES}`], {
      dot: true,
      since: gulp.lastRun(eslintWatch),
    })
    .pipe(
      gulpEslint({
        ignorePath: '.gitignore',
        fix: true,
        maxWarnings: 0,
        // eslint-disable-next-line id-length
        reportUnusedDisableDirectives: true,
        errorOnUnmatchedPattern: false,
      }),
    )
    .pipe(gulpEslint.format('codeframe'))
    .pipe(gulpEslint.failAfterError())
    .pipe(
      gulpIf(
        isFixed,
        gulp.dest(({ base }) => base),
      ),
    )

const isFixed = ({ eslint: { fixed } = {} }) => fixed
