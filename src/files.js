const SOURCES_DIRS = ['src', 'benchmark', 'docs', 'examples', 'gulp']
export const BUILD_SOURCES = ['src', 'benchmark']
export const BUILD = 'build'
export const GENERATED_SOURCES_DIR = 'src/snapshots'
export const GENERATED_SOURCES = `src/snapshots/**`

export const JAVASCRIPT = `{,{${SOURCES_DIRS.join(',')}}/{,**/}}*.{js,cjs,mjs}`
export const MARKDOWN = `{,{${SOURCES_DIRS.join(',')}}/{,**/}}*.md`
export const JSON_YAML = [
  `{,{${SOURCES_DIRS.join(',')}}/{,**/}}*.{json,yml}`,
  '.*.{json,yml}',
]

export const DEPENDENCIES = ['package-lock.json']
export const TYPES = ['src/**/*.ts', 'tsconfig.json']
export const TYPE_TESTS = 'src/**/*.test-d.ts'
