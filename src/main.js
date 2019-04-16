const { testTask } = require('./tasks/test.js')
const { build, buildw } = require('./tasks/build/main.js')
const { check, checkw } = require('./tasks/check/main.js')
const { unit, unitw, coverage } = require('./tasks/unit/main.js')
const { warn, warnw } = require('./tasks/warn.js')
const {
  releaseMajor,
  releaseMinor,
  releasePatch,
} = require('./tasks/release/main.js')
const { publish } = require('./tasks/release/publish.js')

module.exports = {
  test: testTask,
  build,
  buildw,
  check,
  checkw,
  unit,
  unitw,
  coverage,
  warn,
  warnw,
  releaseMajor,
  releaseMinor,
  releasePatch,
  publish,
}
