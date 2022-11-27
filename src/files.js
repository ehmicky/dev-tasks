// Generated files that should be considered like source files
export const GENERATED_SOURCES_DIR = 'src/snapshots'
// Directories containing "sources" in the wide sense of the term
export const SOURCES_DIRS = ['src', 'benchmark', 'docs', 'examples', 'gulp']
// Any file in the top-level directory or inside source-like directories
const ANY_SOURCE_FILE = `{,{${SOURCES_DIRS.join(',')}}/{,**/}}*`
// Source directories to build
export const BUILD_SOURCES = ['src', 'benchmark']
// Build directory
export const BUILD = 'build'

// Source files, per file type or category
const JAVASCRIPT_EXTS = ['js', 'cjs', 'mjs']
export const JAVASCRIPT_EXTS_STR = JAVASCRIPT_EXTS.join(',')
export const JAVASCRIPT = `${ANY_SOURCE_FILE}.{${JAVASCRIPT_EXTS_STR}}`
export const MARKDOWN = `${ANY_SOURCE_FILE}.md`
const JSON_YAML_EXTS = ['json', 'yaml', 'yml']
const JSON_YAML_EXTS_STR = JSON_YAML_EXTS.join(',')
export const JSON_YAML = [
  `${ANY_SOURCE_FILE}.{${JSON_YAML_EXTS_STR}}`,
  `.*.{${JSON_YAML_EXTS_STR}}`,
]
export const TYPESCRIPT_EXT = 'ts'
export const TYPESCRIPT = `${ANY_SOURCE_FILE}.${TYPESCRIPT_EXT}`
export const TYPESCRIPT_TESTS_EXT = `test-d.${TYPESCRIPT_EXT}`
export const TYPESCRIPT_TESTS = `src/**/*.${TYPESCRIPT_TESTS_EXT}`
export const TYPESCRIPT_CONFIG = 'tsconfig.json'
// Those source files should not be linted nor prettified
export const IGNORED_SOURCES = [`src/snapshots/**`, `src/fixtures/invalid*/**`]
export const DEPENDENCIES = ['package-lock.json']
