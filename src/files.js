// Generated files that should be considered like source files
export const GENERATED_SOURCES_DIR = 'src/snapshots'
// Directories containing "sources" in the wide sense of the term
const SOURCES_DIRS = ['src', 'benchmark', 'docs', 'examples', 'gulp']
// Any file in the top-level directory or inside source-like directories
const ANY_SOURCE_FILE = `{,{${SOURCES_DIRS.join(',')}}/{,**/}}*`
// Source directories to build
export const BUILD_SOURCES = ['src', 'benchmark']
// Build directory
export const BUILD = 'build'

// Source files, per file type or category
export const JAVASCRIPT = `${ANY_SOURCE_FILE}.{js,cjs,mjs}`
export const MARKDOWN = `${ANY_SOURCE_FILE}.md`
export const JSON_YAML = [`${ANY_SOURCE_FILE}.{json,yml}`, '.*.{json,yml}']
export const TYPESCRIPT = `${ANY_SOURCE_FILE}.ts`
export const TYPESCRIPT_TESTS = 'src/**/*.test-d.ts'
export const TYPESCRIPT_CONFIG = 'tsconfig.json'
// Those source files should not be linted nor prettified
export const IGNORED_SOURCES = [`src/snapshots/**`, `src/fixtures/invalid*/**`]
export const DEPENDENCIES = ['package-lock.json']
