'use strict'

const through = require('through2')

const { exec } = require('./exec')
const { getError } = require('./error')

// Creates a stream to use in Gulp e.g.
//   src(...).pipe(stream(({ path }) => ['command', [path]]))
// This should not be used with commands that allow several files as arguments
// (through variadic arguments, globbing or directory recursion) as a single
// call to those functions would be more efficient that creating lots of
// child processes through streaming.
const execStream = function(mapFunc, opts) {
  // Without `stdio: pipe`, `vinyl.exec` does not get `stdout|stderr` properties
  const optsA = { stdio: 'pipe', ...opts }

  return through.obj(execVinyl.bind(null, { mapFunc, opts: optsA }))
}

// eslint-disable-next-line max-params, promise/prefer-await-to-callbacks
const execVinyl = async function({ mapFunc, opts }, file, encoding, cb) {
  try {
    const command = mapFunc(file)

    const result = await exec(command, opts)

    addToVinyl({ file, result })

    // eslint-disable-next-line promise/prefer-await-to-callbacks
    return cb(null, file)
  } catch (error) {
    const errorA = getError(error)
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    return cb(errorA)
  }
}

const addToVinyl = function({ file, result }) {
  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  file.exec = [...(file.exec || []), result]
}

module.exports = {
  stream: execStream,
}
