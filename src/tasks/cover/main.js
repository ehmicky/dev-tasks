import { checkCoverage } from './check.js'
import { uploadCoverage } from './upload.js'

// eslint-disable-next-line fp/no-mutation
uploadCoverage.description = 'Upload test coverage to CI'

// eslint-disable-next-line fp/no-mutation
checkCoverage.description = 'Ensure source files are fully covered by tests'

// eslint-disable-next-line no-duplicate-imports
export { uploadCoverage } from './upload.js'
// eslint-disable-next-line no-duplicate-imports
export { checkCoverage } from './check.js'
