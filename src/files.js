export const SRC = 'src'
export const BUILD_SOURCES = ['src', 'test', 'register']
export const BUILD = 'build'
export const BUILD_TEST = 'build/test'

export const JAVASCRIPT = [
  '{,{src,register,docs,examples,gulp,test}/{,**/}}*.js',
]
export const MARKDOWN = ['{,{src,docs,examples,.github}/{,**/}}*.md']

export const DEPENDENCIES = ['package-lock.json']
export const NPMRC = '.npmrc'
