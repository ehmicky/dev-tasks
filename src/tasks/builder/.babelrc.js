import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// TODO: replace with JSON imports once supported
const { dependencies = {} } = JSON.parse(readFileSync('./package.json'))

const browserslistConfigFile = fileURLToPath(
  new URL('../../browserslist', import.meta.url),
)

export default {
  presets: [
    [
      '@babel/preset-typescript',
      {
        onlyRemoveTypeImports: true,
        optimizeConstEnums: true,
        allowDeclareFields: true,
      },
    ],
    [
      '@babel/preset-env',
      {
        modules: false,
        bugfixes: true,
        // Using `core-js` as a dependency is optional
        ...(dependencies['core-js'] && { useBuiltIns: 'usage', corejs: '3' }),
      },
    ],
  ],
  browserslistConfigFile,
  comments: false,
  shouldPrintComment: (comment) => comment.includes('c8 ignore'),
  minified: true,
  retainLines: true,
}
