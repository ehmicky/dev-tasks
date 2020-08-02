export const BUILD_SOURCES = ['src', 'test', 'register', 'benchmarks']
export const BUILD = 'build'

const SRC_DIRS = ['src', 'register', 'benchmarks', 'docs', 'examples', 'gulp']
const TEST_DIRS = ['test']
export const DIRS = [...SRC_DIRS, ...TEST_DIRS]
// `test` snapshots should not be linted/prettified
export const JAVASCRIPT = `{,{${DIRS.join(',')}}/{,**/}}*.js`
export const MARKDOWN = `{,{${SRC_DIRS.join(',')}}/{,**/}}*.md`
export const JSON_YAML = [
  `{,{${SRC_DIRS.join(',')}}/{,**/}}*.{json,yml}`,
  '.*.{json,yml}',
]

export const DEPENDENCIES = ['package-lock.json']
export const NPMRC = '.npmrc'
