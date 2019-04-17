import { accessSync } from 'fs'

try {
  accessSync('./gulp/')
  // eslint-disable-next-line global-require
  require('@babel/register')({ presets: [`${__dirname}/.babelrc.js`] })
} catch (error) {}
