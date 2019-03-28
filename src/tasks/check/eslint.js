'use strict'

// eslint-disable-next-line unicorn/prevent-abbreviations
const { src, dest, lastRun } = require('gulp')
const gulpEslint = require('gulp-eslint')
const gulpIf = require('gulp-if')
const { exec } = require('gulp-execa')

const { JAVASCRIPT, MARKDOWN } = require('../../files')
const { bind, silentAsync } = require('../../utils')

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
    `eslint ${files} --ignore-path=.gitignore ${fix}--cache --format=codeframe --max-warnings=0 --report-unused-disable-directives`,
    options,
  )
}

const eslintLoose = bind(eslint, 'loose')
const eslintStrict = bind(eslint, 'strict')
const eslintSilent = silentAsync(bind(eslint, 'silent'))

const eslintWatch = function() {
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
      }),
    )
    .pipe(gulpEslint.format('codeframe'))
    .pipe(gulpEslint.failAfterError())
    .pipe(gulpIf(isFixed, dest(({ base }) => base)))
}

const isFixed = function({ eslint: { fixed } = {} }) {
  return fixed
}

module.exports = {
  eslintLoose,
  eslintStrict,
  eslintSilent,
  eslintWatch,
}
