[![downloads](https://img.shields.io/npm/dt/gulp-shared-tasks.svg?logo=npm)](https://www.npmjs.com/package/gulp-shared-tasks) [![last commit](https://img.shields.io/github/last-commit/ehmicky/gulp-shared-tasks.svg?logo=github&logoColor=white)](https://github.com/ehmicky/gulp-shared-tasks/graphs/contributors) [![Coverage Status](https://img.shields.io/codecov/c/github/ehmicky/gulp-shared-tasks.svg?label=test%20coverage&logo=codecov)](https://codecov.io/gh/ehmicky/gulp-shared-tasks) [![travis](https://img.shields.io/travis/ehmicky/gulp-shared-tasks/master.svg?logo=travis)](https://travis-ci.org/ehmicky/gulp-shared-tasks/builds) [![node](https://img.shields.io/node/v/gulp-shared-tasks.svg?logo=node.js)](#) [![Gitter](https://img.shields.io/gitter/room/ehmicky/gulp-shared-tasks.svg?logo=gitter)](https://gitter.im/ehmicky/gulp-shared-tasks)

This is a set of automated [Gulp](https://gulpjs.com/) tasks for a Node.js
workflow using
[Babel](https://babeljs.io/),
[ESLint](https://eslint.org/),
[Prettier](https://prettier.io/),
[Jscpd](https://github.com/kucherenko/jscpd),
[Ava](https://github.com/avajs/ava),
[Travis](https://travis-ci.org/),
[nyc](https://github.com/istanbuljs/nyc),
[codecov](https://codecov.io/) and
[YAML](https://en.wikipedia.org/wiki/YAML).

# Usage

After cloning the repository, install dependencies with:

```bash
npm install
```

Run any task using `gulp` followed by the task name. If you're on Windows
`cmd.exe` use `npx gulp` instead.

# Overview

- Use [`gulp build`](#gulpbuild) to build the application.
- Run unit tests with [`gulp unit`](#gulpunit).
- Before `git push`, `gulp check` will automatically be triggered and
  lint/format the JavaScript files.
- Adding a `w` to `gulp build`, `gulp check` or `gulp unit` runs it in watch
  mode.
- [Travis CI](https://travis-ci.org/) ensures that all tests pass on all
  supported environments and that all source files are covered by tests.

# Available tasks

## `gulp build`

Build source files from the `src` root directory to the `dist` root directory:

- JavaScript files are transpiled with [Babel](https://babeljs.io/) (see the
  [configuration file](.babelrc.js)).
- [YAML](https://en.wikipedia.org/wiki/YAML) files are converted to JSON.
- Other files are copied as is.

## `gulp check`

Lint and check source files:

- lint and
  [autofix](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems)
  all JavaScript files using [ESLint](https://eslint.org/). The configuration
  file is a
  [separate module](https://github.com/ehmicky/eslint-config-standard-prettier-fp).
- format all JavaScript files with [Prettier](https://prettier.io/).
- find duplicated code with [Jscpd](https://github.com/kucherenko/jscpd).

This is triggered by [`husky`](https://github.com/typicode/husky) before any
`git push`.

## `gulp unit`

Run unit tests with [Ava](https://github.com/avajs/ava).

If run in CI ([Travis](https://travis-ci.org/)) tests coverage is performed with
[nyc](https://github.com/istanbuljs/nyc) and uploaded to
[codecov](https://codecov.io/). If the repositories does not have any JavaScript
source files, no tests coverage is performed.

## `gulp test`

Runs [`gulp build`](#gulpbuild) then [`gulp check`](#gulpcheck) then
[`gulp unit`](#gulpunit).

This is performed on CI ([Travis](https://travis-ci.org/)) for each supported
Node.js version (see the `package.json` `engines.node` field) and OS (Windows,
Mac, Linux).

## `gulp warn`

Check for:

- security vulnerabilities using
  [`npm audit`](https://docs.npmjs.com/cli/audit)
- outdated dependencies using
  [`npm outdated`](https://docs.npmjs.com/cli/outdated)

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

# Add to a new repository

To add to a new repository copy the setup from other repositories using this
module such as
[`log-process-errors`](https://github.com/ehmicky/log-process-errors).

Custom Gulp tasks can be specified using a `gulp` top-level folder:

```js
'use strict'

module.exports = {
  ...require('gulp-shared-tasks'),
  ...require('./gulp'),
}
```
