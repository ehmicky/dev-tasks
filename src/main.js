import { testTask } from './tasks/test.js'
import { build, buildw } from './tasks/build/main.js'
import { check, checkw } from './tasks/check/main.js'
import { unit, unitw, coverage } from './tasks/unit/main.js'
import { warn, warnw } from './tasks/warn.js'
import {
  releaseMajor,
  releaseMinor,
  releasePatch,
} from './tasks/release/main.js'
import { publish } from './tasks/release/publish.js'

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
