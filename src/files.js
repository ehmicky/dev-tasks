export const BUILD_SOURCES = ['src', 'test', 'benchmark']
export const BUILD = 'build'

const SRC_DIRS = ['src', 'benchmark', 'docs', 'examples', 'gulp']
const TEST_DIRS = ['test']
const DIRS = [...SRC_DIRS, ...TEST_DIRS]
// `test` snapshots should not be linted/prettified
export const JAVASCRIPT = `{,{${DIRS.join(',')}}/{,**/}}*.{js,cjs,mjs}`
export const MARKDOWN = `{,{${SRC_DIRS.join(',')}}/{,**/}}*.md`
export const JSON_YAML = [
  `{,{${SRC_DIRS.join(',')}}/{,**/}}*.{json,yml}`,
  '.*.{json,yml}',
]

export const DEPENDENCIES = ['package-lock.json']
