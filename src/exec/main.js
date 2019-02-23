// eslint-disable-next-line filenames/match-exported
'use strict'

const { parseArgs } = require('./args')
const { execCommand } = require('./command')

// Execute a shell command
// To create a Gulp task, one should not use `bind()` as it removes
// `Function.name`. Instead one should do `const taskName = () => exec(...)`
// We avoid `exec.shell()` as it leads to shell-specific input which is not
// cross-platform.
// We avoid using a single string as input and tokenizing it as it's difficult
// with whitespaces escaping. Also escaping is shell-specific, e.g. on Windows
// `cmd.exe` only use double quotes not single quotes.
const exec = function(command, args, opts) {
  const [argsA, optsA] = parseArgs(args, opts)
  return execCommand(command, argsA, optsA)
}

const createTask = function(command, args, opts) {
  const [argsA, optsA] = parseArgs(args, opts)

  const task = execCommand.bind(null, command, argsA, optsA)

  setDisplayName({ task, command })

  return task
}

// eslint-disable-next-line fp/no-mutation
exec.task = createTask

// We want to allow users to do `const task = execa(...)` instead of the
// more verbose `const task = () => execa(...)`. This is especially
// important when using `gulp.series()` or `gulp.parallel()`.
// However after binding a function or using a closure, assigning it to
// a variable does not change its `function.name` anymore. But this is
// used by Gulp as the displayed task name. So we use the command instead.
const setDisplayName = function({ task, command }) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  task.displayName = String(command)
}

module.exports = exec
