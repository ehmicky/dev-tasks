export const BUILD_SOURCES = ['src', 'test', 'types', 'benchmark']
export const BUILD = 'build'

const SRC_DIRS = ['src', 'types', 'benchmark', 'docs', 'examples', 'gulp']
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
export const TYPES = ['types/**/*.d.ts', 'tsconfig.json']
