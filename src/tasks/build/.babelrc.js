import { readFileSync } from 'fs'

// TODO: replace with JSON imports once supported
const { dependencies = {} } = JSON.parse(readFileSync('./package.json'))

const targets = readFileSync(new URL('browserslist', import.meta.url), 'utf8')

export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets,
        modules: false,
        // Using `core-js` as a dependency is optional
        ...(dependencies['core-js'] && { useBuiltIns: 'usage', corejs: '3' }),
      },
    ],
  ],
  comments: false,
  shouldPrintComment: (comment) => comment.includes('c8 ignore'),
  minified: true,
  retainLines: true,
}
