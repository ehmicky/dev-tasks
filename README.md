[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/@ehmicky/dev-tasks)
[![Browsers](https://img.shields.io/badge/-Browsers-808080?logo=firefox&colorA=404040)](https://www.npmjs.com/package/@ehmicky/dev-tasks)
[![Mastodon](https://img.shields.io/badge/-Mastodon-808080.svg?logo=mastodon&colorA=404040&logoColor=9590F9)](https://fosstodon.org/@ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

Automated development tasks (linting, testing, building) used in my own
projects.

This is not meant to be shared and semantic versioning is not followed.

The task runner is [Gulp](https://gulpjs.com/), but you don't need to know Gulp
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

We use [tsd](https://github.com/SamVerschueren/tsd) to test TypeScript types.
Each export must be fully typed.

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
- [`gulp type`](#gulp-type): run TypeScript type tests.
- [`gulp unit`](#gulp-unit): run unit tests.
- [`gulp test`](#gulp-test): perform the three tasks above.

Use `gulp checkw`, `gulp buildw`, `gulp type`, and `gulp unitw` to run them in
watch mode.

[GitHub actions](https://github.com/features/actions) ensures that:

- tests pass on all supported environments.
- all source files are covered by tests and follow the same coding style.

# Available tasks

## `gulp check`

Lint and check source files:

- format JavaScript files with [Prettier](https://prettier.io/).
- lint and
  [autofix](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems)
  JavaScript files using [ESLint](https://eslint.org/) (see the
  [coding style](https://github.com/ehmicky/eslint-config#coding-style)).
- find duplicated code with [Jscpd](https://github.com/kucherenko/jscpd).

## `gulp build`

Build source files and test files:

- JavaScript files are transpiled with [Babel](https://babeljs.io/).
- Other files are copied as is.

Source files and test files are built from the `src` directory to the
`build/src` directory.

This must be done before running any code or unit tests.

## `gulp type`

Run TypeScript type tests with [tsd](https://github.com/SamVerschueren/tsd).

## `gulp unit`

Run unit tests with [Ava](https://github.com/avajs/ava).

To specify
[Ava options](https://github.com/avajs/ava/blob/master/docs/05-command-line.md),
please call `ava` directly instead. For example: `ava --update-snapshots`.

To target a single test file, use `ava build/test/file.test.js` not
`ava test/file.test.js`.

## `gulp test`

Runs [`gulp check`](#gulp-check) then [`gulp build`](#gulp-build) then
[`gulp unit`](#gulp-unit).

This is performed on CI ([GitHub actions](https://github.com/features/actions))
for each OS (Windows, Mac, Linux) and supported Node.js version.

## `gulp checkw`, `gulp buildw`, `gulp typew`, `gulp unitw`, `gulp warnw`

Like `gulp check`, `gulp build`, `gulp type`, `gulp unit` and `gulp warn` but in
watch mode. The watch mode works even when installing/updating/uninstalling
dependencies or changing the Gulp tasks themselves.

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

`npm publish` must also be performed locally.

Only the repository owner can perform these tasks.

## `gulp uploadCoverage`

In CI ([GitHub actions](https://github.com/features/actions)), upload test
coverage (produced by `c8 ava`) to [codecov](https://codecov.io/).

## `gulp checkCoverage`

Ensures that files are fully covered by tests using
[c8](https://github.com/bcoe/c8). This is meant to be performed on CI
([GitHub actions](https://github.com/features/actions)).

# Custom tasks

Repositories with a `gulp` top-level directory have additional tasks. Please
check those files to see which custom tasks are available.

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://fosstodon.org/@ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/dev-tasks/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/dev-tasks/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->
