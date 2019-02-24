'use strict'

const { parseArgs } = require('./args')
const { execCommand } = require('./command')

// Create a Gulp task
const createTask = function(command, args, opts) {
  const [argsA, optsA] = parseArgs(args, opts)

  const task = execCommand.bind(null, command, argsA, optsA)

  setDisplayName({ task, command })

  return task
}

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

module.exports = {
  task: createTask,
}
