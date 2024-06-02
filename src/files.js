const MAIN_SOURCE = 'src'
// Generated files that should be considered like source files
export const GENERATED_SOURCES_DIR = `${MAIN_SOURCE}/snapshots`
// Directories containing "sources" in the wide sense of the term
export const SOURCES_DIRS = [
  MAIN_SOURCE,
  '.github',
  'benchmark',
  'docs',
  'examples',
  'gulp',
]
// Any file in the top-level directory or inside source-like directories
const ANY_SOURCE_FILE = `{,{${SOURCES_DIRS.join(',')}}/{,**/}}*`
// Source directories to build
const NOT_BUILT_SOURCES = [MAIN_SOURCE, 'benchmark']
export const SOURCES_GLOB = `{${NOT_BUILT_SOURCES.join(',')}}/**`

// Build directory
export const BUILD = 'build'
export const BUILT_MAIN_SOURCE = `${BUILD}/${MAIN_SOURCE}`

// Source files, per file type or category
export const JAVASCRIPT_EXTS = ['js', 'cjs', 'mjs']
export const JAVASCRIPT_EXTS_STR = JAVASCRIPT_EXTS.join(',')
export const JAVASCRIPT = `${ANY_SOURCE_FILE}.{${JAVASCRIPT_EXTS_STR}}`

export const MARKDOWN_EXT = ['md']
export const MARKDOWN = `${ANY_SOURCE_FILE}.${MARKDOWN_EXT}`

export const JSON_YAML_EXTS = ['json', 'yaml', 'yml']
const JSON_YAML_EXTS_STR = JSON_YAML_EXTS.join(',')
export const JSON_YAML = [
  `${ANY_SOURCE_FILE}.{${JSON_YAML_EXTS_STR}}`,
  `.*.{${JSON_YAML_EXTS_STR}}`,
]

export const TYPESCRIPT_EXT = 'ts'
export const TYPESCRIPT = `${ANY_SOURCE_FILE}.${TYPESCRIPT_EXT}`
export const TYPESCRIPT_MAIN = `${MAIN_SOURCE}/main.${TYPESCRIPT_EXT}`
export const TYPESCRIPT_AMBIENT_EXT = 'd.ts'
export const TYPESCRIPT_AMBIENT_MAIN = `${MAIN_SOURCE}/main.${TYPESCRIPT_AMBIENT_EXT}`
export const TYPESCRIPT_AMBIENT_BUILT = `${BUILT_MAIN_SOURCE}/**/*.${TYPESCRIPT_AMBIENT_EXT}`
export const TYPESCRIPT_TESTS_EXT = `test-d.${TYPESCRIPT_EXT}`
export const TYPESCRIPT_TESTS = `${MAIN_SOURCE}/**/*.${TYPESCRIPT_TESTS_EXT}`
export const TYPESCRIPT_CONFIG = 'tsconfig.json'

// Those source files should not be linted nor prettified
export const IGNORED_SOURCES = [
  `${GENERATED_SOURCES_DIR}/**`,
  `${MAIN_SOURCE}/fixtures/invalid*/**`,
]
export const DEPENDENCIES = ['package-lock.json']
