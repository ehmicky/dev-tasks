import { src, dest, lastRun } from 'gulp'
import gulpEslint from 'gulp-eslint'
import gulpIf from 'gulp-if'
import { exec } from 'gulp-execa'

import { JAVASCRIPT, MARKDOWN } from '../../files.js'
import { bind, silentAsync } from '../../utils.js'

// That module's main export is the Prettier config, i.e. we need to use
// `require.resolve()` to load the ESLint config.
const ESLINT_CONFIG = require.resolve(
  'eslint-config-standard-prettier-fp/.eslintrc.yml',
)

// `gulp-eslint` does not support --cache
// (https://github.com/adametry/gulp-eslint/issues/132)
// `gulp.lastRun()` allows linting only modified files, which is 10 times faster
// than using `eslint --cache`. However it does not persist the cache.
// This leads us to two use cases:
//   - `eslint` task is faster when not running in watch mode
//   - `eslintWatch` task is faster when running in watch mode
const eslint = function(mode) {
  const fix = mode === 'strict' ? '' : '--fix '
  const options =
    mode === 'silent' ? { stdout: 'ignore', stderr: 'ignore' } : {}

  const files = `${JAVASCRIPT.join(' ')} ${MARKDOWN.join(' ')}`
  return exec(
    `eslint ${files} --config=${ESLINT_CONFIG} --no-eslintrc --ignore-path=.gitignore ${fix}--cache --format=codeframe --max-warnings=0 --report-unused-disable-directives`,
    options,
  )
}

export const eslintLoose = bind(eslint, 'loose')
export const eslintStrict = bind(eslint, 'strict')
export const eslintSilent = silentAsync(bind(eslint, 'silent'))

export const eslintWatch = function() {
  return src([...JAVASCRIPT, ...MARKDOWN], {
    dot: true,
    since: lastRun(eslintWatch),
  })
    .pipe(
      gulpEslint({
        ignorePath: '.gitignore',
        fix: true,
        maxWarnings: 0,
        // eslint-disable-next-line id-length
        reportUnusedDisableDirectives: true,
        configFile: ESLINT_CONFIG,
        useEslintrc: false,
      }),
    )
    .pipe(gulpEslint.format('codeframe'))
    .pipe(gulpEslint.failAfterError())
    .pipe(gulpIf(isFixed, dest(({ base }) => base)))
}

const isFixed = function({ eslint: { fixed } = {} }) {
  return fixed
}
