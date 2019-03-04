'use strict'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: '8.10.0' }, useBuiltIns: 'usage' },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
  comments: false,
  shouldPrintComment: comment => comment.includes('istanbul ignore'),
  minified: true,
  retainLines: true,
}
