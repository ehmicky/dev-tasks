[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/gulp-shared-tasks.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/gulp-shared-tasks) [![Travis](https://img.shields.io/badge/cross-platform-4cc61e.svg?logo=travis)](https://travis-ci.org/ehmicky/gulp-shared-tasks) [![Node](https://img.shields.io/node/v/gulp-shared-tasks.svg?logo=node.js)](https://www.npmjs.com/package/gulp-shared-tasks) [![Gitter](https://img.shields.io/gitter/room/ehmicky/gulp-shared-tasks.svg?logo=gitter)](https://gitter.im/ehmicky/gulp-shared-tasks)

This is a set of [Gulp](https://gulpjs.com/) tasks for a Node.js workflow using
[Babel](https://babeljs.io/), [ESLint](https://eslint.org/),
[Prettier](https://prettier.io/), [Jscpd](https://github.com/kucherenko/jscpd),
[Ava](https://github.com/avajs/ava), [Travis](https://travis-ci.org/),
[nyc](https://github.com/istanbuljs/nyc), [codecov](https://codecov.io/) and
[YAML](https://en.wikipedia.org/wiki/YAML).

[Gulp](https://gulpjs.com/) is a task runner automating development tasks like
linting, testing or building.

# Usage

Any task can be run using `gulp` for example:

```bash
gulp build
```

If you're on `cmd.exe` (Windows) use `npx gulp ...` instead.

# Overview

- Use [`gulp build`](#gulp-build) to build source files and test files.
- Run unit tests with [`gulp unit`](#gulp-unit).
- Before `git push`, `gulp check` will automatically be triggered and
  lint/format the JavaScript files.
- Adding a `w` to `gulp build`, `gulp check` or `gulp unit` runs it in watch
  mode.
- [Travis CI](https://travis-ci.org/) ensures that tests pass on all supported
  environments and that all source files are covered by tests.

# Available tasks

## `gulp build`

Build source files and test files:

- JavaScript files are transpiled with [Babel](https://babeljs.io/) (see the
  [configuration file](.babelrc.js)).
- [YAML](https://en.wikipedia.org/wiki/YAML) files are converted to JSON.
- Other files are copied as is.

Source files are built from the `src` directory to the `build/src` directory.
Test files are built from the `test` directory to the `build/test` directory.

This must be done before running any code or unit tests.

## `gulp check`

Lint and check source files:

- lint and
  [autofix](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems)
  JavaScript files using [ESLint](https://eslint.org/) (see the
  [configuration file](https://github.com/ehmicky/eslint-config-standard-prettier-fp)).
- format JavaScript files with [Prettier](https://prettier.io/).
- find duplicated code with [Jscpd](https://github.com/kucherenko/jscpd).

This is triggered by [`husky`](https://github.com/typicode/husky) before any
`git push`.

## `gulp unit`

Run unit tests (from the `build/test` folder) with
[Ava](https://github.com/avajs/ava).

[Ava options](https://github.com/avajs/ava/blob/master/docs/05-command-line.md)
can be specified, e.g. `gulp unit --serial`.

To debug with the Chrome DevTools use `gulp unit --inspect build/test/file.js`
or `gulp unit --inspect-brk build/test/file.js`. Specifying a file inside
`build/test` is required.

Test coverage:

- is performed when run in CI ([Travis](https://travis-ci.org/)) or when
  `gulp unit --cover` is used.
- is uploaded to [codecov](https://codecov.io/) when run in CI.
- is not performed if the repository does not have any JavaScript source files.

## `gulp test`

Runs [`gulp build`](#gulp-build) then [`gulp check`](#gulp-check) then
[`gulp unit`](#gulp-unit).

This is performed on CI ([Travis](https://travis-ci.org/)) for each OS (Windows,
Mac, Linux) and supported Node.js version.

## `gulp warn`

Check for security vulnerabilities (using
[`npm audit`](https://docs.npmjs.com/cli/audit)) and outdated dependencies
(using [`npm outdated`](https://docs.npmjs.com/cli/outdated)).

## `gulp releasePatch`, `gulp releaseMinor`, `gulp releaseMajor`

Release a new patch/minor/major version on npm and GitHub using
[`release-it`](https://github.com/webpro/release-it).

The new version will only be published to npm after CI tests have passed.

## `gulp coverage`

Ensures that files are fully covered by tests using
[nyc](https://github.com/istanbuljs/nyc). This is performed on CI
([Travis](https://travis-ci.org/)).

## `gulp buildw`, `gulp checkw`, `gulp unitw`, `gulp warnw`

Like `gulp build`, `gulp check`, `gulp unit` and `gulp warn` but in watch mode.
The watch mode works even when installing/updating/uninstalling dependencies or
changing the Gulp tasks themselves.

They can be performed together, e.g. `gulp buildw` in one terminal tab and
`gulp unitw` in another.

# Add to a new repository

To add to a new repository copy the relevant top-level files and dependencies
from other repositories using this module such as
[`log-process-errors`](https://github.com/ehmicky/log-process-errors).

Custom Gulp tasks can be specified using a `gulp` top-level folder:

<!-- eslint-disable node/no-unpublished-require -->

```js
'use strict'

module.exports = {
  ...require('gulp-shared-tasks'),
  ...require('./gulp'),
}
```
