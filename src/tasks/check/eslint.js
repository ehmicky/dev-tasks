import { src, dest, lastRun } from 'gulp'
import gulpEslint from 'gulp-eslint'
import gulpIf from 'gulp-if'
import { exec } from 'gulp-execa'

import { JAVASCRIPT, MARKDOWN } from '../../files.js'
import { bind } from '../../utils.js'

// `gulp-eslint` does not support --cache
// (https://github.com/adametry/gulp-eslint/issues/132)
// `gulp.lastRun()` allows linting only modified files, which is 10 times faster
// than using `eslint --cache`. However it does not persist the cache.
// This leads us to two use cases:
//   - `eslint` task is faster when not running in watch mode
//   - `eslintWatch` task is faster when running in watch mode
const eslint = async function(mode) {
  const fix = mode === 'strict' ? '' : '--fix '
  const verbose = mode !== 'silent'

  const files = [JAVASCRIPT, MARKDOWN].join(' ')
  // We cannot use `--config` because:
  //  - it seems to change the base directory of rules `overrides` `files`,
  //    which make them not work anymore
  // Also, that module's main export is the Prettier config, i.e. we would need
  // to use `require.resolve()` to load the ESLint config.
  await exec(
    `eslint ${files} --ignore-path=.gitignore ${fix}--cache --format=codeframe --max-warnings=0`,
    { verbose, echo: false },
  )
}

export const eslintLoose = bind(eslint, 'loose')
export const eslintStrict = bind(eslint, 'strict')
export const eslintSilent = bind(eslint, 'silent')

export const eslintWatch = function() {
  return src([JAVASCRIPT, MARKDOWN], { dot: true, since: lastRun(eslintWatch) })
    .pipe(
      gulpEslint({
        ignorePath: '.gitignore',
        fix: true,
        maxWarnings: 0,
        // eslint-disable-next-line id-length
        reportUnusedDisableDirectives: true,
      }),
    )
    .pipe(gulpEslint.format('codeframe'))
    .pipe(gulpEslint.failAfterError())
    .pipe(
      gulpIf(
        isFixed,
        dest(({ base }) => base),
      ),
    )
}

const isFixed = function({ eslint: { fixed } = {} }) {
  return fixed
}
