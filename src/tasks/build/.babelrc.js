import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

// TODO: replace with JSON imports once supported
const { dependencies = {} } = JSON.parse(readFileSync('./package.json'))

export default {
  presets: [
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
  browserslistConfigFile: fileURLToPath(
    new URL('browserslist', import.meta.url),
  ),
  comments: false,
  shouldPrintComment: (comment) => comment.includes('c8 ignore'),
  minified: true,
  retainLines: true,
}
