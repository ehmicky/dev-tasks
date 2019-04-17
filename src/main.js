export { testTask as test } from './tasks/test.js'
export { build, buildw } from './tasks/build/main.js'
export { check, checkw } from './tasks/check/main.js'
export { unit, unitw, coverage } from './tasks/unit/main.js'
export { warn, warnw } from './tasks/warn.js'
export {
  releaseMajor,
  releaseMinor,
  releasePatch,
} from './tasks/release/main.js'
export { publish } from './tasks/release/publish.js'
