import { readFileSync } from 'fs'

// TODO: replace with JSON imports once supported
const { dependencies = {} } = JSON.parse(readFileSync('./package.json'))

export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: '12.20.0' },
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
