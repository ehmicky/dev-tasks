export { testTask as test } from './tasks/test_task.js'
export { build, buildWatch } from './tasks/builder/main.js'
export { check, checkWatch } from './tasks/check/main.js'
export { links } from './tasks/links/main.js'
export { unit, unitWatch, unitCoverage } from './tasks/unit/main.js'
export { type, typeWatch } from './tasks/type.js'
export { warn, warnWatch } from './tasks/warn.js'
export {
  releaseMajor,
  releaseMinor,
  releasePatch,
} from './tasks/release/main.js'
