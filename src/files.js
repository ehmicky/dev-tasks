export const SRC = 'src'
export const BUILD_SOURCES = ['src', 'test', 'register']
export const BUILD = 'build'
export const BUILD_TEST = 'build/test'

const DIRS = 'src,register,docs,examples,gulp'
// `test` snapshots should not be linted/prettified
export const JAVASCRIPT = `{,{${DIRS},test}/{,**/}}*.js`
export const MARKDOWN = `{,{${DIRS}}/{,**/}}*.md`
export const JSON_YAML = [`{,{${DIRS}}/{,**/}}*.{json,yml}`, '.*.{json,yml}']

export const DEPENDENCIES = ['package-lock.json']
export const NPMRC = '.npmrc'
