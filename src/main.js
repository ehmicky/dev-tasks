export { testTask as test } from './tasks/test.js'
export { build, buildWatch } from './tasks/build/main.js'
export { check, checkWatch } from './tasks/check/main.js'
export { unit, unitWatch } from './tasks/unit/main.js'
export { type, typeWatch } from './tasks/type.js'
export { uploadCoverage, checkCoverage } from './tasks/cover/main.js'
export { warn, warnWatch } from './tasks/warn.js'
export {
  releaseMajor,
  releaseMinor,
  releasePatch,
} from './tasks/release/main.js'
