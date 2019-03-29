[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/gulp-shared-tasks.svg?label=tested&logo=codecov&style=popout-square)](https://codecov.io/gh/ehmicky/gulp-shared-tasks) [![Travis](https://img.shields.io/badge/cross-platform-4cc61e.svg?logo=travis&style=popout-square)](https://travis-ci.org/ehmicky/gulp-shared-tasks) [![Node](https://img.shields.io/node/v/gulp-shared-tasks.svg?logo=node.js&style=popout-square)](https://www.npmjs.com/package/gulp-shared-tasks) [![Gitter](https://img.shields.io/gitter/room/ehmicky/gulp-shared-tasks.svg?logo=gitter&logoColor=cccccc&style=popout-square)](https://gitter.im/ehmicky/gulp-shared-tasks) [![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter&style=popout-square)](https://twitter.com/intent/follow?screen_name=ehmicky) [![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium&logoColor=cccccc&style=popout-square)](https://medium.com/@ehmicky)

This is a set of [Gulp](https://gulpjs.com/) tasks for a Node.js workflow using
[Babel](https://babeljs.io/), [ESLint](https://eslint.org/),
[Prettier](https://prettier.io/), [Jscpd](https://github.com/kucherenko/jscpd),
[Ava](https://github.com/avajs/ava), [Travis](https://travis-ci.org/),
[nyc](https://github.com/istanbuljs/nyc), [codecov](https://codecov.io/) and
[YAML](https://en.wikipedia.org/wiki/YAML).

[Gulp](https://gulpjs.com/) is a task runner automating development tasks like
linting, testing or building. You don't need to know [Gulp](https://gulpjs.com/)
to use these tasks.

# Workflow

Code is compiled from the `src` to the `build` directory using
[Babel](https://babeljs.io/), so you can use the latest JavaScript features.

Linting and formatting are performed with [ESLint](https://eslint.org/),
[Prettier](https://prettier.io/) and
[Jscpd](https://github.com/kucherenko/jscpd). We recommend using plugins with
your IDE (code editor) for both Prettier and ESLint so that linting/formatting
is performed as you code.

We use [Ava](https://github.com/avajs/ava) to run tests. Each line of code must
be tested.

# Usage

Any task can be run using `gulp` for example:

```bash
gulp build
```

If you're on `cmd.exe` (Windows) use `npx gulp ...` instead.

# Overview

The main commands are:

- [`gulp check`](#gulp-check): lint/format the JavaScript files.
- [`gulp build`](#gulp-build): build source files and test files. Must be run
  before running any code or unit tests.
- [`gulp unit`](#gulp-unit): run unit tests.
- [`gulp test`](#gulp-test): perform the three tasks above.

Use `gulp checkw`, `gulp buildw` and `gulp unitw` to run them in watch mode.

[Travis CI](https://travis-ci.org/) ensures that tests pass on all supported
environments and that all source files are covered by tests and follow the same
coding style.

# Available tasks

## `gulp check`

Lint and check source files:

- format JavaScript files with [Prettier](https://prettier.io/).
- lint and
  [autofix](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems)
  JavaScript files using [ESLint](https://eslint.org/) (see the
  [configuration file](https://github.com/ehmicky/eslint-config-standard-prettier-fp)).
- find duplicated code with [Jscpd](https://github.com/kucherenko/jscpd).

This is automatically triggered before any `git push`.

## `gulp build`

Build source files and test files:

- JavaScript files are transpiled with [Babel](https://babeljs.io/) (see the
  [configuration file](.babelrc.js)).
- [YAML](https://en.wikipedia.org/wiki/YAML) files are converted to JSON.
- Other files are copied as is.

Source files are built from the `src` directory to the `build/src` directory.
Test files are built from the `test` directory to the `build/test` directory.

This must be done before running any code or unit tests.

## `gulp unit`

Run unit tests (from the `build/test` directory) with
[Ava](https://github.com/avajs/ava).

[Ava options](https://github.com/avajs/ava/blob/master/docs/05-command-line.md)
can be specified, e.g. `gulp unit --update-snapshots` or
`gulp unit --files build/test/file.js`.

To debug with the Chrome DevTools use `gulp unit --inspect build/test/file.js`
(or `--inspect-brk`). Specifying a file inside `build/test/` is required.

Test coverage:

- is performed when run in CI ([Travis](https://travis-ci.org/)) or when
  `gulp unit --cover` is used.
- is uploaded to [codecov](https://codecov.io/) when run in CI.
- is not performed if the repository does not have any JavaScript source files.

## `gulp test`

Runs [`gulp check`](#gulp-check) then [`gulp build`](#gulp-build) then
[`gulp unit`](#gulp-unit).

This is performed on CI ([Travis](https://travis-ci.org/)) for each OS (Windows,
Mac, Linux) and supported Node.js version.

## `gulp checkw`, `gulp buildw`, `gulp unitw`, `gulp warnw`

Like `gulp check`, `gulp build`, `gulp unit` and `gulp warn` but in watch mode.
The watch mode works even when installing/updating/uninstalling dependencies or
changing the Gulp tasks themselves.

They can be performed together, e.g. `gulp buildw` in one terminal tab and
`gulp unitw` in another.

# Other tasks

## `gulp warn`

Check for security vulnerabilities (using
[`npm audit`](https://docs.npmjs.com/cli/audit)) and outdated dependencies
(using [`npm outdated`](https://docs.npmjs.com/cli/outdated)).

## `gulp releasePatch`, `gulp releaseMinor`, `gulp releaseMajor`

Release a new patch/minor/major version on npm and GitHub using
[`release-it`](https://github.com/webpro/release-it).

The new version will only be published to npm after CI tests have passed.

Only the repository owner can perform these tasks.

## `gulp coverage`

Ensures that files are fully covered by tests using
[nyc](https://github.com/istanbuljs/nyc). This is meant to be performed on CI
([Travis](https://travis-ci.org/)).

# Add to a new repository

To add to a new repository copy the relevant top-level files and dependencies
from other repositories using this module such as
[`log-process-errors`](https://github.com/ehmicky/log-process-errors).

Custom Gulp tasks can be specified using a `gulp` top-level directory:

<!-- eslint-disable node/no-unpublished-require -->

```js
'use strict'

module.exports = {
  ...require('gulp-shared-tasks'),
  ...require('./gulp'),
}
```

# Support

If you found a bug or would like a new feature, _don't hesitate_ to
[submit an issue on GitHub](../../issues).

For other questions, feel free to
[chat with us on Gitter](https://gitter.im/ehmicky/gulp-shared-tasks).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks goes to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/gulp-shared-tasks/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/gulp-shared-tasks/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->
